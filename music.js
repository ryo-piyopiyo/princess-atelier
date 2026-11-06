/* One BGM player: embedded bytes or one same-origin HTTPS/loopback download.
   No microphone, storage, cross-origin request, or wake lock. */
(() => {
  'use strict';
  if(window.PrincessMusic)return;
  // Source master: about -30 dBFS RMS. Mao stays at the app's existing .85 volume.
  const levels=Object.freeze({normal:.70,ducked:.23,fadeInMs:650,duckMs:100,releaseMs:420});
  const audio=document.getElementById('atelierMusic')||document.createElement('audio');
  audio.id='atelierMusic';audio.preload='none';audio.loop=true;audio.setAttribute('playsinline','');audio.setAttribute('aria-hidden','true');
  if(!audio.isConnected)document.body.append(audio);
  let config={},started=false,sleeping=false,pageAway=false,blocked=false;
  let context=null,gain=null,mediaNode=null,backend='none',source='',buffer=null,bufferNode=null;
  let offset=0,bufferStartedAt=0,pending=false,playing=false,attempt=0,sourceVersion=0,decodePending=false;
  let voiceSerial=0,activeVoice=0,fadeFrame=0,fade={from:0,to:0,start:0,end:0},playAttempts=0;
  const read=(key,fallback)=>{try{const value=config[key];return typeof value==='function'?value():value??fallback;}catch{return fallback;}};
  const visible=()=>!document.hidden&&!pageAway;
  const wanted=()=>started&&read('enabled',true)!==false&&read('sound',true)!==false&&!sleeping&&visible();
  const now=()=>gain&&context?context.currentTime:performance.now()/1000;
  function currentGain(){const time=now();if(time>=fade.end)return fade.to;if(time<=fade.start)return fade.from;return fade.from+(fade.to-fade.from)*(time-fade.start)/(fade.end-fade.start);}
  function setLevel(value,duration=0){
    const from=currentGain(),time=now(),seconds=Math.max(0,duration)/1000;fade={from,to:value,start:time,end:time+seconds};
    if(gain){try{gain.gain.cancelScheduledValues(time);gain.gain.setValueAtTime(from,time);if(seconds)gain.gain.linearRampToValueAtTime(value,time+seconds);else gain.gain.setValueAtTime(value,time);}catch{}return;}
    cancelAnimationFrame(fadeFrame);fadeFrame=0;
    const step=()=>{try{audio.volume=Math.max(0,Math.min(1,currentGain()));}catch{}if(now()<fade.end)fadeFrame=requestAnimationFrame(step);};step();
  }
  function level(duration){if(!playing||!wanted())return;const target=activeVoice?levels.ducked:levels.normal;if(backend==='element')audio.muted=!!activeVoice;if(Math.abs(fade.to-target)>.0001)setLevel(target,duration);}
  function pause(){
    attempt++;pending=false;playing=false;cancelAnimationFrame(fadeFrame);fadeFrame=0;setLevel(0);
    if(bufferNode){if(context&&buffer)offset=(offset+Math.max(0,context.currentTime-bufferStartedAt))%buffer.duration;const old=bufferNode;bufferNode=null;try{old.stop();old.disconnect();}catch{}}
    audio.muted=true;try{audio.pause();}catch{}
    if(context&&context.state!=='closed'&&context.state!=='suspended')try{context.suspend()?.catch(()=>{});}catch{}
  }
  function ensureContext(){
    if(context&&context.state!=='closed'){if(!gain)try{gain=context.createGain();gain.gain.setValueAtTime(0,context.currentTime);gain.connect(context.destination);}catch{return false;}return true;}
    if(context)return false;
    const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)return false;
    try{context=new Constructor();gain=context.createGain();gain.gain.setValueAtTime(0,context.currentTime);gain.connect(context.destination);fade={from:0,to:0,start:context.currentTime,end:context.currentTime};return true;}catch{context=null;gain=null;return false;}
  }
  function resumeContext(){if(context&&context.state!=='running'&&context.state!=='closed')try{const resumed=context.resume();resumed?.catch(()=>{blocked=true;});}catch{blocked=true;}}
  function embeddedBytes(url){
    let data=url;try{data=window.PrincessEmbeddedImage?.(url)||url;}catch{}
    if(typeof data!=='string'||!/^data:audio\/[^;,]+;base64,/i.test(data))return null;
    const binary=atob(data.slice(data.indexOf(',')+1)),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes.buffer;
  }
  function nativeBackend(){
    if(gain&&!mediaNode){try{mediaNode=context.createMediaElementSource(audio);mediaNode.connect(gain);backend='media-gain';audio.volume=1;return;}catch{}}
    if(mediaNode&&gain){backend='media-gain';return;}
    // Pre-mastered quiet source remains a background layer even on iOS versions
    // that ignore audio.volume. Native mute reliably clears it during speech.
    backend='element';gain=null;fade={from:0,to:0,start:performance.now()/1000,end:performance.now()/1000};
  }
  function selectSource(next){
    if(source===next)return;pause();sourceVersion++;source=next;buffer=null;offset=0;decodePending=false;backend='none';blocked=false;
    if(ensureContext()&&context.decodeAudioData){let bytes,input;try{bytes=embeddedBytes(source);}catch{}
      if(bytes)input=Promise.resolve(bytes);
      else try{const url=new URL(source,window.location.href),local=window.location.protocol==='http:'&&['127.0.0.1','localhost'].includes(window.location.hostname),allowed=window.location.protocol==='https:'||local;if(allowed&&url.protocol===window.location.protocol&&url.origin===window.location.origin&&window.fetch)input=window.fetch(url.href,{credentials:'same-origin',cache:'force-cache'}).then(response=>{if(!response.ok)throw Error('BGM unavailable');return response.arrayBuffer();});}catch{}
      if(input){const version=sourceVersion;backend='buffer';decodePending=true;
        input.then(data=>new Promise((resolve,reject)=>{try{const result=context.decodeAudioData(data,resolve,reject);result?.then(resolve,reject);}catch(error){reject(error);}})).then(decoded=>{
          if(version!==sourceVersion)return;if(!decoded||!Number.isFinite(decoded.duration)||decoded.duration<=0)throw Error('Invalid BGM duration');decodePending=false;buffer=decoded;if(wanted())sync();
        }).catch(()=>{if(version!==sourceVersion)return;decodePending=false;nativeBackend();audio.src=source;if(wanted())sync();});return;}
    }
    nativeBackend();audio.src=source;
  }
  function startBuffer(){
    if(!buffer||bufferNode||!wanted())return;resumeContext();setLevel(0);let node;const version=sourceVersion;
    try{node=context.createBufferSource();node.buffer=buffer;node.loop=true;node.connect(gain);bufferNode=node;bufferStartedAt=context.currentTime;playing=true;playAttempts++;
      node.onended=()=>{if(bufferNode===node){bufferNode=null;playing=false;if(version===sourceVersion&&wanted())blocked=true;}};
      node.start(0,offset%buffer.duration);setLevel(activeVoice?levels.ducked:levels.normal,levels.fadeInMs);
    }catch{bufferNode=null;playing=false;blocked=true;try{node?.disconnect();}catch{}}
  }
  function startNative(){
    if(pending||!wanted())return;if(!audio.paused&&playing){resumeContext();level(levels.releaseMs);return;}
    resumeContext();setLevel(0);audio.muted=backend==='element'&&!!activeVoice;const ticket=++attempt;pending=true;playAttempts++;
    let result;try{result=audio.play();}catch{pending=false;blocked=true;return;}
    Promise.resolve(result).then(()=>{if(ticket!==attempt){if(!wanted())audio.pause();return;}pending=false;if(!wanted()){pause();return;}blocked=false;playing=true;setLevel(activeVoice?levels.ducked:levels.normal,levels.fadeInMs);}).catch(()=>{if(ticket!==attempt)return;pending=false;playing=false;blocked=true;setLevel(0);});
  }
  function sync({gesture=false}={}){
    if(!wanted()){pause();return;}if(gesture)blocked=false;if(blocked&&!gesture)return;
    const next=read('source','');if(typeof next!=='string'||!next){pause();return;}selectSource(next);if(!wanted())return;
    resumeContext();if(decodePending)return;if(backend==='buffer'){if(!bufferNode)startBuffer();else level(levels.releaseMs);}else startNative();
  }
  const voiceStart=()=>{activeVoice=++voiceSerial;if(backend==='element'&&playing){audio.muted=true;setLevel(0);}else level(levels.duckMs);return activeVoice;};
  const voiceEnd=token=>{if(token!==activeVoice||!activeVoice)return;activeVoice=0;if(backend==='element'&&playing)audio.muted=false;level(levels.releaseMs);};
  // Native interruptions can pause only the element. The next real gesture retries it.
  audio.addEventListener('pause',()=>{if(audio.paused&&backend!=='buffer'){playing=false;pending=false;}});
  audio.addEventListener('error',()=>{if(backend!=='buffer'){pending=false;playing=false;blocked=true;setLevel(0);}});
  const retry=()=>{if(wanted()&&(blocked||!playing||audio.paused&&backend!=='buffer'||context&&context.state!=='running'))sync({gesture:true});};
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
    getState(){return {started,sleeping,visible:visible(),enabled:read('enabled',true)!==false,sound:read('sound',true)!==false,backend,contextState:context?.state||null,playing,pending:pending||decodePending,blocked,voiceActive:!!activeVoice,gain:currentGain(),targetGain:fade.to,playAttempts};}
  });
})();
