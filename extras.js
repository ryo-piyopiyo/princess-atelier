/* Generated watercolor accessories, shoes, and stickers. All imagery stays on this device. */
(() => {
  'use strict';
  const fallback={
  "head-crown": {
    "kind": "accessory",
    "id": "crown",
    "src": "assets/extras/head-crown.png",
    "pixelWidth": 512,
    "pixelHeight": 246,
    "x": 242,
    "y": 88,
    "w": 116,
    "h": 57
  },
  "head-bow": {
    "kind": "accessory",
    "id": "bow",
    "src": "assets/extras/head-bow.png",
    "pixelWidth": 512,
    "pixelHeight": 384,
    "x": 319,
    "y": 97,
    "w": 80,
    "h": 63
  },
  "head-flowers": {
    "kind": "accessory",
    "id": "flowers",
    "src": "assets/extras/head-flowers.png",
    "pixelWidth": 512,
    "pixelHeight": 339,
    "x": 229,
    "y": 90,
    "w": 142,
    "h": 94
  },
  "head-star": {
    "kind": "accessory",
    "id": "star",
    "src": "assets/extras/head-star.png",
    "pixelWidth": 512,
    "pixelHeight": 343,
    "x": 229,
    "y": 92,
    "w": 142,
    "h": 94
  },
  "sticker-flower": {
    "kind": "sticker",
    "id": "flower",
    "src": "assets/extras/sticker-flower.png",
    "pixelWidth": 475,
    "pixelHeight": 466,
    "x": -50,
    "y": -49.05263157894736,
    "w": 100,
    "h": 98.10526315789473
  },
  "sticker-star": {
    "kind": "sticker",
    "id": "star",
    "src": "assets/extras/sticker-star.png",
    "pixelWidth": 352,
    "pixelHeight": 332,
    "x": -50,
    "y": -47.15909090909091,
    "w": 100,
    "h": 94.31818181818181
  },
  "sticker-butterfly": {
    "kind": "sticker",
    "id": "butterfly",
    "src": "assets/extras/sticker-butterfly.png",
    "pixelWidth": 512,
    "pixelHeight": 377,
    "x": -50,
    "y": -36.81640625,
    "w": 100,
    "h": 73.6328125
  },
  "sticker-ribbon": {
    "kind": "sticker",
    "id": "ribbon",
    "src": "assets/extras/sticker-ribbon.png",
    "pixelWidth": 503,
    "pixelHeight": 415,
    "x": -50,
    "y": -41.252485089463214,
    "w": 100,
    "h": 82.50497017892643
  },
  "sticker-heart": {
    "kind": "sticker",
    "id": "heart",
    "src": "assets/extras/sticker-heart.png",
    "pixelWidth": 422,
    "pixelHeight": 370,
    "x": -50,
    "y": -43.83886255924171,
    "w": 100,
    "h": 87.67772511848342
  },
  "sticker-gem": {
    "kind": "sticker",
    "id": "gem",
    "src": "assets/extras/sticker-gem.png",
    "pixelWidth": 328,
    "pixelHeight": 409,
    "x": -40.09779951100245,
    "y": -50,
    "w": 80.1955990220049,
    "h": 100
  },
  "shoe-ballet": {
    "kind": "shoes",
    "id": "ballet",
    "parts": [
      {
        "src": "assets/extras/shoe-ballet-left.png",
        "maskSrc": "assets/extras/shoe-ballet-left-fabric.png",
        "pixelWidth": 289,
        "pixelHeight": 434,
        "x": 248,
        "y": 704,
        "w": 48,
        "h": 50
      },
      {
        "src": "assets/extras/shoe-ballet-right.png",
        "maskSrc": "assets/extras/shoe-ballet-right-fabric.png",
        "pixelWidth": 295,
        "pixelHeight": 434,
        "x": 302,
        "y": 704,
        "w": 48,
        "h": 50
      }
    ]
  },
  "shoe-strap": {
    "kind": "shoes",
    "id": "strap",
    "parts": [
      {
        "src": "assets/extras/shoe-strap-left.png",
        "maskSrc": "assets/extras/shoe-strap-left-fabric.png",
        "pixelWidth": 302,
        "pixelHeight": 438,
        "x": 248,
        "y": 704,
        "w": 48,
        "h": 50
      },
      {
        "src": "assets/extras/shoe-strap-right.png",
        "maskSrc": "assets/extras/shoe-strap-right-fabric.png",
        "pixelWidth": 298,
        "pixelHeight": 439,
        "x": 302,
        "y": 704,
        "w": 48,
        "h": 50
      }
    ]
  },
  "shoe-boots": {
    "kind": "shoes",
    "id": "boots",
    "parts": [
      {
        "src": "assets/extras/shoe-boots-left.png",
        "maskSrc": "assets/extras/shoe-boots-left-fabric.png",
        "pixelWidth": 293,
        "pixelHeight": 465,
        "x": 248,
        "y": 684,
        "w": 48,
        "h": 70
      },
      {
        "src": "assets/extras/shoe-boots-right.png",
        "maskSrc": "assets/extras/shoe-boots-right-fabric.png",
        "pixelWidth": 295,
        "pixelHeight": 479,
        "x": 302,
        "y": 684,
        "w": 48,
        "h": 70
      }
    ]
  }
};
  const cards=Object.freeze({
    accessory:Object.freeze([{id:'crown',label:'ティアラ'},{id:'bow',label:'リボン'},{id:'flowers',label:'おはなの かんむり'},{id:'star',label:'おほしさま'}].map(Object.freeze)),
    shoes:Object.freeze([{id:'ballet',label:'バレエシューズ'},{id:'strap',label:'ストラップの くつ'},{id:'boots',label:'りぼんの ブーツ'}].map(Object.freeze)),
    stickers:Object.freeze([{id:'flower',label:'おはな'},{id:'star',label:'おほしさま'},{id:'butterfly',label:'ちょうちょ'},{id:'ribbon',label:'リボン'},{id:'heart',label:'ハート'},{id:'gem',label:'ほうせき'}].map(Object.freeze))
  });
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function entry(key) {
    const source=window.PrincessAssets?.extras;
    return (source?.entries||source||{})[key]||fallback[key]||null;
  }
  function localImage(source) {
    return typeof source==='string'&&/^(?:data:image\/(?:png|webp);base64,|assets\/|blob:)/i.test(source);
  }
  function image(meta,override={}) {
    if(!meta||!localImage(meta.src))return '';
    const m={...meta,...override};
    if(!['x','y','w','h'].every(k=>Number.isFinite(m[k]))||m.w<=0||m.h<=0)return '';
    return '<image href="'+esc(meta.src)+'" x="'+m.x+'" y="'+m.y+'" width="'+m.w+'" height="'+m.h+'" preserveAspectRatio="'+(override.aspect||'none')+'"/>';
  }
  let tintSerial=0;
  // The watercolor is painted in three different pigment families. Isolate
  // the original dye using channel differences so pearls, leaves, and gold
  // settings around pink gemstones retain their own colors.
  function dyePigment(markup,color,family='rose') {
    if(!markup||!/^#[\da-f]{6}$/i.test(color||''))return markup;
    const mask={rose:'5.2 -13.2 8 0 -.13',gold:'0 9 -9 0 -.18',aqua:'-9 5 4 0 -.15'}[family];
    const id='extra-watercolor-'+(++tintSerial);
    const curves=[1,3,5].map((offset,i)=>{
      const pigment=parseInt(color.slice(offset,offset+2),16)/255;
      const mid=.11+.78*pigment;
      const values=Array.from({length:17},(_,j)=>{
        const y=j/16;
        return (y<.72?mid*(.06+.94*y/.72):mid+(1-mid)*((y-.72)/.28)**1.18).toFixed(4);
      });
      return `<feFunc${'RGB'[i]} type="table" tableValues="${values.join(' ')}"/>`;
    }).join('');
    return `<defs><filter id="${id}" x="-1%" y="-1%" width="102%" height="102%" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0" result="value"/>
      <feComponentTransfer in="value" result="paint">${curves}<feFuncA type="identity"/></feComponentTransfer>
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${mask}" result="pigment"/>
      <feComposite in="paint" in2="pigment" operator="in" result="colored"/>
      <feComposite in="SourceGraphic" in2="pigment" operator="out" result="original"/>
      <feComposite in="colored" in2="original" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter></defs><g filter="url(#${id})">${markup}</g>`;
  }
  function ornamentImage(id,m,color,placement) {
    const family=id==='star'?'gold':id==='gem'?'aqua':'rose';
    return dyePigment(image(m,placement),color,family);
  }
  function headAccessory(id,color=null) {
    if(id==='none')return '';
    const m=entry('head-'+id);
    return m?'<g class="painted-head-accessory" data-extra="head-'+esc(id)+'" aria-hidden="true">'+ornamentImage(id,m,color)+'</g>':'';
  }
  const shoeBases={ballet:'#e7b0a7',strap:'#e9d2c3',boots:'#ccacb6'};
  function shoePart(shoe,part,state){
    const imageMarkup=image(part);
    const original=window.PrincessBodySkin?.sceneShoes(state,shoe,imageMarkup)??imageMarkup;
    const color=state?.shoeColor,filter=window.CoordArt?.tintFilter;
    if(!/^#[\da-f]{6}$/i.test(color||'')||!localImage(part.maskSrc)||!filter)return original;
    const key='shoe-fabric-'+(++tintSerial),mask=key+'-mask';
    return '<g class="dyed-shoe">'+original+'<defs>'+filter(key,color,shoeBases[shoe.id])
      +'<mask id="'+mask+'" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="'+part.x+'" y="'+part.y+'" width="'+part.w+'" height="'+part.h+'" style="mask-type:alpha">'
      +image({...part,src:part.maskSrc})+'</mask></defs><g mask="url(#'+mask+')"><g filter="url(#'+key+')">'+imageMarkup+'</g></g></g>';
  }
  function shoe(id,state){
    const m=entry('shoe-'+id);
    return m?'<g class="painted-shoes" data-extra="shoe-'+esc(id)+'" aria-hidden="true">'+(m.parts||[]).map(part=>shoePart(m,part,state)).join('')+'</g>':'';
  }
  function shoeCardPart(shoe,part,index,state){
    // Keep the original thumbnail's fit, sharing exactly the scene's fabric and skin masks.
    const scale=Math.min(52/part.pixelWidth,126/part.pixelHeight);
    const w=part.pixelWidth*scale,h=part.pixelHeight*scale;
    const x=(index?80:18)+(52-w)/2,y=17+(126-h)/2;
    const transform='translate('+x+' '+y+') scale('+w/part.w+' '+h/part.h+') translate('+(-part.x)+' '+(-part.y)+')';
    return '<g transform="'+transform+'">'+shoePart(shoe,part,state)+'</g>';
  }
  function sticker(id,color=null) {
    const m=entry('sticker-'+id);
    return m?'<g class="painted-sticker" data-extra="sticker-'+esc(id)+'" aria-hidden="true">'+ornamentImage(id,m,color)+'</g>':'';
  }
  function card(category,id,state={}) {
    const kind=category==='accessory'?'head':category==='shoes'||category==='shoe'?'shoe':category==='stickers'||category==='sticker'?'sticker':null;
    if(!kind)return '';
    const m=entry(kind+'-'+id);
    if(!m)return '';
    let content='';
    if(kind==='shoe') {
      content=(m.parts||[]).map((part,i)=>shoeCardPart(m,part,i,state)).join('');
    } else {
      const color=kind==='head'?state.accessoryColor:state.stickerColor;
      content=ornamentImage(id,m,color,{x:12,y:14,w:126,h:132,aspect:'xMidYMid meet'});
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 160" width="150" height="160" aria-hidden="true">'+content+'</svg>';
  }
  window.PrincessExtras=Object.freeze({cards,headAccessory,shoe,sticker,card,dyeRibbon:dyePigment});
})();
