/* One paper-doll turn in two bars of the ballroom waltz. Only the
   live figure is grouped; its floor shadow, stickers and keepsake stay still. */
(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg';
  const beatMs=60000/(window.PrincessAssets?.musicInfo?.ballroom?.bpm||156);
  const doll=document.getElementById('doll'),hint=document.getElementById('danceHint');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  let figure=null,animation=null,pendingFrame=0;
  const pose=(x,y,tilt,width)=>'translate('+x+'px,'+y+'px) rotate('+tilt+'deg) scale('+width+',1)';
  const rest=pose(0,0,0,1),ready=pose(-5,-2,-1.4,.99);
  function cancel(){
    cancelAnimationFrame(pendingFrame);pendingFrame=0;
    if(animation){animation.onfinish=null;animation.cancel();animation=null;}
    delete doll.dataset.dancing;
  }
  function update(allowed,mode){
    if(figure&&!figure.isConnected){cancel();figure=null;}
    if(!allowed){
      cancel();hint.hidden=true;
      if(figure){figure.querySelector('.ballroom-touch')?.remove();figure.replaceWith(...figure.children);figure=null;}
      return;
    }
    if(figure)return;
    const svg=doll.querySelector(':scope > svg'),head=svg?.querySelector(':scope > .head-back');
    if(!head){hint.hidden=true;return;}
    const parts=[];for(let n=head;n&&!n.classList.contains('sticker-layer');n=n.nextElementSibling)parts.push(n);
    figure=document.createElementNS(ns,'g');figure.id='danceMotion';svg.insertBefore(figure,head);
    // The paper between the sleeves and beside the skirt is still floor.
    const hit=document.createElementNS(ns,'path');hit.classList.add('ballroom-touch');
    hit.setAttribute('d',mode==='casual'?
      'M300 70 Q392 70 390 207 Q392 254 361 292 Q398 308 434 467 L413 490 366 436 370 591 350 748 316 756 299 635 278 756 244 746 236 590 230 434 181 490 160 468 Q198 319 239 291 Q208 258 209 190 Q207 83 300 70Z':
      'M300 70 Q398 69 391 208 Q391 258 360 291 Q408 317 439 467 L420 483 391 451 Q426 575 531 687 Q476 752 315 736 L298 755 275 745 270 737 Q147 747 74 691 Q148 591 201 451 L180 484 158 469 Q192 321 240 291 Q206 257 208 190 Q207 84 300 70Z');
    figure.append(hit,...parts);hint.hidden=false;
  }
  function perform(wait,prepared){
    const reduced=reduce.matches,bar=beatMs*3,steps=[
      [0,prepared?ready:rest],[1/6,pose(-18,-4,-2.8,.91)],
      [2/6,pose(-9,-10,-1,.14)],[3/6,pose(6,-5,1,-.93)],
      [4/6,pose(17,-9,2,.12)],[5/6,pose(9,-3,1.6,.97)],[1,rest]
    ];
    const lead=Math.max(0,wait),total=bar*2+lead;
    const frames=steps.map(([f,v])=>({offset:(lead+f*bar*2)/total,
      transform:reduced?rest:v,opacity:reduced&&f===.5?.85:1,easing:'ease-in-out'}));
    if(lead>0){frames[0].transform=reduced?rest:ready;frames.unshift({offset:0,transform:prepared&&!reduced?ready:rest,opacity:1,easing:'ease-out'});}
    animation?.cancel();animation=figure.animate(frames,{duration:total,fill:'both'});
    if(wait<0)animation.currentTime=-wait;
    animation.onfinish=cancel;
  }
  function start(){
    if(!figure?.isConnected||doll.hasAttribute('data-dancing')||hint.hidden||document.hidden||!document.getElementById('modalBackdrop').classList.contains('hidden'))return;
    doll.classList.remove('bounce');doll.dataset.dancing='';const music=window.PrincessMusic;
    const tapped=performance.now();let prepared=false;
    function align(){
      pendingFrame=0;
      const time=music?.getPlayhead('ballroom');
      if(Number.isFinite(time)){
        const phase=(time*1000)%beatMs;
        perform(phase<65?-phase:beatMs-phase,prepared);return;
      }
      const state=music?.getState();
      if(state?.enabled&&state.sound&&!state.blocked&&!state.sleeping&&performance.now()-tapped<850){
        if(!prepared){prepared=true;animation=figure.animate([{transform:rest},{transform:reduce.matches?rest:ready}],{duration:180,fill:'forwards'});}
        pendingFrame=requestAnimationFrame(align);
      }else perform(0,prepared);
    }
    align();
  }
  doll.addEventListener('click',e=>{if(e.target.closest('.ballroom-touch'))start();});
  hint.addEventListener('click',start);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
  window.addEventListener('pagehide',cancel);
  window.PrincessBallroom=Object.freeze({update,cancel});
})();
