/* Visible-page inactivity only. Never requests a wake lock or an OS screen lock. */
(() => {
  'use strict';
  const WARN_AFTER=5*60*1000,CLOSE_AFTER=30*1000;
  let started=false,phase='inactive',timer=0,lastActivity=0,warnedAt=null,warningCount=0;
  let config={},swallowWake=false,swallowTimer=0,previousFocus=null,suppressWakeClick=false,clickGuardTimer=0;
  const pressedPointers=new Set();
  const curtain=document.createElement('div');
  curtain.id='idleCurtain';curtain.className='idle-curtain';curtain.tabIndex=-1;
  curtain.setAttribute('role','button');curtain.setAttribute('aria-label','タッチして つづける');
  curtain.setAttribute('aria-hidden','true');curtain.dataset.phase=phase;
  curtain.innerHTML='<div class="idle-lid idle-lid-top"></div><div class="idle-lid idle-lid-bottom"></div>';
  document.body.append(curtain);
  const now=()=>performance.now();
  const visible=()=>!document.hidden;
  function invoke(name){try{config[name]?.();}catch(error){console.warn('Idle callback unavailable',name,error);}}
  function clearTimer(){clearTimeout(timer);timer=0;}
  function setPhase(value){phase=value;curtain.dataset.phase=value;}
  function schedule(){
    clearTimer();if(!started||!visible()||phase==='sleep')return;
    const due=phase==='warning'?warnedAt+CLOSE_AFTER:lastActivity+WARN_AFTER;
    timer=setTimeout(tick,Math.max(1,due-now()));
  }
  function resetClock(){
    clearTimer();if(phase==='warning')invoke('onCancelWarning');
    warnedAt=null;lastActivity=now();setPhase(started?'active':'inactive');
    if(started&&visible())schedule();
  }
  function tick(){
    timer=0;if(!started||!visible()||phase==='sleep')return;
    if(phase==='active'){
      if(now()-lastActivity<WARN_AFTER){schedule();return;}
      setPhase('warning');warnedAt=now();warningCount++;
      let sound=true;try{sound=config.isSoundEnabled?.()!==false;}catch{}
      if(sound)invoke('onWarning');schedule();return;
    }
    if(phase==='warning'){
      if(now()-warnedAt<CLOSE_AFTER){schedule();return;}
      clearTimer();setPhase('sleep');previousFocus=document.activeElement;
      invoke('onSleep');curtain.setAttribute('aria-hidden','false');
      curtain.classList.add('is-closed');curtain.focus({preventScroll:true});
    }
  }
  function wake(){
    curtain.classList.remove('is-closed');curtain.setAttribute('aria-hidden','true');
    if(previousFocus?.isConnected)try{previousFocus.focus({preventScroll:true});}catch{}
    previousFocus=null;resetClock();invoke('onWake');
  }
  function consume(event){if(event.cancelable)event.preventDefault();event.stopImmediatePropagation();}
  function releaseWakeGuard(){swallowWake=false;clearTimeout(swallowTimer);swallowTimer=0;}
  function clearClickGuard(){suppressWakeClick=false;clearTimeout(clickGuardTimer);clickGuardTimer=0;}
  function input(event){
    if(!started)return;
    if(event.type==='pointerdown')pressedPointers.add(event.pointerId);
    if(event.type==='pointerup'||event.type==='pointercancel')pressedPointers.delete(event.pointerId);
    if(suppressWakeClick){
      if(event.type==='click'){consume(event);clearClickGuard();return;}
      if(['pointerup','pointercancel','touchend'].includes(event.type)){consume(event);return;}
      if(['pointerdown','touchstart','keydown'].includes(event.type))clearClickGuard();
    }
    if(swallowWake){
      consume(event);
      if(event.type==='touchend'){
        releaseWakeGuard();suppressWakeClick=true;
        clickGuardTimer=setTimeout(clearClickGuard,750);
      }else if(event.type==='click'||event.type==='keyup')releaseWakeGuard();
      return;
    }
    if(phase==='sleep'){
      consume(event);
      if(['pointerdown','touchstart','keydown','click'].includes(event.type)){
        swallowWake=true;clearTimeout(swallowTimer);
        // Consume the complete waking gesture, including Safari's compatibility click.
        swallowTimer=setTimeout(releaseWakeGuard,750);wake();
        if(event.type==='click')releaseWakeGuard();
      }
      return;
    }
    if(!visible())return;
    const dragging=event.type==='pointermove'&&(event.buttons>0||pressedPointers.has(event.pointerId));
    if(dragging||['pointerdown','touchstart','touchmove','keydown','wheel','input','click'].includes(event.type))resetClock();
  }
  for(const type of ['pointerdown','pointermove','pointerup','pointercancel','touchstart','touchmove','touchend','keydown','keyup','wheel','input','click','contextmenu'])document.addEventListener(type,input,{capture:true,passive:false});
  function pause(){clearTimer();if(phase==='warning'){invoke('onCancelWarning');warnedAt=null;setPhase('active');}}
  document.addEventListener('visibilitychange',()=>{
    if(!visible()){pause();return;}
    if(started&&phase!=='sleep')resetClock();
  });
  window.addEventListener('pagehide',pause);
  window.addEventListener('pageshow',()=>{if(started&&visible()&&phase!=='sleep')resetClock();});
  window.PrincessIdle={
    start(options={}){config={...config,...options};started=true;if(phase==='sleep')wake();else resetClock();},
    stop(){clearTimer();releaseWakeGuard();clearClickGuard();pressedPointers.clear();if(phase==='warning')invoke('onCancelWarning');started=false;warnedAt=null;setPhase('inactive');curtain.classList.remove('is-closed');curtain.setAttribute('aria-hidden','true');},
    activity(){if(started&&phase!=='sleep'&&visible())resetClock();},
    getState(){return {started,phase,visible:visible(),warningCount,lastActivity,warnedAt};}
  };
})();
