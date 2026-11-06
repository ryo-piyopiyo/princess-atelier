/* Optional layered watercolor faces. Legacy faces and photos are gated by art.js. */
(() => {
  'use strict';
  const FALLBACK={"version":1,"skin":{"src":"assets/face-studio/skin-base.png","x":234,"y":127,"w":132,"h":166,"sourceRect":[224,12,532,293]},"eyes":{"round":{"left":{"src":"assets/face-studio/eye-round-left.png","skinMaskSrc":"assets/face-studio/eye-round-left-skin-mask.png","x":252.4596,"y":198.7547,"w":36,"h":26.0377,"iris":{"cx":273,"cy":212,"rx":9.5094,"ry":9.9623},"brow":{"src":"assets/face-studio/brow-round-left.png","x":258,"y":185,"w":30,"h":11.2739},"sourceRect":[871,126,1030,241],"blendMaskSrc":"assets/face-studio/eye-round-left-blend-mask.png"},"right":{"src":"assets/face-studio/eye-round-right.png","skinMaskSrc":"assets/face-studio/eye-round-right-skin-mask.png","x":310.1057,"y":198.3247,"w":36,"h":26.8831,"iris":{"cx":327,"cy":212,"rx":9.8182,"ry":10.2857},"brow":{"src":"assets/face-studio/brow-round-right.png","x":312,"y":185,"w":30,"h":10.8917},"sourceRect":[1141,126,1295,241],"blendMaskSrc":"assets/face-studio/eye-round-right-blend-mask.png"}},"almond":{"left":{"src":"assets/face-studio/eye-almond-left.png","skinMaskSrc":"assets/face-studio/eye-almond-left-skin-mask.png","x":252.1048,"y":202.241,"w":36,"h":19.3012,"iris":{"cx":273,"cy":212,"rx":9.1084,"ry":9.5422},"brow":{"src":"assets/face-studio/brow-almond-left.png","x":258,"y":185,"w":30,"h":10.3774},"sourceRect":[1590,146,1756,235],"blendMaskSrc":"assets/face-studio/eye-almond-left-blend-mask.png"},"right":{"src":"assets/face-studio/eye-almond-right.png","skinMaskSrc":"assets/face-studio/eye-almond-right-skin-mask.png","x":309.5324,"y":202.1818,"w":36,"h":19.4182,"iris":{"cx":327,"cy":212,"rx":9.1636,"ry":9.6},"brow":{"src":"assets/face-studio/brow-almond-right.png","x":312,"y":185,"w":30,"h":10.125},"sourceRect":[1864,146,2029,235],"blendMaskSrc":"assets/face-studio/eye-almond-right-blend-mask.png"}},"soft":{"left":{"src":"assets/face-studio/eye-soft-left.png","skinMaskSrc":"assets/face-studio/eye-soft-left-skin-mask.png","x":252.1473,"y":201.0633,"w":36,"h":20.962,"iris":{"cx":273,"cy":212,"rx":9.5696,"ry":10.0253},"brow":{"src":"assets/face-studio/brow-soft-left.png","x":258,"y":185,"w":30,"h":10.0633},"sourceRect":[155,411,313,503],"blendMaskSrc":"assets/face-studio/eye-soft-left-blend-mask.png"},"right":{"src":"assets/face-studio/eye-soft-right.png","skinMaskSrc":"assets/face-studio/eye-soft-right-skin-mask.png","x":309.9958,"y":200.7792,"w":36,"h":21.5065,"iris":{"cx":327,"cy":212,"rx":9.8182,"ry":10.2857},"brow":{"src":"assets/face-studio/brow-soft-right.png","x":312,"y":185,"w":30,"h":10.1274},"sourceRect":[428,411,582,503],"blendMaskSrc":"assets/face-studio/eye-soft-right-blend-mask.png"}}},"mouths":{"smile":{"src":"assets/face-studio/mouth-smile.png","x":277,"y":250,"w":46,"h":19.7887,"lipMaskSrc":"assets/face-studio/mouth-smile-lip-mask.png","sourceRect":[955,396,1220,510],"anchor":{"x":300,"y":260.8838,"rx":18.400000000000002,"ry":4.749283018867924},"skinMarginSrc":"assets/face-studio/mouth-smile-skin-margin.png"},"laugh":{"src":"assets/face-studio/mouth-laugh.png","x":275.5,"y":246,"w":49,"h":28.9211,"lipMaskSrc":"assets/face-studio/mouth-laugh-lip-mask.png","sourceRect":[1681,366,1947,523],"anchor":{"x":300,"y":261.9066,"rx":19.6,"ry":6.941052631578947},"skinMarginSrc":"assets/face-studio/mouth-laugh-skin-margin.png"},"gentle":{"src":"assets/face-studio/mouth-gentle.png","x":279,"y":255,"w":42,"h":13.0042,"lipMaskSrc":"assets/face-studio/mouth-gentle-lip-mask.png","sourceRect":[250,618,489,692],"anchor":{"x":300,"y":262.1523,"rx":16.8,"ry":3.121004184100418},"skinMarginSrc":"assets/face-studio/mouth-gentle-skin-margin.png"}}};
  const defaults=Object.freeze({enabled:false,skinDepth:'light',undertone:'warm',iris:'brown',eyeShape:'soft',eyeHeight:0,eyeSpacing:0,mouth:'smile'});
  const skinPalette=Object.freeze({light:Object.freeze({warm:'#efc6a7',neutral:'#e8c8b5',cool:'#e6c8c3'}),medium:Object.freeze({warm:'#c18f62',neutral:'#b98c73',cool:'#b58a83'}),deep:Object.freeze({warm:'#855333',neutral:'#79513f',cool:'#74504b'})});
  // Watercolor midtones, ordered from light to deep. Each interval has four small steps.
  const skinMidtones=['#f4dacc','#eed0bf','#e8c5b2','#dfb8a2','#d5a88f','#c7997f','#b98970','#a77962','#936851','#7e5643','#674534','#50362b'];
  const hueOffsets=[[-1,-4,6],[3,-2,2],[0,0,0],[2,3,-5],[-5,3,-5]];
  const lastShade=(skinMidtones.length-1)*4;
  const naturalSkin=value=>value!=null&&Number.isInteger(value.skinShade)&&value.skinShade>=0&&value.skinShade<=lastShade&&Number.isInteger(value.skinHue)&&value.skinHue>=0&&value.skinHue<hueOffsets.length;
  const normalizeColor=value=>typeof value==='string'&&value.length===7&&/^#[0-9a-f]{6}$/i.test(value)?value.toLowerCase():null;
  const paintedSkin=o=>naturalSkin(o)||Boolean(normalizeColor(o?.skinColor));
  const irisPalette=Object.freeze({brown:'#7b523b',amber:'#af7d35',hazel:'#7a7b3f',green:'#4c8063',blue:'#547f9e',gray:'#737c86'});
  const choices=Object.freeze({skinDepth:[{id:'light',label:'明るめ'},{id:'medium',label:'中間'},{id:'deep',label:'深め'}],undertone:[{id:'warm',label:'暖かい色'},{id:'neutral',label:'自然な色'},{id:'cool',label:'涼しい色'}],iris:[{id:'brown',label:'ブラウン'},{id:'amber',label:'アンバー'},{id:'hazel',label:'ヘーゼル'},{id:'green',label:'グリーン'},{id:'blue',label:'ブルー'},{id:'gray',label:'グレー'}],eyeShape:[{id:'round',label:'まるい目'},{id:'almond',label:'アーモンドの目'},{id:'soft',label:'やさしい目'}],eyeHeight:[{id:-1,label:'少し下'},{id:0,label:'まんなか'},{id:1,label:'少し上'}],eyeSpacing:[{id:-1,label:'少し近く'},{id:0,label:'まんなか'},{id:1,label:'少し離す'}],mouth:[{id:'smile',label:'にっこり'},{id:'laugh',label:'わらい顔'},{id:'gentle',label:'おだやか'}]});
  let serial=0;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function normalize(value={}) {
    const o=value&&typeof value==='object'?value:{};
    const one=(key,values)=>values.includes(o[key])?o[key]:defaults[key];
    const skinColor=normalizeColor(o.skinColor),irisColor=normalizeColor(o.irisColor);
    return {...(skinColor?{skinColor}:{}),...(irisColor?{irisColor}:{}),...(naturalSkin(o)?{skinShade:o.skinShade,skinHue:o.skinHue}:{}),enabled:o.enabled===true,skinDepth:one('skinDepth',['light','medium','deep']),undertone:one('undertone',['warm','neutral','cool']),iris:one('iris',Object.keys(irisPalette)),eyeShape:one('eyeShape',['round','almond','soft']),eyeHeight:one('eyeHeight',[-1,0,1]),eyeSpacing:one('eyeSpacing',[-1,0,1]),mouth:one('mouth',['smile','laugh','gentle'])};
  }
  function skinTarget(value={}){
    const o=normalize(value);
    if(o.skinColor)return o.skinColor;
    if(!naturalSkin(o))return skinPalette[o.skinDepth][o.undertone];
    const step=Math.floor(o.skinShade/4),fraction=o.skinShade%4/4;
    const base=mix(skinMidtones[step],skinMidtones[Math.min(step+1,skinMidtones.length-1)],fraction);
    return '#'+[1,3,5].map((offset,index)=>{
      const c=parseInt(base.slice(offset,offset+2),16)+hueOffsets[o.skinHue][index];
      return Math.min(255,Math.max(0,c)).toString(16).padStart(2,'0');
    }).join('');
  }
  function naturalSkinFilter(id,o,color=skinTarget(o),pivot=.82){
    const channels=[1,3,5].map(offset=>{
      const mid=parseInt(color.slice(offset,offset+2),16)/255;
      const high=Math.min(.99,mid*1.17+.022);
      return Array.from({length:33},(_,i)=>{
        const v=i/32;
        return (v<=pivot?mid*(v/pivot)**.91:mid+(high-mid)*(v-pivot)/(1-pivot)).toFixed(5);
      }).join(' ');
    });
    // Retain a little of the pigment variation in the source. Calibrate at its face
    // midtone (~252, 201, 163) and keep highlights relative to the selected skin.
    return '<filter id="'+esc(id)+'" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".3701 .5722 .0577 0 -.034 .1701 .7722 .0577 0 .0064 .1701 .5722 .2577 0 .036 0 0 0 1 0"/><feComponentTransfer>'+
      ['R','G','B'].map((channel,i)=>'<feFunc'+channel+' type="table" tableValues="'+channels[i]+'"/>').join('')+
      '<feFuncA type="identity"/></feComponentTransfer></filter>';
  }
  function skinFilterDefinition(id,value={}) {
    if(paintedSkin(value))return naturalSkinFilter(id,value);
    const c=skinTarget(value),pivot=.78,channel=offset=>Array.from({length:17},(_,i)=>{const v=i/16,t=parseInt(c.slice(offset,offset+2),16)/255;return (v<=pivot?t*Math.pow(v/pivot,.90):t+(1-t)*.75*(v-pivot)/(1-pivot)).toFixed(5);}).join(' ');
    return '<filter id="'+esc(id)+'" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="'+channel(1)+'"/><feFuncG type="table" tableValues="'+channel(3)+'"/><feFuncB type="table" tableValues="'+channel(5)+'"/><feFuncA type="identity"/></feComponentTransfer></filter>';
  }
  function mix(a,b,t){return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');}
  function irisFilter(id,color){const c=color,curve=['#15131a',mix(c,'#171820',.82),mix(c,'#22242c',.56),mix(c,'#24232b',.28),c,mix(c,'#fff3d9',.26),mix(c,'#fff7e9',.52),mix(c,'#fff9ee',.82),'#fffaf0'],channel=n=>curve.map(x=>(parseInt(x.slice(n,n+2),16)/255).toFixed(5)).join(' ');return '<filter id="'+esc(id)+'" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="'+channel(1)+'"/><feFuncG type="table" tableValues="'+channel(3)+'"/><feFuncB type="table" tableValues="'+channel(5)+'"/><feFuncA type="identity"/></feComponentTransfer></filter>';}
  function image(a,more='',url=a.src){return '<image href="'+esc(url)+'" x="'+a.x+'" y="'+a.y+'" width="'+a.w+'" height="'+a.h+'" preserveAspectRatio="none" '+more+'/>';}
  function detailToneFilter(id,target,pivot=.68){const table=n=>Array.from({length:17},(_,i)=>{const v=i/16,t=parseInt(target.slice(n,n+2),16)/255;return (v<=pivot?t*Math.pow(v/pivot,.94):t+(1-t)*.32*(v-pivot)/(1-pivot)).toFixed(5);}).join(' ');return '<filter id="'+esc(id)+'" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="'+table(1)+'"/><feFuncG type="table" tableValues="'+table(3)+'"/><feFuncB type="table" tableValues="'+table(5)+'"/><feFuncA type="identity"/></feComponentTransfer></filter>';}
  function featureDepthDefinitions(prefix,o){
    if(paintedSkin(o)){
      const skin=skinTarget(o),lip=mix(skin,'#a84e58',.38),brow=mix(skin,'#44322e',.66);
      return naturalSkinFilter(prefix+'-brow',o,brow,.50)+naturalSkinFilter(prefix+'-natural-lip',o,lip,.68)+skinFilterDefinition(prefix+'-margin',o)+
        '<filter id="'+prefix+'-ink-knockout" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 6 0"/><feMorphology operator="dilate" radius=".30"/></filter>';
    }
    if(o.skinDepth==='light')return '';const deep=o.skinDepth==='deep',lip=(deep?{warm:'#995e53',neutral:'#925d63',cool:'#895a6d'}:{warm:'#bd806c',neutral:'#b97b77',cool:'#ad7485'})[o.undertone],brow=deep?'#54362e':'#79503c';return detailToneFilter(prefix+'-brow',brow,.50)+detailToneFilter(prefix+'-natural-lip',lip)+detailToneFilter(prefix+'-margin',skinTarget(o),.78);}
  // The original irises have warm pigment. Isolate it from the neutral sclera
  // and highlights, and leave the dark pupil intact when a custom hue is selected.
  // Outline of each visible iris, traced in a 320 by 152 view of its source eye.
  // The right-eye crops mirror the left. These shapes exclude the painted eyelid.
  const irisContours={
    round:'M110 85C111 60 130 45 159 39Q188 32 219 40C253 48 277 64 278 86C280 110 268 125 246 132Q199 142 159 135C132 129 111 109 110 85Z',
    almond:'M125 95C125 71 133 56 150 45Q184 36 216 44C245 50 272 63 276 83C280 107 269 126 251 136Q202 143 155 137C138 131 125 114 125 95Z',
    soft:'M115 96C115 72 128 54 152 44Q184 37 218 45C249 50 272 65 277 85C280 105 273 124 259 137Q209 143 151 138C131 133 116 117 115 96Z'
  };
  function irisContour(shape,side,e){
    const right=side==='right',x=right?e.x+e.w:e.x,sx=(right?-1:1)*e.w/320;
    return '<path d="'+irisContours[shape]+'" transform="translate('+x+' '+e.y+') scale('+sx+' '+e.h/152+')"/>';
  }
  function irisPigmentFilter(id){
    return '<filter id="'+id+'" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 6 0 -6 0 -.72" result="chroma"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2 2 0 0 -.95"/><feComposite in2="chroma" operator="in"/></filter>';
  }
  function alphaMask(id,a,url){return '<mask id="'+id+'" maskUnits="userSpaceOnUse" x="'+a.x+'" y="'+a.y+'" width="'+a.w+'" height="'+a.h+'" style="mask-type:alpha">'+image(a,'',url)+'</mask>';}
  // Remove the pale painted skin from feature sprites before returning their original
  // sclera, eyelashes, teeth and mouth interior to the tinted layer underneath.
  function inkMask(id,prefix,a,urls){
    const box='x="'+a.x+'" y="'+a.y+'" width="'+a.w+'" height="'+a.h+'"';
    return '<mask id="'+id+'" maskUnits="userSpaceOnUse" '+box+' style="mask-type:luminance"><rect '+box+' fill="white"/>'+
      urls.filter(Boolean).map(src=>image(a,'filter="url(#'+prefix+'-ink-knockout)"',src)).join('')+'</mask>';
  }
  function render(value={}) {
    const o=normalize(value);if(!o.enabled)return null;
    const provided=window.PrincessAssets?.faceStudio,m=provided?.skin?.src&&provided?.eyes?.[o.eyeShape]&&provided?.mouths?.[o.mouth]?provided:FALLBACK,prefix='studio-'+(++serial),skinId=prefix+'-skin',irisId=prefix+'-iris',faceClip=prefix+'-face',mouth=m.mouths[o.mouth];
    const usePaint=paintedSkin(o),toneDetails=usePaint||o.skinDepth!=='light';
    let body='<defs>'+skinFilterDefinition(skinId,o)+irisFilter(irisId,o.irisColor||irisPalette[o.iris])+(o.irisColor?irisPigmentFilter(prefix+'-iris-pigment'):'')+featureDepthDefinitions(prefix,o)+'<clipPath id="'+faceClip+'"><ellipse cx="300" cy="210" rx="66" ry="83"/></clipPath></defs><g clip-path="url(#'+faceClip+')">'+image(m.skin,'filter="url(#'+skinId+')"');
    for(const side of ['left','right']){
      const e=m.eyes[o.eyeShape][side],dx=(side==='left'?-1:1)*o.eyeSpacing*4,dy=-o.eyeHeight*4,clip=prefix+'-'+side+'-iris',mask=prefix+'-'+side+'-skin',r=e.iris,margin=toneDetails&&e.blendMaskSrc?e.blendMaskSrc:e.skinMaskSrc;
      let maskDefinition='',eyeArt=image(e);
      if(margin&&usePaint){
        maskDefinition=inkMask(mask,prefix,e,[margin]);
        eyeArt=image(e,'filter="url(#'+skinId+')"')+image(e,'mask="url(#'+mask+')"');
      }else if(margin){
        maskDefinition=alphaMask(mask,e,margin);
        eyeArt+=image(e,'filter="url(#'+(toneDetails?prefix+'-margin':skinId)+')" mask="url(#'+mask+')"');
      }
      let irisMask='';
      if(o.irisColor){
        const pigment=clip+'-pigment';
        maskDefinition+='<mask id="'+pigment+'" maskUnits="userSpaceOnUse" x="'+e.x+'" y="'+e.y+'" width="'+e.w+'" height="'+e.h+'" style="mask-type:alpha">'+image(e,'filter="url(#'+prefix+'-iris-pigment)"')+'</mask>';
        irisMask=' mask="url(#'+pigment+')"';
      }
      const boundary=o.irisColor?irisContour(o.eyeShape,side,e):'<ellipse cx="'+r.cx+'" cy="'+r.cy+'" rx="'+r.rx+'" ry="'+r.ry+'"/>';
      body+='<g class="studio-eye" data-eye-side="'+side+'" transform="translate('+dx+' '+dy+')"><defs><clipPath id="'+clip+'">'+boundary+'</clipPath>'+maskDefinition+'</defs>'+eyeArt+image(e,'filter="url(#'+irisId+')" clip-path="url(#'+clip+')"'+irisMask)+(e.brow?image(e.brow,toneDetails?'filter="url(#'+prefix+'-brow)"':''):'')+'</g>';
    }
    if(usePaint){
      const ink=prefix+'-mouth-ink',margin=prefix+'-mouth-margin';
      body+='<defs>'+inkMask(ink,prefix,mouth,[mouth.lipMaskSrc,mouth.skinMarginSrc])+
        (mouth.skinMarginSrc?alphaMask(margin,mouth,mouth.skinMarginSrc):'')+'</defs>'+
        image(mouth,'filter="url(#'+prefix+'-natural-lip)"')+image(mouth,'mask="url(#'+ink+')"')+
        (mouth.skinMarginSrc?image(mouth,'filter="url(#'+skinId+')" mask="url(#'+margin+')"'):'');
    }else body+=image(mouth);
    if(toneDetails&&!usePaint){
      const lipMask=prefix+'-natural-lip-mask',marginMask=prefix+'-mouth-margin';
      body+='<defs>'+alphaMask(lipMask,mouth,mouth.lipMaskSrc)+(mouth.skinMarginSrc?alphaMask(marginMask,mouth,mouth.skinMarginSrc):'')+'</defs>'+image(mouth,'filter="url(#'+prefix+'-natural-lip)" mask="url(#'+lipMask+')"')+(mouth.skinMarginSrc?image(mouth,'filter="url(#'+prefix+'-margin)" mask="url(#'+marginMask+')"'):'');
    }
    body+='</g>';

    return {markup:'<g class="face-studio" data-face-studio="true" data-eye-shape="'+o.eyeShape+'" data-mouth="'+o.mouth+'">'+body+'</g>',anchors:{cheeks:[[258,239],[342,239]],lip:{...mouth.anchor}},lipMask:{src:mouth.lipMaskSrc,x:mouth.x,y:mouth.y,w:mouth.w,h:mouth.h,id:prefix+'-lip'},lipPath:'',lipHighlight:'',skinColor:skinTarget(o),options:o};
  }
  function thumbnail(value={}){const result=render({...value,enabled:true});return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="220 115 160 190" width="160" height="190" aria-hidden="true">'+(result?.markup||'')+'</svg>';}
  window.PrincessFaceStudio=Object.freeze({defaults,choices,skinPalette,irisPalette,lastShade,normalizeColor,normalize,skinTarget,skinFilterDefinition,render,thumbnail});
})();
