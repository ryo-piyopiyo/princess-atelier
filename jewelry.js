/* Original miniature jewelry. Scene fragments share the doll's 600 × 800 coordinates. */
(() => {
  'use strict';
  const collections={
    necklace:[
      ['pearl','パールのネックレス','#f3e6d1','gold'],['dew','しずくのペンダント','#79b7c7','silver'],
      ['daisy','お花のネックレス','#f6d8bb','gold'],['moon','三日月のネックレス','#dfb566','silver'],
      ['ribbon','リボンのチョーカー','#cb8493','rose'],['locket','ハートのロケット','#d49c78','gold']
    ],
    ring:[
      ['pearl','パールの指輪','#e9dfcf','gold'],['rose','ばらの指輪','#c97883','rose'],
      ['cushion','四角い宝石の指輪','#78a89b','silver'],['star','星の指輪','#dcb46c','gold'],
      ['bow','リボンの指輪','#bc8da8','rose'],['butterfly','ちょうの指輪','#92b8d2','silver']
    ],
    bracelet:[
      ['beads','木の実のブレスレット','#cc8692','gold'],['chain','鎖のブレスレット','#c5a47d','gold'],
      ['clover','クローバーのブレスレット','#8eaf8b','gold'],['ribbon','リボンのブレスレット','#c38da7','rose'],
      ['bangle','金のバングル','#d3ac62','gold'],['shell','貝がらのブレスレット','#dfb0a1','silver']
    ]
  };
  const metals={
    gold:['#816147','#b9925b','#f4dfaa','#caab77'],silver:['#737681','#b0b3bb','#faf8ee','#b7b3b6'],
    rose:['#95685f','#c58f82','#f8d8bd','#cd9c8c']
  };
  const separateMetal={necklace:['dew','daisy','moon','locket'],ring:['pearl','rose','cushion','star','bow','butterfly'],bracelet:['beads','clover','shell']};
  const cards=Object.freeze(Object.fromEntries(Object.entries(collections).map(([kind,rows])=>{
    const none=Object.freeze({id:'none',label:'はずす',baseColor:null,metalColorable:false,metalBaseColor:null});
    const items=rows.map(([id,label,baseColor,metal])=>{
      const metalColorable=separateMetal[kind].includes(id);
      return Object.freeze({id,label,baseColor,metal,metalColorable,metalBaseColor:metalColorable?metals[metal][1]:null});
    });
    return [kind,Object.freeze([none,...items])];
  })));
  const validColor=value=>typeof value==='string'&&value.length===7&&/^#[0-9a-f]{6}$/i.test(value);
  const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
  const round=n=>Math.round(n*100)/100;
  const g=(transform,markup)=>'<g transform="'+transform+'">'+markup+'</g>';
  const path=(d,fill,stroke='none',width=0,more='')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round" '+more+'/>';
  const ellipse=(x,y,rx,ry,fill,stroke='none',width=0,more='')=>'<ellipse cx="'+round(x)+'" cy="'+round(y)+'" rx="'+round(rx)+'" ry="'+round(ry)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" '+more+'/>';
  let serial=0;
  function paints(kind,item,override,metalOverride){
    const color=validColor(override)?override:item.baseColor,id='jewel-'+(++serial);
    // A plain chain or bangle is one material on both the front and the back.
    // A stone setting instead has a second color for its band, chain and prongs.
    const oneMetal=kind==='bracelet'&&(item.id==='chain'||item.id==='bangle');
    const tint=oneMetal&&validColor(override)?override:item.metalColorable&&validColor(metalOverride)?metalOverride:null;
    const metal=tint?[mix(tint,'#302933',.54),mix(tint,'#302933',.10),mix(tint,'#fffaf4',.69),mix(tint,'#ffedd9',.31)]:metals[item.metal];
    const lighter=mix(color,'#fff6df',.43),dark=mix(color,'#41303f',.52),shine=mix(color,'#fffaf2',.80);
    const stops=list=>list.map(([offset,c])=>'<stop offset="'+offset+'" stop-color="'+c+'"/>').join('');
    const defs='<defs><radialGradient id="'+id+'-stone" cx="32%" cy="25%" r="78%">'+stops([[0,shine],[.18,lighter],[.54,color],[.85,mix(color,dark,.54)],[1,dark]])+'</radialGradient>'+
      '<linearGradient id="'+id+'-metal" x1="0" y1=".15" x2=".86" y2="1">'+stops([[0,metal[0]],[.16,metal[1]],[.36,metal[2]],[.51,metal[3]],[.74,metal[1]],[.89,metal[2]],[1,metal[0]]])+'</linearGradient>'+
      '<pattern id="'+id+'-grain" patternUnits="userSpaceOnUse" width="6.4" height="5.1"><path d="M.4 1.1l1.6-.3m2.6 2.7l1-.6m-2 1.3l.35-.08" stroke="#fff7ee" stroke-width=".42" opacity=".43"/><circle cx="3.3" cy=".6" r=".32" fill="#60414d" opacity=".18"/></pattern></defs>';
    return {defs,color,dark,lighter,shine,stone:'url(#'+id+(oneMetal?'-metal)':'-stone)'),metal:'url(#'+id+'-metal)',grain:'url(#'+id+'-grain)',edge:metal[0],glint:metal[2],wire:metal[1]};
  }
  function enamel(d,p){
    return path(d,p.stone,p.edge,.8)+path(d,p.grain);
  }
  function rail(d,p,width){
    return path(d,'none',p.edge,width+.65)+path(d,'none',p.metal,width)+path(d,'none',p.glint,Math.max(.34,width*.24),'opacity=".82"');
  }
  function pearl(x,y,r,p){
    return ellipse(x,y,r*.98,r,p.stone,p.dark,.40)+ellipse(x,y,r*.98,r,p.grain)+
      ellipse(x-r*.30,y-r*.38,r*.25,r*.15,p.shine,'none',0,'opacity=".91"')+
      path('M'+round(x+r*.18)+' '+round(y+r*.77)+'q'+round(r*.40)+' '+round(-r*.02)+' '+round(r*.55)+' '+round(-r*.30),'none',p.lighter,.45);
  }
  const local=(x,y,s,component)=>g('translate('+round(x)+' '+round(y)+') scale('+s+')',component);
  function leaf(x,y,angle,s,p){
    return g('translate('+x+' '+y+') rotate('+angle+') scale('+s+')',
      path('M0 0C-6-2-8-9-6-15C1-12 4-5 0 0Z',p.metal,p.edge,.6)+path('M0-1Q-4-6-5-12','none',p.glint,.65));
  }
  function flower(p){
    let petals='';
    for(let i=0;i<7;i++)petals+=g('rotate('+round(i*360/7)+')',enamel('M-.4-.8C-3.6-3.3-4.5-7.6-1.5-8.5C1.3-9.1 3.7-7.2 3.2-5.5C2.7-3.1 1.1-1.6-.4-.8Z',p)+path('M-.8-6.8Q-.7-4.5 0-2.6','none',p.shine,.5));
    return petals+ellipse(0,0,2.7,2.6,p.metal,p.edge,.55)+ellipse(-.5,-.8,.8,.5,p.glint);
  }
  function ribbon(p){
    const bow='M-.7.1C-6.6-5.9-13.1-8.5-14-5.4C-15.4-2.2-12.6 1.6-13.5 4.2C-9.4 6.9-4.8 3.4-.7.1Z';
    const tails=enamel('M-1 1Q-4 8-10.4 12L-5.5 12.3-4.1 15.4Q.5 9.5 1.8 2Z',p)+enamel('M1.4 1.4Q5.5 7.3 10.7 8.1L8.2 10.4 9.2 13.6Q3 11.4-.2 3Z',p);
    return tails+enamel(bow,p)+g('scale(-1 .90)',enamel(bow,p))+path('M-11.6-3.3Q-7.9-3.8-2.6-.1M11.9-3.1Q7.3-3.3 2.3-.4','none',p.shine,.72)+
      enamel('M-2.5-2.6Q.1-4.1 2.7-2.1L2.3 2.7Q-.4 4-2.3 2.7Z',p);
  }
  function station(x,width,base,sag){const t=x/width;return base+sag*(1-t*t);}
  function wire(width,base,sag,p,weight=1){
    const d='M-'+width+' '+base+'Q0 '+(base+2*sag)+' '+width+' '+base;
    return rail(d,p,weight);
  }
  function links(width,base,sag,count,p,scale=1){
    let result=wire(width,base,sag,p,.68*scale);
    for(let i=0;i<count;i++){
      const x=-width+(i+.5)*2*width/count,y=station(x,width,base,sag),angle=Math.atan(-2*sag*x/(width*width))*180/Math.PI;
      result+=g('translate('+round(x)+' '+round(y)+') rotate('+round(angle)+')',
        ellipse(0,0,width/count+.4,(i%2?.58:1.12)*scale,'none',p.edge,.70*scale)+
        path('M-'+round(width/count*.6)+' -.4q.8-.6 1.6-.2','none',p.glint,.42*scale));
    }
    return result;
  }
  function necklace(id,p){
    const w=32,base=-9,sag=id==='ribbon'?11:23,bottom=base+sag;
    let s='';
    if(id==='pearl'){
      s=wire(w,base,sag,p,.9);
      for(let i=-8;i<=8;i++){
        const x=i*3.8,y=station(x,w,base,sag);
        s+=pearl(x,y,2.3+.75*(1-Math.abs(i)/8),p);
      }
      return s;
    }
    if(id==='ribbon'){
      const silk='M-32-10Q-2 10 32-10L32-6Q0 15-32-6Z';
      return enamel(silk,p)+path('M-31-9Q0 11 31-9','none',p.shine,.65)+local(0,4,.85,ribbon(p));
    }
    s=links(w,base,sag,25,p);
    if(id==='daisy'){
      for(const [x,a] of [[-14,-64],[14,64]])s+=leaf(x,station(x,w,base,sag),a,.43,p);
      for(const [x,scale] of [[-12,.6],[12,.6],[0,.89]])s+=local(x,station(x,w,base,sag),scale,flower(p));
      return s;
    }
    s+=ellipse(0,bottom+1,1.3,2.4,'none',p.edge,.9)+ellipse(-.1,bottom+.9,.8,1.7,'none',p.glint,.40);
    if(id==='dew'){
      const drop='M0-8C-1.7-3.3-7.8.8-7.5 5.3C-7.2 10.1-3.2 13.2.5 13C5.5 12.8 8 8.6 7.5 4.9C6.7.2 1.7-4.5 0-8Z';
      return s+local(0,bottom+7,.83,enamel(drop,p)+path('M-.8-4.2Q-3.8 1.4-4.6 4.2','none',p.shine,1.30)+path('M1.3 10.2Q4.1 9.1 5.1 7','none',p.lighter,.64));
    }
    if(id==='moon'){
      const moon='M4.4-9.2C-5.8-10.9-11-1.6-7.3 5.3C-3.5 12.5 5.8 12 10.1 5.4C1.6 10.1-4.5 1.4 4.4-9.2Z';
      const spark='M0-3.8L1.1-1.2 3.4 0 1 1.1 0 3.5-.9 1-3.4 0-1-.9Z';
      return s+local(0,bottom+7,.90,enamel(moon,p)+path('M-.8-7.2Q-7.4-4.2-6.4 2.3','none',p.shine,.70))+
        rail('M8 13Q9.3 17.4 11.2 18',p,.70)+local(11.2,19.6,.84,path(spark,p.metal,p.edge,.60));
    }
    const heart='M0-3.8C-6.1-11.3-12.8-6.1-11.5-.4C-10.4 5 0 12.3 0 12.3S11.4 4.1 11.8-1.5C12.2-7.9 5.8-10.7 0-3.8Z';
    return s+local(0,bottom+8,.82,enamel(heart,p)+path('M-8.4-4.3Q-5.6-8.2-.8-3.5M6.1.1Q4.2 4.2.1 6.8M3.9 3.8q-2.6.4-2.4-1.5q2.1-.5 2.4 1.5','none',p.glint,.75)+ellipse(9.7,.8,.8,1.4,p.metal,p.edge,.5));
  }
  function ringFace(id,p){
    if(id==='pearl')return leaf(-5,2,-95,.48,p)+leaf(4,2,105,.48,p)+pearl(-8,1,2.3,p)+pearl(8,1,2.3,p)+pearl(0,-1,6,p);
    if(id==='rose'){
      const bloom='M-8-.8C-9.4-5.6-6.2-7.8-3.6-7.7C-1.3-10.3 3.4-9.5 5.4-7.6C10.2-7.4 11-3.2 8.8-.5C10.3 3.4 7.4 6.1 4.4 6.5C1.9 9.3-3.1 8.7-4.8 6.3C-8.5 6.6-10.4 2.4-8-.8Z';
      return leaf(-6,4,-77,.70,p)+leaf(6,4,80,.62,p)+enamel(bloom,p)+path('M-6.7-.6Q-4.6-5.4-.8-5.2Q4.1-6.1 6.1-2Q6.4 1.7 2.3 3.4Q-1.4 4.2-3.9 1.2Q-4.3-1.6-1.2-2.8Q1.3-3.5 3.1-1.4Q3.3.7.3 1','none',p.dark,1)+path('M-6.9 2.6Q-5.4 5.2-2.3 5.7M3.9-6.6Q5.5-5.8 6.8-4.9','none',p.shine,.7);
    }
    if(id==='cushion'){
      const cut='M-5.6-8.2H5.6L8.7-5.2V5.1L5.6 8H-5.5L-8.5 5V-5Z';
      return enamel(cut,p)+path('M-5.6-8.2H5.6L3.8-5.5H-3.7Z',p.shine)+path('M8.7-5.2V5.1L5.6 3.4V-3.2Z',p.dark)+path('M-5.6 8H5.6L3.7 5.2H-3.5Z',p.lighter)+path('M-8.5-5L-5.5-3.4V3.3L-8.5 5Z',p.lighter)+path('M-3.7-5.5H3.8L5.6-3.2V3.4L3.7 5.2H-3.5L-5.5 3.3V-3.4Z','none',p.lighter,.55)+[-1,1].map(x=>[-1,1].map(y=>ellipse(x*6.8,y*6.6,.85,.9,p.metal,p.edge,.30)).join('')).join('');
    }
    if(id==='star'){
      const star='M.6-10.5L3.5-3.2 10.4-2.2 5.2 2.9 6.2 10.1 0 6.6-6.6 9.8-5.3 2.6-10.1-2.9-3.3-3.4Z';
      return enamel(star,p)+path('M.6-9.5L-.1 1 3.2-2.8ZM-.1 1L9.3-2.1 4.2.7ZM-.1 1L5.7 8.9 1.5 5.4Z',p.shine,'none',0,'opacity=".63"')+pearl(0,1,1.6,p);
    }
    if(id==='bow')return local(0,0,.85,ribbon(p));
    const wing='M-1.4.4C-6.3-1.1-13.4-4.9-12-9C-9.5-12.3-3.2-7.7-1.4.4ZM-1.2 1.2C-4 7.8-9.5 8.5-10.1 5.2C-10.2 2.4-5.8-.2-1.2 1.2Z';
    const half=enamel(wing,p)+path('M-1.8 0Q-5.6-4.8-9.6-7.2M-2.4 1.8Q-5.9 3.2-7.7 5.6','none',p.glint,.75);
    return half+g('scale(-1 1)',half)+ellipse(0,.6,1.2,4.5,p.metal,p.edge,.5)+path('M-.3-3Q-1-5-2.4-6M.5-3Q1.6-5.3 2.8-5.7','none',p.edge,.65);
  }
  function ring(id,p,card){
    if(card){
      const band='M-.8-2C-13.3-3-22.5 4-22 14.4C-21.4 25.4-9.7 30.8 1.8 29.6C14.9 28.8 23.2 19.4 21.3 10.4C19.5 2.5 10-3.5-.8-2Z';
      return rail(band,p,3.9)+rail('M-16 2.6Q-8.1-1.3-4.2-.8M16.6 2Q10.7-.5 5.1-.7',p,1.6)+ringFace(id,p);
    }
    const shank='M-15.1-1.9C-13.8 2.5-7.7 4.8.6 4.8C8.7 4.9 13.2 2.7 15.2-.9';
    return rail(shank,p,3.7)+rail('M-14-2Q-9.7-.2-5.8-.5M14.1-1.7Q11.2.4 5-.7',p,1.15)+ringFace(id,p);
  }
  function textile(d,p,width){
    return path(d,'none',p.dark,width+.5)+path(d,'none',p.stone,width)+path(d,'none',p.shine,.48,'opacity=".67"');
  }
  function braceletBack(id,p){
    const curve='M-34-5C-34-30 34-30 34-5';
    if(id==='ribbon')return textile(curve,p,3.1);
    let back=rail(curve,p,id==='bangle'?5:1);
    if(id!=='chain'&&id!=='beads')return back;
    for(let i=1;i<=14;i++){
      const theta=Math.PI*i/15,x=-34*Math.cos(theta),y=-5-18.7*Math.sin(theta);
      if(id==='chain'){
        const angle=180/Math.PI*Math.atan2(-18.7*Math.cos(theta),34*Math.sin(theta));
        back+=g('translate('+round(x)+' '+round(y)+') rotate('+round(angle)+')',
          ellipse(0,0,3.65,i%2?1.4:2.45,'none',p.edge,1.58)+ellipse(0,0,3.65,i%2?1.4:2.45,'none',p.stone,1.08));
      }else back+=i%2?pearl(x,y,2,p):ellipse(x,y,1.7,1.45,p.metal,p.edge,.42);
    }
    return back;
  }
  function bracelet(id,p,card){
    const w=34,base=-5,sag=card?21:10;
    let s=card?braceletBack(id,p):'';
    const beadY=x=>station(x,w,base,sag),front=beadY(0);
    if(id==='bangle'){
      const band='M-34-6Q0 '+(base+2*sag)+' 34-6L33-1Q0 '+(base+2*sag+9)+' -33-1Z';
      s+=enamel(band,p)+rail('M-33-5Q0 '+(base+2*sag+1)+' 33-5',p,.85);
      for(const x of [-20,-10,0,10,20])s+=path('M'+x+' '+round(beadY(x)+.8)+'q1 2.7 2.6 3.4q-2.2.2-3.5-1.8Z',p.glint);
      return s;
    }
    if(id==='ribbon'){
      const silk='M-34-7Q0 '+(base+2*sag-1)+' 34-7L33-2Q0 '+(base+2*sag+6)+' -33-2Z';
      return s+enamel(silk,p)+path('M-32-5Q0 '+(base+2*sag+1)+' 32-5','none',p.shine,.72)+local(5,beadY(5)+1,.86,ribbon(p));
    }
    if(id==='chain'){
      for(let i=0;i<10;i++){
        const x=-30+i*6.65,y=beadY(x),ang=Math.atan(-2*sag*x/(w*w))*180/Math.PI;
        s+=g('translate('+round(x)+' '+round(y)+') rotate('+round(ang)+')',ellipse(0,0,4.8,i%2?1.9:3.5,'none',p.edge,2.2)+ellipse(0,0,4.8,i%2?1.9:3.5,'none',p.stone,1.55)+path('M-3.1-1.4q1.4-1.2 3.4-1','none',p.shine,.64));
      }
      return s;
    }
    s+=wire(w,base,sag,p,1.15);
    if(id==='beads'){
      for(let i=-5;i<=5;i++){
        const x=i*6.2,y=beadY(x),r=i%2?2.2:3.7;
        s+=i%2?ellipse(x,y,r,r*.88,p.metal,p.edge,.55):pearl(x,y,r,p);
      }
      return s;
    }
    if(id==='clover'){
      for(const x of [-22,-15,16,23])s+=ellipse(x,beadY(x),1.6,1.55,p.metal,p.edge,.4);
      const lobe='M0 .3C-1.4-2.1-5-3.6-5.1-6.3C-5.2-8.7-1.8-9.7-.2-7.4C2.2-9.7 5.3-8.6 4.8-5.8C4.3-3.4 1.3-1.3 0 .3Z';
      const clover=Array.from({length:4},(_,k)=>g('rotate('+(k*90-12)+')',enamel(lobe,p))).join('')+ellipse(0,0,1.3,1.25,p.metal,p.edge,.4);
      return s+local(1,front,.84,clover);
    }
    const shell='M0 6C-2.3 4.2-8-.7-8.5-4.5C-8.5-6.3-6.3-6.8-5.6-6.3C-5.3-8.7-2.8-8.7-2-7.7C-.7-9.8 1.9-9.4 2.5-7.8C4.4-9.1 6.4-7.7 6.3-6.3C8.4-6.8 9.2-4.7 8-2.2C6 1.3 2.3 4.3 0 6Z';
    const fan=enamel(shell,p)+path('M0 5L-5.6-5.2M-.1 4.2L-2.1-6M.6 4.8L2.1-6.4M1.4 4L5.6-5','none',p.glint,.6);
    for(const x of [-20,0,20])s+=local(x,beadY(x)+2,x===0?.80:.53,fan);
    for(const x of [-29,-11,11,29])s+=pearl(x,beadY(x),1.6,p);
    return s;
  }
  function itemFor(kind,id){return Array.isArray(cards[kind])?cards[kind].find(row=>row.id===id):null;}
  function design(kind,item,p,card){
    if(kind==='necklace')return necklace(item.id,p);
    if(kind==='ring')return ring(item.id,p,card);
    return bracelet(item.id,p,card);
  }
  function coveredWrist(state){
    if(state.mode==='casual')return window.CoordArt?.sleeve?.(state.casual||{})?.sleeveMode==='long';
    return window.PrincessAssets?.costume?.dresses?.[state.dress]?.sleeveMode==='long'||state.dress==='morning'||state.dress==='riding';
  }
  function necklineBack(item,p,card){
    const curve=card?'M-32-9C-32-23 32-23 32-9':'M-32-9Q-34-12-34.4-16M32-9Q34-12 34.4-16';
    if(item.id==='ribbon')return textile(curve,p,3.2);
    let back=rail(curve,p,.9);
    if(card&&item.id==='pearl'){
      for(let i=1;i<17;i++){
        const theta=Math.PI*i/17;
        back+=pearl(-32*Math.cos(theta),-9-10.5*Math.sin(theta),1.65,p);
      }
    }
    return back;
  }
  function scene(kind,state={}){
    const item=itemFor(kind,state[kind]);if(!item||item.id==='none')return '';
    const p=paints(kind,item,state[kind+'Color'],state[kind+'MetalColor']);
    let position;
    if(kind==='necklace'){
      const collar=state.mode==='casual'||['morning','riding'].includes(state.dress);
      position='translate(300 '+(collar?315:310)+') scale(.61)';
    }else if(kind==='ring'){
      // Second finger from the outside, immediately above its painted nail at (161,502).
      position='translate(164.1 493.1) rotate(19) scale(.169)';
    }else{
      // On the opposite wrist. Position the front arc just below a long sleeve.
      position=coveredWrist(state)?'translate(417.5 479.2) rotate(-15) scale(.335)':'translate(410.6 464.7) rotate(-25) scale(.255)';
    }
    return '<g class="worn-jewelry worn-'+kind+'" data-jewelry="'+item.id+'" pointer-events="none">'+p.defs+g(position,(kind==='necklace'?necklineBack(item,p,false):'')+design(kind,item,p,false))+'</g>';
  }
  function card(kind,id,state={}){
    const item=itemFor(kind,id);if(!item)return '';
    if(id==='none')return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 64" aria-hidden="true"><circle cx="40" cy="32" r="17" fill="none" stroke="#b8a792" stroke-width="2"/><path d="M27 45L53 19" stroke="#aa8e78" stroke-width="3" stroke-linecap="round"/></svg>';
    const selected=!state[kind]||state[kind]===id;
    const p=paints(kind,item,selected?state[kind+'Color']:null,selected?state[kind+'MetalColor']:null);
    const box={necklace:'-38 -22 76 64',ring:'-35 -19 70 58',bracelet:'-40 -28 80 60'}[kind];
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+box+'" role="img" aria-label="'+item.label+'">'+p.defs+(kind==='necklace'?necklineBack(item,p,true):'')+design(kind,item,p,true)+'</svg>';
  }
  function preview(kind,state={}){
    if(!Array.isArray(cards[kind]))return '';
    const art=window.PrincessArt;
    if(!art?.render)return card(kind,state[kind]||'none',state);
    const bounds={necklace:'251 284 98 77',ring:'149 475 48 43',bracelet:'390 445 54 58'}[kind];
    const svg=art.render({...state,transparentBackground:true,hideSceneSparkles:true});
    return svg.replace('viewBox="0 0 600 800"','viewBox="'+bounds+'"').replace('width="600" height="800"','width="200" height="175"');
  }
  window.PrincessJewelry=Object.freeze({cards,scene,card,preview});
})();
