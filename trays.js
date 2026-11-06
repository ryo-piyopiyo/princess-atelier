/* Match the pictures in the accessory box to the doll and the keepsake. */
(() => {
  'use strict';
  let api;
  const kinds=['accessory','necklace','ring','bracelet'];
  const names={accessory:'ヘアアクセサリー',necklace:'ネックレス',ring:'ゆびわ',bracelet:'ブレスレット',shoes:'くつ',stickers:'シール',ribbon:'リボン',pattern:'もよう',dressAccent:'かざり',hairRibbon:'かみの リボン'};
  const example={accessory:'crown',necklace:'dew',ring:'rose',bracelet:'clover'};
  const key={accessory:'accessoryColor',shoes:'shoeColor',hairRibbon:'hairRibbonColor',dressAccent:'dressAccentColor',necklace:'necklaceColor',ring:'ringColor',bracelet:'braceletColor'};
  const original={accessory:{crown:'#db8fa9',bow:'#d98da8',flowers:'#e8b6be',star:'#d6ad68'},shoes:{ballet:'#e4b1bd',strap:'#edd5b0',boots:'#ca8d96'},stickers:{flower:'#e9a3b3',star:'#ecc65f',butterfly:'#c895d3',ribbon:'#df98ac',heart:'#e38fa7',gem:'#71b9c8'}};
  const cap=k=>k[0].toUpperCase()+k.slice(1);
  const current=(kind,s)=>kind==='accessory'&&s.mode==='casual'?s.casual.accessory:s[kind];
  const items=kind=>api.cardItems(kind);
  const noItem=()=>'<svg viewBox="0 0 96 96" aria-hidden="true"><ellipse cx="48" cy="48" rx="27" ry="28" fill="#faf3ea" stroke="#c7b6aa" stroke-width="4"/><path d="m29 68 38-40" stroke="#bb7082" stroke-width="6" stroke-linecap="round"/></svg>';
  function swatch(kind,id,s){
    if(id==='none')return noItem();
    return kind==='accessory'?window.PrincessExtras.card('accessory',id,s):window.PrincessJewelry.card(kind,id,s);
  }
  function shelf(){
    const s=api.getState();
    return '<div class="trinket-box">'+kinds.map(kind=>{
      const id=current(kind,s),worn=id&&id!=='none';
      return '<button class="trinket-box-button" data-jewel-shelf="'+kind+'" aria-label="'+names[kind]+'"><span>'+swatch(kind,worn?id:example[kind],worn?s:{...s,[key[kind]]:null})+'</span><small>'+names[kind]+'</small>'+(worn?'<i class="trinket-check">'+api.icon('check')+'</i>':'')+'</button>';
    }).join('')+'</div>';
  }
  function accentButton(kind){
    const label=kind==='dressAccent'?window.PrincessAssets.costume.dresses[api.getState().dress].accentLabel:names[kind];
    return '<button class="accent-paint" data-item-dye="'+kind+'" aria-label="'+api.escape(label)+'の いろ">'+api.toolIcon('ribbon')+'<span>'+api.escape(label)+'</span></button>';
  }
  function dyeButton(kind,disabled=false){
    const metal=kind.endsWith('-metal'),label=metal?'かなぐの いろ':names[kind]+'の いろ';
    return '<button class="item-dye" data-item-dye="'+kind+'" aria-label="'+label+'" '+(disabled?'disabled':'')+'>'+(metal?"<svg viewBox=\"0 0 48 48\" aria-hidden=\"true\"><g transform=\"rotate(-38 24 24)\" fill=\"none\" stroke-width=\"5\"><ellipse cx=\"15\" cy=\"24\" rx=\"11\" ry=\"7\" stroke=\"#ac8858\"/><ellipse cx=\"31\" cy=\"24\" rx=\"11\" ry=\"7\" stroke=\"#8898a6\"/><path d=\"M7 21q6-6 14-1m3 1q7-6 14-1\" stroke-width=\"1.6\" stroke=\"#fff5d5\"/></g><path d=\"m38 3 2 5 5 1-5 2-2 5-1-5-5-2 5-1Z\" fill=\"#d8ac59\"/></svg>":api.toolIcon('color'))+'<span>'+label+'</span></button>';
  }
  function wornPreview(kind,s){
    if(kind!=='accessory')return window.PrincessJewelry.preview(kind,s);
    const svg=document.querySelector('#doll>svg')?.cloneNode(true);
    if(!svg)return swatch(kind,current(kind,s),s);
    svg.querySelector('.sticker-layer')?.remove();svg.setAttribute('viewBox','187 67 230 249');
    svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('aria-hidden','true');svg.removeAttribute('role');
    const pre='trinket-face-'+(++serial)+'-';
    return svg.outerHTML.replace(/\bid="([^"]+)"/g,(_,v)=>'id="'+pre+v+'"').replace(/url\(#([^)]+)\)/g,(_,v)=>'url(#'+pre+v+')');
  }
  let serial=0;
  function refresh(kind){
    const panel=document.querySelector('[data-tray-panel="'+kind+'"]');if(!panel)return;
    const s=api.getState(),active=current(kind,s),list=items(kind),item=list.find(i=>i.id===active);
    panel.innerHTML='<div class="trinket-mirror"><div class="trinket-portrait">'+wornPreview(kind,s)+'</div><span>'+(active==='none'?'なにも つけていないよ':api.escape(item?.label||''))+'</span></div><div class="trinket-options"><div class="trinket-grid">'+list.map(item=>'<button class="trinket-item" data-jewel-kind="'+kind+'" data-jewel-item="'+item.id+'" aria-pressed="'+(active===item.id)+'" aria-label="'+api.escape(item.label)+'"><span>'+swatch(kind,item.id,s)+'</span><small>'+api.escape(item.label)+'</small>'+(active===item.id?'<i class="trinket-check">'+api.icon('check')+'</i>':'')+'</button>').join('')+'</div><div class="trinket-dye-row">'+dyeButton(kind,active==='none')+(item?.metalColorable?dyeButton(kind+'-metal'):'')+'</div></div>';
  }
  function open(kind){
    if(!kinds.includes(kind))return;
    api.openModal(api.closeMarkup()+'<h2>'+names[kind]+'</h2><div class="trinket-panel" data-tray-panel="'+kind+'"></div><div class="modal-actions"><button class="action-button" data-close>'+api.icon('check')+'<span>これに する</span></button></div>','trinket-modal');
    refresh(kind);api.speak(kind==='accessory'?'accessory':'jewel'+cap(kind));
  }
  function pick(kind,id){
    if(!kinds.includes(kind)||!items(kind).some(it=>it.id===id))return;
    const s=api.getState();if(current(kind,s)!==id)api.change(()=>{if(kind==='accessory'&&s.mode==='casual')s.casual.accessory=id;else s[kind]=id;});
    refresh(kind);document.querySelector('[data-jewel-kind="'+kind+'"][data-jewel-item="'+id+'"]')?.focus({preventScroll:true});
    api.speak(id==='none'?'jewelOff':kind==='accessory'?'learnAccessory'+cap(id):'jewel'+cap(kind)+cap(id));
  }
  function colour(target){
    const metal=target.endsWith('-metal'),kind=metal?target.slice(0,-6):target;
    if(!(kind in names))return;
    const s=api.getState(),cloth=kind==='ribbon'||kind==='pattern',part=api.getCasualPart(),style=s.casual.styles[part];
    const id=kind==='stickers'?api.getSticker():current(kind,s);
    if(kinds.includes(kind)&&id==='none'||cloth&&(kind==='ribbon'?!style.ribbon:style.pattern==='plain'))return;
    const jewel=window.PrincessJewelry?.cards?.[kind]?.find(it=>it.id===id),field=metal?kind+'MetalColor':key[kind];
    if(metal&&!jewel?.metalColorable)return;
    function stored(){return cloth?style[kind+'Color']:kind==='stickers'?s.stickerColors[id]:s[field];}
    const dress=window.PrincessAssets?.costume?.dresses?.[s.dress];
    if(kind==='dressAccent'&&!dress?.accentMaskSrc||kind==='hairRibbon'&&!window.PrincessHair?.hasRibbon?.(s.hair))return;
    const originalColor=(kind==='dressAccent'?dress.accentBaseColor:kind==='hairRibbon'?'#f0d8d6':null)||(metal?jewel?.metalBaseColor:null)||original[kind]?.[id]||jewel?.baseColor||(kind==='pattern'?'#fff5df':'#d98da8');
    function preview(){if(kind==='dressAccent')return window.PrincessArt.card('dress',s.dress,s);if(kind==='hairRibbon')return api.hairPreview(s.hair);if(kinds.includes(kind))return wornPreview(kind,s);if(kind==='shoes')return window.PrincessExtras.card(kind,id,s);if(kind==='stickers')return api.stickerCard(id,s.stickerColors[id]);return api.casualThumbnail(part);}
    function write(value){
      if((stored()||null)===value)return;
      api.change(()=>{if(cloth)style[kind+'Color']=value;else if(kind==='stickers'){if(value)s.stickerColors[id]=value;else delete s.stickerColors[id];}else s[field]=value;});
      if(kinds.includes(kind))refresh(kind);
    }
    window.PrincessColourBook.open({title:metal?'かなぐの いろ':(kind==='dressAccent'?dress.accentLabel:names[kind])+'の いろ',current:()=>stored()||originalColor,preview,onPick:write,onReset:()=>write(null),onClose:()=>{
      if(cloth){api.refreshCasual(kind);document.querySelector('#modal [data-item-dye="'+kind+'"]')?.focus({preventScroll:true});}
    }});
  }
  window.PrincessTrays=Object.freeze({configure(opts){api=opts;},shelf,dyeButton,accentButton,open,pick,colour});
})();
