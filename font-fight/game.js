
(function(){'use strict';
const $=id=>document.getElementById(id),TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const ELEMENTS={
 Fire:{color:'#ff4b24',pale:'#ffd072',strong:'Nature',weak:'Ice'}, Ice:{color:'#5edcff',pale:'#e8fdff',strong:'Fire',weak:'Storm'},
 Storm:{color:'#ffe34c',pale:'#fffbd0',strong:'Ice',weak:'Shadow'}, Shadow:{color:'#b45cff',pale:'#f0d7ff',strong:'Storm',weak:'Cosmic'},
 Light:{color:'#208cff',pale:'#dff7ff',strong:'Cosmic',weak:'Nature'}, Nature:{color:'#55e87d',pale:'#d6ff83',strong:'Light',weak:'Fire'},
 Cosmic:{color:'#a06bff',pale:'#e8d8ff',strong:'Shadow',weak:'Light'}
};
const MAPS=[
 {name:'Neon Nexus',mult:1.0,desc:'The classic arena',bg1:'#0a0a1e',bg2:'#1a1a3a',accent:'#00ffff'},
 {name:'Void Expanse',mult:1.4,desc:'Open cosmic battlefield',bg1:'#050514',bg2:'#140a2a',accent:'#a064ff'},
 {name:'Crystal Caverns',mult:1.3,desc:'Underground crystal maze',bg1:'#05141a',bg2:'#0a2a3a',accent:'#00dcff'},
 {name:'Ember Wastes',mult:1.5,desc:'Volcanic wasteland',bg1:'#1e0a05',bg2:'#4a1a0a',accent:'#ff6400'},
 {name:'Storm Peaks',mult:1.2,desc:'Mountain storm summit',bg1:'#0f0f19',bg2:'#23233f',accent:'#96b4ff'}
];
let currentMap=0;
const R=[
['RAMPAGE','Anton','Fire',174,82,63,'Inferno Breaker'],['VOLTAGE','Monoton','Storm',130,75,94,'Thunder Crown'],['NOCTURNE','UnifrakturCook','Shadow',150,86,67,'Eclipse Maw'],['TURBO','Faster One','Storm',115,70,100,'Mach Lightning'],['TITAN','Black Ops One','Nature',205,93,48,'Worldbreaker'],['GLITCH','Rubik Glitch','Light',134,76,92,'Reality Error'],['DREAD','Nosifer','Fire',147,91,64,'Bloodflare'],['PIXEL','Press Start 2P','Light',126,74,82,'Critical Overflow'],['ROYAL','Cinzel','Light',168,84,60,'Solar Decree'],['CHAOS','Creepster','Fire',141,88,79,'Wildfire Grin'],['BRAWL','Bungee','Nature',186,90,53,'Seismic Type'],['ORBIT','Orbitron','Ice',144,78,87,'Absolute Zero'],['VENOM','Metal Mania','Nature',150,87,72,'Toxic Bloom'],['PHANTOM','Pirata One','Shadow',138,82,90,'Ghost Fleet'],['HAVOC','Bangers','Fire',158,92,74,'Meteor Riot'],['FROST','Iceberg','Ice',166,79,69,'Cryo Prison'],['WRAITH','Frijole','Shadow',142,89,81,'Soul Spiral'],['NOVA','Russo One','Light',131,85,93,'Supernova Type'],['BOLT','Jersey 10','Storm',122,73,99,'Zero Frame'],['REBEL','Permanent Marker','Fire',157,86,78,'Anarchy Arc'],['REAPER','Special Elite','Shadow',149,94,66,'Final Draft'],['ARCADE','Silkscreen','Light',139,77,89,'Extra Life'],['DRIFT','Racing Sans One','Ice',131,80,96,'Whiteout Rush'],['KRAKEN','Graduate','Nature',192,88,51,'Abyssal Roots'],['HEX','VT323','Shadow',120,81,98,'Cursed Code'],['BLAZE','Luckiest Guy','Fire',154,90,76,'Sunspike'],['TEMPEST','Fjalla One','Storm',146,83,86,'Sky Rupture'],['RONIN','Kaushan Script','Ice',160,91,71,'Mooncut Blizzard'],['COLOSSUS','Archivo Black','Nature',210,95,43,'Continental Shift'],['VOID','Rubik Glitch','Cosmic',133,84,95,'Event Horizon'],
['JUGGERNAUT','Alfa Slab One','Cosmic',205,88,45,'Event Horizon Crush'],['BRAWLER','Titan One','Cosmic',168,90,62,'Gravity Slam'],['SPECTRE','Righteous','Cosmic',131,78,95,'Phantom Nebula'],['NEBULA','Audiowide','Cosmic',152,82,78,'Stellar Nursery'],['CIRCUIT','Wallpoet','Cosmic',125,75,98,'Quantum Overload'],['DEVOUR','Eater','Cosmic',176,94,55,'Consume the Stars'],['CARNAGE','Butcherman','Cosmic',157,93,68,'Blood Moon Rising'],['COSMOS','Geostar Fill','Cosmic',147,80,85,'Big Bang Requiem'],['INFERNO','Rubik Burned','Cosmic',163,92,60,'Supernova Burn'],['VELVET','Fascinate Inline','Cosmic',136,77,90,'Silk Nebula'],['SAVAGE','Lacquer','Cosmic',173,89,72,'Untamed Void'],['IRONCLAD','Staatliches','Cosmic',200,85,48,'Dreadnought Protocol'],
['TITANFALL','Bowlby One','Cosmic',189,87,58,'Orbital Drop'],['HEXTECH','Chakra Petch','Cosmic',141,83,88,'Circuit Nova'],['STARDUST','Zen Dots','Cosmic',152,79,82,'Dust to Stars']
].map((d,i)=>({id:i,word:d[0],font:d[1],element:d[2],hp:d[3],atk:d[4],spd:d[5],ult:d[6]}));
/* Every contender owns a distinct combat signature: geometry, motion, projectile silhouette and cinematic grammar. */
const FX=[
['#ff2915','#ffc43d','tri','fountain','flame','meteor'],['#ffe834','#59f3ff','zig','chain','bolt','crown'],['#7b2cff','#e3b3ff','crescent','orbit','eclipse','maw'],['#fff04a','#25bdff','line','speed','drill','mach'],['#54df70','#b7ff6d','rock','quake','boulder','world'],['#26a9ff','#ff56da','pixel','glitch','cube','error'],['#ff183d','#ff866e','drop','saw','blood','bloodflare'],['#48d7ff','#ffffff','square','grid','pixel','overflow'],['#1989ff','#ffd769','diamond','ray','lance','decree'],['#ff6a16','#dc2aff','spiral','chaos','grin','wildfire'],['#72ed66','#dfff56','hex','impact','fist','seismic'],['#7aeaff','#c9f8ff','comet','orbit','iceball','zero'],['#3cff6e','#d0ff35','thorn','vine','spore','bloom'],['#895cff','#d9f5ff','wisp','float','ghost','fleet'],['#ff3b1f','#ffe563','star','scatter','meteor','riot'],['#6eeeff','#ffffff','shard','crystal','icicle','prison'],['#c066ff','#e7c0ff','ribbon','spiral','soul','soulstorm'],['#1e9cff','#fff27b','star','nova','prism','supernova'],['#ffe820','#55dfff','frame','stutter','boltbox','zeroframe'],['#ff3c21','#fff0c6','slash','brush','arc','anarchy'],['#8e54ff','#e7d7ff','glyph','ash','skull','finaldraft'],['#16bcff','#ff48db','pixel','arcade','disk','extralife'],['#b6f5ff','#66bfff','mist','drift','wind','whiteout'],['#35db78','#52caff','tentacle','coil','bubble','abyss'],['#a05cff','#7affcf','code','rain','codebolt','curse'],['#ff4d1f','#fff35c','petal','sun','sunshot','sunspike'],['#ffe05a','#75e7ff','crescent','cyclone','gale','rupture'],['#8de7ff','#dde7ff','slash','moon','blade','blizzard'],['#4de06e','#dfef9b','rock','gravity','slab','continent'],['#a06bff','#e8d8ff','orb','vortex','voidorb','horizon'],
['#8a5cff','#d0b8ff','orb','vortex','voidorb','horizon'],['#9a6bff','#e0ccff','star','orbit','meteor','supernova'],['#b48cff','#f0e0ff','wisp','float','ghost','abyss'],['#a06bff','#e8d8ff','comet','nova','prism','supernova'],['#7a5cff','#c8b8ff','square','grid','codebolt','zero'],['#6a3aff','#b898ff','crescent','vortex','eclipse','maw'],['#8a4cff','#d8a8ff','shard','chaos','blade','bloodflare'],['#aa7bff','#f0e8ff','star','orbit','prism','supernova'],['#9a5cff','#e8ccff','tri','fountain','meteor','supernova'],['#ba8cff','#f5e8ff','diamond','float','lance','decree'],['#7a4cff','#c8a8ff','spiral','vortex','voidorb','horizon'],['#8a6bff','#d8ccff','hex','gravity','slab','continent'],
['#95a0ff','#e0d8ff','rock','impact','boulder','seismic'],['#7ab8ff','#d0e8ff','pixel','glitch','cube','error'],['#a88cff','#f0e0ff','star','nova','prism','supernova']
].map((a,i)=>({c:a[0],c2:a[1],shape:a[2],motion:a[3],shot:a[4],ult:a[5],sig:i}));
const UPGRADES=[
{name:'Reinforced glyphs',desc:'+22% maximum health.',icon:'HP'}, {name:'Kerning fury',desc:'+18% attack power.',icon:'ATK'},
{name:'Overclocked ink',desc:'+20% movement and attack speed.',icon:'SPD'}, {name:'Ultimate battery',desc:'Begin next round at 55% charge.',icon:'ULT'},
{name:'Prismatic armor',desc:'Reduce incoming damage by 16%.',icon:'DEF'}, {name:'Critical serif',desc:'+18% critical chance.',icon:'CRIT'},
{name:'Elemental surge',desc:'Stronger elemental advantage.',icon:'ELEM'}
];
let chosen=[null,null],mode='select',round=1,wins=[0,0],fighters=[],particles=[],projectiles=[],rings=[],bolts=[],logs=[],dmgNums=[],paused=false,muted=false,actx=null,shake=0,flash=0,hitstop=0,slowmo=0,cinematic=null,roundEnd=0,last=0,W=800,H=500,DPR=1,matchStats=null,upgradeMods=[{},{}];
const keys=new Set(),joy={active:false,id:null,cx:0,cy:0,dx:0,dy:0},action={attack:0,dash:0,ult:0};
function buf(kind){const t=action[kind];if(t&&performance.now()-t<160)return true;if(t)action[kind]=0;return false}
const cv=$('cv'),ctx=cv.getContext('2d'),stage=$('stage');
function elem(d){return ELEMENTS[d.element]}function font(d,px){return `400 ${px}px "${d.font}",system-ui,sans-serif`}
let rosterFilter='All';
function buildElemFilter(){const root=$('elemFilter');if(!root)return;root.innerHTML='';['All','Fire','Ice','Storm','Shadow','Light','Nature','Cosmic'].forEach(el=>{const b=document.createElement('button');b.className='elem-pill'+(rosterFilter===el?' on':'');b.type='button';if(el!=='All'){const c=ELEMENTS[el].color;b.style.color=c}b.textContent=el;b.onclick=()=>{rosterFilter=el;buildElemFilter();buildRoster();sfx('ui')};root.appendChild(b)})}
function buildRoster(){const root=$('roster');root.innerHTML='';R.forEach((d,idx)=>{if(rosterFilter!=='All'&&d.element!==rosterFilter)return;const e=elem(d),b=document.createElement('button');b.className='font-card';b.type='button';b.dataset.id=d.id;b.style.animationDelay=(idx*18)+'ms';b.innerHTML=`<span class="element" style="color:${e.color}">${d.element} · ${d.ult}</span><span class="preview" style="font-family:'${d.font}',system-ui;color:${e.color}">${d.word}</span>${bar('HP',d.hp/131,d.hp,'#32d886')}${bar('ATK',d.atk/100,d.atk,'#ff4f6f')}${bar('SPD',d.spd/100,d.spd,'#39a9ff')}`;b.onclick=()=>selectFighter(d);root.appendChild(b)})}
function bar(n,v,x,c){return `<span class="tinybar"><span>${n}</span><i style="--v:${v*100}%;--c:${c}"></i><b>${x}</b></span>`}
function selectFighter(d){audioInit();if(chosen[0]&&chosen[0].id===d.id)chosen[0]=null;else if(chosen[1]&&chosen[1].id===d.id)chosen[1]=null;else if(!chosen[0])chosen[0]=d;else if(!chosen[1])chosen[1]=d;else chosen=[d,null];sfx('ui');renderSelection()}
function renderSelection(){[0,1].forEach(i=>{const s=$('slot'+(i+1)),d=chosen[i],w=s.querySelector('.pickword'),m=s.querySelector('.pickmeta');s.classList.toggle('filled',!!d);if(d){w.textContent=d.word;w.style.fontFamily=`"${d.font}",system-ui`;w.style.color=FX[d.id].c;m.textContent=`${d.element} · ${d.ult}`}else{w.textContent='Choose';w.style.fontFamily='inherit';w.style.color='';m.textContent=i?'Then choose their rival':'Tap any contender below'}});document.querySelectorAll('.font-card').forEach(c=>{c.classList.toggle('chosen1',chosen[0]&&+c.dataset.id===chosen[0].id);c.classList.toggle('chosen2',chosen[1]&&+c.dataset.id===chosen[1].id)});$('pickPrompt').textContent=!chosen[0]?'Choose your fighter':!chosen[1]?'Choose the AI rival':'Rivals locked';$('fightBtn').disabled=!(chosen[0]&&chosen[1]);$('fightBtn').textContent=chosen[0]&&chosen[1]?`${chosen[0].word} VS ${chosen[1].word}`:'Choose two fighters'}
function randomRivals(){let a=pick(R),b;do b=pick(R);while(b===a);chosen=[a,b];renderSelection();sfx('ui')}
function advantage(a,b){if(ELEMENTS[a.element].strong===b.element)return 1;if(ELEMENTS[a.element].weak===b.element)return-1;return 0}
function matchupText(){const a=advantage(chosen[0],chosen[1]);if(a>0)return `${chosen[0].element} breaks ${chosen[1].element}`;if(a<0)return `${chosen[1].element} breaks ${chosen[0].element}`;return'Neutral elements'}
function copyDef(d,side,net){const m=upgradeMods[side];return{def:d,fx:FX[d.id],side,player:net?true:side===0,isLocal:net?!!net.local:side===0,x:side?W*.82:W*.18,y:H*.55,vx:0,vy:0,max:d.hp*(m.hp||1),hp:d.hp*(m.hp||1),atk:d.atk*(m.atk||1),spd:d.spd*(m.spd||1),armor:m.armor||0,crit:.06+(m.crit||0),elementAmp:1+(m.elementAmp||0),energy:m.startEnergy||0,attackCD:.35,dashCD:0,iframe:0,stun:0,flash:0,dash:0,dead:false,ultUsed:0,hits:0,damage:0,taken:0,crits:0,bob:rnd(0,10),facing:side?-1:1,trail:[],aiThink:0,aiX:0,aiY:0}}
function buildMapGrid(onPick){
 const grid=$('mapGrid');grid.innerHTML='';
 MAPS.forEach((m,i)=>{
  const card=document.createElement('div');card.className='map-card';
  card.innerHTML=`<div class="map-prev" style="background:linear-gradient(165deg,${m.bg1},${m.bg2})"><div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 60%,${m.accent}33,transparent 70%)"></div><div style="position:absolute;bottom:8px;left:12px;font-size:11px;font-weight:800;letter-spacing:2px;color:${m.accent}">${m.mult}x SIZE</div></div><div class="map-info"><div class="map-name">${m.name}</div><div class="map-meta"><span class="map-size">${m.mult===1?'Standard':m.mult>1.3?'Large':'Bigger'}</span></div><div class="map-desc">${m.desc}</div></div>`;
  card.onclick=()=>{onPick(i);sfx('ui')};
  grid.appendChild(card);
 });
}
function showMapSelect(onPick){
 buildMapGrid((i)=>{hideMapSelect();onPick(i)});
 $('mapSelect').classList.add('show');
 $('mapClose').onclick=()=>{hideMapSelect();onPick(0)};
}
function hideMapSelect(){$('mapSelect').classList.remove('show')}
function startMatch(){audioInit();round=1;wins=[0,0];upgradeMods=[{},{}];matchStats={damage:[0,0],hits:[0,0],ults:[0,0],crits:[0,0],started:performance.now()};$('selectScreen').classList.add('hidden');$('arenaScreen').classList.remove('hidden');showMapSelect((i)=>{currentMap=i;resize();showVersus()})}
let vsTimer=null;
function showVersus(a,b,metaText,isGuest){mode='versus';a=a||chosen[0];b=b||chosen[1];const c1=FX[a.id].c,c2=FX[b.id].c;
$('v1').textContent=a.word;$('v1').style.cssText=`font-family:"${a.font}";color:${c1}`;
$('v2').textContent=b.word;$('v2').style.cssText=`font-family:"${b.font}";color:${c2}`;
$('vsEl1').textContent=a.element.toUpperCase();$('vsEl1').style.color=c1;
$('vsEl2').textContent=b.element.toUpperCase();$('vsEl2').style.color=c2;
const vs=$('versus');vs.style.setProperty('--c1',c1);vs.style.setProperty('--c2',c2);vs.style.setProperty('--c1a',c1+'66');vs.style.setProperty('--c2a',c2+'66');
// V8.0: apply element FX classes
const sl=$('vsLeft'),sr=$('vsRight');
sl.className='vs-side vs-left vs-fx-'+a.element.toLowerCase();
sr.className='vs-side vs-right vs-fx-'+b.element.toLowerCase();
// Clear previous particles and impact states
sl.querySelector('.vs-particles').innerHTML='';sr.querySelector('.vs-particles').innerHTML='';
sl.classList.remove('go');sr.classList.remove('go');
$('vmeta').textContent=metaText||matchupText();$('countdown').textContent=`ROUND ${round}`;
// V8.0: 3-layer particles per element
function makeParticles(side,el,col){
  const cont=side.querySelector('.vs-particles');
  const layers={
    Fire:[['🔥',26,34,'rise',3],['✦',10,16,'riseFast',8],['·',4,7,'drift',12]],
    Ice:[['❄',24,32,'fall',4],['◇',10,15,'fallFast',8],['·',4,6,'drift',10]],
    Storm:[['⚡',28,36,'flash',3],['ϟ',12,18,'flicker',7],['·',3,6,'static',12]],
    Shadow:[['☁',30,40,'riseSlow',3],['●',10,16,'float',7],['·',3,5,'drift',10]],
    Light:[['✦',24,32,'rise',4],['✧',10,16,'twinkle',8],['·',3,6,'drift',12]],
    Nature:[['🍃',22,30,'swayFall',4],['✿',10,15,'fall',7],['·',3,6,'drift',12]],
    Cosmic:[['✦',24,34,'twinkle',5],['✧',10,16,'float',9],['·',3,6,'drift',16]]
  };
  const cfg=layers[el]||layers.Fire;
  cfg.forEach(([ch,minS,maxS,anim,count],li)=>{
    for(let k=0;k<count;k++){
      const d=document.createElement('i');
      d.textContent=ch;
      d.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${minS+Math.random()*(maxS-minS)}px;color:${col};opacity:${.5+Math.random()*.4};pointer-events:none;z-index:4;animation:vsP_${anim} ${2+Math.random()*3}s ease-in-out infinite;animation-delay:${Math.random()*2}s`;
      // Layer depth: big=slower, tiny=faster
      if(li===0)d.style.filter=`drop-shadow(0 0 8px ${col})`;
      cont.appendChild(d);
    }
  });
}
makeParticles(sl,a.element,c1);makeParticles(sr,b.element,c2);
// V8.0: per-element impact timing (ms within 5s)
const impactAt={Storm:1500,Ice:2500,Light:2500,Nature:3000,Cosmic:3200,Fire:3500,Shadow:4000};
vsImpactTimers.forEach(t=>clearTimeout(t));vsImpactTimers=[];
[[sl,a.element],[sr,b.element]].forEach(([side,el])=>{
  vsImpactTimers.push(setTimeout(()=>{if(mode==='versus')side.classList.add('go')},impactAt[el]||2500));
});
$('vsSkip').classList.add('hidden');vs.classList.remove('hidden');
sfx('versus');
if(vsTimer)clearTimeout(vsTimer);if(!isGuest)vsTimer=setTimeout(vsGo,5000)}
let vsImpactTimers=[];
function vsGo(){if(mode!=='versus')return;if(vsTimer){clearTimeout(vsTimer);vsTimer=null}vsImpactTimers.forEach(t=>clearTimeout(t));const sl=$('vsLeft'),sr=$('vsRight');sl.classList.remove('go');sr.classList.remove('go');sl.querySelector('.vs-particles').innerHTML='';sr.querySelector('.vs-particles').innerHTML='';$('versus').classList.add('hidden');if(netMode&&isHost)netRoomSend({t:'begin'});beginRound()}
function beginRound(){resize();mode='fight';paused=false;particles=[];projectiles=[];rings=[];bolts=[];logs=[];dmgNums=[];shake=0;flash=0;slowmo=0;cinematic=null;netUltFxs=[];roundEnd=0;fighters=netMode?[copyDef(netHostPick,0,{local:isHost}),copyDef(netGuestPick,1,{local:!isHost})]:[copyDef(chosen[0],0),copyDef(chosen[1],1)];window._ghostA=0;window._ghostB=0;upgradeMods.forEach(m=>m.startEnergy=0);setControlColors();updateHud();addLog(`Move, dash and attack — you are ${chosen[0].word}`);sfx('fight')}
function resize(){const r=stage.getBoundingClientRect();const mm=MAPS[currentMap].mult;W=Math.max(300,r.width)*mm;H=Math.max(260,r.height)*mm;DPR=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR)}window.addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);
function audioInit(){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume()}catch(e){}}
function tone(type,f1,f2,d,g=.08,delay=0){if(muted||!actx)return;const t=actx.currentTime+delay,o=actx.createOscillator(),gain=actx.createGain();o.type=type;o.connect(gain);gain.connect(actx.destination);o.frequency.setValueAtTime(Math.max(20,f1),t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);gain.gain.setValueAtTime(g,t);gain.gain.exponentialRampToValueAtTime(.001,t+d);o.start(t);o.stop(t+d+.02)}
function noise(d=.12,g=.06){if(muted||!actx)return;const len=Math.max(1,actx.sampleRate*d),buf=actx.createBuffer(1,len,actx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);const s=actx.createBufferSource(),gain=actx.createGain();s.buffer=buf;s.connect(gain);gain.connect(actx.destination);gain.gain.value=g;s.start()}
function sfx(t){audioInit();if(t==='hit'){tone('square',180,65,.11,.07);noise(.08,.04)}else if(t==='crit'){tone('sawtooth',620,120,.18,.1);noise(.12,.07)}else if(t==='dash'){tone('sawtooth',380,90,.12,.06)}else if(t==='ult'){tone('sawtooth',70,800,.7,.11);tone('sine',200,1100,.8,.08,.15)}else if(t==='ko'){tone('square',260,35,.55,.13);noise(.4,.09)}else if(t==='fight'){tone('square',180,520,.14,.08);tone('square',240,760,.2,.07,.16)}else if(t==='versus'){tone('sawtooth',90,260,.35,.07)}else tone('sine',520,820,.08,.05)}
function toggleSound(){muted=!muted;document.querySelectorAll('.soundbtn').forEach(b=>{b.classList.toggle('off',muted);b.textContent=muted?'Muted':'Sound'});if(!muted){audioInit();sfx('ui')}}
function addLog(t){logs.unshift(t);logs=logs.slice(0,6);$('battleLog').textContent=t}
function ring(x,y,color,r=140,life=.4,w=4,kind='circle'){rings.push({x,y,color,r,t:0,life,w,kind})}
function particle(f,x,y,vx,vy,life=.5,size=4,shape=f.fx.shape,motion=f.fx.motion,color=Math.random()<.72?f.fx.c:f.fx.c2,extra={}){particles.push(Object.assign({x,y,px:x,py:y,vx,vy,life,max:life,size,shape,motion,color,rot:rnd(0,TAU),spin:rnd(-8,8),grav:0},extra));if(particles.length>1100)particles.splice(0,particles.length-1100)}
function signatureBurst(f,x,y,n=26,power=340,life=.6){for(let i=0;i<n;i++){const a=rnd(0,TAU),bias=(f.fx.motion==='ray'||f.fx.motion==='speed')?.25:1,s=rnd(.25,1)*power;let vx=Math.cos(a)*s,vy=Math.sin(a)*s*bias;if(f.fx.motion==='fountain'){vy=-Math.abs(vy)-80;vx*=.55}if(f.fx.motion==='rain'){vy=Math.abs(vy)+120;vx*=.25}if(f.fx.motion==='grid'){vx=Math.round(vx/90)*90;vy=Math.round(vy/90)*90}particle(f,x,y,vx,vy,rnd(life*.6,life),rnd(2,6),f.fx.shape,f.fx.motion,undefined,{grav:f.fx.motion==='fountain'?240:0,phase:rnd(0,TAU)})}}
function ambient(f,dt){const amount=f.energy>=100?7:3;if(Math.random()>dt*(f.energy>=100?35:18))return;for(let i=0;i<amount;i++){const a=rnd(0,TAU),r=rnd(34,70);particle(f,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,-Math.sin(a)*r*1.4,Math.cos(a)*r*1.4,rnd(.35,.85),rnd(1.5,4),f.fx.shape,f.fx.motion,undefined,{phase:a,orbitX:f.x,orbitY:f.y})}}
function makeProjectile(f,t,angleOffset=0,scale=1){const dx=t.x-f.x,dy=t.y-f.y,a=Math.atan2(dy,dx)+angleOffset+(!f.player?rnd(-.07,.07):0),s=(f.fx.shot==='wind'?460:f.fx.shot==='slab'?350:560)+(f.spd*1.2);projectiles.push({x:f.x+Math.cos(a)*45,y:f.y+Math.sin(a)*24,px:f.x,py:f.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,source:f,target:t,color:f.fx.c,color2:f.fx.c2,shot:f.fx.shot,shape:f.fx.shape,motion:f.fx.motion,life:1.45,size:(f.fx.shot==='slab'?17:f.fx.shot==='meteor'?13:8)*scale,dmg:f.atk*rnd(.10,.14)*scale,crit:Math.random()<f.crit,age:0,phase:rnd(0,TAU),homing:['ghost','soul','voidorb','bubble'].includes(f.fx.shot)?1:0})}
function basicAttack(f,t){if(f.dead||t.dead||f.attackCD>0||f.stun>0)return;f.facing=t.x>f.x?1:-1;f.attackCD=clamp(1.12-f.spd/155,.28,.75);const shot=f.fx.shot;if(['fist','blood','arc','blade','skull'].includes(shot)&&Math.hypot(t.x-f.x,t.y-f.y)<155){const a=Math.atan2(t.y-f.y,t.x-f.x);f.x+=Math.cos(a)*28;f.y+=Math.sin(a)*18;hit(f,t,f.atk*rnd(.13,.18),Math.random()<f.crit,false);signatureBurst(f,t.x,t.y,shot==='blade'?38:24,420,.5);ring(t.x,t.y,f.fx.c,110,.28,5,shot==='blade'?'slash':'circle')}else if(shot==='disk'||shot==='pixel'){makeProjectile(f,t,-.09,.72);makeProjectile(f,t,.09,.72)}else if(shot==='bolt'||shot==='codebolt'){makeProjectile(f,t,0,1);bolts.push({x1:f.x,y1:f.y,x2:t.x,y2:t.y,color:f.fx.c,life:.11,max:.11,jag:shot==='codebolt'?9:5})}else if(shot==='meteor'){makeProjectile(f,t,-.15,.72);makeProjectile(f,t,0,.78);makeProjectile(f,t,.15,.72)}else makeProjectile(f,t);f.energy=clamp(f.energy+10,0,100);signatureBurst(f,f.x+f.facing*35,f.y,9,150,.3);sfx('ui')}
function dashFighter(f,dx,dy){if(f.dead||f.stun>0||f.dashCD>0||f.dash>0)return;if(!dx&&!dy){dx=f.facing;dy=0}const l=Math.hypot(dx,dy)||1;f.vx=dx/l*(720+f.spd*2.2);f.vy=dy/l*(720+f.spd*2.2);f.dash=.18;f.iframe=.28;f.dashCD=.82;signatureBurst(f,f.x,f.y,22,300,.4);ring(f.x,f.y,f.fx.c,85,.3,4,'dash');sfx('dash')}
function triggerUltimate(f,t){if(f.dead||t.dead||f.energy<100)return;
 if(netMode&&netActive){
  if(netUltFxs.some(u=>u.f===f))return;
  f.energy=0;f.ultUsed++;matchStats.ults[f.side]++;
  netUltFxs.push({f,t,time:0,hit:false,predicted:false});f._ultTgt=t;if(typeof ULTFX!=='undefined'&&ULTFX[f.sig]){try{ULTFX[f.sig].opening(f)}catch(e){}}
  ultFxSpawn(f);
  if(isHost)netRoomSend({t:'ult-fx',by:f.side===0?'host':'guest',from:netMe()});
  return;
 }
 if(cinematic)return;f.energy=0;f.ultUsed++;matchStats.ults[f.side]++;cinematic={f,t,time:0,hit:false};mode='cinematic';sfx('ult');f._ultTgt=t;if(typeof ULTFX!=='undefined'&&ULTFX[f.sig]){try{ULTFX[f.sig].opening(f)}catch(e){}}addLog(`${f.def.word}: ${f.def.ult.toUpperCase()}!`);for(let i=0;i<100;i++){const a=rnd(0,TAU),r=rnd(30,Math.max(W,H)*.65),spd=rnd(60,340);particle(f,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,-Math.cos(a)*spd,-Math.sin(a)*spd,rnd(.5,1.25),rnd(2,8),f.fx.shape,f.fx.ult,undefined,{phase:a})}ring(f.x,f.y,f.fx.c,Math.max(W,H)*.75,1,9,f.fx.ult)}
function ultFxSpawn(f){sfx('ult');addLog(`${f.def.word}: ${f.def.ult.toUpperCase()}!`);for(let i=0;i<100;i++){const a=rnd(0,TAU),r=rnd(30,Math.max(W,H)*.65),spd=rnd(60,340);particle(f,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,-Math.cos(a)*spd,-Math.sin(a)*spd,rnd(.5,1.25),rnd(2,8),f.fx.shape,f.fx.ult,undefined,{phase:a})}ring(f.x,f.y,f.fx.c,Math.max(W,H)*.75,1,9,f.fx.ult)}
function updateNetUltFx(dt){if(!fighters.length||!netUltFxs.length)return;for(let ui=netUltFxs.length-1;ui>=0;ui--){const u=netUltFxs[ui];u.time+=dt;const f=u.f;
 for(let i=0;i<10;i++){const a=rnd(0,TAU),r=rnd(30,Math.max(W,H)*.55),pull=u.time<.65?-1:1;particle(f,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,Math.cos(a)*pull*r*2.4,Math.sin(a)*pull*r*2.4,rnd(.35,.9),rnd(2,8),f.fx.shape,f.fx.ult,undefined,{phase:a})}
 if(u.time>.68&&!u.hit){u.hit=true;const s=f.fx.sig;
  if(isHost){const dmg=f.atk*rnd(.43,.55);hit(f,u.t,dmg,true,true)}
  else{signatureBurst(f,u.t.x,u.t.y,150,760,1.05);ring(u.t.x,u.t.y,f.fx.c,Math.max(W,H)*.65,.8,10,f.fx.ult);shake=Math.max(shake,30);hitstop=Math.max(hitstop,.15);flash=Math.max(flash,.55);sfx('crit')}
  ultimateSecondary(f,u.t,s)}
 if(u.time>1.65)netUltFxs.splice(ui,1)}}
function hit(src,tgt,dmg,crit,ultimate){if(tgt.dead||tgt.iframe>0)return false;if(!src.player)dmg*=.82;const adv=advantage(src.def,tgt.def),mult=adv>0?1.2*src.elementAmp:adv<0?.84:1;dmg*=mult*(crit?1.65:1)*(1-tgt.armor);tgt.hp=Math.max(0,tgt.hp-dmg);src.damage+=dmg;src.hits++;tgt.taken+=dmg;matchStats.damage[src.side]+=dmg;matchStats.hits[src.side]++;if(crit){src.crits++;matchStats.crits[src.side]++}tgt.energy=clamp(tgt.energy+(ultimate?30:15),0,100);tgt.flash=.13;tgt.stun=ultimate?.42:.09;signatureBurst(src,tgt.x,tgt.y,ultimate?150:crit?54:30,ultimate?760:crit?550:380,ultimate?1.05:.58);ring(tgt.x,tgt.y,src.fx.c,ultimate?Math.max(W,H)*.65:crit?190:105,ultimate?.8:.35,ultimate?10:4,src.fx.ult);shake=Math.max(shake,ultimate?30:crit?16:8);hitstop=Math.max(hitstop,ultimate?.15:crit?.075:.04);flash=Math.max(flash,ultimate?.55:crit?.16:.05);sfx(ultimate?'crit':crit?'crit':'hit');addLog(`${src.def.word} ${ultimate?'unleashes '+src.def.ult:crit?'lands a CRITICAL':'hits'} — ${Math.round(dmg)}`);dmgNums.push({x:tgt.x+rnd(-24,24),y:tgt.y-46,txt:Math.round(dmg),crit,ult:ultimate,life:ultimate?1.15:.85,max:ultimate?1.15:.85,vy:-110});if(tgt.hp<=0)knockout(tgt,src);return true}
function playerVector(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);x+=joy.dx;y+=joy.dy;const l=Math.hypot(x,y);return l>1?{x:x/l,y:y/l}:{x,y}}
function projectileThreat(f){return projectiles.find(p=>p.source!==f&&Math.hypot(p.x-f.x,p.y-f.y)<145)}
function updateAI(f,t,dt){f.aiThink-=dt;if(f.aiThink<=0){f.aiThink=rnd(.16,.34);const dx=t.x-f.x,dy=t.y-f.y,d=Math.hypot(dx,dy)||1,preferred=['fist','blood','arc','blade','skull'].includes(f.fx.shot)?115:260;let toward=d>preferred+45?1:d<preferred-50?-1:0;f.aiX=dx/d*toward+(-dy/d)*rnd(-.75,.75);f.aiY=dy/d*toward+(dx/d)*rnd(-.75,.75);const th=projectileThreat(f);if(th&&f.dashCD<=0&&Math.random()<.5)dashFighter(f,-th.vy,th.vx);else if(f.dashCD<=0&&d>320&&Math.random()<.18)dashFighter(f,dx,dy);else if(f.dashCD<=0&&d<105&&Math.random()<.22)dashFighter(f,-dx,-dy);if(f.attackCD<=0&&d<(preferred<150?165:520))basicAttack(f,t);if(f.energy>=100&&d<520&&Math.random()<.55)triggerUltimate(f,t)}const l=Math.hypot(f.aiX,f.aiY)||1;moveFighter(f,f.aiX/l,f.aiY/l,dt)}
function moveFighter(f,dx,dy,dt){if(f.dash>0){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.94;f.vy*=.94;for(let i=0;i<4;i++)particle(f,f.x-rnd(0,24)*Math.sign(f.vx),f.y-rnd(-12,12),-f.vx*.1,-f.vy*.1,.28,rnd(2,6),f.fx.shape,'trail');return}const l=Math.hypot(dx,dy);if(l>.05){const s=95+f.spd*1.28;f.x+=dx/l*s*dt;f.y+=dy/l*s*dt;f.facing=dx?Math.sign(dx):f.facing;if(Math.random()<dt*22)particle(f,f.x-rnd(0,24)*f.facing,f.y+32,rnd(-30,30),rnd(-20,20),.3,rnd(1,4),f.fx.shape,'trail')}f.x=clamp(f.x,58,W-58);f.y=clamp(f.y,62,H-62)}
function updateFight(dt){if(roundEnd>0){roundEnd-=dt;if(roundEnd<=0)afterRound();updateFx(dt);return}const p=fighters[0],ai=fighters[1];for(const f of fighters){f.flash=Math.max(0,f.flash-dt);f.stun=Math.max(0,f.stun-dt);f.iframe=Math.max(0,f.iframe-dt);f.attackCD=Math.max(0,f.attackCD-dt);f.dashCD=Math.max(0,f.dashCD-dt);f.dash=Math.max(0,f.dash-dt);f.bob+=dt*3;ambient(f,dt)}if(!p.dead&&p.stun<=0){const v=playerVector();moveFighter(p,v.x,v.y,dt);if(buf('attack')){basicAttack(p,ai);action.attack=0}if(buf('dash')){dashFighter(p,v.x,v.y);action.dash=0}if(buf('ult')){if(p.energy>=100)triggerUltimate(p,ai);else addLog(`Ultimate charging — ${Math.floor(p.energy)}%`);action.ult=0}}if(netMode&&isHost){if(!ai.dead&&ai.stun<=0)applyRemoteInput(ai,p,dt)}else if(!ai.dead&&ai.stun<=0&&mode==='fight')updateAI(ai,p,dt);separateFighters();updateProjectiles(dt);updateFx(dt);updateHud()}
function separateFighters(){if(fighters.length<2)return;const a=fighters[0],b=fighters[1],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;if(d<92){const push=(92-d)/2;a.x-=dx/d*push;a.y-=dy/d*push;b.x+=dx/d*push;b.y+=dy/d*push}}
function updateCinematic(dt){const c=cinematic;if(!c)return;c.time+=dt;const f=c.f;const ux=(typeof ULTFX!=='undefined'&&ULTFX[f.sig])?ULTFX[f.sig]:null;if(ux){try{ux.beats(f,c.t,dt)}catch(e){}}else{for(let i=0;i<10;i++){const a=rnd(0,TAU),r=rnd(30,Math.max(W,H)*.55),pull=c.time<.65?-1:1;particle(f,f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,Math.cos(a)*pull*r*2.4,Math.sin(a)*pull*r*2.4,rnd(.35,.9),rnd(2,8),f.fx.shape,f.fx.ult,undefined,{phase:a})}}if(c.time>.68&&!c.hit){c.hit=true;const dmg=f.atk*rnd(.43,.55);hit(f,c.t,dmg,true,true);if(ux){try{ux.impact(f,c.t)}catch(e){}}}updateProjectiles(dt*.4);updateFx(dt*.55);if(c.time>1.65){cinematic=null;mode='fight'}updateHud()}
function ultimateSecondary(f,t,s){const mode=s%6;if(mode===0){for(let i=0;i<5;i++)ring(t.x,t.y,f.fx.c,120+i*65,.55+i*.08,8,f.fx.ult)}else if(mode===1){for(let i=0;i<10;i++)bolts.push({x1:rnd(0,W),y1:0,x2:t.x+rnd(-100,100),y2:t.y,color:i%2?f.fx.c:f.fx.c2,life:.45,max:.45,jag:6+s%5})}else if(mode===2){for(let i=0;i<18;i++){const a=i/18*TAU;projectiles.push({x:t.x+Math.cos(a)*W*.55,y:t.y+Math.sin(a)*H*.55,px:t.x,py:t.y,vx:-Math.cos(a)*650,vy:-Math.sin(a)*650,source:f,target:t,color:f.fx.c,color2:f.fx.c2,shot:f.fx.shot,shape:f.fx.shape,motion:f.fx.motion,life:.7,size:9,dmg:0,crit:false,age:0,phase:a,visual:true})}}else if(mode===3){ring(W/2,H/2,f.fx.c,Math.max(W,H),.8,22,'grid');flash=.8}else if(mode===4){for(let i=0;i<12;i++)bolts.push({x1:f.x,y1:f.y,x2:rnd(0,W),y2:rnd(0,H),color:i%3?f.fx.c:f.fx.c2,life:.5,max:.5,jag:2+i%8})}else{for(let i=0;i<160;i++){const a=rnd(0,TAU),sp=rnd(180,900);particle(f,t.x,t.y,Math.cos(a)*sp,Math.sin(a)*sp,rnd(.5,1.2),rnd(2,10),f.fx.shape,f.fx.ult)}}}
function updateProjectiles(dt){for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.life-=dt;p.age+=dt;p.px=p.x;p.py=p.y;if(p.homing&&p.target&&!p.target.dead){const a=Math.atan2(p.target.y-p.y,p.target.x-p.x),s=Math.hypot(p.vx,p.vy);p.vx=p.vx*.94+Math.cos(a)*s*.06;p.vy=p.vy*.94+Math.sin(a)*s*.06}if(['wind','gale'].includes(p.shot))p.vy+=Math.sin(p.age*15+p.phase)*260*dt;if(['cube','pixel','boltbox'].includes(p.shot))p.y+=Math.sin(p.age*22+p.phase)*70*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;for(let k=0;k<3;k++){const f=p.source;particle(f,p.x-rnd(0,18)*p.vx/600,p.y-rnd(0,18)*p.vy/600,rnd(-30,30),rnd(-30,30),.3,rnd(1,p.size*.65),f.fx.shape,f.fx.motion)}if(!p.visual&&p.life>0&&p.target&&!p.target.dead&&Math.hypot(p.x-p.target.x,p.y-p.target.y)<43){hit(p.source,p.target,p.dmg,p.crit,false);projectiles.splice(i,1)}else if(p.life<=0||p.x<-80||p.x>W+80||p.y<-80||p.y>H+80)projectiles.splice(i,1)}}
function updateFx(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue}p.px=p.x;p.py=p.y;p.rot+=p.spin*dt;const m=p.motion;if(m==='spiral'||m==='orbit'||m==='coil'||m==='vortex'||m==='soulstorm'){const a=(p.phase||0)+(p.max-p.life)*6,r=80*p.life/p.max;p.x+=Math.cos(a)*r*dt*3;p.y+=Math.sin(a)*r*dt*3}else if(m==='zig'||m==='chain'||m==='stutter'||m==='glitch'||m==='error'){p.x+=p.vx*dt+(Math.random()-.5)*12;p.y+=p.vy*dt+(Math.random()-.5)*12}else if(m==='wave'||m==='cyclone'||m==='moon'||m==='blizzard'||m==='whiteout'){p.x+=p.vx*dt;p.y+=p.vy*dt+Math.sin((p.phase||0)+(p.max-p.life)*18)*5}else{p.x+=p.vx*dt;p.y+=p.vy*dt}p.vy+=(p.grav||0)*dt;p.vx*=.977;p.vy*=.977}for(let i=rings.length-1;i>=0;i--){rings[i].t+=dt;if(rings[i].t>=rings[i].life)rings.splice(i,1)}for(let i=bolts.length-1;i>=0;i--){bolts[i].life-=dt;if(bolts[i].life<=0)bolts.splice(i,1)}shake*=Math.exp(-9*dt);flash=Math.max(0,flash-dt);for(let i=dmgNums.length-1;i>=0;i--){const n=dmgNums[i];n.life-=dt;if(n.life<=0){dmgNums.splice(i,1);continue}n.y+=n.vy*dt;n.vy*=.94};}
function knockout(loser,winner){if(loser.dead)return;loser.dead=true;winner.energy=0;slowmo=1.2;roundEnd=1.45;wins[winner.side]++;signatureBurst(winner,loser.x,loser.y,220,840,1.2);ring(loser.x,loser.y,'#ffffff',Math.max(W,H)*.75,.9,12,'ko');shake=36;flash=.85;sfx('ko');$('koTitle').classList.remove('show');void $('koTitle').offsetWidth;$('koTitle').classList.add('show');addLog(`${winner.def.word} wins round ${round}!`);updateHud()}
function afterRound(){if(netMode&&isHost){afterRoundNet();return}const champ=wins.findIndex(x=>x>=2);if(champ>=0){showResult(champ);return}const winner=fighters.find(f=>!f.dead).side;showUpgrade(winner)}
function showUpgrade(winner){const loser=1-winner;const consolation=UPGRADES.slice().sort(()=>Math.random()-.5)[0];
if(winner===0){mode='upgrade';const d=chosen[0];
$('upgradeH').textContent=`Winner's spoils \u2014 power up ${d.word}`;
$('upgradeP').textContent=`You took round ${round}. Pick your reward \u2014 the AI only gets a weaker consolation prize.`;
const pool=UPGRADES.slice().sort(()=>Math.random()-.5).slice(0,3),row=$('upgradeRow');row.innerHTML='';
pool.forEach(u=>{const b=document.createElement('button');b.className='upgrade-card';b.innerHTML=`<div class="upgrade-icon">${u.icon}</div><strong>${u.name}</strong><span>${u.desc}</span>`;b.onclick=()=>{applyUpgrade(0,u,false);applyUpgrade(1,consolation,true);$('upgrade').classList.add('hidden');round++;showVersus();sfx('ui')};row.appendChild(b)});
$('upgrade').classList.remove('hidden');}
else{const u=UPGRADES.slice().sort(()=>Math.random()-.5)[0];applyUpgrade(1,u,false);applyUpgrade(0,consolation,true);mode='upgrade';
$('upgradeH').textContent=`${chosen[1].word} takes round ${round}`;
$('upgradeP').textContent=`The AI claims ${u.name}. Your consolation prize: ${consolation.name} (weakened). Win the round, win the real loot.`;
const row=$('upgradeRow');row.innerHTML='';
const b=document.createElement('button');b.className='upgrade-card';b.innerHTML=`<div class="upgrade-icon">\u00bb</div><strong>Continue</strong><span>Head into round ${round+1}</span>`;b.onclick=()=>{$('upgrade').classList.add('hidden');round++;showVersus();sfx('ui')};row.appendChild(b);
$('upgrade').classList.remove('hidden');}}
function applyUpgrade(side,u,weak){const m=upgradeMods[side];
if(u.icon==='HP')m.hp=(m.hp||1)*(weak?1.11:1.22);
else if(u.icon==='ATK')m.atk=(m.atk||1)*(weak?1.09:1.18);
else if(u.icon==='SPD')m.spd=(m.spd||1)*(weak?1.1:1.2);
else if(u.icon==='ULT')m.startEnergy=weak?25:55;
else if(u.icon==='DEF')m.armor=clamp((m.armor||0)+(weak?.08:.16),0,.48);
else if(u.icon==='CRIT')m.crit=(m.crit||0)+(weak?.09:.18);
else if(u.icon==='ELEM')m.elementAmp=(m.elementAmp||0)+(weak?.11:.22);
addLog(`${chosen[side].word} gains ${u.name}${weak?' (weakened)':''}`)}
function showResult(side){mode='result';netUltFxs=[];const d=chosen[side],sec=Math.max(1,Math.round((performance.now()-matchStats.started)/1000)),youWon=side===0,banner=$('resultBanner'),fighterEl=$('resultFighter'),fx=FX[d.id];let title='VICTORY';if(netMode){title=youWon?'YOU WIN':'YOU LOSE'}else if(youWon){title=wins[0]===2&&wins[1]===0?'FLAWLESS VICTORY':wins[1]===0?'DOMINANT VICTORY':'VICTORY'}else{title='DEFEAT'}banner.textContent=title;banner.classList.toggle('defeat',!youWon);fighterEl.textContent=d.word;fighterEl.style.fontFamily=`"${d.font}",system-ui,sans-serif`;fighterEl.style.color=fx.c;fighterEl.style.textShadow=`0 0 24px ${fx.c},0 0 60px ${fx.c2}`;const oppName=netMode?(youWon?netRemoteName:netLocalName):'AI';$('resultP').textContent=netMode?`${wins[0]}–${wins[1]} vs ${oppName} · ${d.element} · ${d.ult}`:`${wins[0]}–${wins[1]} · ${d.element} champion · ${d.ult}`;$('resultStats').innerHTML=`<div><b>${Math.round(matchStats.damage[0])}</b><span>damage</span></div><div><b>${matchStats.hits[0]}</b><span>hits</span></div><div><b>${matchStats.ults[0]}</b><span>ults</span></div><div><b>${sec}s</b><span>time</span></div>`;$('result').classList.remove('hidden');const card=document.querySelector('.result-card');card.style.borderColor=fx.c+'55';card.style.boxShadow=`0 0 60px ${fx.c}44,0 0 120px rgba(0,100,255,.1)`;if(youWon){sfx('win');const colors=[fx.c,fx.c2,'#ffd700','#ffffff'];for(let i=0;i<40;i++){const c=document.createElement('div');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.background=colors[i%4];c.style.animationDelay=(Math.random()*.8)+'s';c.style.transform=`rotate(${Math.random()*360}deg)`;card.appendChild(c);setTimeout(()=>c.remove(),4000)}const stats=[Math.round(matchStats.damage[0]),matchStats.hits[0],matchStats.ults[0],sec];const labels=['damage','hits','ults','time'];const statDivs=document.querySelectorAll('.result-stats>div b');statDivs.forEach((el,idx)=>{const target=stats[idx];let cur=0;const step=Math.max(1,Math.ceil(target/30));const iv=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(iv)}el.textContent=idx===3?cur+'s':cur},33)})}if(netMode)netResultUI()}
function updateHud(){if(!fighters.length)return;const a=fighters[0],b=fighters[1];$('nameL').textContent=(netMode?netLocalName+' · ':'YOU · ')+a.def.word;$('nameL').style.cssText=`font-family:"${a.def.font}";color:${a.fx.c}`;$('nameR').textContent=b.def.word+(netMode?' · '+netRemoteName:' · AI');$('nameR').style.cssText=`font-family:"${b.def.font}";color:${b.fx.c}`;$('hpL').style.width=clamp(a.hp/a.max*100,0,100)+'%';$('hpR').style.width=clamp(b.hp/b.max*100,0,100)+'%';const pctA=a.hp/a.max,pctB=b.hp/b.max;$('hpNumL').textContent=Math.ceil(a.hp);$('hpNumR').textContent=Math.ceil(b.hp);$('hpL').classList.toggle('critical',pctA<.3);$('hpL').classList.toggle('hurt',pctA>=.3&&pctA<.6);$('hpR').classList.toggle('critical',pctB<.3);$('hpR').classList.toggle('hurt',pctB>=.3&&pctB<.6);if(!window._ghostA||a.hp>window._ghostA)window._ghostA=a.hp;if(!window._ghostB||b.hp>window._ghostB)window._ghostB=b.hp;$('hpGhostL').style.width=clamp(window._ghostA/a.max*100,0,100)+'%';$('hpGhostR').style.width=clamp(window._ghostB/b.max*100,0,100)+'%';window._ghostA+=(a.hp-window._ghostA)*.08;window._ghostB+=(b.hp-window._ghostB)*.08;$('ultL').style.width=a.energy+'%';$('ultR').style.width=b.energy+'%';$('winsL').textContent='●'.repeat(wins[0])+'○'.repeat(2-wins[0]);$('winsR').textContent='●'.repeat(wins[1])+'○'.repeat(2-wins[1]);$('roundTxt').textContent='ROUND '+round;$('matchup').innerHTML=`ELEMENT MATCHUP<b>${matchupText()}</b>`;const ub=$('ultControl'),db=$('dashControl');ub.classList.toggle('ready',a.energy>=100);ub.querySelector('span').textContent=a.energy>=100?'ULT READY':`ULT ${Math.floor(a.energy)}%`;db.classList.toggle('cooling',a.dashCD>0);db.querySelector('span').textContent=a.dashCD>0?`DASH ${a.dashCD.toFixed(1)}`:'DASH'}
function setControlColors(){const c=FX[chosen[0].id].c;document.documentElement.style.setProperty('--player',c);document.documentElement.style.setProperty('--player2',FX[chosen[0].id].c2)}
function drawShape(p,alpha=1){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot||0);ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.strokeStyle=p.color;const s=p.size;ctx.beginPath();switch(p.shape){case'tri':ctx.moveTo(0,-s*1.6);ctx.lineTo(s,s);ctx.lineTo(-s,s);ctx.closePath();break;case'zig':ctx.moveTo(-s,-s);ctx.lineTo(0,-s*.2);ctx.lineTo(-s*.2,s*.2);ctx.lineTo(s,s);ctx.lineTo(.15*s,.15*s);ctx.lineTo(.4*s,-.25*s);ctx.closePath();break;case'crescent':ctx.arc(0,0,s,Math.PI*.35,Math.PI*1.65);ctx.arc(s*.55,0,s*.75,Math.PI*1.65,Math.PI*.35,true);break;case'line':ctx.rect(-s*2,-s*.25,s*4,s*.5);break;case'rock':for(let i=0;i<6;i++){const a=i/6*TAU,r=s*(i%2?1:.75);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();break;case'pixel':case'square':case'frame':ctx.rect(-s,-s,s*2,s*2);break;case'drop':ctx.moveTo(0,-s*1.5);ctx.quadraticCurveTo(s*1.3,0,0,s*1.4);ctx.quadraticCurveTo(-s*1.3,0,0,-s*1.5);break;case'diamond':ctx.moveTo(0,-s*1.5);ctx.lineTo(s,0);ctx.lineTo(0,s*1.5);ctx.lineTo(-s,0);ctx.closePath();break;case'spiral':ctx.arc(0,0,s,0,TAU);break;case'hex':for(let i=0;i<6;i++){const a=i/6*TAU;ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s)}ctx.closePath();break;case'comet':ctx.moveTo(s*2,0);ctx.lineTo(-s,s*.65);ctx.lineTo(-s,-s*.65);ctx.closePath();break;case'thorn':ctx.moveTo(s*1.8,0);ctx.lineTo(-s,s*.65);ctx.lineTo(-s,-s*.65);ctx.closePath();break;case'wisp':ctx.arc(0,0,s,0,TAU);break;case'star':for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?s*.45:s*1.5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();break;case'shard':ctx.moveTo(0,-s*1.8);ctx.lineTo(s*.7,s*.65);ctx.lineTo(0,s*1.3);ctx.lineTo(-s*.7,s*.65);ctx.closePath();break;case'ribbon':ctx.rect(-s*2,-s*.25,s*4,s*.5);break;case'slash':ctx.moveTo(-s*2,s*.6);ctx.lineTo(s*2,-s*.6);ctx.lineTo(s*1.4,s*.1);ctx.lineTo(-s*1.4,s);ctx.closePath();break;case'glyph':ctx.arc(0,0,s,0,TAU);ctx.moveTo(-s,0);ctx.lineTo(s,0);ctx.moveTo(0,-s);ctx.lineTo(0,s);ctx.stroke();ctx.restore();return;case'mist':ctx.arc(0,0,s,0,TAU);break;case'tentacle':ctx.ellipse(0,0,s*2,s*.5,0,0,TAU);break;case'code':ctx.rect(-s*.35,-s*1.4,s*.7,s*2.8);break;case'petal':ctx.ellipse(0,0,s*.65,s*1.5,0,0,TAU);break;case'orb':ctx.arc(0,0,s,0,TAU);break;default:ctx.arc(0,0,s,0,TAU)}ctx.fill();ctx.restore()}
function drawProjectile(p){ctx.save();ctx.translate(p.x,p.y);const a=Math.atan2(p.vy,p.vx);ctx.rotate(a);ctx.globalCompositeOperation='lighter';ctx.shadowColor=p.color;ctx.shadowBlur=18;ctx.fillStyle=p.color;ctx.strokeStyle=p.color2;ctx.lineWidth=3;const s=p.size;if(typeof SHOTFX!=='undefined'&&SHOTFX[p.shot]){try{SHOTFX[p.shot](p)}catch(e){ctx.beginPath();ctx.arc(0,0,s,0,7);ctx.fill()}}else{ctx.beginPath();ctx.arc(0,0,s,0,7);ctx.fill()}ctx.restore()}
function drawFighter(f){const pulse=1+Math.sin(f.bob*2)*.025,low=f.hp/f.max<.3;ctx.save();ctx.translate(f.x,f.y+Math.sin(f.bob)*4);ctx.scale(pulse,pulse);ctx.font=font(f.def,clamp(W/14,31,68));ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=f.fx.c;ctx.shadowBlur=f.energy>=100?32:15;ctx.fillStyle=f.flash>0?'#fff':f.fx.c;ctx.globalAlpha=f.dead?.25:f.iframe>0?.55+Math.sin(f.iframe*80)*.35:1;if(low&&!f.dead)ctx.translate(rnd(-2,2),rnd(-2,2));ctx.fillText(f.def.word,0,0);ctx.restore();ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle=f.fx.c;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(f.x,f.y+42,60,9,0,0,TAU);ctx.stroke();if(f.isLocal){ctx.globalAlpha=.85;ctx.fillStyle=f.fx.c;ctx.beginPath();ctx.moveTo(f.x,f.y-54);ctx.lineTo(f.x-7,f.y-43);ctx.lineTo(f.x+7,f.y-43);ctx.closePath();ctx.fill()}ctx.restore()}
function drawRing(r){const p=r.t/r.life,rad=r.r*p;ctx.save();ctx.globalAlpha=(1-p)*.9;ctx.strokeStyle=r.color;ctx.lineWidth=r.w*(1-p*.65);ctx.translate(r.x,r.y);ctx.beginPath();if(['grid','error','arcade'].includes(r.kind)){ctx.rect(-rad,-rad,rad*2,rad*2)}else if(['slash','moon','blizzard'].includes(r.kind)){ctx.arc(0,0,rad,-.65,.65)}else if(['quake','world','continent','seismic'].includes(r.kind)){for(let i=0;i<8;i++){const a=i/8*TAU,rr=rad*(i%2?1:.76);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath()}else ctx.arc(0,0,rad,0,TAU);ctx.stroke();ctx.restore()}
function drawBolt(b){ctx.save();ctx.globalAlpha=b.life/b.max;ctx.strokeStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=13;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x1,b.y1);for(let i=1;i<b.jag;i++){const t=i/b.jag;ctx.lineTo(b.x1+(b.x2-b.x1)*t+rnd(-16,16),b.y1+(b.y2-b.y1)*t+rnd(-16,16))}ctx.lineTo(b.x2,b.y2);ctx.stroke();ctx.restore()}
function drawDmgNums(){ctx.save();ctx.textAlign='center';for(const n of dmgNums){const a=clamp(n.life/n.max,0,1),pop=1+clamp((n.max-n.life)*6,0,.45);ctx.globalAlpha=Math.min(1,a*1.6);ctx.font=`${Math.round((n.ult?30:n.crit?24:17)*pop)}px "Black Ops One"`;ctx.lineWidth=2;ctx.strokeStyle='rgba(5,6,16,.9)';ctx.fillStyle=n.ult?'#ff5f6d':n.crit?'#ffd34d':'#ffffff';ctx.strokeText(n.txt,n.x,n.y);ctx.fillText(n.txt,n.x,n.y)}ctx.restore()}
function drawUltimateOverlay(c){const f=c.f,s=f.fx.sig,t=c.time,p=clamp(t/.7,0,1);ctx.save();ctx.globalAlpha=clamp(1-Math.abs(t-.78)*.9,0,.92);ctx.fillStyle='rgba(0,0,0,.62)';ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2);ctx.strokeStyle=f.fx.c;ctx.fillStyle=f.fx.c;ctx.shadowColor=f.fx.c;ctx.shadowBlur=25;ctx.lineWidth=4;const mode=s%10,rr=(40+p*Math.max(W,H)*.55);ctx.rotate(t*(s%2?1:-1)*(1.5+s%4));if(mode===0){for(let i=0;i<8;i++){ctx.rotate(TAU/8);ctx.fillRect(rr*.22,-5,rr*.75,10)}}else if(mode===1){for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,rr*(i+1)/5,0,TAU);ctx.stroke()}}else if(mode===2){for(let i=0;i<12;i++){ctx.rotate(TAU/12);ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(rr,0);ctx.stroke()}}else if(mode===3){for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(-rr,i*26);ctx.lineTo(rr,i*26+Math.sin(t*20+i)*22);ctx.stroke()}}else if(mode===4){for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(rr,0);ctx.lineTo(rr*.65,18);ctx.closePath();ctx.fill()}}else if(mode===5){for(let i=0;i<8;i++){ctx.strokeRect(-rr+i*14,-rr+i*14,(rr-i*14)*2,(rr-i*14)*2)}}else if(mode===6){for(let i=0;i<7;i++){ctx.rotate(.8);ctx.beginPath();ctx.ellipse(rr*.45,0,rr*.55,25+i*5,0,0,TAU);ctx.stroke()}}else if(mode===7){for(let i=0;i<18;i++){ctx.rotate(TAU/18);ctx.beginPath();ctx.moveTo(rr*.25,-8);ctx.lineTo(rr,0);ctx.lineTo(rr*.25,8);ctx.fill()}}else if(mode===8){for(let i=0;i<10;i++){ctx.rotate(TAU/10);ctx.beginPath();ctx.arc(rr*.55,0,18+i*2,0,TAU);ctx.fill()}}else{ctx.beginPath();ctx.arc(0,0,rr*.65,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(0,0,rr*.38,0,TAU);ctx.fill()}ctx.restore();ctx.save();ctx.globalAlpha=clamp(1-Math.abs(t-.76)*1.1,0,1);ctx.textAlign='center';ctx.font=`${clamp(W/16,24,54)}px "Black Ops One"`;ctx.fillStyle=f.fx.c2;ctx.shadowColor=f.fx.c;ctx.shadowBlur=25;ctx.fillText(f.def.ult.toUpperCase(),W/2,H*.18);ctx.restore()}
function drawMapBg(){const m=MAPS[currentMap];const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,m.bg1);g.addColorStop(1,m.bg2);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 // Map-specific ambient details
 ctx.save();ctx.globalAlpha=.5;
 if(currentMap===0){ctx.strokeStyle=m.accent;ctx.lineWidth=1;for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}}
 else if(currentMap===1){for(let i=0;i<80;i++){const x=(i*197)%W,y=(i*331)%H;ctx.fillStyle='#fff';ctx.fillRect(x,y,2,2)}}
 else if(currentMap===2){ctx.fillStyle=m.accent;for(let i=0;i<12;i++){const x=(i*167)%W;ctx.beginPath();ctx.moveTo(x,H);ctx.lineTo(x+15,H-80-(i%3)*30);ctx.lineTo(x+30,H);ctx.fill()}}
 else if(currentMap===3){ctx.fillStyle=m.accent;for(let i=0;i<20;i++){const x=(i*211)%W,y=H-((i*137)%(H/3));ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill()}}
 else if(currentMap===4){ctx.strokeStyle=m.accent;ctx.lineWidth=2;for(let i=0;i<5;i++){let x=(i*199)%W,y=0;ctx.beginPath();ctx.moveTo(x,y);while(y<H/2){y+=30;x+=(i%2?20:-20);ctx.lineTo(x,y)}ctx.stroke()}}
 ctx.restore()}
function draw(){ctx.setTransform(DPR,0,0,DPR,0,0);drawMapBg();let zoom=1/MAPS[currentMap].mult,focusX=W/2,focusY=H/2;const cviz=cinematic||netUltFxs[0];if(cviz){const p=clamp(cviz.time/.65,0,1);zoom=1+p*.22;focusX=cviz.t.x;focusY=cviz.t.y}ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-focusX+(focusX-W/2)/zoom,-focusY+(focusY-H/2)/zoom);if(shake>.4)ctx.translate(rnd(-shake,shake),rnd(-shake,shake));ctx.globalCompositeOperation='lighter';rings.forEach(drawRing);for(const p of particles){ctx.shadowColor=p.color;ctx.shadowBlur=p.size*2;drawShape(p,clamp(p.life/p.max,0,1))}bolts.forEach(drawBolt);projectiles.forEach(drawProjectile);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;fighters.forEach(drawFighter);drawDmgNums();ctx.restore();if(flash>0){ctx.fillStyle=`rgba(255,255,255,${Math.min(.72,flash)})`;ctx.fillRect(0,0,W,H)}if(cinematic||netUltFxs.length)drawUltimateOverlay(cinematic||netUltFxs[0])}
function pause(){if(netMode&&netActive)return;if(mode!=='fight'&&mode!=='cinematic')return;paused=true;$('paused').classList.remove('hidden');sfx('ui')}function resume(){paused=false;$('paused').classList.add('hidden');audioInit();last=performance.now()}
function quit(){netCleanup();paused=false;mode='select';fighters=[];$('paused').classList.add('hidden');$('result').classList.add('hidden');$('upgrade').classList.add('hidden');$('versus').classList.add('hidden');$('arenaScreen').classList.add('hidden');$('selectScreen').classList.remove('hidden')}
function skipRound(){if(netMode||mode!=='fight'||roundEnd>0)return;const a=fighters[0],b=fighters[1],sa=(a.hp/a.max)+Math.random()*.45,sb=(b.hp/b.max)+Math.random()*.45;hit(sa>=sb?a:b,sa>=sb?b:a,(sa>=sb?b:a).hp+50,true,true)}
function rematch(){$('result').classList.add('hidden');startMatch()}
function frame(ts){requestAnimationFrame(frame);const raw=Math.min(.045,(ts-last)/1000||0);last=ts;if(!paused&&(mode==='fight'||mode==='cinematic')){let dt=raw;if(hitstop>0){hitstop-=raw;dt=0}else if(slowmo>0){slowmo-=raw;dt=raw*.28}if(mode==='cinematic')updateCinematic(dt);else if(netMode&&!isHost)updateNetGuest(dt);else updateFight(dt);if(netUltFxs.length&&mode==='fight')updateNetUltFx(dt)}if(!paused)draw()}
function bindHold(id,kind){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();audioInit();action[kind]=performance.now();b.setPointerCapture&&b.setPointerCapture(e.pointerId)})}
const jp=$('joystickPad'),jk=$('joystickKnob');function joyMove(e){const r=jp.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.min(r.width*.34,Math.hypot(dx,dy)),a=Math.atan2(dy,dx);joy.dx=Math.cos(a)*m/(r.width*.34);joy.dy=Math.sin(a)*m/(r.height*.34);jk.style.transform=`translate(${joy.dx*34}px,${joy.dy*34}px)`}
jp.addEventListener('pointerdown',e=>{e.preventDefault();audioInit();joy.active=true;joy.id=e.pointerId;jp.setPointerCapture(e.pointerId);joyMove(e)});jp.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id)joyMove(e)});function joyEnd(e){if(e.pointerId!==joy.id)return;joy.active=false;joy.dx=joy.dy=0;jk.style.transform='translate(0,0)'}jp.addEventListener('pointerup',joyEnd);jp.addEventListener('pointercancel',joyEnd);
$('randomBtn').onclick=randomRivals;$('fightBtn').onclick=startMatch;$('menuSound').onclick=toggleSound;$('soundBtn').onclick=toggleSound;$('pauseBtn').onclick=pause;$('pauseTop').onclick=pause;$('resumeBtn').onclick=resume;$('quitBtn').onclick=quit;$('skipBtn').onclick=skipRound;
$('versus').addEventListener('pointerdown',e=>{if(e.target.id!=='vsSkip')$('vsSkip').classList.remove('hidden')});
$('vsSkip').onclick=e=>{e.stopPropagation();sfx('ui');if(netMode&&!isHost)return;vsGo()};$('rematchBtn').onclick=rematch;$('newFightBtn').onclick=quit;bindHold('attackControl','attack');bindHold('dashControl','dash');bindHold('ultControl','ult');
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});window.addEventListener('keydown',e=>{if(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ','shift','e'].includes(k))e.preventDefault();keys.add(k);if(k===' '){action.attack=performance.now()}if(k==='shift')action.dash=performance.now();if(k==='e')action.ult=performance.now();if(k==='escape'){if(paused)resume();else pause()}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
/* ================= ONLINE MULTIPLAYER (PeerJS public cloud, host-authoritative) ================= */
let netMode=false,isHost=false,netActive=false;
let netName='';
let netRoomPeer=null,netRoomCode='';
let netRoom=null;
let netRemoteIn={x:0,y:0,a:0,d:0,u:0};
let netLocalName='',netRemoteName='',netHostPick=null,netGuestPick=null,netOwnPick=null,netOppPick=null;
let snapCurr=null,netSeq=0;
let netUltFxs=[];
let netSnapTimer=null,netInputTimer=null;
function netSan(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,16)||'player'}
function netPid(name){return 'ffa-'+netSan(name)}
function netMe(){return{name:netName}}
function netSaveId(){try{localStorage.setItem('ffa-id',JSON.stringify({name:netName}))}catch(e){}}
function netLoadId(){try{const o=JSON.parse(localStorage.getItem('ffa-id')||'null');if(o&&o.name){let nm=String(o.name).slice(0,16);if(!/\d/.test(nm)&&o.code)nm=(nm+o.code).slice(0,16);if(!/\d/.test(nm))nm=(nm.slice(0,12)+(o.code||Math.floor(Math.random()*9000+1000))).slice(0,16);netName=nm;netSaveId();return}}catch(e){}netName='Fighter'+Math.floor(Math.random()*900+100);netSaveId()}
function netValidateName(){const v=$('netNameInput').value.trim();const ok=/\d/.test(v);$('netNameInput').classList.toggle('bad',!ok);$('nameHint').classList.toggle('show',!ok);return ok}
function netIdLine(){$('netIdLine').innerHTML='✓ <b>'+netName+'</b>';const ni=$('netNameInput');if(ni&&document.activeElement!==ni)ni.value=netName;const rn=$('roomMyName');if(rn)rn.textContent=netName}
/* V4.0: Room-code multiplayer. No friends list — host makes a 4-digit room, guest dials it. */
let netLogBuf=[];
function netLog(){try{const m='[FF] '+[].slice.call(arguments).join(' ');console.log(m);netLogBuf.push(new Date().toLocaleTimeString()+m);if(netLogBuf.length>40)netLogBuf.shift();const lv=$('logView');if(lv&&!lv.classList.contains('hidden'))lv.textContent=netLogBuf.join('\n')}catch(e){}}
function netToggleLog(){const lv=$('logView');if(!lv)return;lv.classList.toggle('hidden');if(!lv.classList.contains('hidden'))lv.textContent=netLogBuf.join('\n')||'(no logs yet)'}
function iceCfg(){return{config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun.relay.metered.ca:80'},{urls:'turn:us-central.relay.metered.ca:80',username:'6da69f246311efa4ffa37b8d',credential:'4l3OjkferhQxArjs'},{urls:'turn:us-central.relay.metered.ca:80?transport=tcp',username:'6da69f246311efa4ffa37b8d',credential:'4l3OjkferhQxArjs'},{urls:'turn:us-central.relay.metered.ca:443',username:'6da69f246311efa4ffa37b8d',credential:'4l3OjkferhQxArjs'},{urls:'turns:us-central.relay.metered.ca:443?transport=tcp',username:'6da69f246311efa4ffa37b8d',credential:'4l3OjkferhQxArjs'}]}}}
function netSend(msg){if(netRoom&&netRoom.conn&&netRoom.conn.open){try{netRoom.conn.send(msg);return true}catch(e){}}return false}
function netRoomSend(msg){return netSend(msg)}
function roomKillPeer(){if(netRoomPeer){try{netRoomPeer.destroy()}catch(e){}netRoomPeer=null}}
function roomMenu(){$('roomScreen').classList.add('hidden');if(!netRoom)$('friendsPanel').classList.remove('hidden');netIdLine()}
function roomCreate(){
 if(netRoom){netPopup('In a room','Leave the current room first.',null,null,true);return}
 if(!netValidateName()){netPopup('Name','Your fighter name needs a number in it.',null,null,true);return}
 if(typeof Peer==='undefined'){netPopup('Offline','Networking unavailable.',null,null,true);return}
 const code=String(Math.floor(1000+Math.random()*9000));
 netLog('roomCreate: code',code);
 roomKillPeer();
 netPopup('Creating','Making room '+code+'…',()=>{roomKillPeer();roomMenu()},null,true);
 netRoomPeer=new Peer('ffa-room-'+code,iceCfg());
 let opened=false;
 const openT=setTimeout(()=>{if(!opened){roomKillPeer();netPopup('Room','Lobby server not answering. Check your connection and try again.',()=>roomMenu(),null,true)}},10000);
 netRoomPeer.on('open',()=>{opened=true;clearTimeout(openT);netLog('roomCreate: peer open, room ffa-room-'+code+' live');$('netPopup').classList.add('hidden');
  netRoomCode=code;isHost=true;
  netRoom={roomId:code,conn:null,hostName:netName,guestName:null,hostPick:null,guestPick:null,hostReady:false,guestReady:false,pending:true};
  $('friendsPanel').classList.add('hidden');
  netShowRoom(true);
  $('roomCodeBig').classList.remove('hidden');$('roomCodeVal').textContent=code;
  $('roomStatus').innerHTML='Share the code — waiting for your rival<span class="waiting-dots"></span>';
 });
 netRoomPeer.on('connection',roomAttachGuest);
 netRoomPeer.on('error',e=>{
  if(e&&e.type==='unavailable-id')roomCreate();
  else netPopup('Room','Could not create the room. Try again.',()=>roomMenu(),null,true);
 });
}
function roomJoin(code){
 code=String(code||'').replace(/\D/g,'').slice(0,4);
 if(code.length!==4){netPopup('Code','Enter the 4-digit room code.',null,null,true);return}
 if(!netValidateName()){netPopup('Name','Your fighter name needs a number in it.',null,null,true);return}
 if(netRoom){netPopup('In a room','Leave the current room first.',null,null,true);return}
 if(typeof Peer==='undefined'){netPopup('Offline','Networking unavailable.',null,null,true);return}
 roomKillPeer();
 let joined=false,opened=false;
 const fail=(t,tx)=>{$('netPopup').classList.add('hidden');roomKillPeer();netRoom=null;netPopup(t,tx,()=>roomMenu(),null,true)};
 netPopup('Joining','Dialing room '+code+'…',()=>{fail('Cancelled','Join cancelled.',()=>roomMenu())},null,true);
 netLog('roomJoin: dialing ffa-room-'+code);
 netRoomPeer=new Peer(iceCfg());
 const openT=setTimeout(()=>{if(!opened){netLog('roomJoin: peer open TIMEOUT');fail('Room','Lobby server not answering. Check your connection and try again.')}},10000);
 netRoomPeer.on('open',()=>{
  opened=true;clearTimeout(openT);netLog('roomJoin: peer open, dialing');
  const c=netRoomPeer.connect('ffa-room-'+code,{reliable:true});
  isHost=false;
  netRoom={roomId:code,conn:c,hostName:null,guestName:netName,hostPick:null,guestPick:null,hostReady:false,guestReady:false,pending:true};
  c.on('open',()=>{joined=true;netLog('roomJoin: conn OPEN');$('netPopup').classList.add('hidden');$('friendsPanel').classList.add('hidden');netSend({t:'room-hello',from:netMe(),pick:netOwnPick});netShowRoom(false)});
  try{const pc=c.peerConnection;if(pc){netLog('roomJoin: ICE state',pc.iceConnectionState);pc.oniceconnectionstatechange=()=>netLog('roomJoin: ICE ->',pc.iceConnectionState)}}catch(e){}
  c.on('data',d=>netOnRoomMsg(d));
  c.on('close',()=>{netLog('roomJoin: conn closed/error before open');if(!joined)fail('Room','Room not found. Check the code.');else netOpponentGone()});
  c.on('error',()=>{if(!joined)fail('Room','Room not found. Check the code.')});
  setTimeout(()=>{if(!joined&&netRoom&&!isHost)fail('Room','No answer. Check the code.')},10000);
 });
 netRoomPeer.on('error',e=>{
  if(!joined&&e&&e.type==='peer-unavailable')fail('Room','Room not found. Check the code.');
 });
}
function roomAttachGuest(c){
 if(!netRoom||netRoom.conn){netLog('roomAttachGuest: rejected (busy)');try{c.close()}catch(e){}return}
 netLog('roomAttachGuest: guest conn from',c.peer);
 netRoom.conn=c;netRoom.pending=false;
 try{const pc=c.peerConnection;if(pc){netLog('roomAttachGuest: ICE state',pc.iceConnectionState);pc.oniceconnectionstatechange=()=>netLog('roomAttachGuest: ICE ->',pc.iceConnectionState)}}catch(e){}
 c.on('open',()=>netLog('roomAttachGuest: conn OPEN'));
 c.on('data',d=>netOnRoomMsg(d));
 c.on('close',()=>{netLog('roomAttachGuest: conn closed');netOpponentGone()});
 c.on('error',(e)=>{netLog('roomAttachGuest: conn error',e&&e.type)});
}
function roomReclaim(){
 if(!isHost||!netRoom||!netRoomCode)return;
 const code=netRoomCode;
 roomKillPeer();
 $('roomStatus').textContent='Reclaiming room…';
 netRoomPeer=new Peer('ffa-room-'+code,iceCfg());
 netRoomPeer.on('open',()=>{
  netRoomPeer.on('connection',roomAttachGuest);
  if(netRoom.conn){netRoom.conn=null;netRoom.guestName=null;netRoom.guestPick=null;netRoom.guestReady=false;}
  $('roomStatus').innerHTML='Share the code — waiting for your rival<span class="waiting-dots"></span>';
  netRenderRoom();
  netPopup('Room live','Room '+code+' is live again. Your rival can join now.',null,null,true);
 });
 netRoomPeer.on('error',e=>{
  if(e&&e.type==='unavailable-id'){netRoom=null;roomCreate();}
  else $('roomStatus').textContent='Reclaim failed — hit Create room again.';
 });
}
document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState!=='visible')return;
 if(isHost&&netRoom&&netRoomCode&&(!netRoomPeer||netRoomPeer.disconnected))roomReclaim();
 else if(!isHost&&netRoom&&netRoom.conn&&!netRoom.conn.open)netPopup('Lost','Connection lost. Rejoin room '+netRoom.roomId+'.',()=>{netToSelect();roomMenu()},null,true);
});
function roomCopyCode(){const t=netRoomCode||'';if(!t)return;const done=()=>{const b=$('copyCodeBtn');if(b){b.textContent='Copied!';setTimeout(()=>{b.textContent='Copy'},1200)}};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done).catch(()=>done());else done()}
let npA=null,npD=null;
function netPopup(title,text,onA,onD,info){
 $('npTitle').textContent=title;$('npText').textContent=text;
 npA=onA||null;npD=onD||null;
 $('npAccept').textContent=info?'OK':'Accept';
 $('npDecline').style.display=info?'none':'';
 $('netPopup').classList.remove('hidden');
}
function roomStateMsg(){return{t:'room-state',host:{name:netRoom.hostName,pick:netRoom.hostPick,ready:netRoom.hostReady},guest:{name:netRoom.guestName,pick:netRoom.guestPick,ready:netRoom.guestReady}}}
function netOnRoomMsg(d){
 if(!d||typeof d!=='object'||!netRoom)return;
 switch(d.t){
  case 'room-hello':
   if(!isHost)break;
   netRoom.guestName=d.from.name;netRoom.guestPick=(d.pick==null?null:d.pick);netRoom.pending=false;
   netRoomSend(roomStateMsg());netRenderRoom();sfx('ui');break;
  case 'room-state':
   if(isHost)break;
   netRoom.hostName=d.host.name;netRoom.hostPick=d.host.pick;netRoom.hostReady=!!d.host.ready;
   netRoom.guestPick=d.guest.pick;netRoom.guestReady=!!d.guest.ready;
   netRenderRoom();break;
  case 'pick':
   if(!isHost||!netRoom)break;
   netRoom.guestPick=d.pick;netRenderRoom();netRoomSend(roomStateMsg());break;
  case 'ready':
   if(!isHost||!netRoom)break;
   netRoom.guestReady=!!d.ready;netRenderRoom();netRoomSend(roomStateMsg());netMaybeStart();break;
  case 'fight-start':netGuestFightStart(d);break;
  case 'versus':netShowVersusGuest(d.round);break;
  case 'begin':netBeginGuest();break;
  case 'in':if(netMode&&isHost){netRemoteIn.x=+d.x||0;netRemoteIn.y=+d.y||0;netRemoteIn.a=d.a?1:0;netRemoteIn.d=d.d?1:0;netRemoteIn.u=d.u?1:0}break;
  case 'ult-fx':{
   if(!fighters.length||!netRoom)break;
   const li=isHost?(d.by==='host'?0:1):(d.by==='host'?1:0);
   var eU=netUltFxs.find(u=>u.predicted&&u.f===fighters[li]);if(eU){eU.predicted=false;break}
   netUltFxs.push({f:fighters[li],t:fighters[1-li],time:0,hit:false,predicted:false});
   ultFxSpawn(fighters[li]);break}
  case 'snap':snapCurr=d;break;
  case 'result':netGuestResult(d);break;
  case 'back-room':netToRoom(false);break;
  case 'leave':netRoom=null;netPopup('Opponent left','They left the room.',()=>netToSelect(),null,true);break;
 }
}
function netShowRoom(asHost){
 isHost=asHost;
 $('selectScreen').classList.add('hidden');$('arenaScreen').classList.add('hidden');$('friendsPanel').classList.add('hidden');
 $('roomScreen').classList.remove('hidden');
 $('roomMeta').textContent='ROOM '+netRoom.roomId;
 if(!asHost)$('roomCodeBig').classList.add('hidden');
 netRenderRoom();
}
function netRenderRoom(){
 if(!netRoom||$('roomScreen').classList.contains('hidden'))return;
 const L=isHost?netRoom.hostName:netRoom.guestName;
 const Rr=isHost?netRoom.guestName:netRoom.hostName;
 $('roomNameL').textContent=L;
 $('roomNameR').textContent=Rr||'…';
 const myPick=isHost?netRoom.hostPick:netRoom.guestPick;
 const opPick=isHost?netRoom.guestPick:netRoom.hostPick;
 const myReady=isHost?netRoom.hostReady:netRoom.guestReady;
 const opReady=isHost?netRoom.guestReady:netRoom.hostReady;
 buildRoomRoster($('roomRosterL'),myPick,true);
 buildRoomRoster($('roomRosterR'),opPick,false);
 const pl=$('roomPickL'),pr=$('roomPickR');
 if(myPick!=null){const d=R[myPick],e=ELEMENTS[d.element];pl.querySelector('.rps-word').textContent=d.word;pl.querySelector('.rps-word').style.cssText=`font-family:"${d.font}";color:${e.color}`}else{pl.querySelector('.rps-word').textContent='?';pl.querySelector('.rps-word').style.cssText=''}
 if(opPick!=null){const d=R[opPick],e=ELEMENTS[d.element];pr.querySelector('.rps-word').textContent=d.word;pr.querySelector('.rps-word').style.cssText=`font-family:"${d.font}";color:${e.color}`}else{pr.querySelector('.rps-word').textContent='?';pr.querySelector('.rps-word').style.cssText=''}
 const rl=$('readyL');rl.textContent=myReady?'READY!':'READY';rl.classList.toggle('on',!!myReady);rl.disabled=(myPick==null);
 const rr=$('readyR');rr.textContent=opReady?'READY!':'READY';rr.classList.toggle('on',!!opReady);
 let st='Pick your fighter.';
 if(myPick!=null&&opPick==null)st='Waiting for opponent to pick…';
 else if(myPick!=null&&opPick!=null&&!(myReady&&opReady))st='Press READY when set.';
 else if(myReady&&opReady)st=isHost?'Both ready — starting!':'Both ready!';
 $('roomStatus').textContent=st;
}
function buildRoomRoster(root,pickId,interactive){
 root.innerHTML='';
 R.forEach((d,idx)=>{
  const el=ELEMENTS[d.element],b=document.createElement('button');
  b.className='room-card'+(pickId===d.id?(interactive?' mine':' opp'):'')+(interactive?'':' locked');b.style.animation='cardIn .3s ease backwards';b.style.animationDelay=(idx*12)+'ms';
  b.type='button';
  const w=document.createElement('span');w.className='rw';w.style.fontFamily="'"+d.font+"',system-ui";w.style.color=el.color;w.textContent=d.word;
  const m=document.createElement('span');m.className='re';m.textContent=d.element+' · '+d.hp+'/'+d.atk+'/'+d.spd;
  b.appendChild(w);b.appendChild(m);
  if(interactive)b.onclick=()=>netPick(d.id);
  root.appendChild(b);
 });
}
function netPick(id){
 if(!netRoom)return;
 if(isHost){netRoom.hostPick=id;netRoomSend(roomStateMsg())}
 else{netRoom.guestPick=id;netOwnPick=id;netRoomSend({t:'pick',pick:id})}
 netRenderRoom();sfx('ui');
}
function netToggleReady(){
 if(!netRoom)return;
 if(isHost){if(netRoom.hostPick==null)return;netRoom.hostReady=!netRoom.hostReady;netRoomSend(roomStateMsg());netRenderRoom();netMaybeStart()}
 else{if(netRoom.guestPick==null)return;netRoom.guestReady=!netRoom.guestReady;netRoomSend({t:'ready',ready:netRoom.guestReady});netRenderRoom()}
}
function netMaybeStart(){
 if(isHost&&netRoom&&!netRoom.pending&&netRoom.hostPick!=null&&netRoom.guestPick!=null&&netRoom.hostReady&&netRoom.guestReady){
  netRoom.pending='starting';
  setTimeout(()=>{if(!netRoom)return;if(netRoom.hostReady&&netRoom.guestReady)netStartFight();netRoom.pending=false},600);
 }
}
function netStartFight(){
 netMode=true;isHost=true;netActive=true;netRemoteIn={x:0,y:0,a:0,d:0,u:0};
 netHostPick=R[netRoom.hostPick];netGuestPick=R[netRoom.guestPick];
 netLocalName=netRoom.hostName;netRemoteName=netRoom.guestName;
 chosen=[netHostPick,netGuestPick];
 round=1;wins=[0,0];upgradeMods=[{},{}];
 matchStats={damage:[0,0],hits:[0,0],ults:[0,0],crits:[0,0],started:performance.now()};
 $('roomScreen').classList.add('hidden');$('arenaScreen').classList.remove('hidden');
 showMapSelect((i)=>{currentMap=i;resize();
 netRoomSend({t:'fight-start',hostPick:netRoom.hostPick,guestPick:netRoom.guestPick,hostName:netRoom.hostName,guestName:netRoom.guestName,round:1,map:i});
 showVersus()});
 if(netSnapTimer)clearInterval(netSnapTimer);
 netSnapTimer=setInterval(netSendSnap,50);
}
function netGuestFightStart(d){
 netMode=true;isHost=false;netActive=true;
 if(d.map!=null){currentMap=d.map;resize()}
 netOwnPick=R[d.guestPick];netOppPick=R[d.hostPick];
 netLocalName=d.guestName;netRemoteName=d.hostName;
 chosen=[netOwnPick,netOppPick];
 round=d.round||1;wins=[0,0];upgradeMods=[{},{}];
 matchStats={damage:[0,0],hits:[0,0],ults:[0,0],crits:[0,0],started:performance.now()};
 $('roomScreen').classList.add('hidden');$('friendsPanel').classList.add('hidden');$('netPopup').classList.add('hidden');
 $('arenaScreen').classList.remove('hidden');
 netShowVersusGuest(round);
 if(netInputTimer)clearInterval(netInputTimer);
 netInputTimer=setInterval(netSendInput,40);
}
function netShowVersusGuest(r){
 round=r;
 showVersus(netOwnPick,netOppPick,'ONLINE BATTLE \u00b7 '+netLocalName+' VS '+netRemoteName,true);
}
function netBeginGuest(){
 if(mode!=='versus')return;
 if(vsTimer){clearTimeout(vsTimer);vsTimer=null}
 $('versus').classList.add('hidden');
 resize();mode='fight';paused=false;
 particles=[];projectiles=[];rings=[];bolts=[];logs=[];dmgNums=[];shake=0;flash=0;slowmo=0;cinematic=null;netUltFxs=[];roundEnd=0;snapCurr=null;
 fighters=[copyDef(netOwnPick,0,{local:true}),copyDef(netOppPick,1,{local:false})];
 snapCurr=null;
 setControlColors();updateHud();
 addLog('Online battle — you are '+netOwnPick.word);sfx('fight');
}
function applyRemoteInput(q,p,dt){
 const r=netRemoteIn;
 moveFighter(q,r.x,r.y,dt);
 if(r.a){basicAttack(q,p);r.a=0}
 if(r.d){dashFighter(q,r.x,r.y);r.d=0}
 if(r.u){if(q.energy>=100)triggerUltimate(q,p);r.u=0}
}
function netSnapF(f){return{x:Math.round(f.x*10)/10,y:Math.round(f.y*10)/10,hp:Math.round(f.hp*10)/10,max:f.max,energy:Math.round(f.energy),facing:f.facing,dead:f.dead?1:0,iframe:Math.round(f.iframe*100)/100,stun:Math.round(f.stun*100)/100}}
function netSendSnap(){
 if(!(netMode&&isHost&&netActive))return;
 if(mode!=='fight'&&mode!=='cinematic')return;
 if(!fighters.length)return;
 netRoomSend({t:'snap',seq:++netSeq,round:round,wins:wins.slice(),
  h:netSnapF(fighters[0]),g:netSnapF(fighters[1]),
  proj:projectiles.slice(0,24).map(p=>({x:Math.round(p.x),y:Math.round(p.y),vx:Math.round(p.vx),vy:Math.round(p.vy),color:p.color,color2:p.color2,size:p.size,shot:p.shot,shape:p.shape,motion:p.motion,age:Math.round((p.age||0)*100)/100}))});
}
function netSendInput(){
 if(!(netMode&&!isHost&&netActive&&mode==='fight'))return;
 const v=playerVector();
 const wu=buf('ult')?1:0;
 if(wu&&fighters.length&&fighters[0].energy>=100&&!netUltFxs.some(u=>u.f===fighters[0])){netUltFxs.push({f:fighters[0],t:fighters[1],time:0,hit:false,predicted:true});ultFxSpawn(fighters[0])}
 netRoomSend({t:'in',x:Math.round(v.x*100)/100,y:Math.round(v.y*100)/100,a:buf('attack')?1:0,d:buf('dash')?1:0,u:wu});
 action.attack=0;action.dash=0;action.ult=0;
}
function netApplySnap(f,s,k){
 f.x+=(s.x-f.x)*k;f.y+=(s.y-f.y)*k;
 f.hp=s.hp;f.max=s.max;f.energy=s.energy;f.facing=s.facing;f.dead=!!s.dead;f.iframe=s.iframe||0;f.stun=s.stun||0;
}
function updateNetGuest(dt){
 if(!snapCurr||fighters.length<2){updateFx(dt);return}
 const s=snapCurr,f0=fighters[0],f1=fighters[1],k=0.45;
 for(const f of fighters){if(f._ph!==undefined&&f.hp<f._ph-0.5)dmgNums.push({x:f.x+rnd(-24,24),y:f.y-46,txt:Math.round(f._ph-f.hp),crit:false,ult:false,life:.85,max:.85,vy:-110})}
 netApplySnap(f0,s.g,k);netApplySnap(f1,s.h,k);
 for(const f of fighters)f._ph=f.hp;
 projectiles=s.proj.map(o=>({x:o.x,y:o.y,px:o.x,py:o.y,vx:o.vx,vy:o.vy,color:o.color,color2:o.color2,size:o.size,shot:o.shot,shape:o.shape,motion:o.motion,life:1,age:o.age||0,phase:0,visual:true,source:f1,target:f0,dmg:0,crit:false,homing:0}));
 for(const f of fighters){f.flash=Math.max(0,f.flash-dt);f.bob+=dt*3;ambient(f,dt)}
 round=s.round;if(s.wins)wins=s.wins.slice();
 updateFx(dt);updateHud();
}
function afterRoundNet(){
 const champ=wins.findIndex(x=>x>=2);
 if(champ>=0){
  if(netSnapTimer){clearInterval(netSnapTimer);netSnapTimer=null}
  netRoomSend({t:'result',winner:champ===0?'host':'guest',wins:wins.slice(),stats:{damage:matchStats.damage.slice(),hits:matchStats.hits.slice(),ults:matchStats.ults.slice(),crits:matchStats.crits.slice()}});
  showResult(champ);return}
 round++;netRoomSend({t:'versus',round});showVersus();
}
function netGuestResult(d){
 if(netInputTimer){clearInterval(netInputTimer);netInputTimer=null}
 wins=d.wins.slice();
 matchStats={damage:d.stats.damage,hits:d.stats.hits,ults:d.stats.ults,crits:d.stats.crits,started:matchStats?matchStats.started:performance.now()};
 showResult(d.winner==='guest'?0:1);
}
function netResultUI(){
 $('rematchBtn').textContent='Back to room';
 $('newFightBtn').style.display='none';
 $('rematchBtn').onclick=()=>netToRoom(true);
}
function netToRoom(send){
 if(send)netRoomSend({t:'back-room'});
 if(netSnapTimer){clearInterval(netSnapTimer);netSnapTimer=null}
 if(netInputTimer){clearInterval(netInputTimer);netInputTimer=null}
 netActive=false;mode='room';netUltFxs=[];
 $('result').classList.add('hidden');$('arenaScreen').classList.add('hidden');$('versus').classList.add('hidden');
 $('roomScreen').classList.remove('hidden');
 if(netRoom){netRoom.pending=false;netRoom.hostReady=false;netRoom.guestReady=false;
  if(isHost)netRoomSend(roomStateMsg());
  netRenderRoom()}
}
function netOpponentGone(){
 if(netSnapTimer){clearInterval(netSnapTimer);netSnapTimer=null}
 if(netInputTimer){clearInterval(netInputTimer);netInputTimer=null}
 netActive=false;netRoom=null;netUltFxs=[];
 netPopup('Disconnected','Opponent disconnected.',()=>netToSelect(),null,true);
}
function netLeaveRoom(){
 if(netRoom)netRoomSend({t:'leave',from:netMe()});
 netToSelect();
}
function netToSelect(){
 netCleanup();
 ['roomScreen','friendsPanel','arenaScreen','versus','upgrade','paused','result','netPopup'].forEach(id=>$(id).classList.add('hidden'));
 $('selectScreen').classList.remove('hidden');mode='select';fighters=[];
}
function netCleanup(){
 if(netSnapTimer){clearInterval(netSnapTimer);netSnapTimer=null}
 if(netInputTimer){clearInterval(netInputTimer);netInputTimer=null}
 roomKillPeer();netRoomCode='';
 netMode=false;isHost=false;netActive=false;netRoom=null;snapCurr=null;netUltFxs=[];
 const cb=$('roomCodeBig');if(cb)cb.classList.add('hidden');
 netRemoteIn={x:0,y:0,a:0,d:0,u:0};
 $('rematchBtn').textContent='Rematch';$('rematchBtn').onclick=rematch;
 $('newFightBtn').style.display='';
}
/* multiplayer UI wiring */
$('friendsBtn').onclick=()=>{audioInit();sfx('ui');roomMenu()};
$('friendsClose').onclick=()=>{$('friendsPanel').classList.add('hidden');sfx('ui')};
$('createRoomBtn').onclick=()=>{sfx('ui');roomCreate()};
$('joinRoomBtn').onclick=()=>{sfx('ui');roomJoin($('joinCode').value)};
$('joinCode').addEventListener('keydown',e=>{if(e.key==='Enter')roomJoin($('joinCode').value)});
$('copyCodeBtn').onclick=()=>{sfx('ui');roomCopyCode()};
$('logBtn').onclick=()=>{sfx('ui');netToggleLog()};
$('readyL').onclick=netToggleReady;
$('leaveRoomBtn').onclick=netLeaveRoom;
$('npAccept').onclick=()=>{$('netPopup').classList.add('hidden');sfx('ui');if(npA){const f=npA;npA=null;f()}};
$('npDecline').onclick=()=>{$('netPopup').classList.add('hidden');sfx('ui');if(npD){const f=npD;npD=null;f()}};
$('netNameInput').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur()});$('netNameInput').addEventListener('input',netValidateName);$('netNameInput').addEventListener('change',()=>{const v=$('netNameInput').value.trim().slice(0,16);if(v&&v!==netName){if(!/\d/.test(v)){netValidateName();sfx('ui');return}netName=v;netSaveId();netIdLine();sfx('ui')}else netIdLine()});
netLoadId();netIdLine();


buildElemFilter();buildRoster();renderSelection();resize();requestAnimationFrame(frame);
})();
