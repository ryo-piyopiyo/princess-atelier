/* Fictional friends only. This album never stores photographs or arbitrary app state. */
(() => {
  'use strict';
  const STORAGE='princess-atelier-friend-book-v1';
  const cast=Object.freeze([
    {id:'cast-gentle',face:'gentle',name:'はな',voiceKey:'friendHana'},
    {id:'cast-smile',face:'smile',name:'ひまり',voiceKey:'friendHimari'},
    {id:'cast-sparkle',face:'sparkle',name:'きら',voiceKey:'friendKira'},
    {id:'cast-rosy',face:'rosy',name:'ゆい',voiceKey:'friendYui'}
  ].map(Object.freeze));
  const names=[
    ['こはる','friendKoharu','long','#865947'],['ゆず','friendYuzu','bob-straight','#b6654d'],
    ['りん','friendRin','straight-twins','#342f3b'],['ほのか','friendHonoka','soft-loose','#dfb965'],
    ['めい','friendMei','short-tucked','#865947'],['あおい','friendAoi','straight-half-up','#83bdbc'],
    ['ひより','friendHiyori','bob-half-up','#db9aaf'],['つむぎ','friendTsumugi','straight-braid','#a49acb']
  ];
  const places=['にじの庭','星の森','花の丘','月の湖','風の里','雲のお城','光の国','夢の泉'];
  const adjectives=['ひみつの','きらめく','やさしい','おひさまの','月あかりの','小鳥の','花びらの','そよ風の'];
  const faceDefaults={skinDepth:'light',undertone:'warm',iris:'brown',eyeShape:'soft',eyeHeight:0,eyeSpacing:0,mouth:'smile'};
  const faceChoices={skinDepth:['light','medium','deep'],undertone:['warm','neutral','cool'],iris:['brown','amber','hazel','green','blue','gray'],eyeShape:['round','almond','soft'],eyeHeight:[-1,0,1],eyeSpacing:[-1,0,1],mouth:['smile','laugh','gentle']};
  const parts=['top','outer','bottom','socks','shoes'];
  const fallbacks={hair:['long','waves','bob','inward','outward','short','crown-braid','single-braid','braid','half-up','bun','double-bun','ponytail','low-pony','twintails','low-twins','ringlets','side-sweep','half-bun','hime','straight-half-up','straight-ponytail','straight-braid','straight-twins','bob-straight','bob-half-up','short-tucked','soft-loose'],dress:['ball','flower','fairy','moon','rose','rainbow','morning','afternoon','riding','stage'],accessory:['none','crown','bow','flowers','star'],shoes:['ballet','strap','boots'],top:['tee','blouse','hoodie','sailor'],outer:['none','cardigan','blazer','denim'],bottom:['skirt','pleated','shorts','pants','culottes','jeans'],socks:['none','ankle','crew','knee'],casualShoes:['sneakers','loafers','rainboots','slipons']};
  const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  const publicCopy=value=>value==null?null:freeze(copy(value));
  const color=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)?value.toLowerCase():null;
  const integer=value=>Number.isSafeInteger(value)&&value>0;
  const empty=()=>({version:1,nextSequence:1,friends:[],looks:{}});
  let book=empty(),dirtyLooks=new Set(),suppressStored=false;

  function normalizedOptions(value={}){
    const input=object(value),result={enabled:true};
    for(const [key,allowed] of Object.entries(faceChoices))result[key]=allowed.includes(input[key])?input[key]:faceDefaults[key];
    // Legacy friends keep their original depth/undertone recipe and rendering.
    if(Number.isInteger(input.skinShade)&&input.skinShade>=0&&input.skinShade<=44&&
       Number.isInteger(input.skinHue)&&input.skinHue>=0&&input.skinHue<=4){
      result.skinShade=input.skinShade;result.skinHue=input.skinHue;
    }
    return result;
  }
  function identity(sequence){
    const [baseName,voiceKey,hair,hairColor]=names[(sequence-1)%names.length],cycle=Math.floor((sequence-1)/names.length);
    let prefix='';
    if(cycle){let journey=Math.floor((cycle-1)/places.length);const descriptors=[];while(journey){journey--;descriptors.unshift(adjectives[journey%adjectives.length]);journey=Math.floor(journey/adjectives.length);}prefix=(descriptors.length?descriptors.join(' ')+' ':'')+places[(cycle-1)%places.length]+'の ';}
    return {name:prefix+baseName,voiceKey,hair,hairColor};
  }
  function allowed(kind){
    let supplied;
    try{if(kind==='hair')supplied=window.PrincessHair?.cards;else if(kind==='dress')supplied=window.PrincessArt?.cards?.dress;else if(kind==='shoes')supplied=window.PrincessExtras?.cards?.shoes;else if(parts.includes(kind)||kind==='casualShoes')supplied=window.CoordArt?.items?.(kind==='casualShoes'?'shoes':kind);}catch{}
    return new Set([...(fallbacks[kind]||[]),...(Array.isArray(supplied)?supplied.map(item=>item.id).filter(id=>typeof id==='string'&&/^[a-z0-9-]{1,48}$/.test(id)):[])]);
  }
  function cleanCasual(value){
    const input=object(value),result={},styles=object(input.styles);
    for(const part of parts){if(allowed(part==='shoes'?'casualShoes':part).has(input[part]))result[part]=input[part];}
    if(['none','bow','flowers'].includes(input.accessory))result.accessory=input.accessory;
    result.styles={};
    for(const part of parts){if(!own(styles,part))continue;const style=object(styles[part]);result.styles[part]={color:color(style.color),pattern:['plain','stripes','dots','flowers','check'].includes(style.pattern)?style.pattern:'plain',ribbon:style.ribbon===true};}
    return result;
  }
  function cleanLook(value){
    const input=object(value),look={};
    for(const key of ['hair','dress','accessory','shoes'])if(allowed(key).has(input[key]))look[key]=input[key];
    for(const key of ['hairColor','dressColor']){const picked=color(input[key]);if(picked)look[key]=picked;}
    if(own(input,'casual'))look.casual=cleanCasual(input.casual);
    if(own(input,'makeup')){const makeup=object(input.makeup);look.makeup={blush:color(makeup.blush),lip:color(makeup.lip)};}
    if(own(input,'nails')){const nails=object(input.nails);look.nails={};for(const mode of ['hands','feet'])look.nails[mode]=Array.from({length:10},(_,i)=>color(Array.isArray(nails[mode])?nails[mode][i]:null));}
    return look;
  }
  function cleanStored(value){
    const input=object(value);if(input.version!==1||!Array.isArray(input.friends))return null;
    const result=empty(),seen=new Set();
    for(const raw of input.friends){const item=object(raw);if(typeof item.id!=='string'||!/^friend-[a-z0-9-]{1,96}$/.test(item.id)||seen.has(item.id)||!integer(item.sequence))continue;seen.add(item.id);const fixed=identity(item.sequence);result.friends.push({id:item.id,sequence:item.sequence,face:'gentle',...fixed,options:normalizedOptions(item.options)});result.nextSequence=Math.max(result.nextSequence,item.sequence+1);}
    if(integer(input.nextSequence))result.nextSequence=Math.max(result.nextSequence,input.nextSequence);
    const known=new Set([...cast.map(item=>item.id),...result.friends.map(item=>item.id)]);
    for(const [id,look] of Object.entries(object(input.looks)))if(known.has(id))result.looks[id]=cleanLook(look);
    return result;
  }
  function read(){if(suppressStored)return null;try{const raw=window.localStorage.getItem(STORAGE);return raw?cleanStored(JSON.parse(raw)):null;}catch{return null;}}
  function refresh(){
    const saved=read();if(!saved)return;
    const existing=new Set(book.friends.map(item=>item.id));for(const friend of saved.friends)if(!existing.has(friend.id)){book.friends.push(friend);existing.add(friend.id);}
    book.nextSequence=Math.max(book.nextSequence,saved.nextSequence);
    for(const [id,look] of Object.entries(saved.looks))if(!dirtyLooks.has(id))book.looks[id]=look;
  }
  function persist(){try{window.localStorage.setItem(STORAGE,JSON.stringify(book));dirtyLooks.clear();suppressStored=false;return true;}catch{return false;}}
  function entry(id){return cast.find(item=>item.id===id)||book.friends.find(item=>item.id===id)||null;}
  function publicFriend(friend){if(!friend)return null;const {sequence,...result}=friend;return publicCopy(result);}
  function list(){refresh();return freeze(book.friends.slice().sort((a,b)=>a.sequence-b.sequence).map(publicFriend));}
  function get(id){refresh();return publicFriend(entry(id));}
  function next(){refresh();return publicCopy(identity(book.nextSequence));}
  function create(options){
    refresh();const sequence=book.nextSequence++,who=identity(sequence);
    const entropy=Math.random().toString(36).slice(2,10),id='friend-'+Date.now().toString(36)+'-'+sequence.toString(36)+'-'+entropy;
    const friend={id,sequence,face:'gentle',...who,options:normalizedOptions(options)};
    book.friends.push(friend);book.looks[id]={hair:who.hair,hairColor:who.hairColor};dirtyLooks.add(id);persist();return publicFriend(friend);
  }
  function rememberLook(id,state){refresh();if(!entry(id))return null;const look=cleanLook(state);book.looks[id]={...book.looks[id],...look};dirtyLooks.add(id);persist();return publicCopy(book.looks[id]);}
  function getLook(id){refresh();return entry(id)?publicCopy(book.looks[id]||null):null;}
  // Called only by the explicit parent reset flow; undo never calls this function.
  function reset(){book=empty();dirtyLooks.clear();suppressStored=true;try{window.localStorage.removeItem(STORAGE);suppressStored=false;}catch{}}
  book=read()||empty();
  window.PrincessFriendBook=Object.freeze({cast,list,get,next,create,rememberLook,getLook,reset});
})();
