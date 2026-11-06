/* One quiet loop player shared by all destinations and both outfit modes. */
(() => {
  'use strict';
  if(window.PrincessMusic)return;
  const levels=Object.freeze({normal:.70,ducked:.23,fadeInMs:650,fadeOutMs:220,duckMs:100,releaseMs:420});
  const audio=document.getElementById('atelierMusic')||document.createElement('audio');
  audio.id='atelierMusic';audio.preload='none';audio.loop=true;audio.setAttribute('playsinline','');audio.setAttribute('aria-hidden','true');
  if(!audio.isConnected)document.body.append(audio);
  let config={},started=false,sleeping=false,pageAway=false,blocked=false;
  let context=null,gain=null,mediaNode=null,backend='none',source='',track=null,buffer=null,bufferNode=null;
  let offset=0,bufferStartedAt=0,pending=false,playing=false,attempt=0,loading=null,transitionTimer=null;
  let voiceSerial=0,activeVoice=0,fadeFrame=0,fade={from:0,to:0,start:0,end:0},playAttempts=0;
  // Keep at most two decoded loops (32 MiB total). A larger loop lives only while selected.
  const cache=new Map(),maxCacheBytes=32*1024*1024;
  let cacheBytes=0;
  const read=(key,fallback,...args)=>{try{const value=config[key];return typeof value==='function'?value(...args):value??fallback;}catch{return fallback;}};
  const visible=()=>!document.hidden&&!pageAway;
  const wanted=()=>started&&read('enabled',true)!==false&&read('sound',true)!==false&&!sleeping&&visible();
  const useGain=()=>gain&&backend!=='element';
  const now=()=>useGain()?context.currentTime:performance.now()/1000;
  function currentGain(){const time=now();if(time>=fade.end)return fade.to;if(time<=fade.start)return fade.from;return fade.from+(fade.to-fade.from)*(time-fade.start)/(fade.end-fade.start);}
  function setLevel(value,duration=0){
    const from=currentGain(),time=now(),seconds=Math.max(0,duration)/1000;
    fade={from,to:value,start:time,end:time+seconds};
    cancelAnimationFrame(fadeFrame);fadeFrame=0;
    if(useGain()){try{gain.gain.cancelScheduledValues(time);gain.gain.setValueAtTime(from,time);if(seconds)gain.gain.linearRampToValueAtTime(value,time+seconds);else gain.gain.setValueAtTime(value,time);}catch{}return;}
    const step=()=>{try{audio.volume=Math.max(0,Math.min(1,currentGain()));}catch{}if(now()<fade.end)fadeFrame=requestAnimationFrame(step);};step();
  }
  function level(duration){
    if(!playing||!wanted()||transitionTimer!==null)return;
    const target=activeVoice?levels.ducked:levels.normal;
    if(Math.abs(fade.to-target)>.0001)setLevel(target,duration);
  }
  function cancelTransition(){if(transitionTimer!==null)clearTimeout(transitionTimer);transitionTimer=null;}
  function stopPlayback(){
    attempt++;pending=false;playing=false;setLevel(0);
    if(bufferNode){
      offset=(offset+Math.max(0,context.currentTime-bufferStartedAt))%buffer.duration;
      const old=bufferNode;bufferNode=null;try{old.stop();old.disconnect();}catch{}
    }
    audio.muted=true;try{audio.pause();}catch{}
  }
  function pause(){
    cancelTransition();stopPlayback();
    if(context&&context.state!=='closed'&&context.state!=='suspended')try{context.suspend()?.catch(()=>{});}catch{}
  }
  function ensureContext(){
    if(context)return context.state!=='closed';
    const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return false;
    try{context=new Constructor();gain=context.createGain();gain.gain.setValueAtTime(0,context.currentTime);gain.connect(context.destination);fade={from:0,to:0,start:context.currentTime,end:context.currentTime};return true;}
    catch{context=null;gain=null;return false;}
  }
  function resumeContext(){
    if(!useGain()||context.state==='running'||context.state==='closed')return;
    const ticket=attempt;
    const failed=()=>{if(ticket===attempt&&wanted()&&useGain()&&context.state!=='running')blocked=true;};
    try{context.resume()?.catch(failed);}catch{failed();}
  }
  function embeddedBytes(url){
    let data=url;try{data=window.PrincessEmbeddedImage?.(url)||url;}catch{}
    if(typeof data!=='string'||!/^data:audio\/[^;,]+;base64,/i.test(data))return null;
    const binary=atob(data.slice(data.indexOf(',')+1)),bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes.buffer;
  }
  function useNativeSource(){
    if(gain&&context.state!=='closed'&&!mediaNode){
      try{const route=context.createMediaElementSource(audio);route.connect(gain);mediaNode=route;}catch{}
    }
    backend=mediaNode&&context?.state!=='closed'?'media-gain':'element';
    if(backend==='media-gain')try{audio.volume=1;}catch{}
    setLevel(0);audio.src=source;
  }
  function inputBytes(src,controller){
    const bytes=embeddedBytes(src);if(bytes)return Promise.resolve(bytes);
    const url=new URL(src,window.location.href);
    const local=window.location.protocol==='http:'&&['127.0.0.1','localhost'].includes(window.location.hostname);
    if((window.location.protocol!=='https:'&&!local)||url.origin!==window.location.origin||url.protocol!==window.location.protocol||!window.fetch)return null;
    return window.fetch(url.href,{credentials:'same-origin',cache:'force-cache',signal:controller?.signal}).then(response=>{
      if(!response.ok)throw Error('BGM unavailable');return response.arrayBuffer();
    });
  }
  function cacheBuffer(src,decoded){
    const bytes=decoded.length*decoded.numberOfChannels*4;
    if(!Number.isFinite(bytes)||bytes<=0||bytes>maxCacheBytes)return;
    while(cache.size>=2||cacheBytes+bytes>maxCacheBytes){
      const oldest=cache.keys().next().value;cacheBytes-=cache.get(oldest).bytes;cache.delete(oldest);
    }
    cache.set(src,{buffer:decoded,bytes});cacheBytes+=bytes;
  }
  function loadSelected(){
    if(loading)return;
    const src=source,controller=window.AbortController?new window.AbortController():null;
    let input;try{input=inputBytes(src,controller);}catch{}
    if(!input){useNativeSource();return;}
    // At most one fetch/decode job. A superseded fetch is aborted, and a decode
    // already in progress may finish but never starts an obsolete destination.
    loading={src,controller};
    input.then(data=>{
      if(controller?.signal.aborted||src!==source)return null;
      return new Promise((resolve,reject)=>{
        const result=context.decodeAudioData(data,resolve,reject);result?.then(resolve,reject);
      });
    }).then(decoded=>{
      if(src!==source||controller?.signal.aborted)return;
      if(!decoded||!Number.isFinite(decoded.duration)||decoded.duration<=0)throw Error('Invalid BGM duration');
      buffer=decoded;cacheBuffer(src,decoded);
    }).catch(()=>{
      if(src===source&&!controller?.signal.aborted)useNativeSource();
    }).finally(()=>{
      loading=null;if(wanted())sync();
    });
  }
  function selectSource(next,key){
    stopPlayback();
    if(backend==='element'||backend==='media-gain'){
      audio.removeAttribute('src');audio.load();
    }
    if(loading&&loading.src!==next)loading.controller?.abort();
    source=next;track=key;buffer=null;offset=0;blocked=false;
    if(ensureContext()&&context.decodeAudioData){
      backend='buffer';
      const entry=cache.get(next);
      if(entry){buffer=entry.buffer;cache.delete(next);cache.set(next,entry);}
    }else useNativeSource();
  }
  function startBuffer(){
    if(!buffer||bufferNode||!wanted())return;
    setLevel(0);let node;
    try{
      node=context.createBufferSource();node.buffer=buffer;node.loop=true;node.connect(gain);bufferNode=node;
      bufferStartedAt=context.currentTime;playing=true;playAttempts++;
      node.onended=()=>{if(bufferNode===node){bufferNode=null;playing=false;if(wanted())blocked=true;}};
      node.start(0,offset%buffer.duration);setLevel(activeVoice?levels.ducked:levels.normal,levels.fadeInMs);
    }catch{bufferNode=null;playing=false;try{node?.disconnect();}catch{}useNativeSource();startNative();}
  }
  function startNative(){
    if(pending||!wanted())return;
    if(!audio.paused&&playing){level(levels.releaseMs);return;}
    setLevel(0);audio.muted=backend==='element'&&!!activeVoice;
    const ticket=++attempt;pending=true;playAttempts++;resumeContext();
    let result;try{result=audio.play();}catch{pending=false;blocked=true;return;}
    Promise.resolve(result).then(()=>{
      if(ticket!==attempt){if(!wanted())audio.pause();return;}
      pending=false;if(!wanted()){pause();return;}
      blocked=false;playing=true;audio.muted=backend==='element'&&!!activeVoice;
      setLevel(activeVoice?levels.ducked:levels.normal,levels.fadeInMs);
    }).catch(()=>{if(ticket!==attempt)return;pending=false;playing=false;blocked=true;setLevel(0);});
  }
  function sync({gesture=false}={}){
    if(!wanted()){pause();return;}
    const key=read('track','atelier'),next=read('source','',key);
    if(typeof next!=='string'||!next){pause();return;}
    if(source!==next){
      if(playing&&currentGain()>.001){
        if(transitionTimer===null){
          setLevel(0,levels.fadeOutMs);
          transitionTimer=setTimeout(()=>{
            transitionTimer=null;
            // Timers use wall time. Finish even if the AudioContext was interrupted.
            setLevel(0);sync();
          },levels.fadeOutMs);
        }
        return;
      }
      cancelTransition();selectSource(next,key);
    }else{
      // A quick round trip before fade-out finishes keeps the original playhead.
      cancelTransition();track=key;
      if(gesture&&blocked&&backend!=='buffer'&&audio.error)audio.load();
    }
    if(gesture)blocked=false;if(blocked)return;
    if(backend==='buffer'){
      resumeContext();
      if(!buffer)loadSelected();
      if(backend==='buffer'){if(!bufferNode)startBuffer();else level(levels.releaseMs);return;}
    }
    if(playing)resumeContext();
    startNative();
  }
  function voiceStart(){
    activeVoice=++voiceSerial;
    // Some iOS versions ignore element.volume. The quiet master is muted during speech.
    if(backend==='element')audio.muted=true;
    if(transitionTimer!==null){
      const remaining=Math.max(0,(fade.end-now())*1000);
      if(currentGain()>levels.ducked&&remaining>levels.duckMs)setLevel(0,levels.duckMs);
    }else level(levels.duckMs);
    return activeVoice;
  }
  function voiceEnd(token){
    if(token!==activeVoice||!activeVoice)return;
    activeVoice=0;if(backend==='element'&&(playing||pending)&&wanted())audio.muted=false;level(levels.releaseMs);
  }
  audio.addEventListener('pause',()=>{if(audio.paused&&backend!=='buffer'){playing=false;pending=false;}});
  audio.addEventListener('error',()=>{if(audio.error&&backend!=='buffer'){pending=false;playing=false;blocked=true;setLevel(0);}});
  const retry=()=>{if(wanted()&&(blocked||!playing||audio.paused&&backend!=='buffer'||useGain()&&context.state!=='running'))sync({gesture:true});};
  document.addEventListener('click',retry);document.addEventListener('keydown',retry);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else sync();});
  window.addEventListener('pagehide',()=>{pageAway=true;pause();});
  window.addEventListener('pageshow',()=>{pageAway=false;sync();});
  window.PrincessMusic=Object.freeze({levels,
    configure(options={}){config={...config,...options};sync();},
    start(options={}){config={...config,...options};started=true;sync({gesture:true});},
    sync,
    setSleeping(value){sleeping=!!value;sync({gesture:!sleeping});},
    voiceStart,voiceEnd,
    getState(){return {started,sleeping,visible:visible(),enabled:read('enabled',true)!==false,sound:read('sound',true)!==false,track,transitioning:transitionTimer!==null,backend,contextState:context?.state||null,playing,pending:pending||(backend==='buffer'&&!buffer&&!!loading),blocked,voiceActive:!!activeVoice,gain:currentGain(),targetGain:fade.to,playAttempts};}
  });
})();
