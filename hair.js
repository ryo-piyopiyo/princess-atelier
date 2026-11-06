/* Local-only generated wig artwork, with original SVG fallbacks. Unscaled head coordinates. */
(() => {
  'use strict';
  const cards = [
    {id:'long',label:'さらさら ロング'},
    {id:'waves',label:'ふわふわ ウェーブ'},
    {id:'bob',label:'まえがみ ボブ'},
    {id:'inward',label:'うちまき ボブ'},
    {id:'outward',label:'そとはね ボブ'},
    {id:'short',label:'ショート'},
    {id:'crown-braid',label:'あみこみの かんむり'},
    {id:'single-braid',label:'ひとつ みつあみ'},
    {id:'braid',label:'ふたつ みつあみ'},
    {id:'half-up',label:'ハーフアップ'},
    {id:'bun',label:'おだんご'},
    {id:'double-bun',label:'ふたつ おだんご'},
    {id:'ponytail',label:'たかい ポニーテール'},
    {id:'low-pony',label:'ひくい ポニーテール'},
    {id:'twintails',label:'たかい ツインテール'},
    {id:'low-twins',label:'ひくい ツインテール'},
    {id:'ringlets',label:'くるくる ロール'},
    {id:'side-sweep',label:'よこながし'},
    {id:'half-bun',label:'おだんご ロング'},
    {id:'hime',label:'ひめカット'},
    {id:'straight-half-up',label:'ストレート ハーフアップ',voiceKey:'learnHairStraightHalfUp'},
    {id:'straight-ponytail',label:'ストレート ポニーテール',voiceKey:'learnHairStraightPony'},
    {id:'straight-braid',label:'ストレート みつあみ',voiceKey:'learnHairStraightBraid'},
    {id:'straight-twins',label:'ストレート ツインテール',voiceKey:'learnHairStraightTwins'},
    {id:'bob-straight',label:'さらさら ボブ',voiceKey:'learnHairBob'},
    {id:'bob-half-up',label:'ボブ ハーフアップ',voiceKey:'learnHairBobHalfUp'},
    {id:'short-tucked',label:'みみかけ ショート',voiceKey:'learnHairShortTucked'},
    {id:'soft-loose',label:'ゆるい ロング',voiceKey:'hairBaseSoft'}
  ];
  const families = [
    {id:'straight',label:'ストレート ロング',voiceKey:'hairBaseStraight',base:'long',styles:['long','straight-half-up','straight-ponytail','straight-braid','straight-twins','hime']},
    {id:'soft',label:'ゆるい ロング',voiceKey:'hairBaseSoft',base:'soft-loose',styles:['soft-loose','half-up','low-pony','ponytail','low-twins','twintails','single-braid','braid','crown-braid','bun','double-bun','half-bun','side-sweep','waves','ringlets']},
    {id:'bob',label:'ボブ',voiceKey:'hairBaseBob',base:'bob-straight',styles:['bob-straight','bob-half-up','bob','inward','outward']},
    {id:'short',label:'ショート',voiceKey:'hairBaseShort',base:'short',styles:['short','short-tucked']}
  ];
  const variants={
    'straight-half-up':{x:190,y:95.76,w:220,h:343.44,fallback:'long'},
    'straight-ponytail':{x:201,y:90,w:222,h:360,fallback:'ponytail'},
    'straight-braid':{x:180,y:95.76,w:240,h:370.44,fallback:'braid'},
    'straight-twins':{x:180,y:95.76,w:240,h:363.42,fallback:'low-twins'},
    'bob-straight':{x:190,y:99,w:220,h:241.92,fallback:'bob'},
    'bob-half-up':{x:190,y:99,w:220,h:241.92,fallback:'bob'},
    'short-tucked':{x:192,y:99,w:216,h:221.4,fallback:'short'},
    'soft-loose':{x:180,y:95.76,w:240,h:343.44,fallback:'waves'}
  };
  const colors = ['#dfb965','#865947','#342f3b','#b6654d','#bfc2d2','#db9aaf','#a49acb','#83bdbc'];
  const known = new Set(cards.map(card => card.id));
  let serial = 0;

  function color(value) {
    if (typeof value !== 'string' || !/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value)) return '#865947';
    return value.length === 4 ? '#' + [...value.slice(1)].map(c => c + c).join('') : value;
  }
  function mix(a,b,amount) {
    return '#' + [1,3,5].map(i => Math.round(parseInt(a.slice(i,i+2),16)*(1-amount) + parseInt(b.slice(i,i+2),16)*amount).toString(16).padStart(2,'0')).join('');
  }
  function palette(value) {
    const c=color(value);
    return {base:c,shade:mix(c,'#30232f',.34),line:mix(c,'#30232f',.43),light:mix(c,'#fff5d9',.38),shine:mix(c,'#fff9e8',.62)};
  }
  const path = (d,extra='') => `<path d="${d}" ${extra}/>`;
  const mirror = content => `<g transform="translate(600 0) scale(-1 1)">${content}</g>`;
  const cap = 'M224 247 C204 211 201 166 220 137 C237 109 269 100 300 105 C334 99 367 111 383 137 C405 170 395 215 376 248 L350 279 H251Z';
  const straight = 'M220 348 C209 306 213 267 211 225 L211 170 C209 124 248 99 300 105 C354 99 393 128 390 174 L388 228 C386 269 392 310 379 350 Q359 365 340 354 Q320 366 300 354 Q277 366 256 354 Q236 367 220 348Z';
  const waved = 'M215 353 C195 339 215 323 202 302 C188 280 208 263 199 241 C187 213 209 197 209 174 C208 126 249 99 300 105 C354 99 393 126 391 174 C391 199 413 216 401 242 C390 265 411 282 397 305 C385 325 406 342 386 357 Q369 377 349 359 Q328 378 300 363 Q273 378 251 361 Q230 374 215 353Z';
  const tidy = 'M225 264 C205 240 203 197 209 165 C212 124 251 101 300 105 C351 101 389 125 392 167 C399 205 389 243 375 265 Q356 284 345 276 H256 Q239 284 225 264Z';

  function strands(d,p,width=2,opacity=.55) {
    return path(d,`fill="none" stroke="${p.light}" stroke-width="${width}" opacity="${opacity}"`);
  }
  function ribbon(x,y,angle=0,size=1) {
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})" fill="#e6b3c5" stroke="#bd879f" stroke-width="1.3">${path('M0 0 C-22 -19 -29 -6 -14 7 C-22 23 -8 23 0 8 C8 23 23 22 15 7 C29 -6 22 -19 0 0Z')}<ellipse cx="0" cy="5" rx="5" ry="6" fill="#f4d9df"/>${path('M-6 13 L-12 31 -2 26 4 14 M8 13 L16 29 20 20 14 10')}</g>`;
  }
  function braid(x,y,length,p,gradient,tilt=0) {
    const count=Math.round(length/17);
    return `<g transform="translate(${x} ${y}) rotate(${tilt})">${path(`M0 -7 Q-8 ${length*.5} 0 ${length}`,`fill="none" stroke="${p.shade}" stroke-width="27"`)}${Array.from({length:count},(_,i)=>{
      const yy=i*17;
      return path(`M0 ${yy-7} C-27 ${yy-13} -29 ${yy+8} 0 ${yy+19} C29 ${yy+6} 26 ${yy-11} 0 ${yy-7}Z`,`fill="url(#${gradient})" stroke="${p.line}" stroke-width="1.4"`) + strands(`M-17 ${yy-3} Q-12 ${yy+7} 0 ${yy+12} M16 ${yy-2} Q12 ${yy+6} 4 ${yy+10}`,p,1.5,.65);
    }).join('')}${ribbon(0,length+4,0,.72)}${path(`M-6 ${length+22} Q-23 ${length+39} -9 ${length+47} Q7 ${length+48} 6 ${length+22}Z`,`fill="url(#${gradient})" stroke="${p.line}" stroke-width="1.4"`)}</g>`;
  }
  function bun(x,y,r,p,gradient) {
    return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${gradient})"/>${strands(`M${x-r*.7} ${y+r*.25} C${x-r*1.05} ${y-r*.8} ${x+r*.6} ${y-r*1.06} ${x+r*.7} ${y-r*.1} C${x+r*.9} ${y+r*.7} ${x-r*.36} ${y+r*.75} ${x-r*.35} ${y} C${x-r*.34} ${y-r*.55} ${x+r*.4} ${y-r*.5} ${x+r*.31} ${y+r*.1}`,p,2.7,.75)}${strands(`M${x-r*.8} ${y-r*.2} Q${x-r*.4} ${y-r*.95} ${x+r*.24} ${y-r*.66}`,p,5,.28)}</g>`;
  }
  function tail(side,low,p,gradient) {
    const shape=low ?
      path('M221 240 C191 237 177 263 179 295 C181 332 202 355 187 378 C216 388 237 360 236 329 C235 297 248 264 231 245Z') + strands('M218 255 C191 278 219 317 212 349 Q211 362 203 369 M226 265 Q211 303 223 330',p,2.2) :
      path('M218 156 C173 143 146 187 154 230 C162 267 181 281 162 329 C182 352 219 343 223 310 C224 280 206 254 211 222 C220 200 239 175 218 156Z') + strands('M207 168 C162 192 175 220 188 251 C204 290 177 307 180 327 M218 180 C187 208 197 234 205 257',p,2.2);
    const result=`<g fill="url(#${gradient})">${shape}${ribbon(low?223:217,low?246:161,side?-10:10,.8)}</g>`;
    return side?mirror(result):result;
  }
  function ringlet(x,y,length,p,gradient,phase=0) {
    const count=Math.round(length/30);
    let d=`M${x} ${y}`;
    for(let i=0;i<count;i++) d+=` C${x-22} ${y+i*30+7} ${x+22} ${y+i*30+23} ${x} ${y+(i+1)*30}`;
    return path(d,`fill="none" stroke="${p.shade}" stroke-width="25"`) + path(d,`fill="none" stroke="url(#${gradient})" stroke-width="20"`) + path(d,`fill="none" stroke="${p.light}" stroke-width="3" opacity=".65" transform="translate(${phase?4:-4} -2)"`);
  }
  function wrap(id,value,part,make) {
    const p=palette(value),gradient=`princess-hair-${++serial}`,style=known.has(id)?id:'long';
    return `<g class="princess-hair princess-hair-${part}" data-hair-style="${style}" aria-hidden="true" stroke="${p.line}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="url(#${gradient})"><defs><linearGradient id="${gradient}" x1="0" y1="0" x2="1" y2=".18"><stop stop-color="${p.shade}"/><stop offset=".25" stop-color="${p.base}"/><stop offset=".46" stop-color="${p.light}"/><stop offset=".7" stop-color="${p.base}"/><stop offset="1" stop-color="${p.shade}"/></linearGradient></defs>${make(style,p,gradient)}</g>`;
  }

  function svgBack(id,value) {
    return wrap(id,value,'back',(style,p,g)=>{
      let result='';
      switch(style) {
        case 'long':
        case 'hime':
          result=path(style==='hime'?straight.replace('Q359 365 340 354 Q320 366 300 354 Q277 366 256 354 Q236 367 220 348Z','L379 355 H220 L220 348Z'):straight) + strands('M230 161 Q218 218 230 276 L231 342 M243 145 Q233 211 243 267 L244 346 M370 161 Q383 219 369 279 L369 342 M355 144 Q368 209 356 274 L356 348',p);
          if(style==='hime') result+=strands('M221 339 H379 M252 334 V350 M348 334 V350',p,1.5,.35);
          break;
        case 'waves':
          result=path(waved)+strands('M235 144 C213 187 235 207 221 237 C205 267 237 282 222 311 Q211 333 232 350 M251 134 C230 179 254 204 240 235 C224 264 252 286 239 316 Q232 337 252 351 M365 144 C388 186 367 207 380 237 C396 267 364 281 379 311 Q390 333 368 350 M348 135 C369 178 346 205 359 236 C376 264 349 285 362 316 Q369 337 348 351',p,2.6);
          break;
        case 'bob':
          result=path('M222 282 C198 257 211 235 207 207 C194 139 233 100 300 105 C370 100 406 143 392 210 C388 236 405 263 378 287 Q358 307 332 294 H269 Q244 306 222 282Z')+strands('M230 160 Q211 218 229 273 M243 143 Q229 214 242 285 M370 160 Q390 218 373 276 M357 143 Q372 213 359 287',p);
          break;
        case 'inward':
          result=path('M216 273 C199 247 211 223 209 186 C204 132 239 102 300 105 C362 101 397 134 391 189 C387 221 401 249 385 276 C373 303 345 319 331 301 Q348 297 351 281 H249 Q253 298 270 301 C257 320 228 303 216 273Z')+strands('M228 161 Q211 219 225 267 Q235 289 251 295 M372 161 Q389 219 375 267 Q365 289 349 295 M239 144 Q228 214 240 269 M361 144 Q372 214 360 269',p,2.5);
          break;
        case 'outward':
          result=path('M218 254 C203 219 204 171 223 140 C240 113 269 101 300 105 C333 101 364 114 381 142 C399 173 396 220 382 254 Q384 279 419 284 Q401 313 373 298 L344 278 H255 L226 298 Q197 313 180 285 Q214 279 218 254Z')+strands('M232 155 Q214 208 231 253 Q231 279 206 286 M368 155 Q386 208 369 253 Q369 279 394 286 M242 144 Q229 208 244 259 M358 144 Q371 208 356 259',p,2.5);
          break;
        case 'short':
          result=path('M225 243 Q208 234 211 214 L199 203 210 191 C200 158 213 127 242 115 Q271 97 300 105 C345 97 381 120 391 152 L402 174 391 183 401 204 386 211 Q389 233 374 245 L356 224 H243Z')+strands('M229 146 Q211 182 226 214 M372 144 Q391 180 378 217 M252 120 Q277 105 301 113',p,2.5);
          break;
        case 'crown-braid':
          result=path(tidy)+strands('M220 174 Q218 232 240 258 M380 174 Q382 232 360 258',p);
          break;
        case 'single-braid':
          result=path(tidy)+strands('M223 171 Q222 228 256 264 M378 168 Q392 222 369 264',p);
          break;
        case 'braid':
          result=path(tidy)+braid(222,238,102,p,g,-4)+braid(378,238,102,p,g,4);
          break;
        case 'half-up':
          result=path(waved.replace('C208 126 249 99 300 105 C354 99 393 126 391 174','C208 126 249 80 300 96 C354 80 393 126 391 174'))+strands('M235 140 Q201 205 238 246 Q256 259 265 278 M365 140 Q399 205 362 246 Q344 259 335 278 M221 259 Q244 281 227 320 M379 259 Q356 281 373 320',p,2.5)+path('M217 189 Q196 218 211 245 L227 239 Q214 217 232 202Z')+mirror(path('M217 189 Q196 218 211 245 L227 239 Q214 217 232 202Z'));
          break;
        case 'bun':
          result=bun(300,81,42,p,g)+path(tidy)+strands('M223 157 Q240 124 279 114 M377 157 Q360 124 321 114 M220 187 Q219 234 250 265 M380 187 Q381 234 350 265',p,2.3)+ribbon(300,112,0,.7);
          break;
        case 'double-bun':
          result=bun(211,125,34,p,g)+bun(389,125,34,p,g)+path(tidy)+ribbon(214,148,-15,.65)+ribbon(386,148,15,.65)+strands('M233 133 Q259 106 300 111 Q343 106 368 134 M222 189 Q217 232 246 263 M378 189 Q383 232 354 263',p,2.3);
          break;
        case 'ponytail':
          result=path('M368 139 C421 113 455 161 443 208 C432 244 450 276 424 306 Q411 321 391 320 C418 296 397 275 397 252 C399 213 363 200 368 139Z')+strands('M389 145 C437 145 429 181 419 211 C406 245 438 268 415 296 M399 156 Q425 168 411 199',p,2.6)+path(tidy)+ribbon(377,149,15,.84);
          break;
        case 'low-pony':
          result=path('M361 241 C406 238 437 274 423 311 C410 342 428 362 405 388 Q383 402 368 384 C399 359 378 339 378 317 C381 291 350 276 361 241Z')+strands('M376 257 C420 273 402 298 398 321 Q409 354 389 380 M383 269 Q405 282 392 306',p,2.4)+path(tidy)+ribbon(366,249,15,.85);
          break;
        case 'twintails':
          result=tail(false,false,p,g)+tail(true,false,p,g)+path(tidy);
          break;
        case 'low-twins':
          result=tail(false,true,p,g)+tail(true,true,p,g)+path(tidy);
          break;
        case 'ringlets':
          result=path(tidy)+ringlet(209,178,180,p,g)+ringlet(230,204,180,p,g,1)+ringlet(391,178,180,p,g,1)+ringlet(370,204,180,p,g);
          break;
        case 'side-sweep':
          result=path('M221 354 C193 338 210 316 198 293 C184 264 206 247 202 219 C193 149 227 99 300 105 C363 100 399 141 391 199 Q387 228 371 246 L348 271 H263 C259 300 270 325 254 350 Q243 368 221 354Z')+strands('M234 143 C207 181 223 207 215 239 C201 268 233 288 220 315 Q210 336 233 348 M249 129 C226 175 243 204 231 237 C219 269 250 289 239 321 M369 142 Q389 190 369 235',p,2.6);
          break;
        case 'half-bun':
          result=bun(300,79,31,p,g)+path(straight)+strands('M230 157 Q215 220 232 276 L233 343 M245 142 Q233 211 246 274 L246 347 M370 157 Q385 220 368 276 L367 343 M355 142 Q367 211 354 274 L354 347',p,2.2)+ribbon(300,106,0,.6);
          break;
      }
      return result;
    });
  }

  function svgFront(id,value) {
    return wrap(id,value,'front',(style,p,g)=>{
      let fringe='';
      const blunt=['bob','inward','outward','hime'].includes(style);
      if(blunt) {
        fringe=path('M227 197 Q207 159 231 130 Q256 104 299 109 Q341 103 369 132 Q394 162 373 197 L365 178 Q355 184 344 179 L342 164 Q337 182 322 180 L319 166 Q312 184 299 181 L296 166 Q288 184 271 180 L267 164 Q257 182 240 178Z')+strands('M239 141 Q246 161 243 172 M259 127 Q266 145 267 157 M281 122 L288 158 M311 121 L314 155 M336 128 Q335 146 339 157 M357 140 Q350 158 354 171',p,1.9,.6);
      } else if(style==='short') {
        fringe=path('M220 192 Q204 161 229 133 Q260 104 301 109 Q345 102 373 132 L386 157 374 175 360 167 352 181 338 166 323 179 311 160 Q280 187 242 185 L236 199 229 187Z')+strands('M239 139 Q268 117 297 120 M307 120 Q280 154 244 169 M326 119 Q352 132 367 150',p,2.2);
      } else if(['side-sweep','single-braid','low-pony'].includes(style)) {
        fringe=path('M228 207 C208 174 214 145 239 126 C269 101 307 102 334 112 C364 120 386 143 380 173 L366 184 Q348 164 336 143 C313 169 281 187 243 188 L236 216Z')+strands('M328 121 Q294 165 243 179 M321 116 Q292 151 246 168 M337 124 Q357 140 368 163',p,2.5);
      } else {
        fringe=path('M231 202 Q207 163 234 130 Q259 104 299 111 Q337 103 366 130 Q394 160 371 205 L362 181 Q327 181 302 143 Q277 183 239 185Z')+strands('M300 120 Q282 154 241 172 M300 127 Q280 162 239 178 M309 124 Q334 158 366 168 M314 120 Q341 152 369 161',p,2.1);
      }
      let side='';
      if(style==='hime') {
        side=path('M227 176 Q216 200 222 237 L244 237 243 180Z')+path('M373 176 Q384 200 378 237 L356 237 357 180Z')+strands('M232 189 V229 M368 189 V229',p,2,.65);
      } else if(['bob','inward'].includes(style)) {
        side=path('M229 177 Q217 220 231 253 Q239 269 253 274 Q232 278 223 260 Q209 220 223 177Z')+mirror(path('M229 177 Q217 220 231 253 Q239 269 253 274 Q232 278 223 260 Q209 220 223 177Z'))+strands('M227 202 Q221 238 239 263 M373 202 Q379 238 361 263',p);
      } else if(style==='outward') {
        side=path('M228 176 Q216 211 230 247 Q233 266 211 276 Q235 283 243 264 Q246 245 238 221 Q232 201 239 180Z')+mirror(path('M228 176 Q216 211 230 247 Q233 266 211 276 Q235 283 243 264 Q246 245 238 221 Q232 201 239 180Z'));
      } else if(style!=='short') {
        const lock=path('M232 177 Q221 211 235 235 Q244 254 232 271 Q246 267 246 250 Q244 233 239 221 Q231 203 240 180Z');
        side=lock+mirror(lock);
      }
      if(style==='single-braid') side+=braid(371,240,111,p,g,-4);
      if(style==='crown-braid') {
        const xs=[229,246,266,287,308,329,350,370],ys=[155,137,124,119,120,126,140,158];
        side+=`<g>${xs.map((x,i)=>`<ellipse cx="${x}" cy="${ys[i]}" rx="15" ry="9" transform="rotate(${(i-3.5)*16} ${x} ${ys[i]})" fill="url(#${g})" stroke="${p.line}" stroke-width="1.5"/>${strands(`M${x-7} ${ys[i]-2} Q${x} ${ys[i]+5} ${x+8} ${ys[i]+1}`,p,1.5,.7)}`).join('')}</g>`;
      }
      if(style==='half-up') side+=strands('M228 168 Q213 192 226 212 M372 168 Q387 192 374 212',p,6,.34)+ribbon(386,211,15,.64);
      const shine=strands('M247 136 Q261 125 279 124 M327 123 Q343 128 354 141',p,5.3,.3);
      return fringe+side+shine;
    });
  }
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

  function paintedAsset(id) {
    const asset=window.PrincessAssets?.hairs?.[id]||(variants[id]?{...variants[id],src:'assets/hair-v2/'+id+'.png'}:null);
    if(!asset||typeof asset.src!=='string'||!/^(?:data:image\/(?:png|webp);base64,|assets\/|blob:)/i.test(asset.src))return null;
    if(!['x','y','w','h'].every(key=>Number.isFinite(asset[key])))return null;
    if(asset.w<=0||asset.h<=0||asset.w>3000||asset.h>3000||Math.abs(asset.x)>3000||Math.abs(asset.y)>3000)return null;
    return asset;
  }

  // Bounds of the cream fabric ties, normalized to each original watercolor.
  // Floral pins, pearl chains and styles without a fabric bow are excluded.
  const ribbonAreas={
    braid:[[0,.79,.31,.17],[.69,.79,.31,.17]],
    'double-bun':[[.02,.185,.235,.28],[.69,.185,.27,.28]],
    'half-up':[[.315,.063,.39,.23]],
    'low-pony':[[0,.385,.35,.23],[0,.605,.105,.145]],
    'single-braid':[[.48,.77,.38,.19]],
    'bob-half-up':[[.82,.19,.145,.22]],
    'straight-braid':[[.16,.772,.15,.075],[.70,.772,.16,.075]],
    'straight-half-up':[[.75,.145,.165,.14]],
    'straight-ponytail':[[.60,.053,.23,.116]],
    'straight-twins':[[.135,.419,.15,.068],[.70,.419,.15,.068]],
    twintails:[[.21,.005,.19,.212],[.59,.005,.23,.212]]
  };
  const hasRibbon=id=>Object.prototype.hasOwnProperty.call(ribbonAreas,id);
  function hairTintSteps(value) {
    const base=color(value).toLowerCase();
    if(base==='#865947')return '';
    // Map source luminance through a multi-stop color curve, retaining every fine strand.
    const curve=base==='#342f3b'
      ? ['#111017','#1c1a25','#302d3b','#494555','#676171','#87818d','#b5acb1','#d8cdd0','#fff9ef']
      : [mix(base,'#221d28',.86),mix(base,'#30232f',.70),mix(base,'#30232f',.45),mix(base,'#30232f',.16),base,mix(base,'#fff5e5',.28),mix(base,'#fff5e5',.52),mix(base,'#fff8ed',.78),'#fff9ef'];
    const table=channel=>curve.map(c=>(parseInt(c.slice(channel,channel+2),16)/255).toFixed(5)).join(' ');
    return `<feColorMatrix in="SourceGraphic" type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0" result="hair-luminance"/>
      <feComponentTransfer in="hair-luminance" result="hair-tinted"><feFuncR type="table" tableValues="${table(1)}"/><feFuncG type="table" tableValues="${table(3)}"/><feFuncB type="table" tableValues="${table(5)}"/><feFuncA type="identity"/></feComponentTransfer>
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 .2126 .7152 .0722 0 0" result="ornament-luminance"/>
      <feComponentTransfer in="ornament-luminance" result="ornament-mask"><feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0.03 0.60 0.97 1 1"/></feComponentTransfer>
      <feComposite in="hair-tinted" in2="ornament-mask" operator="out" result="dyed-hair"/>
      <feComposite in="SourceGraphic" in2="ornament-mask" operator="in" result="original-ornaments"/>
      <feComposite in="dyed-hair" in2="original-ornaments" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="styled-hair"/>`;
  }

  function ribbonTintSteps(asset,areas,ribbonColor,baseImage) {
    if(!areas||!/^#[\da-f]{6}$/i.test(ribbonColor||''))return '';
    const zones=areas.map(([x,y,w,h],i)=>`<feFlood x="${asset.x+x*asset.w}" y="${asset.y+y*asset.h}" width="${w*asset.w}" height="${h*asset.h}" flood-color="white" result="tie-${i}"/>`).join('');
    const channels=['R','G','B'].map((letter,i)=>{
      const m=.10+.80*parseInt(ribbonColor.slice(1+i*2,3+i*2),16)/255;
      const stops=Array.from({length:17},(_,j)=>{
        const y=j/16;
        return (y<.82?m*(.035+.965*(y/.82)**1.28):m+(1-m)*((y-.82)/.18)**1.25).toFixed(4);
      }).join(' ');
      return `<feFunc${letter} type="table" tableValues="${stops}"/>`;
    }).join('');
    return `${zones}<feMerge result="tie-zones">${areas.map((_,i)=>`<feMergeNode in="tie-${i}"/>`).join('')}</feMerge>
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 2.5 0 -4.44" result="ivory"/>
      <feComposite in="ivory" in2="tie-zones" operator="in" result="tie-mask"/>
      <feColorMatrix in="SourceGraphic" type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0" result="tie-value"/>
      <feComponentTransfer in="tie-value" result="tie-color">${channels}<feFuncA type="identity"/></feComponentTransfer>
      <feComposite in="tie-color" in2="tie-mask" operator="in" result="only-ties"/>
      <feComposite in="${baseImage}" in2="tie-mask" operator="out" result="rest-of-wig"/>
      <feComposite in="only-ties" in2="rest-of-wig" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>`;
  }
  function paintedLayer(id,value,part,asset,ribbonColor) {
    const prefix=`princess-painted-hair-${++serial}`,filterId=prefix+'-tint',clipId=prefix+'-face',rangeId=prefix+'-range';
    const hair=hairTintSteps(value),ties=ribbonTintSteps(asset,ribbonAreas[id],ribbonColor,hair?'styled-hair':'SourceGraphic');
    const tint=(hair||ties)?`<filter id="${filterId}" x="0" y="0" width="100%" height="100%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">${hair}${ties}</filter>`:'';
    const front=part==='front';
    // The wig is partitioned once: fringe/cheek strands and hanging locks sit
    // in front, while the upper outer cap stays behind the face. A low split
    // above the shoulders keeps long hair and braids from disappearing in clothes.
    // Slightly overlap this shared cut to avoid a bright antialiasing seam.
    const splitY=270;
    const ellipse='<ellipse cx="300" cy="210" rx="66" ry="83"/>';
    const clip=front
      ? `<clipPath id="${clipId}" clipPathUnits="userSpaceOnUse">${ellipse}<rect x="-300" y="${splitY-.25}" width="1200" height="630"/></clipPath>`
      : `<clipPath id="${clipId}" clipPathUnits="userSpaceOnUse"><path clip-rule="evenodd" d="M-300 -300H900V900H-300Z M366 210A66 83 0 1 0 234 210A66 83 0 1 0 366 210Z"/></clipPath><clipPath id="${rangeId}" clipPathUnits="userSpaceOnUse"><rect x="-300" y="-300" width="1200" height="${splitY+301}"/></clipPath>`;
    const image=`<image href="${esc(asset.src)}" x="${asset.x}" y="${asset.y}" width="${asset.w}" height="${asset.h}" preserveAspectRatio="none"${tint?` filter="url(#${filterId})"`:''}/>`;
    return `<g class="princess-hair painted-hair painted-hair-${part}" data-hair-style="${id}" data-hair-art="painted" aria-hidden="true"><defs>${tint}${clip}</defs><g clip-path="url(#${clipId})">${front?image:`<g clip-path="url(#${rangeId})">${image}</g>`}</g></g>`;
  }

  function back(id,value,ribbonColor=null) {
    const style=known.has(id)?id:'long',asset=paintedAsset(style);
    return asset?paintedLayer(style,value,'back',asset,ribbonColor):svgBack(variants[style]?.fallback||style,value);
  }
  function front(id,value,ribbonColor=null) {
    const style=known.has(id)?id:'long',asset=paintedAsset(style);
    return asset?paintedLayer(style,value,'front',asset,ribbonColor):svgFront(variants[style]?.fallback||style,value);
  }

  const frozenFamilies=Object.freeze(families.map(item=>Object.freeze({...item,styles:Object.freeze(item.styles)})));
  const familyFor=id=>frozenFamilies.find(item=>item.styles.includes(id))||frozenFamilies[0];
  window.PrincessHair=Object.freeze({cards:Object.freeze(cards.map(Object.freeze)),colors:Object.freeze(colors),families:frozenFamilies,familyFor,hasRibbon,back,front});
})();
