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
        "pixelWidth": 289,
        "pixelHeight": 434,
        "x": 248,
        "y": 704,
        "w": 48,
        "h": 50
      },
      {
        "src": "assets/extras/shoe-ballet-right.png",
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
        "pixelWidth": 302,
        "pixelHeight": 438,
        "x": 248,
        "y": 704,
        "w": 48,
        "h": 50
      },
      {
        "src": "assets/extras/shoe-strap-right.png",
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
        "pixelWidth": 293,
        "pixelHeight": 465,
        "x": 248,
        "y": 684,
        "w": 48,
        "h": 70
      },
      {
        "src": "assets/extras/shoe-boots-right.png",
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
  function headAccessory(id) {
    if(id==='none')return '';
    const m=entry('head-'+id);
    return m?'<g class="painted-head-accessory" data-extra="head-'+esc(id)+'" aria-hidden="true">'+image(m)+'</g>':'';
  }
  function shoe(id,state) {
    const m=entry('shoe-'+id);
    const markup=m?'<g class="painted-shoes" data-extra="shoe-'+esc(id)+'" aria-hidden="true">'+(m.parts||[]).map(p=>image(p)).join('')+'</g>':'';
    return window.PrincessBodySkin?.sceneShoes(state,m,markup)??markup;
  }
  function sticker(id) {
    const m=entry('sticker-'+id);
    return m?'<g class="painted-sticker" data-extra="sticker-'+esc(id)+'" aria-hidden="true">'+image(m)+'</g>':'';
  }
  function card(category,id) {
    const kind=category==='accessory'?'head':category==='shoes'||category==='shoe'?'shoe':category==='stickers'||category==='sticker'?'sticker':null;
    if(!kind)return '';
    const m=entry(kind+'-'+id);
    if(!m)return '';
    let content='';
    if(kind==='shoe') {
      content=(m.parts||[]).map((p,i)=>image(p,{x:i?80:18,y:17,w:52,h:126,aspect:'xMidYMid meet'})).join('');
    } else {
      content=image(m,{x:12,y:14,w:126,h:132,aspect:'xMidYMid meet'});
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 160" width="150" height="160" aria-hidden="true">'+content+'</svg>';
  }
  window.PrincessExtras=Object.freeze({cards,headAccessory,shoe,sticker,card});
})();
