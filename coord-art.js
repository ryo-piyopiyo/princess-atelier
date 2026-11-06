(function(){
'use strict';
const specs={top:'tops',outer:'outer',bottom:'bottoms',socks:'socks',shoes:'shoes'};
const defaults={top:'tee',outer:'none',bottom:'skirt',socks:'ankle',shoes:'sneakers',background:'room',accessory:'none',styles:Object.fromEntries(Object.keys(specs).map(key=>[key,{color:null,pattern:'plain',ribbon:false,ribbonColor:null,patternColor:null}]))};
const registry=(part)=>window.PrincessAssets?.casual?.[part]||{};
function items(part){const result=Object.values(registry(part));return ['outer','socks'].includes(part)?[{id:'none',label:part==='outer'?'うわぎを ぬぐ':'くつしたを ぬぐ'},...result]:result}
const entry=(part,state={})=>registry(part)[state[part]??defaults[part]];
const hex=s=>/^#[0-9a-f]{6}$/i.test(s||'')?s:null;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
let serial=0;
const img=(a,url=a.src,more='')=>`<image href="${esc(url)}" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" preserveAspectRatio="none" ${more}/>`;
function tintFilter(id,c,base){
 const rgb=h=>[1,3,5].map(n=>parseInt(h.slice(n,n+2),16)/255),target=rgb(c),b=rgb(hex(base)||'#c7b8b5'),l=Math.max(.27,Math.min(.90,b[0]*.2126+b[1]*.7152+b[2]*.0722));
 const channels=target.map((channel,i)=>`<feFunc${'RGB'[i]} type="table" tableValues="${Array.from({length:17},(_,j)=>{const v=j/16;return (v<l?channel*(.20+.80*v/l):channel+(1-channel)*.48*(v-l)/(1-l)).toFixed(4)}).join(' ')}"/>`).join('');
 return `<filter id="${id}" x="-1%" y="-1%" width="102%" height="102%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer>${channels}</feComponentTransfer></filter>`;
}
function pattern(id,kind,part,c,patternColor){
  const isFoot=part==='shoes'||part==='socks',u=isFoot?9:part==='bottom'?22:16;
  const rgb=[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)),light=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  const customInk=hex(patternColor),ink=customInk||(light<144?'#fff5df':'#744d69');
  let second=light<144?'#fad0b8':'#d59599';
  if(customInk){
    const channels=[1,3,5].map(i=>parseInt(customInk.slice(i,i+2),16));
    const darker=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722>165;
    second='#'+channels.map(c=>Math.round(darker?c*.76:c+(255-c)*.35).toString(16).padStart(2,'0')).join('');
  }
  let motif='';
  if(kind==='stripes')motif=`<path d="M0 ${u*.3}H${u}" stroke="${ink}" stroke-opacity=".58" stroke-width="${u*.22}"/>`;
  if(kind==='dots')motif=`<g fill="${ink}" opacity=".77"><circle cx="${u*.25}" cy="${u*.25}" r="${u*.115}"/><circle cx="${u*.75}" cy="${u*.75}" r="${u*.115}"/></g>`;
  if(kind==='check')motif=`<path d="M0 ${u*.33}H${u}M${u*.33} 0V${u}" stroke="${ink}" stroke-width="${u*.31}" opacity=".38"/><path d="M0 ${u*.73}H${u}M${u*.73} 0V${u}" stroke="${second}" stroke-width="${u*.08}" opacity=".74"/>`;
  if(kind==='flowers'){motif=`<g transform="translate(${u*.52} ${u*.50})" fill="${ink}" opacity=".82">${[0,72,144,216,288].map(an=>`<ellipse cx="0" cy="${-u*.14}" rx="${u*.091}" ry="${u*.145}" transform="rotate(${an})"/>`).join('')}<circle r="${u*.075}" fill="${second}"/></g>`;}
  return motif?`<pattern id="${id}" patternUnits="userSpaceOnUse" x="0" y="0" width="${u}" height="${u}">${motif}</pattern>`:'';
}
function ribbon(part,a,color){
 const t=window.PrincessAssets?.extras?.entries?.['head-bow'];if(!t)return '';
 const positions=part==='socks'?[[275,a.y+5,16],[322,a.y+5,16]]:part==='shoes'?[[273,a.y+a.h*.57,18],[324,a.y+a.h*.57,18]]:part==='outer'?[[344,348,30]]:part==='bottom'?[[329,418,29]]:[[300,342,36]];
 const bows=positions.map(([cx,y,w])=>`<image href="${esc(t.src)}" x="${cx-w/2}" y="${y}" width="${w}" height="${w*.70}" preserveAspectRatio="xMidYMid meet"/>`).join('');
 return `<g class="fabric-ribbon">${window.PrincessExtras?.dyeRibbon?.(bows,color)??bows}</g>`;
}
function piece(part,a,style={}){
 if(!a?.src)return '';const id='coord-layer-'+(++serial),c=hex(style.color),base=hex(a.baseColor)||'#c3b0af',recolor=c&&c.toLowerCase()!==base.toLowerCase(),p=pattern(id+'-p',style.pattern,part,c||base,style.patternColor);
 const cloth=a.maskSrc||a.src,needsMask=!!p||(recolor&&!!a.maskSrc);
 const mask=needsMask?`<mask id="${id}-m" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" style="mask-type:alpha">${img(a,cloth)}</mask>`:'';
 return `<g data-coord-part="${part}" data-item="${a.id}"><defs>${mask}${p}${recolor?tintFilter(id+'-t',c,base):''}</defs>${(!recolor||a.maskSrc)?img(a):''}${recolor?img(a,a.src,`filter="url(#${id}-t)" ${a.maskSrc?`mask="url(#${id}-m)"`:''}`):''}${p?`<rect x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" fill="url(#${id}-p)" mask="url(#${id}-m)"/>`:''}${style.ribbon?ribbon(part,a,style.ribbonColor):''}</g>`;
}
function thumbnail(part,id,style={}){const a=registry(part)[id];if(!a){return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M45 32a6 6 0 1 1 10 5l-5 5v4l33 19q4 4-1 7H18q-5-3-1-7l33-19" fill="none" stroke="#98798a" stroke-width="4" stroke-linecap="round"/><path d="M24 80 77 23" stroke="#ca8b96" stroke-width="5" stroke-linecap="round"/></svg>`}
 const edge=Math.max(a.w,a.h)*.065;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.x-edge} ${a.y-edge} ${a.w+edge*2} ${a.h+edge*2}" aria-hidden="true">${piece(part,a,style)}</svg>`;
}
function sleeve(c){return entry('outer',c)||entry('top',c)}
function body(state,base){if(!base)return '';const c=state.casual||defaults,sl=sleeve(c),sock=entry('socks',c),shoe=entry('shoes',c);
 const top=sock?sock.y+6:shoe?Math.min(719,shoe.y+11):752;
 const id='coord-base-'+(++serial),long=sl?.sleeveMode==='long';
 // Retain only the original neck, arms, hands and visible leg segments. The new clothes replace the illustrated petticoat.
 const leftArm='150,285 267,285 259,366 253,384 240,409 227,435 211,457 198,473 201,520 144,520';
 const arms=long?'<rect x="145" y="476" width="58" height="44"/><rect x="398" y="476" width="58" height="44"/>':`<polygon points="${leftArm}"/><polygon transform="translate(600 0) scale(-1 1)" points="${leftArm}"/>`;
 const markup=`<g class="painted-body coord-body"><defs><clipPath id="${id}"><rect x="${long?267:238}" y="280" width="${long?66:124}" height="132"/>${arms}<rect x="239" y="552" width="122" height="${Math.max(0,top-552)}"/></clipPath></defs>${img(base,base.src,`clip-path="url(#${id})"`)}</g>`;
 return window.PrincessBodySkin?.sceneBody(state,base,markup)??markup;
}
function outfit(state){const c=state.casual||defaults,style=c.styles||{};const p=(part)=>piece(part,entry(part,c),style[part]);let inner=p('top');const o=entry('outer',c);if(o?.innerTopClipPoints){const id='coord-inner-'+(++serial);inner=`<defs><clipPath id="${id}"><polygon points="${o.innerTopClipPoints.map(x=>x.join(',')).join(' ')}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`}
 return `<g class="everyday-outfit">${p('socks')}${p('shoes')}${p('bottom')}${inner}${p('outer')}</g>`;
}
window.CoordArt={items,defaults,thumbnail,body,outfit,sleeve,tintFilter,get palette(){return window.PrincessAssets?.palette||[]}};
})();
