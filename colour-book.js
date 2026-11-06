/* Shared colour book. The mirror, nail drawing or clothing shelf stays mounted below it. */
(() => {
  'use strict';
  let settings={},session=null;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function hex(value){
    if(typeof value!=='string'||!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value))return null;
    return (value.length===4?'#'+Array.from(value.slice(1),c=>c+c).join(''):value).toLowerCase();
  }
  function nearestGroup(groups,value){
    if(!value)return 0;
    const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
    const sample=rgb(value);let best=0,minDistance=Infinity;
    groups.forEach((group,index)=>{
      for(const item of group.colors){
        const colour=hex(item.hex);if(!colour)continue;
        const [r,g,b]=rgb(colour).map((v,i)=>v-sample[i]);
        const distance=2*r*r+4*g*g+3*b*b;
        if(distance<minDistance){best=index;minDistance=distance;}
      }
    });
    return best;
  }
  function colourInfo(value){
    const entry=session.groups.flatMap(group=>group.colors).find(c=>hex(c.hex)===value);
    return entry||session.options.describe?.(value)||{hex:value,label:'じぶんの いろ',reading:value?.toUpperCase()||'',voiceKey:'color'};
  }
  function render(){
    const {options,root,groups,group}=session;
    const current=hex(options.current()),info=current?colourInfo(current):null;
    root.querySelector('#colourGarmentPreview').innerHTML=options.preview?.()||'';
    root.querySelector('#colourName').innerHTML=info?'<strong>'+escape(info.label)+'</strong><span>'+escape(info.reading)+'</span>':'';
    const input=root.querySelector('[data-colour-rgb]');input.value=current||'#ffffff';
    root.querySelector('#colourGroups').innerHTML=groups.map((family,i)=>{
      const colors=family.colors;
      const stops=[0,.25,.5,.75,1].map(n=>hex(colors[Math.floor(n*(colors.length-1))].hex)+' '+n*100+'%');
      return '<button class="colour-family '+(i===group?'selected':'')+'" data-colour-group="'+i+'" aria-label="'+escape(family.label||family.id)+'" aria-pressed="'+(i===group)+'"><span style="background:linear-gradient(135deg,'+stops.join(',')+')"></span>'+(i===group?'<i>'+settings.icon('check')+'</i>':'')+'</button>';
    }).join('');
    root.querySelector('#colourChoices').innerHTML=groups[group].colors.map((c,i)=>{
      const value=hex(c.hex),selected=value===current;
      return '<button class="colour-sample '+(selected?'selected':'')+'" style="--swatch:'+value+'" data-colour-choice="'+i+'" aria-label="'+escape([c.label,c.reading].filter(Boolean).join(' '))+'" aria-pressed="'+selected+'">'+(selected?settings.icon('check'):'')+'</button>';
    }).join('');
  }
  function pick(value){
    value=hex(value);if(!value)return;
    const {options,groups}=session,info=colourInfo(value);
    const index=groups.findIndex(family=>family.colors.some(c=>hex(c.hex)===value));
    if(!groups[session.group].colors.some(c=>hex(c.hex)===value))session.group=index<0?nearestGroup(groups,value):index;
    options.onPick(value,info);
    if(session?.options===options)render();
    settings.speak(info.voiceKey||'color',info.reading||info.label);
  }
  function close(){
    if(!session)return;
    const {root,options,owner,ownerScope,covered}=session;session=null;root.remove();
    for(const [el,old] of covered){el.inert=false;if(old===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',old);}
    options.onClose?.();
    if(owner?.isConnected){owner.focus({preventScroll:true});return;}
    if(!owner||!ownerScope?.isConnected)return;
    const attrs=[...owner.attributes].filter(a=>a.name.startsWith('data-'));
    if(attrs.length){
      const replacement=[...ownerScope.querySelectorAll('button')].find(b=>attrs.every(a=>b.getAttribute(a.name)===a.value));
      replacement?.focus({preventScroll:true});
    }
  }
  function handleKey(event){
    if(!session)return;
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
    if(event.key!=='Tab')return;
    const controls=[...session.root.querySelectorAll('button:not([disabled]),input')];
    const boundary=event.shiftKey?controls[0]:controls.at(-1);
    if(document.activeElement===boundary){
      event.preventDefault();controls[event.shiftKey?controls.length-1:0].focus();
    }
  }
  function open(options){
    if(session)close();
    const groups=settings.groups().filter(family=>family.colors?.length);
    if(!groups.length)return;
    const owner=document.activeElement,root=document.createElement('div');
    const current=hex(options.current()),index=nearestGroup(groups,current);
    const covered=[document.getElementById('app'),document.getElementById('modalBackdrop')].filter(el=>el&&!el.inert).map(el=>[el,el.getAttribute('aria-hidden')]);
    for(const [el] of covered)el.inert=true;
    session={options,groups,group:Math.max(0,index),root,owner,covered,ownerScope:owner?.closest('[role="dialog"]')||document.body};
    root.className='modal-backdrop colour-book-layer';
    root.innerHTML='<section class="modal colour-modal colour-book" role="dialog" aria-modal="true" aria-labelledby="colourBookTitle">'
      +'<button class="modal-close" data-colour-close aria-label="とじる">'+settings.icon('close')+'</button>'
      +'<h2 id="colourBookTitle">'+escape(options.title||'いろを えらぼう')+'</h2>'
      +'<div class="colour-workbench"><div class="colour-preview-column"><div id="colourGarmentPreview" class="colour-garment-preview"></div><div id="colourName" class="colour-name" aria-live="polite"></div></div>'
      +'<div class="colour-picker-column"><nav id="colourGroups" class="colour-groups" aria-label="いろの なかま"></nav><div id="colourChoices" class="colour-choices" aria-label="いろの みほん"></div>'
      +'<label class="colour-custom"><input type="color" data-colour-rgb aria-label="じぶんの いろ"><span>じぶんの いろ</span></label>'+ (options.onReset?'<button class="item-original" data-colour-original>↶ もとの いろ</button>':'')+'</div></div>'
      +'<div class="modal-actions"><button class="action-button" data-colour-done>'+settings.icon('check')+'<span>これに する</span></button></div></section>';
    document.body.append(root);render();
    root.addEventListener('change',e=>{if(e.target.matches('[data-colour-rgb]'))pick(e.target.value);});
    root.addEventListener('click',e=>{
      if(e.target===root||e.target.closest('[data-colour-close],[data-colour-done]')){close();return;}
      if(e.target.closest('[data-colour-original]')){options.onReset?.();render();return;}
      const family=e.target.closest('[data-colour-group]'),sample=e.target.closest('[data-colour-choice]');
      if(!family&&!sample)return;
      const button=family||sample,focused=document.activeElement===button;
      if(family){session.group=Number(family.dataset.colourGroup);render();settings.effect?.();}
      else pick(groups[session.group].colors[Number(sample.dataset.colourChoice)].hex);
      if(focused&&session?.root===root){
        const key=family?'data-colour-group':'data-colour-choice';
        root.querySelector('['+key+'="'+button.getAttribute(key)+'"]')?.focus({preventScroll:true});
      }
    });
    root.querySelector('[data-colour-close]').focus({preventScroll:true});
    for(const [el] of covered)el.setAttribute('aria-hidden','true');
    settings.speak('chooseColor','いろを えらんでね');
  }
  document.addEventListener('keydown',handleKey,true);
  window.PrincessColourBook=Object.freeze({configure(options){settings=options;},open,close});
})();
