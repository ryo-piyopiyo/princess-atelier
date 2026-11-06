/* Small watercolor figures stand in the middle distance. The same geometry
   is used by the play stage and the exported keepsake. Numbers are percentages
   of the visible floor; x is the foot center, y the baseline, h the height. */
(() => {
  'use strict';
  const residents={
    garden:[['gardener',80,68,23]], palace:[['attendant',81,73,30]],
    sky:[['grandpa',20,72,26]],room:[],park:[['balloon-family',78,65,22]],
    town:[['florist',19,68,29],['movie-friends',80,59,17]],
    castle:[['usher',75,68,21]],amusement:[['usher',18,70,23],['balloon-family',79,61,18]],
    ferris:[['balloon-family',81,67,25]],carousel:[['usher',21,67,24]],
    coaster:[['movie-friends',80,66,23]],aquarium:[['guide',81,66,25]],
    road:[['movie-friends',19,64,20]],mall:[['florist',20,73,26],['movie-friends',77,63,19]],
    cinema:[['movie-friends',75,70,22]],mountain:[['hiker',75,69,24]],
    thicket:[['hiker',23,72,24]],sandbox:[['pond-child',24,70,16]],
    playground:[['grandpa',80,71,24]],adventure:[['butterfly-friends',22,68,20]],
    riverbank:[['pond-child',19,78,16]],riverpark:[['grandpa',80,74,28]],
    dolphin:[['guide',80,73,26]],tank:[['visitors',20,76,28]],
    souvenir:[['guide',72,68,22]],ballroom:[['violinist',19,65,24],['dancers',80,72,29]],
    'great-hall':[['attendant',22,68,26]],'castle-library':[['librarian',78,74,30]],
    'music-room':[['violinist',23,74,30]],'rose-house':[['gardener',80,73,24]],
    'lily-pond':[['grandpa',19,74,25]],'butterfly-meadow':[['butterfly-friends',73,74,20]],
    'berry-patch':[['berry-child',79,72,21]]
  };
  function markup(scene,bounds){
    const guests=residents[scene],art=window.PrincessAssets?.guests;
    if(!guests?.length||!art||!bounds.width||!bounds.height)return '';
    const {width,height}=bounds;
    const figures=guests.map(([id,x,y,h])=>{
      const asset=art[id];if(!asset)return '';
      const dy=Math.min(height*h/100,width*.32/asset.aspect),dx=dy*asset.aspect;
      const cx=width*x/100,bottom=height*y/100,left=cx-dx/2;
      const contrast=scene==='cinema'?.66:scene==='sky'?.83:.96;
      const body='<image href="'+asset.src+'" x="'+left+'" y="'+(bottom-dy)+'" width="'+dx+'" height="'+dy+'" opacity="'+contrast+'"/>';
      const shadow='<ellipse cx="'+cx+'" cy="'+(bottom-dy*.012)+'" rx="'+(dx*.34)+'" ry="'+(dy*.018)+'" fill="#745f54" opacity=".14"/>';
      return '<g data-guest="'+id+'">'+shadow+body+'</g>';
    }).join('');
    return '<svg xmlns="http://www.w3.org/2000/svg" class="scenery-people" x="'+bounds.x+'" y="'+bounds.y+'" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" aria-hidden="true">'+figures+'</svg>';
  }
  let previous='';
  function update(scene){
    const host=document.getElementById('sceneGuests');
    const width=host.clientWidth,height=host.clientHeight,key=[scene,width,height].join(':');
    if(previous===key)return;
    previous=key;host.innerHTML=markup(scene,{x:0,y:0,width,height});
  }
  window.PrincessScenery=Object.freeze({markup,update});
})();
