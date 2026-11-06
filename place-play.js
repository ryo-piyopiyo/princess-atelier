/* A place has one illustrated action. The artwork lasts for one performance;
   dressing, stickers and saved pictures do not include this temporary layer. */
(() => {
  'use strict';
  const scenes=new Map();
  const stage=document.getElementById('stage');
  const button=document.getElementById('placeAction');
  const surface=document.getElementById('placePerformance');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let active=null,timer=null,clearTimer=null,playCount=0;


  // The bell and the harp respond to the tap, even with the background music at zero.
  const ringing=new Set();
  let audioForAction=null;
  function silence(){
    for(const voice of ringing){
      const now=voice.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0,now,.009);
      try{voice.osc.stop(now+.04);}catch{}
    }
    ringing.clear();
  }
  function playInstrument(place){
    if(place!=='great-hall'&&place!=='music-room')return;
    const context=audioForAction?.();
    if(!context)return;
    const isBell=place==='great-hall';
    const pitches=isBell?[392,784,1175]:[523.25,659.25,783.99,1046.5];
    pitches.forEach((frequency,i)=>{
      const osc=context.createOscillator(),gain=context.createGain();
      const start=context.currentTime+.015+(isBell?.04:i*.13);
      const end=start+(isBell?1.25-i*.20:.62);
      osc.type='sine';osc.frequency.value=frequency;
      gain.gain.setValueAtTime(.0001,start);
      gain.gain.exponentialRampToValueAtTime((isBell?.052/(i+1):.049),start+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,end);
      osc.connect(gain);gain.connect(context.destination);
      const voice={osc,gain,context};ringing.add(voice);
      osc.onended=()=>{ringing.delete(voice);osc.disconnect();gain.disconnect();};
      osc.start(start);osc.stop(end+.03);
    });
  }
  function cancel(){
    silence();
    clearTimeout(timer);clearTimeout(clearTimer);
    surface.replaceChildren();
    surface.hidden=true;
    surface.classList.remove('finishing');
    delete stage.dataset.performing;
  }
  function update(place,enabled){
    const selected=enabled&&scenes.has(place)?place:null;
    if(active===selected)return;
    cancel();
    active=selected;
    button.hidden=!active;
    if(!active)return;
    const item=scenes.get(active);
    button.dataset.placeAction=active;
    button.setAttribute('aria-label',item.label);
    button.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true">'+item.icon+'</svg><span>'+item.label+'</span>';
  }
  function play(){
    if(!active||document.hidden||!document.getElementById('modalBackdrop').classList.contains('hidden'))return;
    const item=scenes.get(active);
    cancel();
    playCount++;
    playInstrument(active);
    const artwork=typeof item.draw==='function'?item.draw(playCount):item.draw;
    const duration=Math.max(800,Math.min(7000,item.ms||2800));
    surface.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+artwork+'</svg>';
    surface.hidden=false;
    stage.dataset.performing=active;
    const svg=surface.firstElementChild;
    // A newly inserted SVG starts at zero. Seeking to zero here can strand
    // zero-begin SMIL animations at their initial pose in Chromium.
    if(reduced.matches){
      svg.pauseAnimations?.();
      svg.setCurrentTime?.(duration*.00065);
    }
    timer=setTimeout(()=>{
      surface.classList.add('finishing');
      clearTimer=setTimeout(cancel,240);
    },reduced.matches?1100:duration);
  }
  button.addEventListener('click',play);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  window.addEventListener('pagehide',cancel);
  window.PrincessActivities=Object.freeze({
    add(entries){for(const [place,item] of Object.entries(entries))scenes.set(place,item);},
    update,cancel,silence,
    useAudio(getContext){audioForAction=getContext;},
    places(){return [...scenes.keys()];}
  });
})();
