/* Face mirror: edits live in a draft until the child taps the check mark. */
(() => {
  'use strict';
  const studio=window.PrincessFaceStudio,defaults=studio.defaults;
  const preset=(skinShade,skinHue,iris,eyeShape,eyeHeight,eyeSpacing,mouth)=>studio.normalize({enabled:true,skinShade,skinHue,iris,eyeShape,eyeHeight,eyeSpacing,mouth});
  const looks=[
    {id:'peach',name:'ももの お花',options:preset(8,1,'amber','round',0,0,'smile')},
    {id:'violet',name:'すみれの お花',options:preset(24,0,'brown','almond',1,0,'gentle')},
    {id:'clover',name:'クローバー',options:preset(38,2,'hazel','soft',0,1,'laugh')},
    {id:'sky',name:'空の お星さま',options:preset(3,3,'blue','almond',0,-1,'smile')}
  ];
  const tabs=[['looks','おかお','faceStudioTypes'],['skin','はだ','faceStudioSkin'],['iris','ひとみ','faceStudioIris'],['eyes','め','faceStudioEyes'],['mouth','くち','faceStudioMouth']];
  const fields={
    iris:[['brown','栗色','colorKuriiro','#704f41'],['amber','琥珀色','swatchBrown12','#b27931'],['hazel','ヘーゼル','faceIrisHazel','#858052'],['green','緑','colorMidori','#57846a'],['blue','青','colorAo','#527c9c'],['gray','灰色','colorHaiiro','#747581']],
    eyeShape:[['round','まるい目','faceEyesRound'],['almond','アーモンド形','faceEyesAlmond'],['soft','やさしい目','faceEyesSoft']],
    eyeHeight:[[-1,'少し下','faceEyesDown'],[0,'まんなか','faceEyesCenter'],[1,'少し上','faceEyesUp']],
    eyeSpacing:[[-1,'少し近く','faceEyesNear'],[0,'まんなか','faceEyesCenter'],[1,'少し離す','faceEyesFar']],
    mouth:[['gentle','ちいさくにっこり','faceMouthGentle'],['smile','ほほえみ','faceMouthSmile'],['laugh','にこっ','faceMouthLaugh']]
  };
  const normalize=studio.normalize;
  const hues=['ばら','もも','まんなか','はちみつ','オリーブ'];
  const symbol=(kind)=>{
    const faces='<path d="M14 28q0-19 18-19t18 19v6q0 18-18 20-18-2-18-20z" fill="#efc7ab"/><path d="M15 27q-1-20 18-20 18 0 18 20-8-1-13-11-5 10-23 11" fill="#aa7254"/><path d="M22 33q3-4 7 0m6 0q3-4 7 0" stroke="#674c45" stroke-width="3" fill="none"/><path d="M26 42q6 7 12 0" stroke="#b76e70" stroke-width="2.8" fill="none"/>';
    const parts={looks:faces,skin:'<circle cx="23" cy="22" r="11" fill="#f2cfb4"/><circle cx="42" cy="25" r="12" fill="#d6a18b"/><circle cx="29" cy="42" r="12" fill="#a4775e"/>',iris:'<ellipse cx="32" cy="32" rx="19" ry="21" fill="#fbf4e9" stroke="#99705a" stroke-width="2"/><ellipse cx="31" cy="32" rx="13" ry="16" fill="#997b5e"/><ellipse cx="31" cy="34" rx="7" ry="9" fill="#4c3b30"/><circle cx="27" cy="26" r="4" fill="#fffaf2"/>',eyes:'<path d="M5 34q27-28 54 0-28 23-54 0" fill="#fff7ed" stroke="#845c49" stroke-width="3"/><ellipse cx="32" cy="34" rx="10" ry="12" fill="#9e795a"/><circle cx="32" cy="35" r="6" fill="#624a3c"/><circle cx="29" cy="30" r="3" fill="white"/>',mouth:'<path d="M7 32q11-4 20-6 6 5 11 0 8 4 19 5-21 24-38 11z" fill="#ca868a"/><path d="M9 32q23 6 46-1" fill="none" stroke="#8e5a5d" stroke-width="2"/>'};
    return '<svg viewBox="0 0 64 64" aria-hidden="true">'+parts[kind]+'</svg>';
  };
  const escapeName=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function open(api) {
    const {state,card,show,close,commit,say,back,candidate}=api; if(!state.faceStudioEnabled)return;
    let work={...looks[0].options},tab='looks';
    const picture=(options,part='')=>{
      const boxes={eyes:'241 176 117 58',mouth:'269 231 64 49'};
      const svg=card('face','gentle',{face:'gentle',hair:candidate.hair,hairColor:candidate.hairColor,makeup:{blush:null,lip:null},photoUrl:null,faceStudioEnabled:true,faceOptions:options});
      return boxes[part]?svg.replace(/viewBox="[^"]+"/,'viewBox="'+boxes[part]+'"'):svg;
    };
    function optionButtons(key,title,kind) {
      return '<div class="face-desk-group"><p>'+title+'</p><div class="face-desk-choices '+kind+'">'+fields[key].map(([value,name,voice,color])=>{
        const selected=work[key]===value,opts={...work,[key]:value};let art='';
        if(kind==='iris-swatches')art='<i class="iris-dot" style="--color:'+color+'"></i>';
        else if(kind==='miniatures')art=picture(opts,key==='mouth'?'mouth':'eyes');
        else {
          const mark=key==='eyeSpacing'?['→←','• •','←→'][Number(value)+1]:['↓','—','↑'][Number(value)+1];
          art='<b aria-hidden="true">'+mark+'</b>';
        }
        return '<button type="button" data-desk-key="'+key+'" data-desk-value="'+value+'" aria-label="'+name+'" aria-pressed="'+selected+'"><span>'+art+'</span><small>'+name+'</small></button>';
      }).join('')+'</div></div>';
    }
    const currentPreset=p=>Object.keys(p.options).every(k=>work[k]===p.options[k]);
    function skinPanel(){
      const dot=opts=>'<i class="skin-dot" style="--color:'+studio.skinTarget(opts)+'"></i>';
      const shades=Array.from({length:studio.lastShade/4+1},(_,index)=>{
        const shade=index*4,name='はだの あかるさ '+(index+1);
        return '<button type="button" data-desk-shade="'+shade+'" aria-label="'+name+'" aria-pressed="'+(work.skinShade===shade)+'">'+dot({...work,skinShade:shade})+'</button>';
      }).join('');
      const tones=hues.map((name,hue)=>'<button type="button" data-desk-hue="'+hue+'" aria-label="'+name+'の いろみ" aria-pressed="'+(work.skinHue===hue)+'">'+dot({...work,skinHue:hue})+'<small>'+name+'</small></button>').join('');
      const step=(delta,label)=>'<button type="button" data-desk-step="'+delta+'" '+(work.skinShade+delta<0||work.skinShade+delta>studio.lastShade?'disabled':'')+'>'+label+'</button>';
      return '<div class="face-desk-group"><p>はだの あかるさ</p><div class="face-desk-choices skin-scale">'+shades+'</div><div class="skin-fine">'+step(-1,'少し あかるく')+'<span aria-label="いまの はだの いろ">'+dot(work)+'</span>'+step(1,'少し こく')+'</div></div>'+
        '<div class="face-desk-group"><p>いろみ</p><div class="face-desk-choices skin-hues">'+tones+'</div></div>';
    }
    function panel(){
      if(tab==='looks')return '<div class="face-desk-group"><p>えの みほん</p><div class="face-desk-presets">'+looks.map(p=>'<button type="button" data-desk-preset="'+p.id+'" aria-label="'+p.name+'" aria-pressed="'+currentPreset(p)+'"><span>'+picture(p.options)+'</span><small>'+p.name+'</small></button>').join('')+'</div></div>';
      if(tab==='skin')return skinPanel();
      if(tab==='iris')return optionButtons('iris','ひとみの いろ','iris-swatches');
      if(tab==='eyes')return optionButtons('eyeShape','めの かたち','miniatures')+optionButtons('eyeHeight','めの たかさ','directions')+optionButtons('eyeSpacing','めの あいだ','directions');
      return optionButtons('mouth','くちの かたち','miniatures');
    }
    const main=()=>'<aside class="face-desk-mirror"><div class="desk-portrait">'+picture(work)+'</div><span class="candidate-name">'+escapeName(candidate.name)+'</span></aside><div class="face-desk-trays"><div class="face-desk-tabs">'+tabs.map(([id,name])=>'<button type="button" data-desk-tab="'+id+'" aria-label="'+name+'" aria-pressed="'+(id===tab)+'">'+symbol(id)+'<small>'+name+'</small></button>').join('')+'</div><div class="face-desk-panel">'+panel()+'</div></div>';
    show('<button class="modal-close" data-desk-back aria-label="おともだちの えほんに もどる">‹</button><h2>新しいお友達は、どんな顔？</h2><div class="face-desk-content">'+main()+'</div><div class="modal-actions"><button class="action-button" data-desk-apply><b aria-hidden="true">✓</b> おともだちを むかえる</button></div>','face-desk-modal');
    const modal=document.getElementById('modal'),content=modal.querySelector('.face-desk-content');
    modal.querySelector('[data-desk-back]').onclick=()=>{close();back();};
    modal.querySelector('[data-desk-apply]').onclick=()=>{close();commit({...work,enabled:true});};
    content.onclick=e=>{
      const b=e.target.closest('button');if(!b)return;
      let voice,selector;
      if(b.dataset.deskTab){tab=b.dataset.deskTab;voice=tabs.find(row=>row[0]===tab)?.[2];selector='[data-desk-tab="'+tab+'"]';}
      else if(b.dataset.deskPreset){const entry=looks.find(p=>p.id===b.dataset.deskPreset);work={...entry.options};voice='faceLook'+entry.id[0].toUpperCase()+entry.id.slice(1);selector='[data-desk-preset="'+entry.id+'"]';}
      else if(b.hasAttribute('data-desk-shade')||b.hasAttribute('data-desk-step')){
        const fine=b.hasAttribute('data-desk-step');
        work.skinShade=fine?Math.min(studio.lastShade,Math.max(0,work.skinShade+Number(b.dataset.deskStep))):Number(b.dataset.deskShade);
        selector=fine?'[data-desk-step="'+b.dataset.deskStep+'"]':'[data-desk-shade="'+work.skinShade+'"]';
        voice=work.skinShade<14?'faceShadeLight':work.skinShade<30?'faceShadeMedium':'faceShadeDeep';
      }
      else if(b.hasAttribute('data-desk-hue')){
        work.skinHue=Number(b.dataset.deskHue);selector='[data-desk-hue="'+work.skinHue+'"]';
        voice=['faceToneCool','faceToneWarm','faceToneNeutral','faceToneWarm','faceToneNeutral'][work.skinHue];
      }
      else if(b.dataset.deskKey){const key=b.dataset.deskKey,choice=fields[key].find(opt=>String(opt[0])===b.dataset.deskValue);if(!choice)return;work[key]=choice[0];voice=choice[2];selector='[data-desk-key="'+key+'"][data-desk-value="'+choice[0]+'"]';}
      else return;
      const wasFocused=document.activeElement===b,scroll=content.querySelector('.face-desk-panel')?.scrollTop||0;content.innerHTML=main();if(!b.dataset.deskTab)content.querySelector('.face-desk-panel').scrollTop=scroll;if(wasFocused)content.querySelector(selector)?.focus({preventScroll:true});if(voice)say(voice);
    };
    say('faceStudioOpen');
  }
  window.PrincessFaceDesk={defaults,normalize,open,symbol};
})();
