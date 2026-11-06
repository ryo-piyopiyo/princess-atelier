/* Local-only generated hand/foot artwork with original SVG fallbacks. */
(function () {
  'use strict';

  var DEFAULT_COLOR = '#ffe9df';
  var skin = '#ffe2cf';
  var outline = '#c88983';
  var paintedSerial = 0;
  var paintedSpecs = {
    hands: {
      viewBox: '-24 -24 1584 1060', width: 1536, height: 1024, hitRadius: 86,
      nails: [
        [68,270,21,22,-22], [198,137,26,26,-9], [366,76,29,27,0],
        [532,142,27,26,15], [674,447,26,29,45],
        [1468,271,21,22,22], [1338,138,26,26,9], [1175,76,29,27,0],
        [1001,142,27,26,-15], [853,447,26,29,-45]
      ]
    },
    feet: {
      viewBox: '155 -30 1226 1060', width: 1536, height: 1024, hitRadius: 35,
      nails: [
        [611,83,43,38,-6], [501,93,23,19,-11], [428,122,20,16,-13],
        [365,168,17,15,-18], [307,228,15,13,-18],
        [926,85,43,38,6], [1036,96,22,18,12], [1109,126,20,16,13],
        [1171,171,17,14,18], [1227,229,15,13,20]
      ]
    }
  };

  function safeColor(value) {
    return typeof value === 'string' && /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value)
      ? value
      : DEFAULT_COLOR;
  }

  function sparkle(x, y, size, color) {
    return '<path d="M' + x + ' ' + (y - size) + ' Q' + x + ' ' + y + ' ' + (x + size) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + size) + ' Q' + x + ' ' + y + ' ' + (x - size) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - size) + 'Z" fill="' + color + '"/>';
  }

  function nail(spec, index, color, selected, label) {
    var x = spec[0];
    var y = spec[1];
    var rx = spec[2];
    var ry = spec[3];
    var rotate = spec[4] || 0;
    var selectedMarkup = selected ?
      '<ellipse cx="0" cy="0" rx="' + (rx + 9) + '" ry="' + (ry + 9) + '" fill="none" stroke="#b9762a" stroke-width="5"/>' +
      sparkle(rx + 13, -ry + 2, 10, '#c5943d') : '';
    return '<g class="nail-touch" data-nail="' + index + '" role="button" tabindex="0" aria-label="' + label +
      '" aria-pressed="' + (selected ? 'true' : 'false') + '" transform="translate(' + x + ' ' + y + ') rotate(' + rotate + ')" style="cursor:pointer;outline:none">' +
      '<rect data-nail="' + index + '" x="-37" y="-43" width="74" height="86" rx="34" fill="transparent" pointer-events="all"/>' +
      '<g pointer-events="none">' + selectedMarkup + '</g>' +
      '<ellipse class="nail-color" data-nail="' + index + '" cx="0" cy="0" rx="' + rx + '" ry="' + ry +
      '" fill="' + color + '" stroke="#b76f89" stroke-width="2.7"/>' +
      '<path d="M' + (-rx * 0.46) + ' ' + (-ry * 0.3) + ' Q' + (-rx * 0.38) + ' ' + (-ry * 0.66) + ' ' + (rx * 0.12) + ' ' + (-ry * 0.65) +
      '" fill="none" stroke="#fff" stroke-opacity=".74" stroke-width="4" stroke-linecap="round" pointer-events="none"/>' +
      '<ellipse class="nail-focus" cx="0" cy="0" rx="' + (rx + 13) + '" ry="' + (ry + 13) + '" fill="none" stroke="#7955a2" stroke-width="4" opacity="0" pointer-events="none"/>' +
      '</g>';
  }

  function handSilhouette(mirror) {
    var transform = mirror ? 'translate(695 0) scale(-1 1)' : 'translate(-15 0)';
    return '<g transform="' + transform + '" fill="' + skin + '" stroke="' + outline + '" stroke-width="3.5" stroke-linejoin="round">' +
      '<path d="M118 425 C117 397 109 377 101 355 C79 335 65 310 61 283 L42 182 C37 159 43 142 60 138 C77 134 91 146 96 166 L108 226 L102 108 C100 84 112 69 130 69 C148 69 159 83 160 106 L164 215 L164 76 C164 51 177 39 195 39 C214 39 227 53 227 77 L230 214 L231 114 C232 91 245 80 262 82 C281 84 291 98 290 120 L283 252 C294 235 307 224 320 228 C337 233 342 248 334 262 L301 322 C287 349 263 366 249 384 L246 425Z"/>' +
      '<path d="M127 355 Q171 371 216 356 M117 405 Q179 418 246 403" fill="none" stroke-opacity=".34" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M109 295 Q122 314 139 316 M272 295 Q258 309 259 329" fill="none" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M113 423 Q178 438 251 423 L253 451 L112 451Z" fill="#e8bfd6" stroke="#bc8fae"/>' +
      '<path d="M174 430 C157 411 143 421 151 436 C137 447 150 457 174 442 C198 459 212 446 199 436 C208 420 192 411 174 430Z" fill="#f7dbe9" stroke="#bc8fae" stroke-width="2.5"/>' +
      '<circle cx="174" cy="436" r="7" fill="#fff1d7" stroke="#c7a272" stroke-width="2"/>' +
      '</g>';
  }

  function footSilhouette(mirror) {
    var transform = mirror ? 'translate(680 0) scale(-1 1)' : '';
    return '<g transform="' + transform + '" stroke="' + outline + '" stroke-width="3.5" stroke-linejoin="round">' +
      '<path d="M141 430 C119 412 114 389 112 368 C111 337 91 322 70 301 C51 283 39 264 40 241 C39 216 52 202 70 195 C62 173 72 152 91 144 C96 121 112 108 133 107 C138 84 155 71 175 74 C189 54 215 48 235 62 C248 40 280 38 298 57 C320 80 315 111 308 138 C301 164 295 183 294 207 C293 237 300 264 294 291 C288 319 265 340 256 367 C248 389 247 412 230 430Z" fill="' + skin + '"/>' +
      '<ellipse cx="57" cy="236" rx="25" ry="33" fill="' + skin + '"/>' +
      '<ellipse cx="84" cy="169" rx="29" ry="38" fill="' + skin + '"/>' +
      '<ellipse cx="137" cy="117" rx="32" ry="42" fill="' + skin + '"/>' +
      '<ellipse cx="206" cy="87" rx="34" ry="46" fill="' + skin + '"/>' +
      '<ellipse cx="281" cy="91" rx="40" ry="51" fill="' + skin + '"/>' +
      '<path d="M116 329 Q146 345 172 332 M247 277 Q236 311 224 321" fill="none" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M132 420 Q183 436 238 419 L240 447 Q185 462 129 447Z" fill="#e8bfd6" stroke="#bc8fae"/>' +
      '<path d="M181 430 C167 414 153 422 160 435 C149 445 162 455 181 441 C200 455 214 445 203 435 C210 421 196 413 181 430Z" fill="#f7dbe9" stroke="#bc8fae" stroke-width="2.5"/>' +
      '<circle cx="181" cy="435" r="6" fill="#fff1d7" stroke="#c7a272" stroke-width="2"/>' +
      '</g>';
  }

  function renderVectorNails(options) {
    options = options || {};
    var feet = options.mode === 'feet';
    var colors = Array.isArray(options.colors) ? options.colors : [];
    var selected = Number.isInteger(options.selected) ? options.selected : -1;
    var left = feet ?
      [[281, 78, 27, 31, 5], [206, 76, 23, 28, -4], [137, 107, 21, 25, -12], [84, 162, 18, 22, -19], [54, 233, 15, 19, -24]] :
      [[69, 170, 20, 26, -9], [132, 105, 23, 30, -2], [196, 77, 24, 31, 0], [261, 116, 23, 30, 3], [315, 248, 20, 26, 35]];
    var fingers = feet ? ['おやゆび', 'ひとさしゆび', 'なかゆび', 'くすりゆび', 'こゆび'] :
      ['こゆび', 'くすりゆび', 'なかゆび', 'ひとさしゆび', 'おやゆび'];
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="nail-illustration" viewBox="0 0 680 460" width="680" height="460" role="group" aria-label="' +
      (feet ? 'あしのつめ。すきなつめをえらんでね' : 'てのつめ。すきなつめをえらんでね') +
      '" style="display:block;width:100%;height:auto;max-height:100%;overflow:visible;touch-action:manipulation;user-select:none">' +
      '<style>.nail-touch:focus-visible .nail-focus{opacity:1}.nail-touch:hover .nail-color{stroke:#965a7c;stroke-width:4}</style>' +
      '<ellipse cx="340" cy="439" rx="273" ry="16" fill="#c6a788" opacity=".09"/>' +
      sparkle(25, 52, 12, '#e6c397') + sparkle(650, 47, 9, '#ddc5d9') +
      (feet ? footSilhouette(false) + footSilhouette(true) : handSilhouette(false) + handSilhouette(true));
    for (var side = 0; side < 2; side++) {
      for (var finger = 0; finger < 5; finger++) {
        var spec = left[finger].slice();
        if (!feet) spec[0] -= 15;
        if (side === 1) {
          spec[0] = 680 - spec[0];
          spec[4] *= -1;
        }
        var index = side * 5 + finger;
        svg += nail(spec, index, safeColor(colors[index]), selected === index,
          (side === 0 ? 'ひだり' : 'みぎ') + (feet ? 'あし' : 'て') + 'の' + fingers[finger] + 'のつめ');
      }
    }
    return svg + '</svg>';
  }

  function expandedHex(value) {
    var c=safeColor(value);
    return c.length===4?'#'+c.slice(1).split('').map(function(v){return v+v;}).join(''):c;
  }

  function polishDefinition(value,id,x,y,rx,ry) {
    var c=expandedHex(value),rgb=[1,3,5].map(function(i){return parseInt(c.slice(i,i+2),16)/255;});
    // Recolor the painted nail itself. The original grain, folds, and white shine survive.
    var table=function(channel){var v=rgb[channel];return [v*.18,v*.25,v*.34,v*.43,v*.53,v*.65,v*.80,v,v+(1-v)*.12,v+(1-v)*.38,1].map(function(n){return n.toFixed(5);}).join(' ');};
    var radius=Math.ceil(Math.hypot(rx,ry))+8;
    return '<filter id="'+id+'" filterUnits="userSpaceOnUse" x="'+(x-radius)+'" y="'+(y-radius)+'" width="'+(radius*2)+'" height="'+(radius*2)+'" color-interpolation-filters="sRGB">'+
      '<feColorMatrix type="matrix" values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/>'+
      '<feComponentTransfer><feFuncR type="table" tableValues="'+table(0)+'"/><feFuncG type="table" tableValues="'+table(1)+'"/><feFuncB type="table" tableValues="'+table(2)+'"/><feFuncA type="identity"/></feComponentTransfer></filter>';
  }

  function paintedNailPath(rx,ry) {
    return 'M'+(-rx)+' '+(ry*.35)+' C'+(-rx)+' '+(-ry*.28)+' '+(-rx*.95)+' '+(-ry*.79)+' '+(-rx*.52)+' '+(-ry*.94)+
      ' Q0 '+(-ry*1.08)+' '+(rx*.52)+' '+(-ry*.94)+' C'+(rx*.95)+' '+(-ry*.79)+' '+rx+' '+(-ry*.28)+' '+rx+' '+(ry*.35)+
      ' Q'+(rx*.97)+' '+(ry*.91)+' '+(rx*.5)+' '+ry+' L'+(-rx*.5)+' '+ry+' Q'+(-rx*.97)+' '+(ry*.91)+' '+(-rx)+' '+(ry*.35)+'Z';
  }

  function renderPaintedNails(options,source,mode) {
    var art=paintedSpecs[mode],values=Array.isArray(options.colors)?options.colors:[],selected=Number.isInteger(options.selected)?options.selected:-1;
    var prefix='painted-nails-'+(++paintedSerial)+'-',defs='',content='';
    var src=source.replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c];});
    var image='<image href="'+src+'" x="0" y="0" width="'+art.width+'" height="'+art.height+'" preserveAspectRatio="none"';
    var names=mode==='feet'?['おやゆび','ひとさしゆび','なかゆび','くすりゆび','こゆび']:['こゆび','くすりゆび','なかゆび','ひとさしゆび','おやゆび'];
    for(var index=0;index<10;index++) {
      if(mode==='feet' && (options.side===0||options.side===1) && Math.floor(index/5)!==options.side)continue;
      var s=art.nails[index],x=s[0],y=s[1],rx=s[2],ry=s[3],angle=s[4],d=paintedNailPath(rx,ry);
      var transform='translate('+x+' '+y+') rotate('+angle+')',clip=prefix+'clip-'+index,filter=prefix+'polish-'+index;
      var painted=typeof values[index]==='string'&&/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(values[index]);
      defs+='<clipPath id="'+clip+'" clipPathUnits="userSpaceOnUse"><path d="'+d+'" transform="'+transform+'"/></clipPath>';
      if(painted)defs+=polishDefinition(values[index],filter,x,y,rx,ry);
      var label=(index<5?'ひだり':'みぎ')+(mode==='feet'?'あし':'て')+'の'+names[index%5]+'のつめ';
      content+=(painted?'<g clip-path="url(#'+clip+')" pointer-events="none">'+image+' filter="url(#'+filter+')"/></g>':'')+
        '<g class="nail-touch painted-nail-touch" data-nail="'+index+'" role="button" tabindex="0" aria-label="'+label+'" aria-pressed="'+(selected===index)+'" style="cursor:pointer;outline:none">'+
        '<circle data-nail="'+index+'" cx="'+x+'" cy="'+y+'" r="'+art.hitRadius+'" fill="#fff" fill-opacity="0" pointer-events="all"/>'+
        '<path class="nail-color" data-nail="'+index+'" data-polish="'+(painted?expandedHex(values[index]):'clear')+'" d="'+d+'" transform="'+transform+'" fill="none" stroke="'+(selected===index?'#b97929':'transparent')+'" stroke-width="7" pointer-events="none"/>'+
        '<circle class="nail-focus" cx="'+x+'" cy="'+y+'" r="'+(art.hitRadius-3)+'" fill="none" stroke="#9574b1" stroke-width="7" stroke-dasharray="10 10" opacity="0" pointer-events="none"/>'+
        '</g>';
    }
    // Use the soft painting's shading with an intermediate instep width. The same
    // transform applies to the base picture, polish masks, and larger touch areas.
    var view=mode==='feet'&&options.side===0?'251 -24 510 362':mode==='feet'&&options.side===1?'763 -24 510 362':art.viewBox,box=view.split(' ');
    var sideClip='';
    if(mode==='feet'&&(options.side===0||options.side===1)){defs+='<clipPath id="'+prefix+'one-foot"><rect x="'+(options.side*768)+'" y="0" width="768" height="1024"/></clipPath>';sideClip=' clip-path="url(#'+prefix+'one-foot)"';}
    return '<svg xmlns="http://www.w3.org/2000/svg" class="nail-illustration painted-nail-illustration" data-nail-art="painted" viewBox="'+view+'" width="'+box[2]+'" height="'+box[3]+'" role="group" aria-label="'+(mode==='feet'?'あし':'て')+'のつめ。すきなつめをえらんでね" style="display:block;width:100%;height:auto;max-height:100%;overflow:hidden;touch-action:manipulation;user-select:none">'+
      '<style>.nail-touch:focus-visible .nail-focus{opacity:1}.painted-nail-touch:hover .nail-color{stroke:#b97929}</style><defs>'+defs+'</defs><g'+(mode==='feet'?' transform="translate(107.52 0) scale(.86 1)"':'')+sideClip+'>'+image+' pointer-events="none"/>'+content+'</g></svg>';
  }

  function renderNails(options) {
    options=options||{};
    var mode=options.mode==='feet'?'feet':'hands',source=window.PrincessAssets&&window.PrincessAssets.nailArt&&window.PrincessAssets.nailArt[mode];
    var markup=typeof source==='string'&&/^(?:data:image\/(?:png|webp);base64,|assets\/|blob:)/i.test(source)
      ?renderPaintedNails(options,source,mode):renderVectorNails(options);
    return window.PrincessBodySkin?.sceneNails(options,markup)??markup;
  }

  window.PrincessBeauty = Object.freeze({ renderNails: renderNails });
}());
