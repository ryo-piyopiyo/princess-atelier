/* The atelier stays on this device. Only design choices are stored; photos live in memory. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const STORAGE = 'princess-atelier-design-v1';
  const SAVED_PIXELS_STORAGE = 'princess-atelier-saved-pixels-v1';
  const savedPixelFingerprints = new Set();
  const savedKeepsakeCompositions = new Map(), keepsakePhotoIds = new Map();
  let keepsakeSaveInFlight = false;
  const CASUAL_PARTS=[{id:'top',label:'トップス'},{id:'outer',label:'うわぎ'},{id:'bottom',label:'ボトムス'},{id:'socks',label:'くつした'},{id:'shoes',label:'くつ'}];
  const CASUAL_FALLBACK={top:'tee',outer:'none',bottom:'skirt',socks:'ankle',shoes:'sneakers',accessory:'none',background:'room',styles:{top:{color:'#dc9fb4',pattern:'plain',ribbon:false},outer:{color:'#a4c4b7',pattern:'plain',ribbon:false},bottom:{color:'#91abc8',pattern:'plain',ribbon:false},socks:{color:'#fff1df',pattern:'plain',ribbon:false},shoes:{color:'#cc9b80',pattern:'plain',ribbon:false}}};
  const DEFAULT = {mode:'princess',casual:CASUAL_FALLBACK,dress:'ball',dressColor:'#ec9695',hair:'long',hairColor:'#865947',face:'gentle',friendId:'cast-gentle',faceStudioEnabled:false,faceOptions:{enabled:false},accessory:'crown',shoes:'ballet',background:'garden',makeup:{blush:null,lip:null},nails:{hands:Array(10).fill(null),feet:Array(10).fill(null)},stickers:[],unlocked:false,sound:true,bgm:true};
  const POLISHES = ['#e99aa9','#c48ec1','#b8b3e0','#82b5df','#83c9c1','#e8bd72','#dc7778','#f6eee1'];
  const BLUSHES = ['#eb91a3','#eaa481','#dca0ba'];
  const LIPS = ['#d87d94','#c85f7f','#e39a83'];
  const SPEECH = {welcome:'すきな ドレスを タッチしてね',dress:'ドレスを えらんでね',hair:'かみがたを えらんでね',accessory:'かざりを えらんでね',background:'どこにお出かけしようかな？',locked:'できたを おすと おけしょうばこが とどくよ',makeup:'おけしょう してみよう',blush:'ほっぺを かわいく しよう',lip:'くちびるを かわいく しよう',nails:'すきな つめを タッチしてね',done:'わあ、すてき！',gift:'おけしょうばこが とどいたよ',photo:'しゃしんで おようふくを きてみよう',photoAdjust:'おかおを ゆびで うごかしてね',saved:'すてきな しゃしんが できたよ',stickers:'すきな シールを えらんで、おにわに ぺたん',place:'おにわを タッチしてね',face:'きょうは だれと あそぶ？',haircolor:'かみの いろを えらんでね'};
  Object.assign(SPEECH,{casualMode:'おようふくを えらんでね',princessMode:'ドレスで おめかし しよう',top:'うえの おようふくを えらんでね',outer:'うわぎを えらんでね',bottom:'したの おようふくを えらんでね',socks:'くつしたを えらんでね',casualShoes:'くつを えらんでね',pattern:'もようを えらんでね',ribbon:'リボンを つけてみよう'});
  const NAMED_CHOICES={
    hair:{long:['learnHairLong','ロングヘア'],waves:['learnHairWaves','ウェーブヘア'],bob:['learnHairBob','ボブ'],inward:['learnHairInward','内巻きボブ'],outward:['learnHairOutward','外はねボブ'],short:['learnHairShort','ショートヘア'],'crown-braid':['learnHairCrownBraid','編み込みカチューシャ'],'single-braid':['learnHairSingleBraid','ひとつの三つ編み'],braid:['learnHairBraid','ふたつの三つ編み'],'half-up':['learnHairHalfUp','ハーフアップ'],bun:['learnHairBun','おだんごヘア'],'double-bun':['learnHairDoubleBun','ツインおだんご'],ponytail:['learnHairPonytail','ポニーテール'],'low-pony':['learnHairLowPony','ローポニーテール'],twintails:['learnHairTwintails','ツインテール'],'low-twins':['learnHairLowTwins','低めのツインテール'],ringlets:['learnHairRinglets','縦ロール'],'side-sweep':['learnHairSideSweep','サイドに寄せたヘア'],'half-bun':['learnHairHalfBun','おだんごハーフアップ'],hime:['learnHairHime','姫カット']},
    accessory:{none:['learnAccessoryNone','ヘアアクセサリーをはずしたよ'],crown:['learnAccessoryCrown','ティアラ'],bow:['learnAccessoryBow','リボン'],flowers:['learnAccessoryFlowers','花かんむり'],star:['learnAccessoryStar','星のヘアアクセサリー']},
    shoes:{ballet:['learnPrincessShoesBallet','バレエシューズ'],strap:['learnPrincessShoesStrap','ストラップシューズ'],boots:['learnPrincessShoesBoots','リボンのブーツ']},
    background:{garden:['learnSceneGarden','お花のお庭'],palace:['learnScenePalace','ティールーム'],sky:['learnSceneSky','星空のテラス'],room:['learnSceneRoom','おしたくのお部屋'],park:['learnScenePark','公園']},
    sticker:{flower:['learnStickerFlower','お花のシール'],star:['learnStickerStar','星のシール'],butterfly:['learnStickerButterfly','ちょうちょのシール'],ribbon:['learnStickerRibbon','リボンのシール'],heart:['learnStickerHeart','ハートのシール'],gem:['learnStickerGem','宝石のシール']}
  };
  function speakNamedChoice(kind,id){const named=NAMED_CHOICES[kind]?.[id];if(named)speak(named[0],named[1]);}
  Object.assign(SPEECH,{cheekPlay:'チークで おめかし してみよう',lipPlay:'リップで くちびるを いろどろう',manicurePlay:'マニキュアで ての つめに ぬってみよう',pedicurePlay:'ペディキュアで あしの つめに ぬってみよう'});
  const CASUAL_SHELF_VOICES={top:'casualChooseTop',outer:'casualChooseOuter',bottom:'casualChooseBottom',socks:'casualChooseSocks',shoes:'casualChooseShoes'};
  const CASUAL_ITEM_VOICES={top:{tee:'casualTee',blouse:'casualBlouse',hoodie:'casualHoodie',sailor:'casualSailor'},outer:{none:'noOuter',cardigan:'casualCardigan',blazer:'casualBlazer',denim:'casualDenimJacket'},bottom:{skirt:'casualSkirt',pleated:'casualPleatedSkirt',shorts:'casualShorts',pants:'casualPants',culottes:'casualCulottes',jeans:'casualJeans'},socks:{none:'noSocks',ankle:'casualAnkleSocks',crew:'casualCrewSocks',knee:'casualKneeSocks'},shoes:{sneakers:'casualSneakers',loafers:'casualLoafers',rainboots:'casualRainboots',slipons:'casualSlipons'}};
  const CASUAL_PATTERN_VOICES={plain:'casualPatternPlain',stripes:'casualPatternStripes',dots:'casualPatternDots',flowers:'casualPatternFlowers',check:'casualPatternCheck'};
  Object.assign(SPEECH,{
    casualChooseTop:'どのトップスを着ようかな？',casualChooseOuter:'どの上着を着ようかな？',casualChooseBottom:'どのボトムスにしようかな？',casualChooseSocks:'どの靴下を履こうかな？',casualChooseShoes:'どの靴を履こうかな？',
    casualTee:'ティーシャツを着てみよう！',casualBlouse:'襟付きブラウスにしよう！',casualHoodie:'パーカーを着てみようかな？',casualSailor:'セーラー服にしよう！',
    casualCardigan:'カーディガンを羽織ってみよう！',casualBlazer:'ブレザーを着てみようかな？',casualDenimJacket:'デニムジャケットにしよう！',
    casualSkirt:'スカートを履いてみよう！',casualPleatedSkirt:'プリーツスカートにしよう！',casualShorts:'半ズボンを履いてみよう！',casualPants:'長ズボンにしよう！',casualCulottes:'キュロットを履いてみようかな？',casualJeans:'ジーンズを履いてみよう！',
    casualAnkleSocks:'くるぶしソックスにしよう！',casualCrewSocks:'クルーソックスを履いてみよう！',casualKneeSocks:'ハイソックスを履いてみようかな？',
    casualSneakers:'スニーカーにしよう！',casualLoafers:'ローファーを履いてみよう！',casualRainboots:'レインブーツを履いてみようかな？',casualSlipons:'上履きにしよう！',
    casualPatternPlain:'無地にしてみよう！',casualPatternStripes:'しましま模様にしよう！',casualPatternDots:'水玉模様にしよう！',casualPatternFlowers:'お花の模様にしよう！',casualPatternCheck:'チェック模様にしよう！',casualRibbonOn:'リボンをつけてみよう！'
  });
  function speakCasualShelf(part){const key=CASUAL_SHELF_VOICES[part];if(key)speak(key);}
  function speakCasualItem(part,id){const key=CASUAL_ITEM_VOICES[part]?.[id];if(key)speak(key);else speakCasualShelf(part);}
  function speakCasualStyle(kind,value){const key=kind==='ribbon'?(value==='on'?'casualRibbonOn':'noRibbon'):CASUAL_PATTERN_VOICES[value];if(key)speak(key);}
  const CATEGORIES = [{id:'dress',label:'ドレス'},{id:'hair',label:'かみのけ'},{id:'accessory',label:'ヘアアクセサリー'},{id:'background',label:'おでかけ'},{id:'makeup',label:'おけしょう'},{id:'stickers',label:'シール'}];
  const TITLES = {dress:'どれに する？',hair:'かみがたを えらぼう',accessory:'きらり、かざろう',background:'どこにお出かけしようかな？',makeup:'おけしょうの じかん',stickers:'ぺたん、と かざろう'};
  const STICKERS = [{id:'flower',label:'おはな'},{id:'star',label:'おほしさま'},{id:'butterfly',label:'ちょうちょ'},{id:'ribbon',label:'リボン'},{id:'heart',label:'ハート'},{id:'gem',label:'ほうせき'}];
  const FALLBACK_CARDS = {dress:[{id:'ball',label:'ふんわり',colors:['#e7a5bb','#b5b4df','#a4cbd0']},{id:'flower',label:'おはな',colors:['#f0c5a0','#b0cbaa','#d9a9bf']},{id:'fairy',label:'ようせい',colors:['#b6cfae','#d2b5de','#a4d8d2']},{id:'moon',label:'おつきさま',colors:['#bec4e3','#e7c48e','#e5b7ca']},{id:'rose',label:'ばら',colors:['#dca1b4','#e7bb9f','#c9b6dd']},{id:'rainbow',label:'にじ',colors:['#e9b7c9','#c4bfe3','#b6d1cb']}],hair:[{id:'long',label:'さらさら'},{id:'braid',label:'みつあみ'},{id:'bob',label:'ふわり'}],accessory:[{id:'crown',label:'ティアラ'},{id:'bow',label:'リボン'},{id:'flowers',label:'おはな'},{id:'star',label:'おほしさま'}],background:[{id:'garden',label:'おにわ'},{id:'palace',label:'おしろ'},{id:'sky',label:'おそら'}]};
  FALLBACK_CARDS.face=[{id:'gentle',label:'やさしい おかお'},{id:'smile',label:'にっこり'},{id:'sparkle',label:'きらきら'},{id:'rosy',label:'まんまる'}];
  let state = loadDesign(), history = [], category = 'dress', page = 0, makeupPart = null;
  let photo = null, photoDraft = null, cameraStream = null, cameraSession = 0, modalCleanup = null, modalAfterClose = null, audioContext = null, voiceAudio = null, voiceCleanup = null, toastTimer;
  let nailMode = 'hands', footSide=null, selectedNail = -1, polish = POLISHES[0], started = false, selectedSticker = 'flower', accessoryShelf='accessory';
  let casualPart='top',casualPreviewSerial=0,paletteTarget='dress',paletteGroup=0;
  let hairStep='base',hairRenderedSelection=null,outingRegion=null,outingRenderedScene=null;
  const hairRemembered=new Map();
  const art = () => window.PrincessArt;
  const assets = () => window.PrincessAssets || {};
  function outingEntries(){return window.PrincessOuting?.entries?.()||[{id:'garden',label:'おにわ'},{id:'palace',label:'おちゃの おへや'},{id:'sky',label:'ほしの テラス'},{id:'room',label:'おしたくの おへや'},{id:'park',label:'こうえん'}];}

  function loadDesign() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (!s || typeof s !== 'object') {const result=clone(DEFAULT);result.casual=normalizeCasual();return result;}
    const result = {...clone(DEFAULT),...s};
      result.mode=s.mode==='casual'?'casual':'princess';result.casual=normalizeCasual(s.casual);
      result.makeup = {...DEFAULT.makeup,...s.makeup};
      result.nails = {hands:Array.from({length:10},(_,i)=>safeColor(s.nails?.hands?.[i])),feet:Array.from({length:10},(_,i)=>safeColor(s.nails?.feet?.[i]))};
      result.dressColor = safeColor(result.dressColor) || DEFAULT.dressColor;
      result.hairColor = safeColor(result.hairColor) || DEFAULT.hairColor;
      result.makeup.blush = safeColor(result.makeup.blush); result.makeup.lip = safeColor(result.makeup.lip);
      result.faceStudioEnabled=s.faceStudioEnabled===true;const book=window.PrincessFriendBook;
      let member=result.faceStudioEnabled&&book?book.get(s.friendId||('cast-'+s.face)):null;
      if(result.faceStudioEnabled&&book&&!s.friendId&&s.faceOptions?.enabled){member=book.create(s.faceOptions);book.rememberLook(member.id,s);try{localStorage.setItem(STORAGE,JSON.stringify({...s,friendId:member.id}));}catch{}}
      if(!member)member=book?.get('cast-gentle')||{id:'cast-gentle',face:'gentle'};identity(result,member);
      result.sound = s.sound !== false;result.bgm=s.bgm!==false; result.unlocked = s.unlocked === true;
      result.stickers = Array.isArray(s.stickers)?s.stickers.filter(x=>x&&['flower','star','butterfly','ribbon','heart','gem'].includes(x.id)&&Number.isFinite(x.x)&&Number.isFinite(x.y)).slice(0,24):[];
      return result;
    } catch { const result=clone(DEFAULT);result.casual=normalizeCasual();return result; }
  }
  function casualItems(part) {
    let provided;try{provided=window.CoordArt?.items?.(part);}catch{}
    const fallback={top:[['tee','シャツ'],['blouse','ブラウス'],['sweater','セーター'],['tank','ノースリーブ']],outer:[['none','はずす'],['cardigan','カーディガン'],['blazer','ブレザー'],['jacket','ジャケット']],bottom:[['skirt','スカート'],['pleated','プリーツ'],['shorts','ショートパンツ'],['pants','パンツ'],['culottes','キュロット'],['jeans','ジーンズ']],socks:[['ankle','くるぶし'],['long','ながい'],['frill','フリル'],['none','はずす']],shoes:[['sneakers','スニーカー'],['flats','バレエシューズ'],['boots','ブーツ'],['sandals','サンダル']]};
    const items=Array.isArray(provided)&&provided.length?provided:fallback[part].map(([id,label])=>({id,label}));
    return part==='outer'&&!items.some(item=>item.id==='none')?[{id:'none',label:'はずす'},...items]:items;
  }
  function normalizeCasual(value={}) {
    const defaults=window.CoordArt?.defaults||CASUAL_FALLBACK,result={...clone(CASUAL_FALLBACK),...clone(defaults),...value,styles:{}};
    for(const {id} of CASUAL_PARTS){result[id]=typeof result[id]==='string'?result[id]:CASUAL_FALLBACK[id];const style={...CASUAL_FALLBACK.styles[id],...defaults.styles?.[id],...value?.styles?.[id]};result.styles[id]={color:style.color===null?null:safeColor(style.color)||CASUAL_FALLBACK.styles[id].color,pattern:['plain','stripes','dots','flowers','check'].includes(style.pattern)?style.pattern:'plain',ribbon:style.ribbon===true};}
    result.accessory=typeof value.accessory==='string'?value.accessory:'none';result.background=outingEntries().some(item=>item.id===value.background)?value.background:'room';return result;
  }
  function effectiveBackground(){return state.mode==='casual'?state.casual.background:state.background;}
  function effectiveAccessory(){return state.mode==='casual'?state.casual.accessory:state.accessory;}
  function casualModeIcon(){
    try{const provider=window.CoordArt;if(provider?.items('top').some(item=>item.id==='tee')&&provider.items('bottom').some(item=>item.id==='pants')){const framed=(svg,x,y,w,h)=>svg.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" style="width:${w}px;height:${h}px" `);return `<svg viewBox="0 0 100 100" aria-hidden="true">${framed(provider.thumbnail('top','tee',{color:null,pattern:'plain',ribbon:false}),0,1,65,64)}${framed(provider.thumbnail('bottom','pants',{color:null,pattern:'plain',ribbon:false}),44,31,54,67)}</svg>`;}}catch{}
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="m18 8 16 6 16-6 14 18-14 12-4-9v30H22V29l-5 9L4 26Z" fill="#e3a0b6" stroke="#97516d" stroke-width="3"/><path d="M26 12q8 13 16 0" fill="none" stroke="#fff1de" stroke-width="5"/><path d="m49 47 41 2 6 44-19 1-8-30-3 30H47Z" fill="#8eacca" stroke="#546e96" stroke-width="3"/><path d="m52 56 34 1M69 56v9" stroke="#d6e3ec" stroke-width="4"/><path d="m27 39 6-9 7 9-6 11Z" fill="#f8cf7b"/></svg>';
  }
  function casualToolIcon(kind){const shapes={color:'<path d="M48 9C-2 7-7 82 41 88c18 2 21-9 12-17-7-6 1-13 14-10 35 5 30-50-19-52Z" fill="#f1d5a5" stroke="#aa784a" stroke-width="3"/><circle cx="29" cy="32" r="10" fill="#d9618b"/><circle cx="53" cy="23" r="10" fill="#a58acb"/><circle cx="75" cy="40" r="10" fill="#65a8ba"/><circle cx="27" cy="60" r="10" fill="#e5bb55"/><ellipse cx="49" cy="77" rx="7" ry="5" fill="#fff7e9" stroke="#aa784a" stroke-width="2"/>',pattern:'<rect x="9" y="9" width="78" height="78" rx="10" fill="#fff1df" stroke="#987666" stroke-width="3"/><path d="M14 29h68M14 51h68M14 73h68" stroke="#dd8eab" stroke-width="9"/><path d="M30 14v68m25-68v68m23-68v68" stroke="#9eb7d4" stroke-width="7" opacity=".75"/>',ribbon:'<path d="M43 41C-6-8-9 64 43 53m10-12C102-8 105 64 53 53" fill="#e68eae" stroke="#a34f77" stroke-width="3"/><path d="m39 50-13 39-11-15-11 2 28-35m25 9 13 39 11-15 11 2-28-35" fill="#f0b6cb" stroke="#a34f77" stroke-width="3"/><ellipse cx="48" cy="48" rx="12" ry="16" fill="#cb6b94" stroke="#a34f77" stroke-width="3"/><path d="M15 30q11 0 23 12m43-12Q70 30 58 42" stroke="#ffdfeb" stroke-width="5" fill="none"/>'};return `<svg viewBox="0 0 96 96" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">${shapes[kind]||shapes.pattern}</svg>`;}
  function fallbackCasualThumbnail(part,id,style={}) {
    const c=safeColor(style.color)||'#dca3b8',p=style.pattern||'plain',serial='casual-preview-'+(++casualPreviewSerial);
    let shape=part==='top'?'M32 16 60 23 88 16 113 43 91 60 84 47v74H36V47l-7 13L7 43Z':part==='outer'?'M32 14 52 22l8 22 8-22 20-8 25 33-20 16-9-14v73H36V49l-9 14L7 47Z':part==='bottom'?(id.includes('pant')||id.includes('jean')||id==='shorts'?'M29 15h62l9 108H70L60 55 50 123H20Z':'M32 17h56l25 103q-53 21-106 0Z'):part==='socks'?'M21 11h29v65L30 99q-12 7-18-5-3-8 6-17l5-5Z M71 11h29v65L80 99q-12 7-18-5-3-8 6-17l5-5Z':'M21 30q14 6 25-2l13 38q-8 17-48 4-11-6-3-17Z M76 30q14 6 25-2l13 38q-8 17-48 4-11-6-3-17Z';
    if(id==='none')return `<svg viewBox="0 0 120 140" aria-hidden="true"><g opacity=".3"><path d="${shape}" fill="${c}" stroke="#795747" stroke-width="3"/></g><path d="m31 40 58 58M89 40 31 98" stroke="#b75978" stroke-width="10" stroke-linecap="round"/></svg>`;
    const pattern=p==='stripes'?'<path d="M0 4h16M0 12h16" stroke="#fff7e9" stroke-width="4"/>':p==='dots'?'<circle cx="5" cy="5" r="3" fill="#fff7eb"/><circle cx="13" cy="13" r="3" fill="#fff7eb"/>':p==='flowers'?'<path d="M8 3v10M3 8h10m-8-3 6 6m0-6-6 6" stroke="#fff0d8" stroke-width="3"/><circle cx="8" cy="8" r="2" fill="#e5bd6d"/>':p==='check'?'<path d="M0 4h16M4 0v16" stroke="#fff3e5" stroke-width="5" opacity=".8"/>':'';
    return `<svg viewBox="0 0 120 140" aria-hidden="true"><defs><pattern id="${serial}" width="16" height="16" patternUnits="userSpaceOnUse">${pattern}</pattern></defs><path d="${shape}" fill="${c}" stroke="#795747" stroke-width="3" stroke-linejoin="round"/>${p!=='plain'?`<path d="${shape}" fill="url(#${serial})"/>`:''}${part==='outer'?'<path d="M60 43v80M53 61h1m-1 19h1m-1 19h1" stroke="#795747" stroke-width="3"/>':''}${style.ribbon?'<path d="M57 29q-31-24-23 0 0 15 23 6m6-6q31-24 23 0 0 15-23 6" fill="#f4bdd0" stroke="#a85e7b" stroke-width="2"/><circle cx="60" cy="33" r="6" fill="#d17d9f"/>':''}</svg>`;
  }
  function casualThumbnail(part,id=state.casual[part],style=state.casual.styles[part]) {
    try{const rendered=window.CoordArt?.thumbnail?.(part,id,style);if(rendered)return rendered;}catch{}
    return fallbackCasualThumbnail(part,id,style);
  }
  function renderPlayModes(){const nav=$('#playModes');if(!nav)return;const modes=[{id:'princess',label:'おひめさま',image:categoryVisual('dress')},{id:'casual',label:'おようふく',image:casualModeIcon()}];nav.innerHTML=modes.map(m=>`<button class="play-mode ${state.mode===m.id?'selected':''}" data-play-mode="${m.id}" aria-label="${m.label}" aria-pressed="${state.mode===m.id}"><span class="play-mode-picture">${m.image}</span><span class="play-mode-label">${m.label}</span>${state.mode===m.id?`<i>${icon('check')}</i>`:''}</button>`).join('');if($('#startDressPicture'))$('#startDressPicture').innerHTML=modes[0].image;if($('#startCasualPicture'))$('#startCasualPicture').innerHTML=modes[1].image;}
  function setPlayMode(mode){if(!['princess','casual'].includes(mode))return;if(state.mode===mode){setCategory('dress');return;}category='dress';makeupPart=null;page=0;change(()=>{state.mode=mode;},{sparkle:false});speak(mode==='casual'?'casualMode':'princessMode');}
  function renderCasual(body){
    const items=casualItems(casualPart),perPage=items.length>4?3:4,pages=Math.ceil(items.length/perPage);page=Math.max(0,Math.min(page,pages-1));const selected=state.casual[casualPart],disabled=selected==='none';
    body.innerHTML=`<nav class="casual-parts" aria-label="おようふくの ばしょ">${CASUAL_PARTS.map(part=>`<button class="casual-part ${casualPart===part.id?'active':''}" data-casual-part="${part.id}" aria-label="${part.label}" aria-pressed="${casualPart===part.id}"><span>${casualThumbnail(part.id)}</span><small>${part.label}</small></button>`).join('')}</nav><div class="cards casual-cards">${items.slice(page*perPage,page*perPage+perPage).map(item=>`<button class="choice ${selected===item.id?'selected':''}" data-casual-item="${escapeAttr(item.id)}" aria-label="${escapeAttr(item.label||item.id)}" aria-pressed="${selected===item.id}"><span class="choice-art">${casualThumbnail(casualPart,item.id)}</span>${selected===item.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`).join('')}${pages>1?`<button class="choice next-card" data-page="${page===pages-1?-page:1}" aria-label="つぎの おようふく"><span class="next-card-icon">${icon('chevron-right')}</span><span class="next-card-dots">${Array.from({length:pages},(_,i)=>`<i class="${i===page?'current':''}"></i>`).join('')}</span></button>`:''}</div><div class="casual-edit-actions">${[{id:'color',label:'いろ'},{id:'pattern',label:'もよう'},{id:'ribbon',label:'リボン'}].map(tool=>`<button data-casual-tool="${tool.id}" ${disabled?'disabled':''} aria-label="${tool.label}">${casualToolIcon(tool.id)}<span>${tool.label}</span></button>`).join('')}</div>`;
    $('#categoryTitle').textContent='おようふくを えらぼう';$('#wardrobeHint').textContent=disabled?(casualPart==='outer'?'うわぎなし':'くつしたなし'):(items.find(item=>item.id===selected)?.label||'すきな ふくを タッチ');
  }
  function paletteGroups(){const provided=window.CoordArt?.palette;if(Array.isArray(provided)&&provided.length)return provided;return [{id:'starter',label:'いろ',colors:POLISHES.map(hex=>({hex,label:colorName(hex),reading:colorName(hex),voiceKey:'color'}))}];}
  function paletteColour(hex){for(const group of paletteGroups()){const found=group.colors.find(item=>item.hex?.toLowerCase()===hex?.toLowerCase());if(found)return found;}return {hex,label:colorName(hex),reading:colorName(hex),voiceKey:'color'};}
  function paletteCurrentColour(){return paletteTarget==='dress'?state.dressColor:state.casual.styles[paletteTarget].color||casualItems(paletteTarget).find(item=>item.id===state.casual[paletteTarget])?.baseColor||CASUAL_FALLBACK.styles[paletteTarget].color;}
  function palettePreview(){return paletteTarget==='dress'?art()?.card?.('dress',state.dress,{...state})||categoryVisual('dress'):casualThumbnail(paletteTarget);}
  function openColourPalette(target){speak('chooseColor','いろを えらんでね');paletteTarget=target;const groups=paletteGroups(),current=paletteCurrentColour();paletteGroup=Math.max(0,groups.findIndex(group=>group.colors.some(c=>c.hex?.toLowerCase()===current.toLowerCase())));openModal(`${closeMarkup()}<h2>いろを えらぼう</h2><div class="colour-workbench"><div class="colour-preview-column"><div id="colourGarmentPreview" class="colour-garment-preview"></div><div id="colourName" class="colour-name" aria-live="polite"></div></div><div class="colour-picker-column"><nav id="colourGroups" class="colour-groups" aria-label="いろの なかま"></nav><div id="colourChoices" class="colour-choices" aria-label="いろの みほん"></div></div></div><div class="modal-actions"><button class="action-button" data-colour-done>${icon('check')}<span>これに する</span></button></div>`,'colour-modal');renderColourPalette();}
  function renderColourPalette(){if(!$('#colourGroups'))return;const groups=paletteGroups();paletteGroup=Math.min(paletteGroup,groups.length-1);const current=paletteCurrentColour(),info=paletteColour(current);$('#colourGarmentPreview').innerHTML=palettePreview();$('#colourName').innerHTML=`<strong>${escapeAttr(info.label||info.reading||'')}</strong><span>${escapeAttr(info.reading||info.label||'')}</span>`;$('#colourGroups').innerHTML=groups.map((group,i)=>`<button class="colour-family ${i===paletteGroup?'selected':''}" data-colour-group="${i}" aria-label="${escapeAttr(group.label||group.id)}" aria-pressed="${i===paletteGroup}"><span style="background:linear-gradient(135deg,${[0,.25,.5,.75,1].map((n,j)=>{const colours=group.colors;return `${colours[Math.min(colours.length-1,Math.floor(n*(colours.length-1)))].hex} ${j*25}%`;}).join(',')})"></span>${i===paletteGroup?`<i>${icon('check')}</i>`:''}</button>`).join('');$('#colourChoices').innerHTML=groups[paletteGroup].colors.map((c,i)=>`<button class="colour-sample ${current.toLowerCase()===c.hex.toLowerCase()?'selected':''}" style="--swatch:${c.hex}" data-colour-choice="${i}" aria-label="${escapeAttr((c.label||'')+' '+(c.reading||''))}" aria-pressed="${current.toLowerCase()===c.hex.toLowerCase()}">${current.toLowerCase()===c.hex.toLowerCase()?icon('check'):''}</button>`).join('');}
  function openCasualStyle(kind,announce=true){if(kind==='color'){openColourPalette(casualPart);return;}const options=kind==='pattern'?[{id:'plain',label:'むじ'},{id:'stripes',label:'しましま'},{id:'dots',label:'みずたま'},{id:'flowers',label:'おはな'},{id:'check',label:'チェック'}]:[{id:'off',label:'リボンなし'},{id:'on',label:'リボンあり'}];const current=state.casual.styles[casualPart];openModal(`${closeMarkup()}<h2>${kind==='pattern'?'もようを えらぼう':'リボンを つけよう'}</h2><div class="casual-style-options ${kind==='ribbon'?'ribbon-options':''}">${options.map(option=>{const active=kind==='pattern'?current.pattern===option.id:current.ribbon===(option.id==='on'),style={...current,...(kind==='pattern'?{pattern:option.id}:{ribbon:option.id==='on'})};return `<button class="choice ${active?'selected':''}" data-casual-style="${kind}" data-style-value="${option.id}" aria-label="${option.label}" aria-pressed="${active}"><span class="choice-art">${casualThumbnail(casualPart,state.casual[casualPart],style)}</span>${active?`<span class="choice-check">${icon('check')}</span>`:''}</button>`;}).join('')}</div><div class="modal-actions"><button class="action-button" data-colour-done>${icon('check')}<span>これに する</span></button></div>`,'casual-style-modal');if(announce)speak(kind);}
  function persist() { try { localStorage.setItem(STORAGE,JSON.stringify(state)); } catch {} }
  function safeColor(c) { return typeof c === 'string' && /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(c) ? c : null; }
  function escapeAttr(value) { return String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])); }
  function paintedIcon(name) {
    const shapes={
      dress:'<path d="m32 14 16 8 16-8 12 16-15 11 22 41q-35 16-70 0l22-41-15-11Z" fill="#dd6f9a" stroke="#8e3c60" stroke-width="3"/><path d="m34 37 14 7 14-7-1 15q-13 8-26 0Z" fill="#f6b5c9"/><path d="m35 51-13 28q25 11 52 0L61 51q-13 7-26 0Z" fill="#ef9fbc"/><path d="M35 53 23 80m38-27 12 27M47 59v24" fill="none" stroke="#fff0d6" stroke-width="4"/><path d="M34 50q14 9 28 0" fill="none" stroke="#d7a33e" stroke-width="6"/><circle cx="48" cy="54" r="5" fill="#fff1b5" stroke="#ae7f2b" stroke-width="2"/><path d="m27 27 10 6m22 0 10-6" stroke="#ffe9f0" stroke-width="4" stroke-linecap="round"/>',
      hair:'<path d="M24 76C7 62 16 47 14 31 14 7 58 2 71 23c9 18-5 23 1 39q9 22-12 24-10-7-14-4-15 12-22-6Z" fill="#86553e" stroke="#573e36" stroke-width="3"/><path d="M30 19C9 37 39 51 24 72m17-58C20 35 50 54 34 80m18-62C37 37 62 51 51 77m12-49q-9 19 0 34" fill="none" stroke="#d09a5c" stroke-width="5" stroke-linecap="round"/><g transform="rotate(-23 65 64)"><rect x="51" y="29" width="15" height="55" rx="6" fill="#edc67c" stroke="#966431" stroke-width="3"/><path d="M65 38h16m-16 9h16m-16 9h16m-16 9h16m-16 9h16" stroke="#9f6630" stroke-width="5" stroke-linecap="round"/></g>',
      accessory:'<path d="m10 28 18 13L48 12l20 29 18-13-9 46q-29 15-58 0Z" fill="#e4b84f" stroke="#9c6a24" stroke-width="3"/><path d="m18 65 10-14 20 11 20-11 10 14" fill="none" stroke="#fff1a9" stroke-width="5"/><path d="m48 33 9 13-9 13-9-13Z" fill="#c63870" stroke="#fff2b7" stroke-width="3"/><circle cx="27" cy="49" r="5" fill="#75bfb4" stroke="#fff1b1" stroke-width="2"/><circle cx="69" cy="49" r="5" fill="#75bfb4" stroke="#fff1b1" stroke-width="2"/><path d="M22 75q26 11 52 0" fill="none" stroke="#fff1a9" stroke-width="4"/><circle cx="48" cy="13" r="5" fill="#f6d980" stroke="#aa792b" stroke-width="2"/>',
      background:'<path d="M17 85V38a31 31 0 0 1 62 0v47" fill="none" stroke="#598469" stroke-width="12"/><path d="M19 85V38a29 29 0 0 1 58 0v47" fill="none" stroke="#f5e5b7" stroke-width="5"/><path d="M27 86V45h42v41M48 45v41M27 61h42" fill="#fff3df" stroke="#b89869" stroke-width="4"/><path d="M30 87q18-9 36 0" stroke="#c7b38a" stroke-width="7"/><g fill="#67926a"><ellipse cx="14" cy="39" rx="7" ry="13" transform="rotate(-35 14 39)"/><ellipse cx="76" cy="21" rx="8" ry="13" transform="rotate(42 76 21)"/><ellipse cx="80" cy="67" rx="8" ry="15" transform="rotate(35 80 67)"/></g><g fill="#db7495" stroke="#a94e71" stroke-width="2"><circle cx="18" cy="24" r="10"/><circle cx="40" cy="11" r="10"/><circle cx="69" cy="14" r="10"/><circle cx="79" cy="47" r="10"/><circle cx="15" cy="64" r="10"/></g><g fill="#f8d27a"><circle cx="18" cy="24" r="4"/><circle cx="40" cy="11" r="4"/><circle cx="69" cy="14" r="4"/><circle cx="79" cy="47" r="4"/><circle cx="15" cy="64" r="4"/></g>',
      makeup:'<g transform="rotate(-14 43 50)"><path d="M27 46V24q1-11 22-17v39" fill="#c52e69" stroke="#802749" stroke-width="3"/><path d="M29 23q5-10 18-12" fill="none" stroke="#f18eae" stroke-width="4" stroke-linecap="round"/><rect x="23" y="43" width="30" height="39" rx="5" fill="#ddb552" stroke="#95602d" stroke-width="3"/><path d="M29 48v27" stroke="#fff0b2" stroke-width="5"/><path d="M24 68h28v16H24Z" fill="#8d3554" stroke="#672d46" stroke-width="3"/><path d="M29 73h18" stroke="#ca7895" stroke-width="3"/></g><g transform="rotate(14 75 64)"><rect x="64" y="35" width="24" height="51" rx="7" fill="#82304f" stroke="#5f2940" stroke-width="3"/><path d="M68 42v35" stroke="#bd6889" stroke-width="4" stroke-linecap="round"/><path d="M65 80h22" stroke="#e6c173" stroke-width="4"/></g>',
      stickers:'<path d="M15 11h66v53L61 85H15Z" fill="#fffbeb" stroke="#ad866b" stroke-width="3"/><path d="M61 85V64h20" fill="#ead6c5" stroke="#ad866b" stroke-width="3"/><path d="m51 17 8 19 20 2-15 14 4 20-17-10-17 10 4-20-15-14 20-2Z" fill="#e5b94f" stroke="#ae7627" stroke-width="2"/><path d="M18 64q10-7 15 3-5 19-17 10Z" fill="#e68aa7" stroke="#b45678" stroke-width="2"/>',
      blush:'<ellipse cx="42" cy="43" rx="30" ry="34" fill="#f9d2b1" stroke="#af7863" stroke-width="2.5"/><path d="M16 27q3-26 26-22 22-4 27 21-19 0-26-11-10 14-27 12Z" fill="#996446"/><path d="M27 41q5-8 10 0m12 0q5-8 10 0" fill="none" stroke="#6b4438" stroke-width="3.5" stroke-linecap="round"/><circle cx="25" cy="51" r="9" fill="#e96e91"/><circle cx="59" cy="51" r="9" fill="#e96e91"/><path d="M33 57q9 11 18 0" fill="#b34f64" stroke="#994457" stroke-width="2"/><g transform="rotate(35 74 64)"><rect x="68" y="44" width="12" height="46" rx="5" fill="#b44d78" stroke="#7c3653" stroke-width="2"/><rect x="66" y="37" width="16" height="16" rx="3" fill="#dfbc69"/><path d="M65 40C54 8 93 8 83 40Z" fill="#a96d54" stroke="#744b40" stroke-width="2"/><path d="M67 35q-6-17 5-17" fill="none" stroke="#e4ba95" stroke-width="4"/></g>',
      lip:'<g transform="translate(31 -2) scale(.77)"><path d="M27 46V24q1-11 22-17v39" fill="#c52e69" stroke="#802749" stroke-width="3"/><rect x="23" y="43" width="30" height="39" rx="5" fill="#ddb552" stroke="#95602d" stroke-width="3"/><path d="M29 48v27" stroke="#fff0b2" stroke-width="5"/><path d="M24 68h28v16H24Z" fill="#8d3554" stroke="#672d46" stroke-width="3"/><rect x="63" y="36" width="24" height="49" rx="6" fill="#82304f" stroke="#5f2940" stroke-width="3"/></g><path d="M6 65q13-15 24-9l8 4 8-4q12-6 24 9-33 38-64 0Z" fill="#d64f7e" stroke="#923652" stroke-width="3"/><path d="M9 65q29 9 58 0" fill="none" stroke="#8c3551" stroke-width="3"/><path d="M20 76q13 7 26 1" stroke="#f5aac0" stroke-width="4" stroke-linecap="round"/>',
      hand:'<path d="M22 78q-9-13-10-31-1-8 7-6l7 9V18q0-9 8-8 5 1 5 8v24-32q0-9 8-7 5 1 5 8v31-27q0-8 8-6 4 1 4 7v29-21q1-7 7-5 5 1 5 8v38q-1 26-25 27-19 1-29-14Z" fill="#f5c7a5" stroke="#ae7964" stroke-width="2.5"/><g stroke="#a35f73" stroke-width="1.3"><rect x="28" y="13" width="9" height="14" rx="4" fill="#de759d"/><rect x="41" y="7" width="9" height="15" rx="4" fill="#b29cd6"/><rect x="54" y="12" width="9" height="14" rx="4" fill="#6faeb9"/><rect x="67" y="23" width="8" height="13" rx="4" fill="#dca64f"/></g><g transform="rotate(10 76 75)"><rect x="64" y="62" width="25" height="28" rx="6" fill="#c171a0" stroke="#844568" stroke-width="2.5"/><rect x="70" y="45" width="13" height="21" rx="3" fill="#4e3b50"/><path d="M69 70v10" stroke="#f1b8d3" stroke-width="4" stroke-linecap="round"/></g>',
      foot:'<path d="M37 36q21-13 29 8 8 16 0 37-5 13-19 10-19-3-20-20-2-23 10-35Z" fill="#f5c7a5" stroke="#ae7964" stroke-width="2.5"/><g fill="#f5c7a5" stroke="#ae7964" stroke-width="2"><ellipse cx="33" cy="25" rx="14" ry="18"/><ellipse cx="51" cy="22" rx="10" ry="14"/><ellipse cx="66" cy="27" rx="8" ry="12"/><ellipse cx="77" cy="34" rx="7" ry="10"/><ellipse cx="84" cy="44" rx="6" ry="8"/></g><ellipse cx="33" cy="20" rx="9" ry="10" fill="#df789e"/><ellipse cx="51" cy="18" rx="6" ry="8" fill="#b69ed9"/><ellipse cx="66" cy="23" rx="5" ry="7" fill="#6fb8bb"/><ellipse cx="77" cy="31" rx="4" ry="6" fill="#e0b25a"/><ellipse cx="84" cy="41" rx="3.5" ry="5" fill="#df789e"/><g transform="rotate(36 17 67)"><rect x="11" y="48" width="12" height="25" rx="3" fill="#574452"/><path d="M17 70v17" stroke="#b88c68" stroke-width="5"/><path d="M11 82h12v10H11Z" fill="#cd638d"/></g>',
      save:'<g transform="rotate(-8 42 43)"><rect x="9" y="9" width="62" height="73" rx="5" fill="#fffaf0" stroke="#9b7662" stroke-width="3"/><path d="M16 17h48v48H16Z" fill="#b7d5ca"/><path d="M23 65 32 45h15l11 20Z" fill="#de7da2"/><circle cx="40" cy="34" r="12" fill="#f6cdaa"/><path d="M28 34q-2-21 13-18 15-2 12 18l-7-11-11 3Z" fill="#88563f"/><path d="m28 21 11-9 13 9" fill="#e7c169"/><path d="M23 73h31" stroke="#d7bbaa" stroke-width="4" stroke-linecap="round"/></g><path d="M74 47v29m-11-9 11 12 11-12M58 88h32" fill="none" stroke="#a86a29" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
      finish:'<path d="m27 59-7 33 19-9 12 10 8-34m1-2 14 33 5-18 16-5-24-22" fill="#c65e87" stroke="#8e3c61" stroke-width="3"/><path d="m48 7 9 8 13-1 3 12 11 7-5 12 2 13-12 4-8 10-13-4-13 4-8-10-12-4 2-13-5-12 11-7 3-12 13 1Z" fill="#e4b74b" stroke="#9f702a" stroke-width="3"/><circle cx="48" cy="39" r="24" fill="#fff0b6" stroke="#c89538" stroke-width="3"/><path d="m48 20 6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2Z" fill="#d39033"/>',
      undo:'<path d="M37 22 13 43l24 20V49h24q17 0 17 15 0 16-27 14" fill="none" stroke="#8d455b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="m37 22-24 21 24 20" fill="#8d455b"/>',
      sound:'<path d="M12 34h20L54 16v64L32 62H12Z" fill="#d8aa51" stroke="#8a592d" stroke-width="4"/><path d="M65 30q20 18 0 36m12-48q31 30 0 60" fill="none" stroke="#80505a" stroke-width="7" stroke-linecap="round"/>',
      'music-off':'<path d="M10 34h19L51 16v64L29 62H10Z" fill="#bca998" stroke="#8a7666" stroke-width="4"/><circle cx="73" cy="49" r="21" fill="#ba5770" stroke="#884254" stroke-width="3"/><path d="m61 37 24 24m0-24L61 61" stroke="#fff4e8" stroke-width="7" stroke-linecap="round"/>',
      'chevron-left':'<path d="M63 14 28 48l35 34" fill="none" stroke="#965568" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
      'chevron-right':'<path d="m33 14 35 34-35 34" fill="none" stroke="#965568" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
      camera:'<rect x="8" y="27" width="80" height="58" rx="12" fill="#d8839c" stroke="#8e4a63" stroke-width="3"/><path d="m28 27 9-15h24l9 15" fill="#edbbca" stroke="#8e4a63" stroke-width="3"/><circle cx="49" cy="54" r="22" fill="#f5dfca" stroke="#a96f64" stroke-width="3"/><circle cx="49" cy="54" r="16" fill="#648b9c" stroke="#375c73" stroke-width="3"/><circle cx="44" cy="48" r="6" fill="#d3ebee"/><rect x="71" y="35" width="10" height="6" rx="2" fill="#fff1bb"/>',
      photo:'<rect x="9" y="11" width="78" height="76" rx="7" fill="#fff7e8" stroke="#a87b63" stroke-width="3"/><rect x="17" y="19" width="62" height="52" rx="2" fill="#b6d8dd"/><circle cx="61" cy="32" r="9" fill="#f0cf77"/><path d="m17 65 19-27 19 23 9-12 15 17v5H17Z" fill="#6f9c7b"/><path d="M27 79h42" stroke="#d3b7a1" stroke-width="4" stroke-linecap="round"/>'
    };
    if(!shapes[name])return null;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">${shapes[name]}</svg>`;
  }
  function categoryVisual(name) {
    if(name==='background'&&window.PrincessOuting)return window.PrincessOuting.mapIcon();
    const png=assets().icons?.[name];return png?`<img class="category-asset" src="${escapeAttr(png)}" alt="">`:paintedIcon(name)||icon(name);
  }
  function icon(name) {
    if(name==='foot'&&assets().icons?.foot)return `<svg viewBox="0 0 100 100" aria-hidden="true"><image href="${escapeAttr(assets().icons.foot)}" width="100" height="100"/></svg>`;
    const painted=paintedIcon(name);if(painted)return painted;
    const native = art()?.icon?.(name);
    if (native && !native.includes('undefined')) return native;
    const p = {check:'m6 16 6 6 14-14',close:'m8 8 16 16M24 8 8 24',undo:'M9 11H3V5m0 6a12 12 0 1 1 1 15',sound:'m4 12 7 0 8-7v22l-8-7H4zM24 10q7 6 0 12',settings:'M16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12M16 3v4m0 18v4M3 16h4m18 0h4M7 7l3 3m12 12 3 3M7 25l3-3M22 10l3-3',camera:'M4 9h7l3-4h5l3 4h6v18H4zM16 13a5 5 0 1 0 0 10 5 5 0 0 0 0-10',save:'M7 4h18v24H7zM11 4v9h10V4M11 21h10v7',dress:'m10 3 6 4 6-4 4 7-6 4 8 15H4l8-15-6-4z',hair:'M5 28V13a11 11 0 0 1 22 0v15M10 20V10q6 6 13 1v9',accessory:'m4 25 1-17 7 7 4-12 4 12 7-7 1 17z',background:'M3 27h26M7 27V15h18v12M5 15l5-9 6 9 6-9 5 9M14 27v-7h4v7',makeup:'M5 20h22v10H5zM9 20V9a7 7 0 0 1 14 0v11M13 8h6',hand:'M6 28V16q0-3 3-3v-7q0-4 3-2v10-10q2-3 4 0v10-9q3-3 4 1v8-5q3-2 3 2v8l4-4q4 0 2 4l-7 12z',foot:'M9 30Q1 17 12 11q8-4 11 5t-5 14zM13 4v2m6-3v3m6-1v4m4 0v4',blush:'M4 17a12 12 0 1 0 24 0 12 12 0 0 0-24 0M8 20h4m8 0h4M11 13h1m8 0h1',lip:'M3 17q5-3 9-7l4 3 4-3 9 7q-13 15-26 0zM3 17h26',polish:'M10 16h12v14H10zM13 4h6v12h-6z',lock:'M8 14h16v15H8zM11 14V8a5 5 0 0 1 10 0v6',gift:'M4 13h24v16H4zM2 8h28v7H2zM16 8v21M16 8Q3 8 7 2q5-3 9 6Zm0 0q13 0 9-6-5-3-9 6Z',star:'m16 2 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z','chevron-left':'m20 6-10 10 10 10','chevron-right':'m12 6 10 10-10 10','zoom-in':'M14 4a10 10 0 1 0 0 20 10 10 0 0 0 0-20m7 17 8 8M14 9v10m-5-5h10','zoom-out':'M14 4a10 10 0 1 0 0 20 10 10 0 0 0 0-20m7 17 8 8M9 14h10',mirror:'M16 3v26M12 7 2 25h10zM20 7l10 18H20z',photo:'M3 5h26v23H3zM3 25l9-10 6 7 5-5 6 8M22 10h.1','music-off':'M5 5l22 22M12 20V6l14-3v15M12 20q-8-4-8 2t8-2M26 18q-8-4-8 2t8-2',heart:'M16 28C-6 14 5-3 16 9 27-3 38 14 16 28z'}[name] || 'm16 2 4 9 10 1-8 7 3 10-9-5-9 5 3-10-8-7 10-1z';
    return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
  }
  function stickerDrawing(id) {
    const painted=window.PrincessExtras?.sticker(id);if(painted)return painted;
    const drawings={flower:`<g fill="#e8b0bd" stroke="#cc8d9d" stroke-width="1">${Array.from({length:6},(_,i)=>`<ellipse cx="0" cy="-18" rx="11" ry="17" transform="rotate(${i*60})"/>`).join('')}<circle r="11" fill="#f5d98a" stroke="#d5b46f"/></g>`,star:'<path d="m0-34 10 22 24 3-18 17 5 24L0 20l-21 12 5-24-18-17 24-3z" fill="#f3d58b" stroke="#d4b575" stroke-width="2"/><path d="m0-24 6 15 17 2-13 11 4 17L0 12-14 21l4-17-13-11 17-2z" fill="#f9e6b2"/>',butterfly:'<path d="M0-5C-35-49-51-11-28 7-54 24-17 45 0 11 17 45 54 24 28 7 51-11 35-49 0-5" fill="#d3bce1" stroke="#b49aca" stroke-width="2"/><path d="M0-10v31M0-9q-13-14-15-10M0-9q13-14 15-10" fill="none" stroke="#a98b74" stroke-width="4" stroke-linecap="round"/><circle cx="-24" cy="-9" r="6" fill="#f6dce7"/><circle cx="24" cy="-9" r="6" fill="#f6dce7"/>',ribbon:'<path d="m-5 3-11 33-10-12-14 2 18-31m27 8 11 33 10-12 14 2-18-31" fill="#d891a8" stroke="#bd708c" stroke-width="2"/><path d="M-4-9C-48-47-47 22-4 8m8-17C48-47 47 22 4 8" fill="#e8adbf" stroke="#c786a0" stroke-width="2"/><ellipse rx="8" ry="12" fill="#f4c4d2" stroke="#c786a0" stroke-width="2"/>',heart:'<path d="M0 34C-66-3-30-52 0-18 30-52 66-3 0 34" fill="#eaa1b4" stroke="#cc839b" stroke-width="2"/><path d="M-26-13q5-12 16-5" fill="none" stroke="#ffd9e0" stroke-width="5" stroke-linecap="round"/>',gem:'<path d="m-21-29 42 0 15 22L0 34-36-7z" fill="#aed4d7" stroke="#8eb6c2" stroke-width="2"/><path d="m-21-29 7 22L0 34 14-7l7-22M-36-7h72M-14-7 0-29 14-7" fill="none" stroke="#e4f5ed" stroke-width="2"/>'};
    return drawings[id]||drawings.flower;
  }
  function stickerCard(id) {return `<svg viewBox="-55 -55 110 110" aria-hidden="true">${stickerDrawing(id)}</svg>`;}
  function eraserIcon() {return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m7 21 16-16q3-3 6 0l7 7q3 3 0 6L20 34h-9L4 27q-2-3 3-6Z" fill="#e4afbd" stroke="#bd8c9e" stroke-width="1.6"/><path d="m7 21 13 13h-9L4 27q-2-3 3-6Z" fill="#fffaf4" stroke="#c9b4a3" stroke-width="1.6"/><path d="m18 10 13 13" stroke="#f4ced7" stroke-width="2"/></svg>';}
  function giftIllustration(open=false) {
    return `<svg viewBox="0 0 240 240" aria-hidden="true"><ellipse cx="120" cy="220" rx="89" ry="11" fill="#a8816d" opacity=".1"/>${open?'<rect x="57" y="19" width="126" height="126" rx="54" fill="#dca8bc" stroke="#bb829c" stroke-width="3"/><ellipse cx="120" cy="81" rx="49" ry="50" fill="#f4edf5" stroke="#f6dbc7" stroke-width="5"/><path d="m91 92 45-47m-30 66 43-45" stroke="#fffaf7" stroke-width="10" opacity=".85"/><g transform="rotate(-13 74 133)"><rect x="65" y="100" width="13" height="62" rx="5" fill="#caaa76"/><path d="M64 101q-11-29 8-34 18 3 8 34Z" fill="#aa7d65"/><path d="M67 98q-7-22 5-26" fill="none" stroke="#cba88c" stroke-width="3"/></g><rect x="105" y="105" width="24" height="46" rx="5" fill="#d9b36f"/><path d="M109 105V78q0-7 15-13v40" fill="#ce7d95"/><rect x="143" y="117" width="29" height="37" rx="8" fill="#b8a3d5" stroke="#a88bc6" stroke-width="2"/><rect x="150" y="91" width="15" height="29" rx="4" fill="#ede0c8"/>':'<path d="M114 85C39 70 65 12 116 76m10 9C201 70 175 12 124 76" fill="#e7b0c4" stroke="#c38da6" stroke-width="3"/><path d="M116 76 77 125l-1-26-22 1 48-31m22 7 39 49 1-26 22 1-48-31" fill="#edc3d2" stroke="#c38da6" stroke-width="2"/>'}<rect x="41" y="137" width="158" height="73" rx="13" fill="#daa0b5" stroke="#ba829b" stroke-width="3"/><path d="M42 151h156v27q-77 24-156 0Z" fill="#ebbdcb"/><rect x="31" y="119" width="178" height="29" rx="9" fill="#efd0d9" stroke="#c99aa9" stroke-width="3"/><path d="M110 120h22v89h-22Z" fill="#e6c285"/><rect x="111" y="166" width="20" height="22" rx="6" fill="#f4e1b9" stroke="#c7a26d" stroke-width="2"/><path d="m120 171 2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="#c49a61"/><path d="m28 57 4 10 10 3-10 3-4 10-3-10-10-3 10-3m181 16 4 11 11 3-11 3-4 11-3-11-11-3 11-3" fill="#d9b46e"/></svg>`;
  }
  function cardItems(cat,mode=state.mode) {
    if(cat==='background')return outingEntries();
    if(cat==='accessory'&&mode==='casual')return [{id:'none',label:'はずす'},...((window.PrincessExtras?.cards?.accessory||FALLBACK_CARDS.accessory).filter(item=>['bow','flowers'].includes(item.id)))];
    const raw = cat==='hair'&&window.PrincessHair?.cards?window.PrincessHair.cards:art()?.cards?.[cat];
    const list = Array.isArray(raw) ? raw : FALLBACK_CARDS[cat];
    const result=list.map(x=>typeof x==='string'?{id:x,label:x}:x);
    if(cat==='dress'){const order=['ball','morning','afternoon','riding','stage','fairy','flower','moon','rose','rainbow'];result.sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));}
    return result;
  }
  function representativeColor(item) {
    const painted=assets().costume?.dresses?.[item?.id];if(painted?.baseColor)return painted.baseColor;
    const index={flower:1,rose:1,rainbow:2}[item?.id]||0,c=item?.colors?.[index]||item?.colors?.[0];return safeColor(typeof c==='string'?c:c?.color||c?.value)||state.dressColor;
  }
  function validateDesign() {
    for(const cat of ['dress','hair','face','accessory','background']) {
      if(!cardItems(cat,'princess').some(x=>x.id===state[cat])) state[cat]=cardItems(cat,'princess')[0].id;
    }
    state.casual=normalizeCasual(state.casual);
    for(const {id} of CASUAL_PARTS){const items=casualItems(id);if(!items.some(item=>item.id===state.casual[id]))state.casual[id]=items[0].id;}
  }
  function record() { history.push({design:clone(state),photo:photo?{...photo}:null}); if(history.length>30)history.shift(); }
  function change(fn, options = {}) {
    record(); fn(); persist(); renderDoll(); renderCloset(); renderHeader();
    if(options.sparkle!==false) sparkle();
    effect();
  }
  function renderHeader() {
    $('#undo').innerHTML=icon('undo'); $('#undo').disabled=!history.length;
    $('#sound').innerHTML=icon(state.sound?'sound':'music-off');
    $('#sound').setAttribute('aria-label',state.sound?'おとを けす':'おとを つける');
    $('#sound').setAttribute('aria-pressed',String(state.sound));
    $('#parents').innerHTML=icon('settings');
    $('.photo-icon').innerHTML=icon('camera');$('.done-icon').innerHTML=icon('finish');
    const shelf=$('#friends'),enabled=!!state.faceStudioEnabled&&studioReady();shelf.hidden=!enabled;shelf.classList.toggle('hidden',!enabled);
    if(enabled){$('.friend-book-icon',shelf).innerHTML='<svg width="38" height="36" viewBox="0 0 56 48" aria-hidden="true"><path d="M4 9q14-5 24 3 10-8 24-3v29q-14-5-24 3-11-8-24-3z" fill="#fbf2d7" stroke="#a47c65" stroke-width="2.6"/><path d="M28 12v27" fill="none" stroke="#c7a184" stroke-width="2"/><g fill="#deb39a" stroke="#916753" stroke-width="1.4"><circle cx="16" cy="21" r="6"/><circle cx="40" cy="21" r="6"/></g><path d="M8 34q8-15 16-1m8 0q8-15 16 0" fill="#d6a9b9" stroke="#af8293" stroke-width="1.5"/></svg>';const current=window.PrincessFriendBook.get(state.friendId);$('#friendName').textContent=!photo&&current?current.name+'と おしたく':'';}else $('#friendName').textContent='';
    renderPlayModes();
    renderStageLabel();
    window.PrincessMusic?.sync();
  }
  function renderStageLabel(){
    const label=$('#stageLabel'),provider=window.PrincessOuting,current=effectiveBackground(),place=category==='background'?provider?.destination?.(current,provider.regionFor(current)):null,guide=state.mode==='princess'?assets().dressGuide?.[state.dress]:null;
    label.classList.toggle('has-outing-guide',!!place);label.classList.toggle('has-dress-guide',!!guide&&!place);
    if(place){const reading=provider.distinctReading(place),ride=['amusement','ferris','carousel','coaster'].includes(place.id),picture=ride||!place.src?provider.landmark(place.id):`<img src="${escapeAttr(place.src)}" alt="">`;label.innerHTML=`<span class="stage-outing-guide"><span class="stage-outing-picture">${picture}</span><span class="stage-outing-copy"><strong>${escapeAttr(place.label)}</strong>${reading?`<small>${escapeAttr(reading)}</small>`:''}</span></span>`;return;}
    label.innerHTML=guide?`<span class="dress-guide"><strong>${escapeAttr(guide.label)}</strong><small>${escapeAttr(guide.occasion||'')}</small></span><i>✧</i>`:`<span>${state.mode==='casual'?'すきな ふくを えらんでね':'じゆうに えらんでね'}</span><i>✧</i>`;
  }
  function renderCategories() {
    $('#categories').innerHTML=CATEGORIES.map(c=>`<button class="category ${category===c.id?'active':''}" data-category="${c.id}" aria-label="${c.id==='dress'&&state.mode==='casual'?'おようふく':c.label}${c.id==='makeup'&&!state.unlocked?'、できたを おすと ひらく':''}" aria-pressed="${category===c.id}"><span class="category-icon">${c.id==='dress'&&state.mode==='casual'?casualModeIcon():c.id==='accessory'&&state.mode==='casual'?window.PrincessExtras?.card?.('accessory','bow')||casualToolIcon('ribbon'):categoryVisual(c.id)}</span><span class="category-label">${c.id==='dress'&&state.mode==='casual'?'おようふく':c.label}</span>${c.id==='makeup'&&!state.unlocked?`<span class="lock-dot">${icon('lock')}</span>`:''}</button>`).join('');
  }
  function renderDoll() {
    const options={...state,background:effectiveBackground(),accessory:effectiveAccessory(),transparentBackground:true,photoUrl:photo?.url||null,hairFit:photo?.hairFit,gardenImageDataUrl:assets().garden||undefined};
    const markup=art()?.render?.(options);
    $('#doll').innerHTML=markup||'<svg viewBox="0 0 600 800"><ellipse cx="300" cy="740" rx="180" ry="20" fill="#bb9e8030"/><path d="M245 330h110l150 370H95z" fill="#e7a5bb"/><ellipse cx="300" cy="205" rx="70" ry="88" fill="#f4ceb1"/><path d="M230 205q-15-150 70-140 95-10 70 140l-23-73q-80 35-95 0z" fill="#8a6045"/><circle cx="278" cy="204" r="4" fill="#76503c"/><circle cx="322" cy="204" r="4" fill="#76503c"/><path d="M285 238q15 12 30 0" fill="none" stroke="#ba7a79" stroke-width="3"/></svg>';
    const scene=effectiveBackground();$('#stage').dataset.background=scene;
    if(assets().scenes?.[scene])$('#stage').style.backgroundImage=`url("${assets().scenes[scene]}")`;
    else if(scene!=='garden'&&art()?.renderBackground){$('#stage').style.backgroundImage=`url("data:image/svg+xml,${encodeURIComponent(art().renderBackground({background:scene}))}")`;}else $('#stage').style.backgroundImage='';
    injectPhoto($('#doll'));
    addStickers($('#doll>svg'));
    if(!started&&$('#startPrincess'))$('#startPrincess').innerHTML=$('#doll').innerHTML;
    if(category==='makeup'&&makeupPart)syncMakeupPortrait();
  }
  function stageBounds() {
    const svg=$('#doll>svg'),stage=$('#stage');if(!svg?.getScreenCTM())return {x:0,y:0,width:600,height:800};
    const matrix=svg.getScreenCTM().inverse(),r=stage.getBoundingClientRect(),point=svg.createSVGPoint();point.x=r.left;point.y=r.top;const a=point.matrixTransform(matrix);point.x=r.right;point.y=r.bottom;const b=point.matrixTransform(matrix);return {x:a.x,y:a.y,width:b.x-a.x,height:b.y-a.y};
  }
  function addStickers(svg,bounds=stageBounds()) {
    if(svg&&state.stickers.length){const layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.setAttribute('class','sticker-layer');layer.innerHTML=state.stickers.map((s,index)=>{const x=Number.isFinite(s.nx)?bounds.x+s.nx*bounds.width:s.x,y=Number.isFinite(s.ny)?bounds.y+s.ny*bounds.height:s.y;return `<g data-sticker-index="${index}" transform="translate(${x} ${y}) scale(1.05)">${stickerDrawing(s.id)}</g>`;}).join('');svg.append(layer);}
  }
  function sceneMarkup(bounds=stageBounds()) {
    const container=document.createElement('div'),background=art().renderBackground({background:effectiveBackground(),gardenImageDataUrl:assets().garden||undefined});
    const backdrop=document.createElement('div');backdrop.innerHTML=background;const backdropSvg=$('svg',backdrop);backdropSvg.setAttribute('x',String(bounds.x));backdropSvg.setAttribute('y',String(bounds.y));backdropSvg.setAttribute('width',String(bounds.width));backdropSvg.setAttribute('height',String(bounds.height));backdropSvg.setAttribute('preserveAspectRatio','xMidYMid slice');
    const character=art().render({...state,background:effectiveBackground(),accessory:effectiveAccessory(),photoUrl:photo?.url||null,hairFit:photo?.hairFit,transparentBackground:true});
    container.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" width="${bounds.width}" height="${bounds.height}" role="img" aria-label="できあがった おひめさま">${backdrop.innerHTML}${character}</svg>`;injectPhoto(container);addStickers($('svg',container),bounds);return container.innerHTML;
  }
  function photoTransform(p=photo, center={x:300,y:210}) {
    const s=p?.scale||1; return `translate(${center.x+(p?.x||0)} ${center.y+(p?.y||0)}) scale(${p?.flip?-s:s} ${s}) translate(${-center.x} ${-center.y})`;
  }
  function photoSize(p){const aspect=p?.aspect||192/242;return {w:Math.max(192,242*aspect),h:Math.max(242,192/aspect)};}
  function injectPhoto(root,p=photo) {
    if(!p)return;
    const slot=$('#face-photo-slot',root); if(!slot)return;
    const unique='photo-clip-'+Math.random().toString(36).slice(2,9);
    const {w,h}=photoSize(p);
    slot.innerHTML=`<defs><clipPath id="${unique}"><ellipse cx="300" cy="210" rx="66" ry="83"/></clipPath></defs><g clip-path="url(#${unique})"><image class="fitted-photo" href="${escapeAttr(p.url)}" x="${300-w/2}" y="${210-h/2}" width="${w}" height="${h}" preserveAspectRatio="none" transform="${photoTransform(p)}"/></g>`;
  }
  function renderCloset() {
    if(category!=='makeup')hideMakeupPortrait();
    $('#closetBody').classList.toggle('makeup-shelf',category==='makeup');
    renderCategories(); $('#categoryTitle').textContent=TITLES[category];
    $('#wardrobeHint').textContent=category==='makeup'?(state.unlocked?'すきな いろで おめかし':'できた！で ひらくよ'):category==='stickers'?'タッチで ぺたん。もういちど タッチで はがせるよ':'すきな えを タッチ';
    const body=$('#closetBody');
    body.classList.toggle('outing-shelf',category==='background'&&!!window.PrincessOuting);
    body.classList.toggle('hair-shelf',category==='hair');body.classList.toggle('extra-shelf',category==='accessory');
    body.classList.toggle('casual-shelf',category==='dress'&&state.mode==='casual');
    if(category==='dress'&&state.mode==='casual'){renderCasual(body);return;}
    if(category==='makeup'){renderMakeup(body);return;}
    if(category==='background'&&window.PrincessOuting){renderOutings(body);return;}
    if(category==='hair'){renderHair(body);return;}
    if(category==='accessory'&&state.mode==='casual'){
      body.innerHTML=`<div class="cards casual-accessories">${cardItems('accessory').map(item=>`<button class="choice ${effectiveAccessory()===item.id?'selected':''}" data-casual-accessory="${item.id}" aria-label="${escapeAttr(item.label)}" aria-pressed="${effectiveAccessory()===item.id}"><span class="choice-art ${item.id==='none'?'no-accessory':''}">${item.id==='none'?casualToolIcon('ribbon')+'<b>×</b>':window.PrincessExtras?.card?.('accessory',item.id)||icon('accessory')}</span>${effectiveAccessory()===item.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`).join('')}</div>`;return;
    }
    if(category==='accessory'&&window.PrincessExtras){
      const ex=window.PrincessExtras,items=ex.cards[accessoryShelf],choiceKey=accessoryShelf==='shoes'?'shoes':'accessory';
      const tabs=['accessory','shoes'].map((s,i)=>`<button class="${accessoryShelf===s?'active':''}" data-extra-shelf="${s}" aria-pressed="${accessoryShelf===s}">${ex.card(s,i?(state.shoes||'ballet'):(state.accessory||'crown'))}<span>${i?'くつ':'かみかざり'}</span></button>`).join('');
      body.innerHTML=`<div class="extra-switch">${tabs}</div><div class="cards">${items.map(item=>`<button class="choice ${state[choiceKey]===item.id?'selected':''}" data-extra-choice="${item.id}" aria-label="${escapeAttr(item.label)}" aria-pressed="${state[choiceKey]===item.id}"><span class="choice-art">${ex.card(accessoryShelf,item.id)}</span>${state[choiceKey]===item.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`).join('')}</div>`;return;
    }
    if(category==='stickers'){body.innerHTML=`<div class="sticker-cards">${STICKERS.map(s=>`<button class="choice ${selectedSticker===s.id?'selected':''}" data-sticker="${s.id}" aria-label="${s.label}" aria-pressed="${selectedSticker===s.id}"><span class="choice-art">${stickerCard(s.id)}</span>${selectedSticker===s.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`).join('')}</div>`;return;}
    const items=cardItems(category), perPage=items.length>4?3:4, pages=Math.ceil(items.length/perPage);page=Math.min(page,pages-1);
    const selectedValue=category==='background'?effectiveBackground():state[category];
    const shown=items.slice(page*perPage,page*perPage+perPage);
    body.innerHTML=`<div class="cards">${shown.map(item=>{const representative=category==='dress'&&item.id!==state.dress?representativeColor(item):state.dressColor;return `<button class="choice ${selectedValue===item.id?'selected':''}" data-choice="${item.id}" aria-label="${escapeAttr(item.label||item.name||item.title||item.id)}" aria-pressed="${selectedValue===item.id}"><span class="choice-art">${art()?.card?.(category,item.id,{...state,color:representative,dressColor:representative})||icon(category)}</span><span class="card-name">${item.label||item.name||item.title||''}</span>${selectedValue===item.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`;}).join('')}${pages>1?`<button class="choice next-card" data-page="${page+1>=pages?-page:1}" aria-label="つぎの ドレス"><span class="next-card-icon">${icon('chevron-right')}</span><span class="card-name">つぎの ドレス</span><span class="next-card-dots">${Array.from({length:pages},(_,i)=>`<i class="${i===page?'current':''}"></i>`).join('')}</span></button>`:''}</div>${category==='dress'?colorsMarkup(dressColors(),state.dressColor,'dress'):''}`;
  }
  function dressColors() {
    const item=cardItems('dress').find(x=>x.id===state.dress);
    const candidates=(item?.colors||FALLBACK_CARDS.dress.find(x=>x.id===state.dress)?.colors||FALLBACK_CARDS.dress[0].colors).map(x=>typeof x==='string'?x:x.color||x.value).filter(safeColor);
    // Three generous color targets stay visible on the portrait iPad shelf.
    return candidates.slice(0,3);
  }
  function fitOutingMap(root){const frame=$('.outing-map-frame',root),board=$('.outing-board',root);if(!frame||!board)return;const width=Math.max(0,Math.floor(Math.min(frame.clientWidth,frame.clientHeight*4/3)));if(width){board.style.width=width+'px';board.style.height=width*.75+'px';}}
  function outingNeedsDialog(body){return Math.min(body.clientWidth*3/4,body.clientHeight-58)<200;}
  function renderOutings(body){const provider=window.PrincessOuting,current=effectiveBackground();if(outingRenderedScene!==current){outingRegion=provider.regionFor(current);outingRenderedScene=current;}outingRegion||=provider.regionFor(current);const compact=outingNeedsDialog(body);body.dataset.outingCompact=String(compact);body.innerHTML=provider.render({current,region:outingRegion,compact});if(!compact)fitOutingMap(body);$('#wardrobeHint').textContent=compact?'ちずを ひらいて おでかけ':'いきたい ところを タッチ';}
  function openOutingMap(){const provider=window.PrincessOuting;if(!provider)return;outingRegion||=provider.regionFor(effectiveBackground());openModal(`${closeMarkup()}<h2>どこへ いこう？</h2>${provider.render({current:effectiveBackground(),region:outingRegion,large:true})}`,'outing-modal');fitOutingMap($('#modal'));}
  let outingArrivalTimer;
  function showOutingArrival(item){const stage=$('#stage');if(!stage)return;window.clearTimeout(outingArrivalTimer);$('#outingArrival')?.remove();const card=document.createElement('div'),reading=window.PrincessOuting.distinctReading(item);card.id='outingArrival';card.className='outing-arrival';card.setAttribute('role','status');card.innerHTML=`<span class="outing-arrival-picture">${item.src?`<img src="${escapeAttr(item.src)}" alt="">`:window.PrincessOuting.landmark(item.id)}</span><span class="outing-arrival-copy"><strong>${escapeAttr(item.label)}</strong><small>${reading?escapeAttr(reading)+'に きたよ！':'ついたよ！'}</small></span>`;stage.append(card);outingArrivalTimer=window.setTimeout(()=>card.remove(),4600);}
  function travelOuting(id){const provider=window.PrincessOuting,item=provider?.get(id);if(!item)return;const arrival=provider.destination?.(id,outingRegion)||item;if($('#modal').classList.contains('outing-modal'))closeModal(false);outingRegion=provider.regionFor(id);change(()=>{if(state.mode==='casual')state.casual.background=id;else state.background=id;});showOutingArrival(arrival);speak(item.voiceKey,`${item.label}に来たよ！`);}
  function handleOutingClick(event){
    if(!window.PrincessOuting)return false;const target=event.target,go=target.closest('button[data-outing-go]');if(go){travelOuting(go.dataset.outingGo);return true;}
    const region=target.closest('button[data-outing-region]');if(region){outingRegion=region.dataset.outingRegion;if($('#modal').classList.contains('outing-modal'))openOutingMap();else renderCloset();effect();return true;}
    if(target.closest('[data-outing-expand]')){openOutingMap();effect();return true;}return false;
  }
  function hairColors() { return (window.PrincessHair?.colors||['#dfb965','#865947','#342f3b','#b6654d','#bfc2d2','#db9aaf','#a49acb','#83bdbc']).map(c=>typeof c==='string'?c:c.color||c.value).filter(safeColor); }
  function hairFamilies() {
    const supplied=window.PrincessHair?.families||assets().hairFamilies;
    return Array.isArray(supplied)&&supplied.length?supplied:[{id:'all',label:'かみがた',base:'long',styles:cardItems('hair').map(item=>item.id)}];
  }
  function currentHairFamily(){return hairFamilies().find(family=>family.styles.includes(state.hair))||hairFamilies()[0];}
  function hairFamilyItems(family=currentHairFamily()){const items=cardItems('hair');return family.styles.map(id=>items.find(item=>item.id===id)).filter(Boolean);}
  function hairPerPage(){return window.matchMedia('(orientation:portrait)').matches?4:2;}
  function hairPreview(id){const preview=art()?.card?.('hair',id,{...state});return preview?preview.replace(/viewBox="[^"]+"/,'viewBox="130 38 340 442"'):icon('hair');}
  function speakHairChoice(id){const item=cardItems('hair').find(item=>item.id===id);if(item?.voiceKey)speak(item.voiceKey,item.label);else speakNamedChoice('hair',id);}
  function renderHair(body) {
    const family=currentHairFamily();body.classList.toggle('hair-arranging',hairStep==='arrange');
    if(hairStep==='base'){
      body.innerHTML=`<div class="cards hair-base-cards">${hairFamilies().map(item=>`<button class="choice hair-base ${family.id===item.id?'selected':''}" data-hair-family="${escapeAttr(item.id)}" aria-label="${escapeAttr(item.label)}" aria-pressed="${family.id===item.id}"><span class="choice-art">${hairPreview(item.base)}</span><span class="hair-base-name">${escapeAttr(item.label)}</span>${family.id===item.id?`<span class="choice-check">${icon('check')}</span>`:''}<span class="hair-base-go">${icon('chevron-right')}</span></button>`).join('')}</div><div class="hair-palette">${colorsMarkup(hairColors(),state.hairColor,'hair')}</div>`;
      $('#categoryTitle').textContent='まず、かみがたを えらぼう';$('#wardrobeHint').textContent='えらぶと アレンジが ひらくよ';return;
    }
    const items=hairFamilyItems(family),perPage=hairPerPage(),pages=Math.max(1,Math.ceil(items.length/perPage));if(hairRenderedSelection!==state.hair){page=Math.max(0,Math.floor(items.findIndex(item=>item.id===state.hair)/perPage));hairRenderedSelection=state.hair;}page=Math.max(0,Math.min(page,pages-1));
    const back=`<button class="hair-base-back" data-hair-back aria-label="ベースの かみがたを えらびなおす"><span class="hair-back-arrow">${icon('chevron-left')}</span><span class="hair-back-preview">${hairPreview(family.base)}</span><span class="hair-back-label">かみがた</span></button>`;
    body.innerHTML=`<div class="hair-context">${back}<span class="hair-stage-title">${escapeAttr(family.label)}<small>アレンジを えらぼう</small></span></div><div class="hair-browser"><button class="hair-page" data-page="-1" aria-label="まえの アレンジ" ${page===0?'disabled':''}>${icon('chevron-left')}</button><div class="cards hair-cards">${items.slice(page*perPage,page*perPage+perPage).map(item=>`<button class="choice ${state.hair===item.id?'selected':''}" data-choice="${item.id}" aria-label="${escapeAttr(item.label||item.id)}" aria-pressed="${state.hair===item.id}"><span class="choice-art">${hairPreview(item.id)}</span>${item.id===family.base?'<span class="hair-loose-badge">そのまま</span>':''}${state.hair===item.id?`<span class="choice-check">${icon('check')}</span>`:''}</button>`).join('')}</div><button class="hair-page" data-page="1" aria-label="つぎの アレンジ" ${page===pages-1?'disabled':''}>${icon('chevron-right')}</button><div class="hair-page-mark" aria-label="${page+1} / ${pages}">${Array.from({length:pages},(_,i)=>`<i class="${page===i?'current':''}"></i>`).join('')}</div></div><div class="hair-palette">${colorsMarkup(hairColors(),state.hairColor,'hair')}</div>`;
    $('#categoryTitle').textContent='つぎは、アレンジ';$('#wardrobeHint').textContent='むすぶ？ あむ？ そのまま？';
  }
  function colorsMarkup(colors,selected,kind,clear=false) {
    return `<div class="colors ${kind==='nail'?'nail-colors':''} ${kind==='dress'?'dress-colors':''}" aria-label="いろ">${colors.map(c=>`<button class="color ${selected===c?'selected':''}" style="--swatch:${c}" data-color="${c}" data-color-kind="${kind}" aria-label="${colorName(c)}" aria-pressed="${selected===c}">${selected===c?icon('check'):''}</button>`).join('')}${clear?`<button class="color clear-color ${!selected?'selected':''}" data-color="clear" data-color-kind="${kind}" aria-label="おけしょうを とる">${eraserIcon()}</button>`:''}${kind==='dress'?`<button class="palette-open" data-open-dress-palette aria-label="たくさんの いろから えらぶ">${casualToolIcon('color')}</button>`:''}</div>`;
  }
  function colorName(color) {
    const namedColour=window.CoordArt?.palette?.flatMap(group=>group.colors||[]).find(item=>item.hex?.toLowerCase()===color?.toLowerCase());if(namedColour)return namedColour.reading||namedColour.label;
    const named={'#e99aa9':'ももいろ','#c48ec1':'むらさき','#b8b3e0':'うすむらさき','#82b5df':'あお','#83c9c1':'みどり','#e8bd72':'きんいろ','#dc7778':'あか','#f6eee1':'しろ','#dfb965':'はちみついろ','#865947':'くりいろ','#342f3b':'くろ','#b6654d':'あかちゃいろ','#bfc2d2':'ぎんいろ','#db9aaf':'ピンク','#a49acb':'ラベンダー','#83bdbc':'アクア'};if(named[color])return named[color];
    const hex=color.replace('#','');if(hex.length!==6)return 'いろを えらぶ';const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
    const hi=Math.max(r,g,b),lo=Math.min(r,g,b),ch=hi-lo;
    if(ch<14)return lo>217?'しろ':'はいいろ';
    const hue=((hi===r?(g-b)/ch:hi===g?(b-r)/ch+2:(r-g)/ch+4)*60+360)%360;
    if(hue>=326||hue<10)return 'ももいろ';if(hue<38)return 'オレンジ';if(hue<65)return 'きいろ';
    if(hue<168)return 'みどり';if(hue<205)return 'みずいろ';if(hue<246)return 'あお';return 'むらさき';
  }
  const MAKEUP_TOOLS=[{id:'blush',label:'チーク',picture:'blush',voice:'cheekPlay'},{id:'lip',label:'リップ',picture:'lip',voice:'lipPlay'},{id:'hands',label:'マニキュア',picture:'hand',voice:'manicurePlay'},{id:'feet',label:'ペディキュア',picture:'foot',voice:'pedicurePlay'}];
  let makeupFullView=false,makeupPortraitSerial=0;
  function makeupViewPicture(full=false) {
    return full?'<svg viewBox="0 0 80 96" aria-hidden="true"><path d="M30 43h20l16 36H14Z" fill="#e6a1b6" stroke="#a0657d" stroke-width="2.5"/><path d="M30 43 20 65m30-22 10 22M29 79v11m22-11v11" stroke="#e9ba98" stroke-width="7" stroke-linecap="round"/><circle cx="40" cy="25" r="18" fill="#f5ccaa" stroke="#ac7b65" stroke-width="2"/><path d="M22 24q-1-23 19-21 21 1 17 23l-10-14-13 8Z" fill="#976448"/><circle cx="34" cy="26" r="2" fill="#6c463b"/><circle cx="47" cy="26" r="2" fill="#6c463b"/><path d="M34 34q6 6 12 0" fill="none" stroke="#b86b78" stroke-width="2" stroke-linecap="round"/></svg>':'<svg viewBox="0 0 80 96" aria-hidden="true"><ellipse cx="40" cy="45" rx="27" ry="33" fill="#f6cba9" stroke="#ac7b65" stroke-width="2.5"/><path d="M13 42q-5-36 27-36 32 0 27 36L52 23q-17 17-39 19Z" fill="#976448"/><circle cx="30" cy="46" r="3" fill="#6c463b"/><circle cx="51" cy="46" r="3" fill="#6c463b"/><ellipse cx="22" cy="58" rx="8" ry="5" fill="#e785a1"/><ellipse cx="59" cy="58" rx="8" ry="5" fill="#e785a1"/><path d="M31 65q10 8 19 0" fill="none" stroke="#b95d78" stroke-width="3" stroke-linecap="round"/><path d="M58 75 70 88" stroke="#a67686" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="72" r="11" fill="#fff9ee88" stroke="#a67686" stroke-width="3"/></svg>';
  }
  function hideMakeupPortrait(normal=false) {
    if(normal)makeupFullView=true;
    $('#makeupPortrait')?.remove();$('#makeupViewSwitch')?.remove();
  }
  function syncMakeupPortrait() {
    const active=category==='makeup'&&state.unlocked&&['blush','lip'].includes(makeupPart)&&$('#modalBackdrop').classList.contains('hidden');
    if(!active){hideMakeupPortrait();return;}
    const stage=$('#stage'),source=$('#doll>svg');if(!source)return;
    let portrait=$('#makeupPortrait');if(!portrait){portrait=document.createElement('div');portrait.id='makeupPortrait';portrait.className='makeup-portrait';portrait.setAttribute('aria-label','おかおを おおきく みる');stage.append(portrait);}
    portrait.classList.toggle('hidden',makeupFullView);
    if(!makeupFullView){const svg=source.cloneNode(true),prefix='makeup-close-'+(++makeupPortraitSerial)+'-';svg.setAttribute('viewBox','190 105 220 275');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.removeAttribute('role');svg.setAttribute('aria-hidden','true');portrait.innerHTML=svg.outerHTML.replace(/\bid="([^"]+)"/g,(_,id)=>'id="'+prefix+id+'"').replace(/url\(#([^)]+)\)/g,(_,id)=>'url(#'+prefix+id+')');}
    let controls=$('#makeupViewSwitch');if(!controls){controls=document.createElement('div');controls.id='makeupViewSwitch';controls.className='makeup-view-switch';controls.setAttribute('aria-label','おかおと ぜんしんを みくらべる');stage.append(controls);}
    controls.innerHTML=[{full:false,label:'おかお'},{full:true,label:'ぜんしん'}].map(v=>'<button class="makeup-view-button '+(makeupFullView===v.full?'selected':'')+'" data-makeup-view="'+(v.full?'full':'face')+'" aria-label="'+v.label+'を みる" aria-pressed="'+(makeupFullView===v.full)+'">'+makeupViewPicture(v.full)+'<span>'+v.label+'</span></button>').join('');
    $$('[data-makeup-view]',controls).forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();makeupFullView=button.dataset.makeupView==='full';syncMakeupPortrait();effect();}));
  }
  function makeupColour(hex) {
    const defaults={'#eb91a3':['ローズピンク','ろーずぴんく','swatchPink09'],'#eaa481':['ピーチコーラル','ぴーちこーらる','cosmeticPeachCoral'],'#dca0ba':['モーヴピンク','もーゔぴんく','cosmeticMauvePink'],'#d87d94':['ローズ','ろーず','cosmeticRose'],'#c85f7f':['ベリーローズ','べりーろーず','cosmeticBerryRose'],'#e39a83':['コーラル','こーらる','cosmeticCoral']},known=defaults[hex?.toLowerCase()];
    return known?{hex,label:known[0],reading:known[1],voiceKey:known[2]}:paletteColour(hex);
  }
  function makeupSwatch(hex,kind,selected) {
    const named=makeupColour(hex),label=named.reading||named.label||colorName(hex);
    return '<button class="color makeup-swatch '+(selected===hex?'selected':'')+'" style="--swatch:'+hex+'" data-color="'+hex+'" data-color-kind="'+kind+'" aria-label="'+escapeAttr(label)+'" aria-pressed="'+(selected===hex)+'">'+(selected===hex?icon('check'):'')+'</button>';
  }
  function makeupExploreColours() {
    const all=paletteGroups().flatMap(group=>group.colors||[]).filter(item=>safeColor(item.hex));
    const ordered=labels=>labels.map(label=>all.find(item=>item.label===label)).filter(Boolean);
    const gentle=ordered(['桜色','桃色','ベビーピンク','サーモンピンク','コーラルピンク','オールドローズ','ローズピンク','ピーチピンク','珊瑚色','撫子色']);
    const vivid=ordered(['フューシャ','ラベンダー','プラム','ロイヤルブルー','黒','黄金色','ターコイズブルー']);
    return [...new Map([...gentle,...vivid,...all].map(item=>[item.hex.toLowerCase(),item])).values()];
  }
  function renderMakeup(body) {
    body.classList.add('makeup-shelf');
    if(!state.unlocked){hideMakeupPortrait();body.innerHTML='<div class="locked-content"><div class="gift-preview">'+giftIllustration()+'</div><div><p>おけしょうばこが<br>とどくよ</p><button class="done-button gift-finish" data-first-done aria-label="できた！ おけしょうばこを もらう">'+icon('finish')+'<span>できた！</span></button></div></div>';return;}
    if(!makeupPart){hideMakeupPortrait();body.innerHTML='<div class="makeup-cards">'+MAKEUP_TOOLS.map(m=>'<button class="makeup-choice" data-makeup="'+m.id+'" aria-label="'+m.label+'">'+icon(m.picture)+'<span class="makeup-label">'+m.label+'</span></button>').join('')+'</div>';return;}
    const old=$('.makeup-palette-scroll',body),scroll=old?.dataset.part===makeupPart?{x:old.scrollLeft,y:old.scrollTop}:{x:0,y:0},selected=state.makeup[makeupPart],title=MAKEUP_TOOLS.find(m=>m.id===makeupPart)?.label||'メイク',standard=makeupPart==='blush'?BLUSHES:LIPS,extras=makeupExploreColours(),named=selected?makeupColour(selected):null;
    const current='<div class="makeup-current-colour" aria-live="polite"><i style="--swatch:'+(selected||'transparent')+'"></i><b>'+(named?escapeAttr(named.label||named.reading):'いろなし')+'</b>'+(named?.reading?'<small>'+escapeAttr(named.reading)+'</small>':'')+'</div>';
    body.innerHTML='<div class="makeup-palette-panel"><div class="makeup-palette-top"><button class="makeup-back" data-makeup-back aria-label="おけしょうの たなに もどる">'+icon('chevron-left')+'<span>'+title+'</span></button><span class="makeup-palette-title">'+icon(makeupPart)+'<b>'+title+'</b></span></div><div class="makeup-standard-colours" aria-label="ていばんの いろ">'+standard.map(hex=>makeupSwatch(hex,makeupPart,selected)).join('')+'<button class="color clear-color makeup-swatch '+(!selected?'selected':'')+'" data-color="clear" data-color-kind="'+makeupPart+'" aria-label="'+title+'を とる" aria-pressed="'+!selected+'">'+eraserIcon()+'</button></div>'+current+'<div class="makeup-explore-title"><span>'+casualToolIcon('color')+'</span><span>もっと いろいろ</span><i aria-hidden="true">↕</i></div><div class="makeup-palette-scroll" data-part="'+makeupPart+'" tabindex="0" aria-label="たくさんの いろ。たてに うごかせるよ"><div class="makeup-explore-grid">'+extras.map(item=>makeupSwatch(item.hex,makeupPart,selected)).join('')+'</div></div></div>';
    const scroller=$('.makeup-palette-scroll',body);scroller.scrollLeft=scroll.x;scroller.scrollTop=scroll.y;$('#wardrobeHint').textContent='おかおと ぜんしんを みくらべよう';syncMakeupPortrait();
  }
  function sparkle() {
    const doll=$('#doll');doll.classList.remove('bounce');void doll.offsetWidth;doll.classList.add('bounce');
    $('#sparkles').innerHTML=Array.from({length:7},(_,i)=>`<span class="sparkle" style="--x:${22+Math.random()*56}%;--y:${15+Math.random()*60}%;animation-delay:${i*.035}s">${icon('star')}</span>`).join('');
    setTimeout(()=>{$('#sparkles').innerHTML='';},1300);
  }
  function toast(text) { clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400); }
  function ensureAudio() { if(!state.sound)return;try{audioContext ||= new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();}catch{} }
  function effect(kind='select') {
    if(!state.sound||!started)return;ensureAudio();if(!audioContext)return;
    try{const now=audioContext.currentTime;const notes=kind==='done'?[523.25,659.25,783.99,1046.5]:[660,880];notes.forEach((n,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type='sine';osc.frequency.value=n;gain.gain.setValueAtTime(0,now+i*.075);gain.gain.linearRampToValueAtTime(.055,now+i*.075+.012);gain.gain.exponentialRampToValueAtTime(.001,now+i*.075+.2);osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+i*.075);osc.stop(now+i*.075+.22);});}catch{}
  }
  function stopVoice() {voiceCleanup?.();voiceCleanup=null;voiceAudio?.pause();}
  function speak(key, text) {
    if(!state.sound||!started)return;stopVoice();
    const phrase=text||SPEECH[key]||key;
    const normalize=s=>String(s).replace(/[\s、。！？!?・]/g,''),recordedKey=assets().voices?.[key]?key:assets().phraseKeys?.[normalize(phrase)],recording=assets().voices?.[recordedKey];
    if(recording){
      const audio=voiceAudio ||= document.getElementById('maoVoice')||new Audio();audio.src=recording;audio.volume=.85;
      const token=window.PrincessMusic?.voiceStart();let live=true;
      const finish=()=>{if(!live)return;live=false;for(const type of ['ended','error','pause'])audio.removeEventListener(type,onStop);window.PrincessMusic?.voiceEnd(token);if(voiceCleanup===finish)voiceCleanup=null;};
      const onStop=()=>{if(audio.ended||audio.error||audio.paused)finish();};
      voiceCleanup=finish;for(const type of ['ended','error','pause'])audio.addEventListener(type,onStop);
      try{audio.play()?.catch(finish);}catch{finish();}
    }
  }
  function selectedPage(cat){if(cat==='hair')return Math.max(0,Math.floor(hairFamilyItems().findIndex(item=>item.id===state.hair)/hairPerPage()));if(cat==='dress'&&state.mode==='casual'){const items=casualItems(casualPart);return Math.max(0,Math.floor(items.findIndex(x=>x.id===state.casual[casualPart])/(items.length>4?3:4)));}return cat==='dress'?Math.max(0,Math.floor(cardItems(cat).findIndex(x=>x.id===state[cat])/3)):0;}
  function setCategory(cat) { category=cat;if(cat==='background')outingRegion=window.PrincessOuting?.regionFor(effectiveBackground())||'world';if(cat==='hair')hairStep='base';page=selectedPage(cat);makeupPart=null;renderCloset();renderStageLabel();speak(cat==='hair'?'hairChooseBase':cat==='makeup'&&!state.unlocked?'locked':cat==='dress'&&state.mode==='casual'?'casualMode':cat==='stickers'?'stickerHow':cat);effect();if(cat==='background'&&$('#closetBody').dataset.outingCompact==='true')openOutingMap(); }

  function openModal(markup, extraClass='', afterClose=null) {
    hideMakeupPortrait(true);
    closeModal(false);const modal=$('#modal');modal.className='modal '+extraClass;modal.innerHTML=markup;$('#modalBackdrop').classList.remove('hidden');modalAfterClose=afterClose;
    const close=$('.modal-close',modal);if(close)close.focus({preventScroll:true});
  }
  function closeModal(follow=true) {
    if(follow)stopVoice();
    if(modalCleanup){modalCleanup();modalCleanup=null;}
    stopCamera();$('#modalBackdrop').classList.add('hidden');$('#modal').innerHTML='';
    const next=modalAfterClose;modalAfterClose=null;if(follow&&next)next();
  }
  const closeMarkup=()=>`<button class="modal-close" data-close aria-label="とじる">${icon('close')}</button>`;
  function studioReady(){return Boolean(window.PrincessFriendBook&&window.PrincessFaceDesk&&window.PrincessFaceStudio?.render&&assets().faceStudio?.skin?.src);}
  function friendHair(person){
    const byFace={gentle:['long','#865947'],smile:['bob-straight','#b6654d'],sparkle:['soft-loose','#342f3b'],rosy:['braid','#865947']};
    const pair=byFace[person.face]||byFace.gentle;return {hair:person.hair||pair[0],hairColor:person.hairColor||pair[1]};
  }
  function identity(d,person){d.friendId=person.id;d.face=person.face;d.faceOptions=person.options?{...person.options,enabled:true}:{enabled:false};}
  function swapFriend(person,{keepPhoto=false}={}){
    const book=window.PrincessFriendBook;if(!person||!book)return;
    if(person.id!==state.friendId){
      book.rememberLook(state.friendId||'cast-gentle',state);
      const sharedBackground=effectiveBackground(),look=book.getLook(person.id)||{},dressDefaults={};
      for(const key of ['dress','dressColor','shoes','accessory','makeup','nails'])dressDefaults[key]=clone(DEFAULT[key]);
      Object.assign(state,dressDefaults,friendHair(person),look);state.casual=normalizeCasual(look.casual||{});
      if(state.mode==='casual')state.casual.background=sharedBackground;
    }
    identity(state,person);if(!keepPhoto)photo=null;
  }
  function meetFriend(person,isNew=false){
    if(!state.faceStudioEnabled||!person)return;
    closeModal();change(()=>swapFriend(person));
    speak(isNew||!person.options?(person.voiceKey||'faceStudioApply'):'friendsReturn');toast(person.name+'が あそびに きたよ');
  }
  function openFaceDesk(){
    const book=window.PrincessFriendBook;if(!state.faceStudioEnabled||!studioReady())return;
    window.PrincessFaceDesk.open({state,candidate:book.next(),card:(...args)=>art().card(...args),show:openModal,close:closeModal,back:openFaceMenu,say:speak,
      commit:options=>meetFriend(book.create(options),true)});
  }
  function openFaceMenu(){
    if(!state.faceStudioEnabled||!studioReady())return;
    const book=window.PrincessFriendBook,custom=book.list();
    const cardFor=person=>{
      const look=book.getLook(person.id)||{},selected=state.friendId===person.id&&!photo;
      const visual={...friendHair(person),...look,face:person.face,faceStudioEnabled:!!person.options,faceOptions:person.options||{enabled:false},photoUrl:null};
      const drawing=art().card('face',person.face,visual);
      return '<button class="guest-card" data-guest-id="'+escapeAttr(person.id)+'" aria-label="'+escapeAttr(person.name)+'と あそぶ" aria-pressed="'+selected+'"><span>'+drawing+'</span><b>'+escapeAttr(person.name)+'</b></button>';
    };
    const opener='<button class="invite-friend" data-open-face-desk>'+window.PrincessFaceDesk.symbol('looks')+'<b>新しい おともだちを むかえる</b><i>＋</i></button>';
    openModal(closeMarkup()+'<h2>おともだちの えほん</h2><p class="guest-question">きょうは だれと あそぶ？</p>'+opener+'<div class="guest-pages">'+(custom.length?'<h3>むかえた おともだち</h3><div class="guest-grid">'+custom.slice().reverse().map(cardFor).join('')+'</div>':'')+'<h3>アトリエの なかま</h3><div class="guest-grid">'+book.cast.map(cardFor).join('')+'</div></div>','guest-modal');
    speak('face');
  }
  function openCompletion() {
    $('#doll').classList.remove('bounce');
    const first=!state.unlocked;if(first){state.unlocked=true;persist();renderCloset();}
    effect('done');speak('done');
    openModal(`${closeMarkup()}<h2>すてきな おひめさま！</h2><div class="keepsake" id="keepsake"></div><p class="celebration-subtitle">きょうの おきにいり</p><div class="modal-actions"><button class="action-button secondary" data-save>${icon('save')}<span>しゃしんを のこす</span></button><button class="action-button" data-continue>${first?giftIllustration():icon('heart')}<span>${first?'プレゼントを ひらく':'もっと あそぶ'}</span></button></div>`,'celebration-modal',first?openGift:null);
    const bounds=stillKeepsakeBounds(),ratio=bounds.width/bounds.height,w=Math.min(650,window.innerWidth-105,window.innerHeight*.52*ratio);
    $('#keepsake').style.width=w+'px';$('#keepsake').style.height=(w/ratio)+'px';$('#keepsake').innerHTML=sceneMarkup(bounds);
    const saved=savedKeepsakeCompositions.get(keepsakeCompositionKey());if(saved&&knownPixelFingerprints().has(saved))markKeepsakeSaved($('[data-save]'),true);
  }
  function openGift() {
    speak('gift');effect('done');openModal(`${closeMarkup()}<h2>おけしょうばこが<br>とどいたよ！</h2><div class="big-gift">${giftIllustration(true)}</div><p>ほっぺも、つめも。<br>すきな いろで おめかし しよう。</p><div class="modal-actions"><button class="action-button" data-open-makeup>${icon('makeup')}<span>あけてみる</span></button></div>`,'gift-modal');
  }
  function sha256Bytes(bytes) {
    const constants=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
    const hash=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const padded=new Uint8Array(Math.ceil((bytes.length+9)/64)*64),view=new DataView(padded.buffer),words=new Uint32Array(64);
    padded.set(bytes);padded[bytes.length]=128;const bits=bytes.length*8;
    view.setUint32(padded.length-8,Math.floor(bits/4294967296));view.setUint32(padded.length-4,bits>>>0);
    const rotate=(n,s)=>(n>>>s)|(n<<(32-s));
    for(let offset=0;offset<padded.length;offset+=64){
      for(let i=0;i<16;i++)words[i]=view.getUint32(offset+i*4);
      for(let i=16;i<64;i++){const a=words[i-15],b=words[i-2],s0=rotate(a,7)^rotate(a,18)^(a>>>3),s1=rotate(b,17)^rotate(b,19)^(b>>>10);words[i]=(words[i-16]+s0+words[i-7]+s1)>>>0;}
      let [a,b,c,d,e,f,g,h]=hash;
      for(let i=0;i<64;i++){const sum1=rotate(e,6)^rotate(e,11)^rotate(e,25),choose=(e&f)^(~e&g),t1=(h+sum1+choose+constants[i]+words[i])>>>0,sum0=rotate(a,2)^rotate(a,13)^rotate(a,22),majority=(a&b)^(a&c)^(b&c),t2=(sum0+majority)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
      [a,b,c,d,e,f,g,h].forEach((n,i)=>hash[i]=(hash[i]+n)>>>0);
    }
    return [...hash].map(n=>n.toString(16).padStart(8,'0')).join('');
  }
  async function fingerprintCanvas(canvas) {
    const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    const bytes=new Uint8Array(8+pixels.length),dimensions=new DataView(bytes.buffer);
    dimensions.setUint32(0,canvas.width);dimensions.setUint32(4,canvas.height);bytes.set(pixels,8);
    let hex;
    if(globalThis.crypto?.subtle){try{const digest=await globalThis.crypto.subtle.digest('SHA-256',bytes);hex=[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');}catch{}}
    return 'px1:'+(hex||sha256Bytes(bytes));
  }
  function knownPixelFingerprints() {
    try {const stored=JSON.parse(localStorage.getItem(SAVED_PIXELS_STORAGE)||'[]');if(Array.isArray(stored))for(const hash of stored)if(typeof hash==='string'&&/^px1:[0-9a-f]{64}$/.test(hash))savedPixelFingerprints.add(hash);}catch{}
    return savedPixelFingerprints;
  }
  function keepsakeCompositionKey() {
    const {sound,bgm,unlocked,friendId,faceStudioEnabled,faceOptions,...visual}=state;let picture=null;
    if(faceStudioEnabled&&faceOptions?.enabled&&!photo)visual.faceOptions=faceOptions;
    if(photo){if(!keepsakePhotoIds.has(photo.url))keepsakePhotoIds.set(photo.url,keepsakePhotoIds.size+1);picture={...photo,url:keepsakePhotoIds.get(photo.url)};}
    return JSON.stringify({visual,picture,bounds:stillKeepsakeBounds()});
  }
  function stillKeepsakeBounds() {
    // Selection feedback is temporary; never bake its bounce transform into a keepsake.
    $('#doll').classList.remove('bounce');
    return Object.fromEntries(Object.entries(stageBounds()).map(([key,value])=>[key,Math.round(value*10000)/10000]));
  }
  function rememberPixelFingerprint(hash) {
    const known=knownPixelFingerprints();if(known.has(hash))return null;
    let previous=null,persisted=false;
    // Only one-way pixel digests are persisted; a private/full store falls back to this page's memory.
    try{previous=localStorage.getItem(SAVED_PIXELS_STORAGE);localStorage.setItem(SAVED_PIXELS_STORAGE,JSON.stringify([...known,hash]));persisted=true;}catch{}
    known.add(hash);
    return ()=>{known.delete(hash);if(persisted)try{if(previous===null)localStorage.removeItem(SAVED_PIXELS_STORAGE);else localStorage.setItem(SAVED_PIXELS_STORAGE,previous);}catch{}};
  }
  function markKeepsakeSaved(button,already=false) {
    if(!button)return;button.disabled=true;button.classList.add('save-is-complete');
    button.setAttribute('aria-label','この しゃしんは ほぞんずみ');
    button.innerHTML=`<span class="saved-action-icon">${icon('photo')}<i>${icon('check')}</i></span><span>${already?'もう のこしてあるよ':'のこしたよ'}</span>`;
  }
  async function saveKeepsake() {
    if(keepsakeSaveInFlight)return;
    keepsakeSaveInFlight=true;
    const button=$('[data-save]');if(button){button.disabled=true;button.innerHTML=icon('sparkles')+'<span>つくっているよ…</span>';}
    const compositionKey=keepsakeCompositionKey();
    let rollback=null,downloadUrl=null,anchor=null,didSave=false,alreadySaved=false;
    try {
      const bounds=stillKeepsakeBounds(),container=document.createElement('div');container.innerHTML=sceneMarkup(bounds);const source=$('svg',container);if(!source)throw Error('no svg');const svg=source.cloneNode(true),ratio=bounds.width/bounds.height;svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','930');svg.setAttribute('height',String(930/ratio));
      // Every image in an exported SVG must be embedded so file: launch stays self-contained.
      const embeds=new Map();
      const inlineImage=src=>{
        if(src.startsWith('data:image/'))return src;
        const original=window.PrincessEmbeddedImage?.(src);if(original)return original;
        if(!/^assets\/[a-z0-9_./-]+\.(png|webp)$/i.test(src)||src.includes('..'))throw Error('Unexpected artwork URL');
        if(!embeds.has(src))embeds.set(src,(async()=>{const result=await fetch(src);if(!result.ok)throw Error('Missing artwork: '+src);const bytes=await result.blob();return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(bytes);});})());
        return embeds.get(src);
      };
      await Promise.all($$('image',svg).map(async img=>img.setAttribute('href',await inlineImage(img.getAttribute('href')||img.getAttribute('xlink:href')||''))));
      const serialized=new XMLSerializer().serializeToString(svg),url=URL.createObjectURL(new Blob([serialized],{type:'image/svg+xml;charset=utf-8'}));
      const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
      const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=Math.round(930/ratio+140);const ctx=canvas.getContext('2d');
      ctx.fillStyle='#fffaf4';ctx.fillRect(0,0,canvas.width,canvas.height);const grad=ctx.createLinearGradient(0,35,0,canvas.height-100);grad.addColorStop(0,'#f8eddb');grad.addColorStop(1,'#eed7df');ctx.fillStyle=grad;ctx.fillRect(35,35,930,canvas.height-140);ctx.drawImage(image,35,35,930,930/ratio);URL.revokeObjectURL(url);
      ctx.textAlign='center';ctx.fillStyle='#ac7e83';ctx.font='24px serif';ctx.fillText('✧  おひめさまの アトリエ  ✧',500,canvas.height-39);
      const fingerprint=await fingerprintCanvas(canvas);
      if(knownPixelFingerprints().has(fingerprint)){alreadySaved=true;savedKeepsakeCompositions.set(compositionKey,fingerprint);markKeepsakeSaved(button,true);toast('この しゃしんは もう のこしてあるよ');return;}
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('no blob');
      const file=new File([blob],'おひめさまのアトリエ.png',{type:'image/png'});
      downloadUrl=URL.createObjectURL(blob);anchor=document.createElement('a');anchor.href=downloadUrl;anchor.download=file.name;document.body.append(anchor);
      rollback=rememberPixelFingerprint(fingerprint);
      if(!rollback){alreadySaved=true;markKeepsakeSaved(button,true);toast('この しゃしんは もう のこしてあるよ');return;}
      anchor.click();didSave=true;rollback=null;savedKeepsakeCompositions.set(compositionKey,fingerprint);markKeepsakeSaved(button);
      const releaseUrl=downloadUrl;setTimeout(()=>URL.revokeObjectURL(releaseUrl),60000);downloadUrl=null;
      // iPad can also save the generated picture with the system's long-press menu.
      try{const keepsake=button?.isConnected&&$('[data-save]')===button?$('#keepsake'):null;if(keepsake){keepsake.innerHTML=`<img class="saved-image" src="${canvas.toDataURL('image/png')}" alt="できあがった おひめさまの しゃしん">`;keepsake.classList.add('exported');const subtitle=$('.celebration-subtitle');if(subtitle){subtitle.textContent='がぞうを ながおし しても ほぞんできるよ';subtitle.classList.add('save-hint');}}}catch{}
      speak('saved');toast('しゃしんが できたよ');
    } catch(error) {
      if(rollback)rollback();
      if(!didSave){if(button){button.disabled=false;button.classList.remove('save-is-complete');button.innerHTML=icon('save')+'<span>もういちど</span>';}toast('ほぞんできませんでした。もういちど おしてね。');console.warn('Keepsake export unavailable',error);}
    } finally {
      anchor?.remove();if(downloadUrl)URL.revokeObjectURL(downloadUrl);
      keepsakeSaveInFlight=false;
      if(didSave||alreadySaved)markKeepsakeSaved(button,alreadySaved);
    }
  }
  window.addEventListener('pagehide',()=>{savedKeepsakeCompositions.clear();keepsakePhotoIds.clear();});
  function openPhotoMenu() {
    speak('photo');
    openModal(`${closeMarkup()}<h2>しゃしんで おしたく</h2>${photo?`<button class="photo-adjust" data-adjust-photo><span class="photo-adjust-thumb"><img src="${escapeAttr(photo.url)}" alt=""></span><span class="photo-adjust-icon">${icon('zoom-in')}</span><span>あわせなおす</span></button>`:''}<div class="photo-options"><button class="photo-option" data-sample><span class="sample-face-thumb"><img src="${assets().sample||'assets/sample-face.png'}" alt=""></span><span>おためし</span></button><button class="photo-option" data-file>${icon('photo')}<span>しゃしん</span></button><button class="photo-option" data-camera>${icon('camera')}<span>カメラ</span></button></div>${photo?`<button class="photo-remove" data-remove-photo>しゃしんを はずす</button>`:''}<p class="privacy-note">しゃしんは この がめんの なかだけ。<br>アプリを とじると きえます。</p>`,'photo-menu');
  }
  async function useSample() {
    let url=assets().sample;
    if(!url)url='assets/sample-face.png';
    try{await loadPhotoUrl(url,{y:18});}catch{toast('おためしの しゃしんを よみこめませんでした');}
  }
  async function loadPhotoUrl(url,initial={}) {
    const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    openPhotoEditor({url,x:0,y:0,scale:1,flip:false,aspect:img.naturalWidth/img.naturalHeight,...initial});
  }
  async function readPhoto(file) {
    if(!file)return;
    try {
      const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
      const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
      const factor=Math.min(1,1400/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*factor);canvas.height=Math.round(img.naturalHeight*factor);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      await loadPhotoUrl(canvas.toDataURL('image/jpeg',.9));
    } catch {toast('この しゃしんは ひらけませんでした');}
  }
  let fitMode='face';
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  function fitTarget(){return fitMode==='hair'?photoDraft.hairFit:photoDraft;}
  function fitTranslate(x,y){
    const t=fitTarget(),size=photoSize(photoDraft),hair=fitMode==='hair';
    const limitX=hair?32:size.w*t.scale/2+55,limitY=hair?40:size.h*t.scale/2+70;
    t.x=clamp(x,-limitX,limitX);t.y=clamp(y,-limitY,limitY);refreshPhotoDraft();
  }
  function fitScale(value){const t=fitTarget();t.scale=fitMode==='hair'?clamp(value,.8,1.25):clamp(value,.5,8);fitTranslate(t.x,t.y);}
  function refreshPhotoDraft(){
    if(!photoDraft)return;
    const preview=$('#photoPreview'),h=photoDraft.hairFit;
    $('.fitted-photo',preview)?.setAttribute('transform',photoTransform(photoDraft));
    $$('.photo-hair-fit',preview).forEach(layer=>layer.setAttribute('transform',`translate(${h.x} ${h.y}) translate(300 210) scale(${h.scale}) translate(-300 -210)`));
    $$('[data-fit-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fitMode===fitMode)));
    $('[data-photo-flip]').hidden=fitMode==='hair';
  }
  function openPhotoEditor(candidate=photo) {
    if(!candidate)return;
    const draft={...candidate,hairFit:{x:0,y:0,scale:1,...candidate.hairFit}};fitMode='face';
    const padButton=(move,label,direction)=>`<button class="fit-key dir-${direction}" data-fit-move="${move}" aria-label="${label}">${icon('chevron-right')}</button>`;
    speak('photoAdjust');openModal(`${closeMarkup()}<h2>ぴったり あわせよう</h2><div class="fit-layout"><div class="photo-editor-preview" id="photoPreview"></div><div class="fit-controls">
      <div class="fit-modes"><button data-fit-mode="face" aria-label="おかおを うごかす" aria-pressed="true"><img src="${escapeAttr(draft.url)}" alt=""><span>おかお</span></button><button data-fit-mode="hair" aria-label="かみを うごかす" aria-pressed="false">${categoryVisual('hair')}<span>かみ</span></button></div>
      <p class="photo-editor-tip">ゆびで うごかしてね</p><div class="fit-adjust">
      <div class="fit-pad">${padButton('0,-2','すこし うえ','up')}${padButton('-2,0','すこし ひだり','left')}<button class="fit-key fit-reset" data-fit-reset aria-label="えらんだ ところを もとに もどす">${icon('undo')}</button>${padButton('2,0','すこし みぎ','right')}${padButton('0,2','すこし した','down')}</div>
      <div class="fit-tools"><button class="fit-key" data-fit-zoom="1" aria-label="おおきく">${icon('zoom-in')}</button><button class="fit-key" data-fit-zoom="-1" aria-label="ちいさく">${icon('zoom-out')}</button><button class="fit-key" data-photo-flip aria-label="かがみに うつす">${icon('mirror')}</button></div></div></div></div>
      <div class="modal-actions"><button class="action-button" data-photo-done>${icon('check')}<span>これに する</span></button></div>`,'photo-editor');
    photoDraft=draft;modalCleanup=()=>{photoDraft=null;};
    const preview=$('#photoPreview');
    preview.innerHTML=art().render({...state,photoUrl:draft.url,hairFit:draft.hairFit,transparentBackground:true});
    const svg=$('svg',preview);svg.setAttribute('viewBox','135 58 330 350');svg.setAttribute('width','330');svg.setAttribute('height','350');
    injectPhoto(preview,draft);refreshPhotoDraft();
    const pointers=new Map();let gesture;
    function localPoint(event){const p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform($('.head-front',svg).getScreenCTM().inverse());}
    function geometry(){const [a,b]=[...pointers.values()];if(!a)return null;return {x:b?(a.x+b.x)/2:a.x,y:b?(a.y+b.y)/2:a.y,d:b?Math.hypot(a.x-b.x,a.y-b.y):0};}
    function anchor(){const g=geometry(),t=fitTarget();gesture=g?{...g,tx:t.x,ty:t.y,scale:t.scale}:null;}
    preview.addEventListener('pointerdown',e=>{e.preventDefault();if(pointers.size>1)return;preview.setPointerCapture(e.pointerId);pointers.set(e.pointerId,localPoint(e));anchor();});
    preview.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId)||!gesture)return;e.preventDefault();pointers.set(e.pointerId,localPoint(e));const g=geometry();
      if(g.d&&gesture.d>2)fitScale(gesture.scale*g.d/gesture.d);
      fitTranslate(gesture.tx+(g.x-gesture.x),gesture.ty+(g.y-gesture.y));
    });
    const release=e=>{pointers.delete(e.pointerId);anchor();};preview.addEventListener('pointerup',release);preview.addEventListener('pointercancel',release);preview.addEventListener('lostpointercapture',release);
  }
  async function openCamera() {
    // Camera access is requested exclusively by the child's explicit camera button.
    if(!navigator.mediaDevices?.getUserMedia||!window.isSecureContext){$('#cameraInput').click();return;}
    openModal(`${closeMarkup()}<h2>カメラ</h2><video class="camera-view" id="cameraVideo" playsinline muted autoplay></video><p>おかおを まんなかに</p><div class="modal-actions"><button class="action-button" data-capture>${icon('camera')}<span>パシャ！</span></button></div>`,'camera-modal');
    const session=++cameraSession;
    try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280}},audio:false});const video=$('#cameraVideo');if(session!==cameraSession||!video){stream.getTracks().forEach(t=>t.stop());return;}cameraStream=stream;video.srcObject=stream;await video.play();}
    catch{if(session!==cameraSession)return;stopCamera();openModal(`${closeMarkup()}<h2>しゃしんを えらぼう</h2><p>カメラが ひらけませんでした。<br>しゃしんからも あそべるよ。</p><div class="modal-actions"><button class="action-button" data-file>${icon('photo')}<span>しゃしんを えらぶ</span></button></div>`);}
  }
  function stopCamera() { cameraSession++;if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;} }
  async function capturePhoto() {
    const video=$('#cameraVideo');if(!video?.videoWidth)return;const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);const data=canvas.toDataURL('image/jpeg',.9);stopCamera();await loadPhotoUrl(data);
  }
  function openNails(mode=nailMode) {
    nailMode=mode;selectedNail=-1;footSide=null;speak(mode==='feet'?'pedicurePlay':'manicurePlay');
    openModal(`${closeMarkup()}<h2>${mode==='feet'?'ペディキュア':'マニキュア'}で あそぼう</h2><div class="nail-tabs"><button class="nail-tab ${mode==='hands'?'active':''}" data-nail-mode="hands">${icon('hand')}<span>マニキュア</span></button><button class="nail-tab ${mode==='feet'?'active':''}" data-nail-mode="feet">${icon('foot')}<span>ペディキュア</span></button></div><div class="nail-drawing" id="nailDrawing"></div><p class="nail-notice">いろを えらんで、つめを タッチ</p><div id="nailColors">${colorsMarkup(POLISHES,polish,'nail',true)}</div><div class="modal-actions"><button class="action-button" data-nail-done>${icon('check')}<span>できた</span></button></div>`,'nail-modal');
    renderNailDrawing();
  }
  function renderNailDrawing() {
    if(!$('#nailDrawing'))return;
    const drawing=$('#nailDrawing'),overview=nailMode==='feet'&&footSide===null;
    drawing.innerHTML=window.PrincessBeauty?.renderNails({mode:nailMode,colors:state.nails[nailMode],selected:selectedNail,side:footSide,faceStudioEnabled:state.faceStudioEnabled,faceOptions:state.faceOptions,photoUrl:photo?.url||null})||`<div class="error-note">つめの おしたくを よみこんでいます</div>`;
    if(overview){
      drawing.querySelector('svg')?.setAttribute('aria-hidden','true');
      drawing.querySelectorAll('[data-nail][tabindex]').forEach(el=>el.removeAttribute('tabindex'));
      drawing.insertAdjacentHTML('beforeend',`<div class="foot-pickers">${['ひだり','みぎ'].map((label,i)=>`<button data-foot-side="${i}" aria-label="${label}の あしを おおきく"><span>${icon('zoom-in')}</span></button>`).join('')}</div>`);
    }else if(nailMode==='feet'){
      drawing.insertAdjacentHTML('beforeend',`<button class="feet-back" data-foot-overview aria-label="りょうあしを みる">${icon('zoom-out')}</button>`);
    }
    $('.nail-notice').textContent=overview?'えらんだ あしを タッチ': 'いろを えらんで、つめを タッチ';
  }
  function paintNail(index) {
    if(index<0||index>9)return;selectedNail=index;record();state.nails[nailMode][index]=polish;persist();renderDoll();renderNailDrawing();renderHeader();effect();
  }
  function renderParents() {
    const faceSetting=studioReady()?'<div class="setting-row"><span>おともだちの絵本</span><button class="setting-toggle '+(state.faceStudioEnabled?'on':'')+'" data-setting="face-studio" aria-label="おともだちの絵本" aria-pressed="'+state.faceStudioEnabled+'">'+(state.faceStudioEnabled?'オン':'オフ')+'</button></div><p class="settings-note">オンにすると、架空のおともだちを新しく迎えて、一緒に着せ替えで遊べます。迎えた子の顔はそのまま絵本に残ります。「しゃしん」の遊びは別の入口です。</p>':'';
    openModal(`${closeMarkup()}<h2>おうちのかたへ</h2>${faceSetting}<div class="setting-row"><span>おけしょうばこを ひらく</span><button class="setting-toggle ${state.unlocked?'on':''}" data-setting="unlock" aria-pressed="${state.unlocked}">${state.unlocked?'ひらいています':'ひらく'}</button></div><div class="setting-row"><span>おと・こえ</span><button class="setting-toggle ${state.sound?'on':''}" data-setting="sound" aria-pressed="${state.sound}">${state.sound?'オン':'オフ'}</button></div><div class="setting-row"><span>BGM（音楽）<small class="setting-hint">全体のおとがオフの間は無音です</small></span><button class="setting-toggle ${state.bgm!==false?'on':''}" data-setting="bgm" aria-label="BGM（音楽）" aria-pressed="${state.bgm!==false}">${state.bgm!==false?'オン':'オフ'}</button></div><p class="settings-note">写真は通信・保存しません。開いている画面のメモリだけで扱い、画面を閉じると消えます。保存ボタンを押すと、完成した記念写真を端末へ書き出します。</p><p class="settings-note">カメラは「カメラ」を押したときだけ開きます。iPadではSafariのHTTPS環境か、写真選択からご利用ください。</p><button class="reset-button" data-reset>おしたくを はじめから</button><p class="settings-note">ドレスなどの設定は、このブラウザに保存されます。</p>`,'settings-modal');
  }
  function openParents(){renderParents();$('#modal').insertAdjacentHTML('beforeend','<p class="settings-note">案内の声：AivisSpeech: まお</p>');}
  let holdTimer,holdIndicator;
  function beginParentHold(e) { if(e.button>0)return;clearParentHold();holdIndicator=document.createElement('span');holdIndicator.className='parent-hold-progress';const r=$('#parents').getBoundingClientRect();holdIndicator.style.cssText=`left:${r.left-3}px;top:${r.top-3}px`;document.body.append(holdIndicator);holdTimer=setTimeout(()=>{clearParentHold();openParents();},1200); }
  function clearParentHold(){clearTimeout(holdTimer);holdIndicator?.remove();holdIndicator=null;}

  function beginPlay(mode){started=true;window.PrincessMusic?.start();ensureAudio();$('#startScreen').classList.add('hidden');if(state.mode!==mode)setPlayMode(mode);else{renderDoll();renderCloset();renderHeader();speak(mode==='casual'?'casualMode':'welcome');effect();}window.PrincessIdle?.start({isSoundEnabled:()=>state.sound,onWarning:()=>speak('sleepy','眠くなってきちゃった'),onCancelWarning:()=>stopVoice(),onSleep:()=>{window.PrincessMusic?.setSleeping(true);stopCamera();stopVoice();},onWake:()=>window.PrincessMusic?.setSleeping(false)});}
  $('#start').addEventListener('click',()=>beginPlay('princess'));
  $('#startCasual')?.addEventListener('click',()=>beginPlay('casual'));
  $('#undo').addEventListener('click',()=>{if(!history.length)return;const preferences={unlocked:state.unlocked,sound:state.sound,bgm:state.bgm,faceStudioEnabled:state.faceStudioEnabled},past=history.pop();window.PrincessFriendBook?.rememberLook(state.friendId,state);state={...past.design,...preferences};photo=past.photo?{...past.photo}:null;if(!state.faceStudioEnabled&&state.friendId!=='cast-gentle')swapFriend(window.PrincessFriendBook?.get('cast-gentle'),{keepPhoto:true});persist();renderDoll();renderCloset();renderHeader();effect();});
  $('#sound').addEventListener('click',()=>{state.sound=!state.sound;persist();renderHeader();if(state.sound){ensureAudio();effect();speak('welcome');}else stopVoice();});
  $('#done').addEventListener('click',openCompletion);$('#photo').addEventListener('click',openPhotoMenu);$('#friends').addEventListener('click',openFaceMenu);
  $('#parents').addEventListener('pointerdown',beginParentHold);$('#parents').addEventListener('pointerup',clearParentHold);$('#parents').addEventListener('pointerleave',clearParentHold);$('#parents').addEventListener('pointercancel',clearParentHold);$('#parents').addEventListener('contextmenu',e=>e.preventDefault());$('#parents').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openParents();}});
  $('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b)setCategory(b.dataset.category);});
  $('#playModes')?.addEventListener('click',e=>{const button=e.target.closest('[data-play-mode]');if(button)setPlayMode(button.dataset.playMode);});
  $('#closetBody').addEventListener('click',e=>{
    if(handleOutingClick(e))return;
    if(e.target.closest('[data-hair-back]')){hairStep='base';renderCloset();effect();speak('hairChooseBase','まず、ベースの髪型を選ぼう！');return;}
    const hairBase=e.target.closest('[data-hair-family]');if(hairBase){const family=hairFamilies().find(item=>item.id===hairBase.dataset.hairFamily);if(!family)return;const previous=currentHairFamily();hairRemembered.set(previous.id,state.hair);const remembered=hairRemembered.get(family.id),next=family.styles.includes(remembered)?remembered:family.base;hairStep='arrange';page=Math.max(0,Math.floor(family.styles.indexOf(next)/hairPerPage()));if(next!==state.hair)change(()=>state.hair=next);else{renderCloset();effect();}speak(family.voiceKey||'hairChooseArrange',family.label);return;}
    const part=e.target.closest('[data-casual-part]');if(part){casualPart=part.dataset.casualPart;page=selectedPage('dress');renderCloset();effect();speakCasualShelf(casualPart);return;}
    const casualItem=e.target.closest('[data-casual-item]');if(casualItem){const id=casualItem.dataset.casualItem;change(()=>state.casual[casualPart]=id);speakCasualItem(casualPart,id);return;}
    const casualTool=e.target.closest('[data-casual-tool]');if(casualTool){openCasualStyle(casualTool.dataset.casualTool);return;}
    const casualAccessory=e.target.closest('[data-casual-accessory]');if(casualAccessory){change(()=>state.casual.accessory=casualAccessory.dataset.casualAccessory);speakNamedChoice('accessory',casualAccessory.dataset.casualAccessory);return;}
    if(e.target.closest('[data-open-dress-palette]')){openColourPalette('dress');return;}
    if(e.target.closest('[data-first-done]')){openCompletion();return;}
    const shelf=e.target.closest('[data-extra-shelf]');if(shelf){accessoryShelf=shelf.dataset.extraShelf;renderCloset();effect();speak(accessoryShelf==='shoes'?'shoes':'hairAccessory',accessoryShelf==='shoes'?'くつを えらんでね':'かみかざりを えらんでね');return;}
    const extra=e.target.closest('[data-extra-choice]');if(extra){change(()=>state[accessoryShelf]=extra.dataset.extraChoice);speakNamedChoice(accessoryShelf==='shoes'?'shoes':'accessory',extra.dataset.extraChoice);return;}
    const choice=e.target.closest('[data-choice]');if(choice){change(()=>{if(category==='background'&&state.mode==='casual')state.casual.background=choice.dataset.choice;else state[category]=choice.dataset.choice;if(category==='dress'){const item=cardItems('dress').find(x=>x.id===state.dress);state.dressColor=representativeColor(item);}});if(category==='hair'){hairRemembered.set(currentHairFamily().id,state.hair);speakHairChoice(state.hair);}if(category==='background')speakNamedChoice('background',choice.dataset.choice);if(category==='dress'){const guide=assets().dressGuide?.[state.dress];speak(guide?.voiceKey||'dress',guide?.label);}return;}
    const p=e.target.closest('[data-page]');if(p){page+=Number(p.dataset.page);renderCloset();effect();return;}
    const sticker=e.target.closest('[data-sticker]');if(sticker){selectedSticker=sticker.dataset.sticker;renderCloset();effect();speakNamedChoice('sticker',sticker.dataset.sticker);return;}
    const color=e.target.closest('[data-color]');if(color){chooseColor(color);return;}
    const m=e.target.closest('[data-makeup]');if(m){if(m.dataset.makeup==='hands'||m.dataset.makeup==='feet'){openNails(m.dataset.makeup);return;}makeupPart=m.dataset.makeup;makeupFullView=false;renderCloset();speak(makeupPart==='blush'?'cheekPlay':'lipPlay');return;}
    if(e.target.closest('[data-makeup-back]')){stopVoice();makeupPart=null;makeupFullView=false;hideMakeupPortrait();renderCloset();effect();}
  });
  function stickerAtPoint(clientX,clientY) {
    const shapes=$$('#doll .sticker-layer > [data-sticker-index]');
    for(let i=shapes.length-1;i>=0;i--){
      const r=shapes[i].getBoundingClientRect();if(!r.width||!r.height)continue;
      const dx=(clientX-r.left-r.width/2)/Math.max(20,r.width*.52),dy=(clientY-r.top-r.height/2)/Math.max(20,r.height*.52);
      if(dx*dx+dy*dy<=1)return Number(shapes[i].dataset.stickerIndex);
    }
    return -1;
  }
  $('#stage').addEventListener('click',e=>{
    if(category!=='stickers'||e.target.closest('button'))return;
    const hit=stickerAtPoint(e.clientX,e.clientY);
    if(hit>=0&&hit<state.stickers.length){change(()=>state.stickers.splice(hit,1),{sparkle:false});speak('stickerPeel');toast('シールが はがれたよ');return;}
    if(state.stickers.length>=24){toast('はった シールを タッチして はがしてね');return;}
    const svg=$('#doll>svg');if(!svg)return;const point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;
    const matrix=svg.getScreenCTM();if(!matrix)return;const p=point.matrixTransform(matrix.inverse()),r=$('#stage').getBoundingClientRect();
    change(()=>state.stickers.push({id:selectedSticker,x:Math.round(p.x),y:Math.round(p.y),nx:(e.clientX-r.left)/r.width,ny:(e.clientY-r.top)/r.height}),{sparkle:false});
  });
  function chooseColor(button) {
    const color=button.dataset.color==='clear'?null:button.dataset.color,kind=button.dataset.colorKind;
    if(kind==='nail'){polish=color;$('#nailColors').innerHTML=colorsMarkup(POLISHES,polish,'nail',true);effect();speak('color',color?colorName(color):'いろを とるよ');return;}
    change(()=>{if(kind==='dress')state.dressColor=color;else if(kind==='hair')state.hairColor=color;else state.makeup[kind]=color;});if(color){const named=(kind==='blush'||kind==='lip')?makeupColour(color):paletteColour(color);speak(named.voiceKey||'color',named.reading||named.label||colorName(color));}else speak('clearColor');
  }
  $('#modal').addEventListener('click',e=>{
    if(handleOutingClick(e))return;
    const t=e.target;
    const colourGroup=t.closest('[data-colour-group]');if(colourGroup){paletteGroup=Number(colourGroup.dataset.colourGroup);renderColourPalette();effect();return;}
    const colourChoice=t.closest('[data-colour-choice]');if(colourChoice){const selected=paletteGroups()[paletteGroup].colors[Number(colourChoice.dataset.colourChoice)];change(()=>{if(paletteTarget==='dress')state.dressColor=selected.hex;else state.casual.styles[paletteTarget].color=selected.hex;});renderColourPalette();speak(selected.voiceKey||'color',selected.reading||selected.label);return;}
    const casualStyle=t.closest('[data-casual-style]');if(casualStyle){const kind=casualStyle.dataset.casualStyle,value=casualStyle.dataset.styleValue;change(()=>{state.casual.styles[casualPart][kind]=kind==='ribbon'?value==='on':value;});openCasualStyle(kind,false);speakCasualStyle(kind,value);return;}
    if(t.closest('[data-colour-done]')){closeModal();return;}
    if(t.closest('[data-close]')||t.closest('[data-continue]')){closeModal();return;}
    if(t.closest('[data-save]')){saveKeepsake();return;}
    if(t.closest('[data-open-makeup]')){closeModal();setCategory('makeup');return;}
    if(t.closest('[data-photo-menu]')){openPhotoMenu();return;}
    if(t.closest('[data-open-face-desk]')){openFaceDesk();return;}
    const guest=t.closest('button[data-guest-id]');if(guest){meetFriend(window.PrincessFriendBook?.get(guest.dataset.guestId));return;}
    if(t.closest('[data-sample]')){useSample();return;}
    if(t.closest('[data-file]')){$('#photoInput').click();return;}
    if(t.closest('[data-camera]')){openCamera();return;}
    if(t.closest('[data-capture]')){capturePhoto();return;}
    if(t.closest('[data-adjust-photo]')){openPhotoEditor();return;}
    if(t.closest('[data-remove-photo]')){record();photo=null;renderDoll();renderHeader();closeModal();effect();return;}
    if(t.closest('[data-photo-done]')){if(photoDraft){record();photo={...photoDraft};}closeModal();renderDoll();renderHeader();sparkle();effect();return;}
    const fit=t.closest('[data-fit-mode]');if(fit&&photoDraft){fitMode=fit.dataset.fitMode;refreshPhotoDraft();effect();return;}
    const move=t.closest('[data-fit-move]');if(move&&photoDraft){const [dx,dy]=move.dataset.fitMove.split(',').map(Number),layer=fitTarget();fitTranslate(layer.x+dx,layer.y+dy);effect();return;}
    const zoom=t.closest('[data-fit-zoom]');if(zoom&&photoDraft){fitScale(fitTarget().scale*Math.pow(fitMode==='hair'?1.025:1.07,Number(zoom.dataset.fitZoom)));effect();return;}
    if(t.closest('[data-fit-reset]')&&photoDraft){Object.assign(fitTarget(),{x:0,y:0,scale:1});if(fitMode==='face')photoDraft.flip=false;refreshPhotoDraft();effect();return;}
    if(t.closest('[data-photo-flip]')&&photoDraft){photoDraft.flip=!photoDraft.flip;refreshPhotoDraft();effect();return;}
    const mode=t.closest('[data-nail-mode]');if(mode){openNails(mode.dataset.nailMode);effect();return;}
    const side=t.closest('[data-foot-side]');if(side){footSide=Number(side.dataset.footSide);selectedNail=-1;renderNailDrawing();effect();speak('nails');return;}
    if(t.closest('[data-foot-overview]')){footSide=null;selectedNail=-1;renderNailDrawing();effect();return;}
    const nail=t.closest('[data-nail]');if(nail){paintNail(Number(nail.dataset.nail));return;}
    const color=t.closest('[data-color]');if(color){chooseColor(color);return;}
    if(t.closest('[data-nail-done]')){closeModal();sparkle();effect();return;}
    const setting=t.closest('[data-setting]');if(setting){if(setting.dataset.setting==='face-studio'){state.faceStudioEnabled=!state.faceStudioEnabled;if(!state.faceStudioEnabled)swapFriend(window.PrincessFriendBook?.get('cast-gentle'),{keepPhoto:true});persist();renderDoll();renderHeader();renderCloset();openParents();}else if(setting.dataset.setting==='bgm'){state.bgm=state.bgm===false;persist();window.PrincessMusic?.sync({gesture:true});openParents();}else if(setting.dataset.setting==='unlock'){state.unlocked=!state.unlocked;persist();renderCloset();openParents();}else{state.sound=!state.sound;persist();renderHeader();if(!state.sound)stopVoice();openParents();}return;}
    if(t.closest('[data-reset]')){openModal(closeMarkup()+'<h2>はじめからにしますか？</h2><p>衣装の保存と、このブラウザーのおともだちの絵本を消去します。</p><div class="modal-actions"><button class="action-button secondary" data-reset-back>やめる</button><button class="reset-button" data-reset-confirm>すべて消去</button></div>','settings-modal');return;}if(t.closest('[data-reset-back]')){openParents();return;}if(t.closest('[data-reset-confirm]')){window.PrincessFriendBook?.reset();state=clone(DEFAULT);state.casual=normalizeCasual();photo=null;history=[];persist();category='dress';page=0;makeupPart=null;renderDoll();renderCloset();renderHeader();closeModal();toast('あたらしい おしたくを はじめよう');}
  });
  $('#modal').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-nail]')){e.preventDefault();paintNail(Number(e.target.dataset.nail));}});
  $('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modalBackdrop').classList.contains('hidden'))closeModal();});
  for(const input of [$('#photoInput'),$('#cameraInput')])input.addEventListener('change',()=>{const file=input.files?.[0];input.value='';readPhoto(file);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopCamera();stopVoice();}});
  window.addEventListener('pagehide',()=>{stopCamera();stopVoice();photo=null;history=[];closeModal(false);renderDoll();renderHeader();});
  let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{renderDoll();if(category==='background'&&window.PrincessOuting)renderOutings($('#closetBody'));if($('#modal').classList.contains('outing-modal'))fitOutingMap($('#modal'));});});
  const hairOrientation=window.matchMedia('(orientation:portrait)'),refreshHairOrientation=()=>{if(category==='hair'){page=selectedPage('hair');renderCloset();}};
  if(hairOrientation.addEventListener)hairOrientation.addEventListener('change',refreshHairOrientation);else hairOrientation.addListener(refreshHairOrientation);
  window.PrincessMusic?.configure({source:()=>assets().music?.atelier||'',enabled:()=>state.bgm!==false,sound:()=>state.sound});
  validateDesign();page=selectedPage(category);renderHeader();renderDoll();renderCloset();
  // A tiny inspection surface is useful for offline smoke tests, with no photo contents exposed.
  window.PrincessAtelier={getDesign:()=>clone(state),getPhotoStatus:()=>({present:!!photo,scale:photo?.scale||1,flip:photo?.flip||false}),getCategory:()=>category};
})();
