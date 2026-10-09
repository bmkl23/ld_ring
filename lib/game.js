// Ported from the single-file HTML. THREE is injected by the React component.
import { createSound } from './sound';
export function startGame(THREE){
let stopped=false,raf=0;
const sfx=createSound();sfx.armIntro(); // intro music starts on the first click/tap/key (browser autoplay rule)
// ember particles
const emb=document.getElementById('embers');
for(let i=0;i<26;i++){const e=document.createElement('div');e.className='ember';
 e.style.left=Math.random()*100+'%';e.style.setProperty('--dx',(Math.random()*80-40)+'px');
 e.style.animationDuration=(6+Math.random()*6)+'s';e.style.animationDelay=(Math.random()*6)+'s';emb.appendChild(e);}
document.getElementById('startBtn').onclick=()=>{
 sfx.enter();
 document.getElementById('intro').classList.add('hide');
 const rs=document.getElementById('roleScreen');
 if(rs)rs.classList.add('show'); // next: choose Player or Computer
 else{roleChosen=true;document.getElementById('hud').style.opacity=1;} // safety fallback
 setTimeout(()=>{const i=document.getElementById('intro');if(i)i.style.display='none';},1300);
};

const muteBtn=document.getElementById('muteBtn');
if(muteBtn){const paint=()=>{muteBtn.textContent=sfx.isMuted()?'\u{1F507}':'\u{1F50A}';};paint();muteBtn.onclick=()=>{sfx.toggleMute();paint();};}
const COLS='ABCDEF', N=6;
// maps each real character name from your API to a visual piece type + team
const PIECE_INFO={
 Frodo:{type:'boy',team:'light'},Sam:{type:'statue',team:'light'},Gandalf:{type:'witch',team:'light'},
 Aragorn:{type:'crown',team:'light'},Legolas:{type:'elf',team:'light'},Gimli:{type:'bearded',team:'light'},
 Orc1:{type:'demon',team:'mid'},Orc2:{type:'demon',team:'mid'},Orc3:{type:'demon',team:'mid'},
 Orc4:{type:'demon',team:'mid'},Orc5:{type:'demon',team:'mid'},Orc6:{type:'demon',team:'mid'},
 Saruman:{type:'witch',team:'dark'},Angmar:{type:'crown',team:'dark'},Gothmog:{type:'demon',team:'dark'}
};
const API_BASE='/api'; // proxied by Next.js route handlers (avoids https->http mixed-content on Vercel)
// offline fallback — the exact two API payloads you shared, used if the live API can't be reached
const FALLBACK_STATE={Frodo:'C1',Sam:'A1',Gandalf:'B1',Aragorn:'D1',Legolas:'E1',Gimli:'F1',Orc1:'A5',Orc2:'B5',Orc3:'C5',Orc4:'D5',Orc5:'E5',Orc6:'F5',Saruman:'B6',Angmar:'C6',Gothmog:'E6',turn:'player',has_ring:false,computer_won:false,player_won:false,draw:false};
const FALLBACK_MOVES=[{"piece":"Frodo","from":"C1","to":"B2","capture":null},{"piece":"Frodo","from":"C1","to":"C2","capture":null},{"piece":"Frodo","from":"C1","to":"D2","capture":null},{"piece":"Sam","from":"A1","to":"A2","capture":null},{"piece":"Sam","from":"A1","to":"A3","capture":null},{"piece":"Sam","from":"A1","to":"A4","capture":null},{"piece":"Sam","from":"A1","to":"A5","capture":"Orc1"},{"piece":"Gandalf","from":"B1","to":"A2","capture":null},{"piece":"Gandalf","from":"B1","to":"C2","capture":null},{"piece":"Gandalf","from":"B1","to":"D3","capture":null},{"piece":"Gandalf","from":"B1","to":"E4","capture":null},{"piece":"Gandalf","from":"B1","to":"F5","capture":"Orc6"},{"piece":"Aragorn","from":"D1","to":"D2","capture":null},{"piece":"Aragorn","from":"D1","to":"D3","capture":null},{"piece":"Aragorn","from":"D1","to":"D4","capture":null},{"piece":"Aragorn","from":"D1","to":"D5","capture":"Orc4"},{"piece":"Aragorn","from":"D1","to":"C2","capture":null},{"piece":"Aragorn","from":"D1","to":"B3","capture":null},{"piece":"Aragorn","from":"D1","to":"A4","capture":null},{"piece":"Aragorn","from":"D1","to":"E2","capture":null},{"piece":"Aragorn","from":"D1","to":"F3","capture":null},{"piece":"Legolas","from":"E1","to":"D2","capture":null},{"piece":"Legolas","from":"E1","to":"C3","capture":null},{"piece":"Legolas","from":"E1","to":"B4","capture":null},{"piece":"Legolas","from":"E1","to":"A5","capture":"Orc1"},{"piece":"Legolas","from":"E1","to":"F2","capture":null},{"piece":"Gimli","from":"F1","to":"D2","capture":null},{"piece":"Gimli","from":"F1","to":"E3","capture":null}];
const FALLBACK_NEXT_STATE={Frodo:'B2',Sam:'A2',Gandalf:'B1',Aragorn:'D1',Legolas:'E1',Gimli:'F1',Orc1:'A5',Orc2:'B5',Orc3:'C5',Orc4:'D5',Orc5:'E5',Orc6:'F5',Saruman:'B6',Angmar:'C6',Gothmog:'E6',turn:'player',has_ring:false,computer_won:false,player_won:false,draw:false};
const FALLBACK_NEXT_MOVES=[{"piece":"Frodo","from":"B2","to":"A1","capture":null},{"piece":"Frodo","from":"B2","to":"A3","capture":null},{"piece":"Frodo","from":"B2","to":"B3","capture":null},{"piece":"Frodo","from":"B2","to":"C1","capture":null},{"piece":"Frodo","from":"B2","to":"C2","capture":null},{"piece":"Frodo","from":"B2","to":"C3","capture":null},{"piece":"Sam","from":"A2","to":"A1","capture":null},{"piece":"Sam","from":"A2","to":"A3","capture":null},{"piece":"Sam","from":"A2","to":"A4","capture":null},{"piece":"Sam","from":"A2","to":"A5","capture":"Orc1"},{"piece":"Gandalf","from":"B1","to":"C2","capture":null},{"piece":"Gandalf","from":"B1","to":"D3","capture":null},{"piece":"Gandalf","from":"B1","to":"E4","capture":null},{"piece":"Gandalf","from":"B1","to":"F5","capture":"Orc6"},{"piece":"Aragorn","from":"D1","to":"D2","capture":null},{"piece":"Aragorn","from":"D1","to":"D3","capture":null},{"piece":"Aragorn","from":"D1","to":"D4","capture":null},{"piece":"Aragorn","from":"D1","to":"D5","capture":"Orc4"},{"piece":"Aragorn","from":"D1","to":"C1","capture":null},{"piece":"Aragorn","from":"D1","to":"C2","capture":null},{"piece":"Aragorn","from":"D1","to":"B3","capture":null},{"piece":"Aragorn","from":"D1","to":"A4","capture":null},{"piece":"Aragorn","from":"D1","to":"E2","capture":null},{"piece":"Aragorn","from":"D1","to":"F3","capture":null},{"piece":"Legolas","from":"E1","to":"D2","capture":null},{"piece":"Legolas","from":"E1","to":"C3","capture":null},{"piece":"Legolas","from":"E1","to":"B4","capture":null},{"piece":"Legolas","from":"E1","to":"A5","capture":"Orc1"},{"piece":"Legolas","from":"E1","to":"F2","capture":null},{"piece":"Gimli","from":"F1","to":"D2","capture":null},{"piece":"Gimli","from":"F1","to":"E3","capture":null}];
const cv=document.getElementById('c');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x9a7a5a,0.025);
scene.background=new THREE.Color(0x1c140f); // graceful fallback so rotating past the backdrop image doesn't show black void
const cam=new THREE.PerspectiveCamera(42,1,0.1,100);
scene.add(new THREE.AmbientLight(0xffd9ad,0.45));
const sun=new THREE.DirectionalLight(0xffcf8a,1.2);sun.position.set(6,7,3);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:1,far:20});
scene.add(sun);
const fill=new THREE.DirectionalLight(0x8a9ac8,0.25);fill.position.set(-5,4,-4);scene.add(fill);

// background — your uploaded fantasy artwork, as a crisp flat backdrop (not wrapped around a sphere, so no blur/upscaling)
const WALLPAPERS = ['/wallpapers/wp1.jpg','/wallpapers/wp2.jpg'];
let wpIndex = 0;
const skyImg = WALLPAPERS[wpIndex];
const skyMap = new THREE.TextureLoader().load(skyImg);
if ('SRGBColorSpace' in THREE) skyMap.colorSpace = THREE.SRGBColorSpace;
skyMap.anisotropy = R.capabilities.getMaxAnisotropy();
skyMap.wrapS = THREE.ClampToEdgeWrapping;
skyMap.wrapT = THREE.ClampToEdgeWrapping;
const sky=new THREE.Mesh(new THREE.PlaneGeometry(420,80),new THREE.MeshBasicMaterial({map:skyMap,fog:false}));
sky.position.set(0,9,-72);skyMap.wrapS=skyMap.wrapT=THREE.MirroredRepeatWrapping;
// cycle through the wallpapers every ~2 minutes
const wpTimer=setInterval(()=>{
 wpIndex=(wpIndex+1)%WALLPAPERS.length;
 new THREE.TextureLoader().load(WALLPAPERS[wpIndex],t=>{
  if('SRGBColorSpace' in THREE) t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=R.capabilities.getMaxAnisotropy();
  t.wrapS=t.wrapT=THREE.MirroredRepeatWrapping;
  sky.material.map=t;sky.material.needsUpdate=true;
 });
},120000);
scene.add(sky);

function wood(base,grain,w=256,h=256,reps=2){
 const k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');
 x.fillStyle=base;x.fillRect(0,0,w,h);
 for(let i=0;i<55;i++){
  x.strokeStyle=grain;x.globalAlpha=0.06+Math.random()*0.10;x.lineWidth=1+Math.random()*2.2;
  x.beginPath();let yy=Math.random()*h;x.moveTo(0,yy);
  for(let xx=0;xx<=w;xx+=18){yy+=(Math.random()-0.5)*9;x.lineTo(xx,yy);}
  x.stroke();
 }
 x.globalAlpha=1;
 const t=new THREE.CanvasTexture(k);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(reps,reps);return t;
}
const maple=wood('#dcc79c','#b6935f',256,256,1);
const walnutSq=wood('#6a4128','#3c2415',256,256,1);
const frameWood=wood('#33200f','#1c1109',256,256,4);
// floor surface — dark aged wood with a center runner rug, original motif (not the Gondor tree emblem)
function floorTex(){
 const w=1024,h=1024;const k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');
 const wg=wood('#2a1d14','#120b07',256,256,1);
 // draw base wood by stamping the wood canvas's own drawing logic inline instead (reuse pattern via tiling)
 x.fillStyle='#241810';x.fillRect(0,0,w,h);
 for(let i=0;i<10;i++){x.strokeStyle='#120b07';x.globalAlpha=0.5;x.lineWidth=2;x.beginPath();x.moveTo(i*(w/10),0);x.lineTo(i*(w/10),h);x.stroke();}
 for(let i=0;i<160;i++){x.globalAlpha=0.05+Math.random()*0.08;x.strokeStyle='#3a2a1a';x.lineWidth=1+Math.random()*1.6;
  x.beginPath();let yy=Math.random()*h;x.moveTo(0,yy);for(let xx=0;xx<=w;xx+=22){yy+=(Math.random()-0.5)*8;x.lineTo(xx,yy);}x.stroke();}
 x.globalAlpha=1;
 // runner rug band down the center (Z direction once mapped onto the floor)
 const bw=260;const bx=w/2-bw/2;
 x.fillStyle='#1a2338';x.fillRect(bx,0,bw,h);
 x.fillStyle='#caa862';x.fillRect(bx,0,6,h);x.fillRect(bx+bw-6,0,6,h);
 x.fillStyle='#8a6f3a';x.fillRect(bx+16,0,2,h);x.fillRect(bx+bw-18,0,2,h);
 // original stylised tree motif, repeated along the rug — simple asymmetric branches, not the Gondor sigil
 function motif(cy){
  x.save();x.translate(w/2,cy);x.strokeStyle='#d8c389';x.globalAlpha=0.5;x.lineWidth=3;x.lineCap='round';
  x.beginPath();x.moveTo(0,40);x.lineTo(0,-10);x.stroke();
  const branches=[[-1,-10,-34,-30],[1,-2,30,-24],[-1,6,-24,-6],[1,14,22,2]];
  branches.forEach(([dx,y0,ex,ey])=>{x.beginPath();x.moveTo(0,y0);x.quadraticCurveTo(dx*18,y0-14,ex,ey);x.stroke();
   x.beginPath();x.arc(ex,ey,3.2,0,7);x.fillStyle='#d8c389';x.fill();});
  x.beginPath();x.arc(0,-16,4,0,7);x.fill();
  x.restore();x.globalAlpha=1;
 }
 for(let cy=90;cy<h;cy+=190)motif(cy);
 // warm candlelight glow pools near the corners, echoing the torch positions
 function glowPatch(gx,gy,r){const rg=x.createRadialGradient(gx,gy,0,gx,gy,r);rg.addColorStop(0,'#ff9a3b33');rg.addColorStop(1,'#ff9a3b00');x.fillStyle=rg;x.fillRect(gx-r,gy-r,r*2,r*2);}
 glowPatch(130,130,220);glowPatch(w-130,130,220);glowPatch(130,h-130,220);glowPatch(w-130,h-130,220);
 const t=new THREE.CanvasTexture(k);return t;
}
const tableWood=floorTex();

const table=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({map:tableWood,roughness:0.9}));
table.rotation.x=-Math.PI/2;table.position.y=-0.7;table.receiveShadow=true;scene.add(table);

const frameMat=new THREE.MeshStandardMaterial({map:frameWood,roughness:0.5,metalness:0.05});
const frame=new THREE.Mesh(new THREE.BoxGeometry(N+1,0.5,N+1),frameMat);
frame.position.y=-0.3;frame.castShadow=true;frame.receiveShadow=true;scene.add(frame);
const inlay=new THREE.Mesh(new THREE.BoxGeometry(N+0.7,0.06,N+0.7),new THREE.MeshStandardMaterial({color:0xc9a862,roughness:0.4,metalness:0.15}));
inlay.position.y=-0.055;scene.add(inlay);

// corner torches
function torch(x,z){
 const g=new THREE.Group();
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.04,0.5,8),new THREE.MeshStandardMaterial({color:0x2a1c10,roughness:0.7}));
 pole.position.y=0.25;pole.castShadow=true;g.add(pole);
 const flame=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.2,10),new THREE.MeshStandardMaterial({color:0xff8a2b,emissive:0xff5a00,emissiveIntensity:0.9}));
 flame.position.y=0.58;g.add(flame);
 const pl=new THREE.PointLight(0xff9a3b,0.9,4);pl.position.y=0.6;g.add(pl);
 g.position.set(x,-0.05,z);scene.add(g);
}
torch(-N/2-0.3,-N/2-0.3);torch(N/2+0.3,-N/2-0.3);torch(-N/2-0.3,N/2+0.3);torch(N/2+0.3,N/2+0.3);

// stone balcony pillars with hanging vines, framing the view either side
function pillar(x0,z0){
 const g=new THREE.Group();
 const stone=new THREE.MeshStandardMaterial({color:0x8c8578,roughness:0.75});
 const col=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,4.2,10),stone);col.position.y=1.8;col.castShadow=true;g.add(col);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.28,0.2,10),stone);cap.position.y=3.95;g.add(cap);
 const ivy=new THREE.MeshStandardMaterial({color:0x3a5a2e,roughness:0.9});
 for(let i=0;i<5;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),ivy);
  leaf.position.set((Math.random()-0.5)*0.5,3.6-i*0.55-Math.random()*0.3,(Math.random()-0.5)*0.5);
  leaf.scale.set(1,0.6,1);leaf.castShadow=true;g.add(leaf);}
 g.position.set(x0,-0.3,z0);scene.add(g);
}
pillar(-N/2-1.3,-0.3);pillar(N/2+1.3,-0.3);

// drifting magical will-o-wisp orbs
const wisps=[];
const wispColors=[0x8ac2e8,0xc28ae8,0x8ae8c2];
for(let i=0;i<10;i++){
 const c=wispColors[i%wispColors.length];
 const orb=new THREE.Mesh(new THREE.SphereGeometry(0.045,10,10),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.4}));
 const light=new THREE.PointLight(c,0.35,2.5);orb.add(light);
 const bx=(Math.random()-0.5)*(N+2),bz=(Math.random()-0.5)*(N+2);
 orb.position.set(bx,1.1+Math.random()*0.6,bz);
 scene.add(orb);wisps.push({orb,bx,bz,ph:Math.random()*10,r:0.5+Math.random()*0.5});
}

const tiles=[];
const pos=(c,r)=>new THREE.Vector3(c-(N-1)/2,0,(N-r)-(N-1)/2);
const lightMat=new THREE.MeshStandardMaterial({map:maple,roughness:0.4,metalness:0.03});
const darkMat=new THREE.MeshStandardMaterial({map:walnutSq,roughness:0.4,metalness:0.03});
for(let c=0;c<N;c++)for(let r=1;r<=N;r++){
 const dk=(c+r)%2===0;
 const m=new THREE.Mesh(new THREE.BoxGeometry(0.97,0.1,0.97),dk?darkMat:lightMat);
 const p=pos(c,r);m.position.set(p.x,-0.02,p.z);m.receiveShadow=true;
 m.userData={tile:COLS[c]+r,piece:null};
 scene.add(m);tiles.push(m);
}
function label(txt){
 const k=document.createElement('canvas');k.width=k.height=64;const x=k.getContext('2d');
 x.fillStyle='#e8c274';x.font='italic 30px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,32,34);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(k),transparent:true,opacity:0.9}));
 s.scale.set(0.35,0.35,1);return s;
}
for(let c=0;c<N;c++){const s=label(COLS[c]);const p=pos(c,1);s.position.set(p.x,0.02,p.z+0.68);scene.add(s);}
for(let r=1;r<=N;r++){const s=label(String(r));const p=pos(0,r);s.position.set(p.x-0.68,0.02,p.z);scene.add(s);}

// ---- LOTR-flavoured character builder ----
function mat(c,extra){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.45,metalness:0.05},extra||{}));}
function pieceMesh(type,team){
 const g=new THREE.Group();
 function add(geo,m,y,rot){const mesh=new THREE.Mesh(geo,m);mesh.position.y=y;if(rot)mesh.rotation.set(rot[0]||0,rot[1]||0,rot[2]||0);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
 const skin=mat(0xe3b98c);
 switch(type){
  case 'castle':{
   const stone=mat(0x9a9a9a);
   add(new THREE.CylinderGeometry(0.24,0.3,0.55,16),stone,0.28);
   add(new THREE.CylinderGeometry(0.3,0.3,0.08,16),stone,0.6);
   for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const b=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.13,0.09),stone);b.position.set(Math.cos(a)*0.25,0.71,Math.sin(a)*0.25);b.castShadow=true;g.add(b);
    if(i%3===0){const flag=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.1,3),mat(0xb33a2e));flag.rotation.z=Math.PI/2;flag.position.set(Math.cos(a)*0.25,0.86,Math.sin(a)*0.25);flag.castShadow=true;g.add(flag);}
   }
   break;}
  case 'witch':{
   const robe=mat(team==='dark'?0x5a2a7a:0x2f6b4a);
   add(new THREE.ConeGeometry(0.2,0.5,14),robe,0.28);
   add(new THREE.SphereGeometry(0.14,16,12),skin,0.58);
   add(new THREE.CylinderGeometry(0.2,0.03,0.1,14),mat(0x1c140f),0.68,[0,0,Math.PI]);
   add(new THREE.ConeGeometry(0.14,0.32,14),mat(0x1c140f),0.9);
   break;}
  case 'crown':{
   const gold=mat(0xd4af37,{metalness:0.6,roughness:0.25});
   add(new THREE.CylinderGeometry(0.2,0.25,0.3,16),gold,0.2);
   const gems=[0xb3312c,0x2f6b4a,0x2f4f8a,0xb3312c,0x2f6b4a];
   for(let i=0;i<5;i++){const a=i/5*Math.PI*2;
    const p=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.16,8),gold);p.position.set(Math.cos(a)*0.16,0.4,Math.sin(a)*0.16);p.castShadow=true;g.add(p);
    const j=new THREE.Mesh(new THREE.SphereGeometry(0.03,8,8),mat(gems[i],{metalness:0.3,roughness:0.2}));j.position.set(Math.cos(a)*0.2,0.25,Math.sin(a)*0.2);g.add(j);
   }
   break;}
  case 'fire':{
   const flame=mat(0xff6a2b,{emissive:0xff3d00,emissiveIntensity:0.6,roughness:0.5});
   const flame2=mat(0xffc23b,{emissive:0xff9500,emissiveIntensity:0.7,roughness:0.5});
   add(new THREE.ConeGeometry(0.22,0.5,16),flame,0.28);
   add(new THREE.ConeGeometry(0.13,0.3,16),flame2,0.6);
   break;}
  case 'mountain':{
   const rock=mat(0x6b7280);
   add(new THREE.ConeGeometry(0.3,0.55,4),rock,0.28,[0,0.4,0]);
   const p2=add(new THREE.ConeGeometry(0.2,0.4,4),rock,0.35,[0,-0.5,0]);p2.position.x=0.12;
   add(new THREE.ConeGeometry(0.09,0.14,4),mat(0xffffff),0.62,[0,0.4,0]);
   break;}
  case 'demon':{
   const red=mat(0xb32020,{roughness:0.5});
   add(new THREE.SphereGeometry(0.22,16,12),red,0.32);
   add(new THREE.SphereGeometry(0.15,16,12),red,0.58);
   const dark=mat(0x2a1a12);
   const h1=add(new THREE.ConeGeometry(0.045,0.16,8),dark,0.76,[0,0,-0.35]);h1.position.x=-0.08;
   const h2=add(new THREE.ConeGeometry(0.045,0.16,8),dark,0.76,[0,0,0.35]);h2.position.x=0.08;
   const white=mat(0xffffff);
   const eL=add(new THREE.SphereGeometry(0.035,8,8),white,0.6);eL.position.x=-0.06;eL.position.z=0.12;
   const eR=add(new THREE.SphereGeometry(0.035,8,8),white,0.6);eR.position.x=0.06;eR.position.z=0.12;
   break;}
  case 'statue':{
   const rock=mat(0x8c8c86,{roughness:0.7});
   add(new THREE.BoxGeometry(0.32,0.62,0.26),rock,0.34);
   add(new THREE.BoxGeometry(0.36,0.1,0.28),rock,0.58);
   add(new THREE.BoxGeometry(0.1,0.14,0.16),rock,0.5).position.z=0.16;
   break;}
  case 'boy':{
   const tunic=mat(team==='dark'?0x5a2a7a:0x3f6fb0);
   add(new THREE.CylinderGeometry(0.15,0.19,0.36,14),tunic,0.2);
   add(new THREE.SphereGeometry(0.13,14,10),skin,0.46);
   add(new THREE.SphereGeometry(0.14,10,8,0,6.3,0,1.7),mat(0xe8d27a),0.5);
   break;}
  case 'elf':{
   const tunic=mat(team==='dark'?0x5a2a7a:0x2f6b4a);
   add(new THREE.CylinderGeometry(0.15,0.19,0.36,14),tunic,0.2);
   add(new THREE.SphereGeometry(0.12,14,10),skin,0.46);
   const ear=mat(skin.color);
   const e1=add(new THREE.ConeGeometry(0.03,0.14,8),ear,0.46,[0,0,-0.9]);e1.position.x=-0.13;
   const e2=add(new THREE.ConeGeometry(0.03,0.14,8),ear,0.46,[0,0,0.9]);e2.position.x=0.13;
   add(new THREE.ConeGeometry(0.14,0.14,14),mat(0xd8cf9a),0.62);
   break;}
  case 'bearded':{
   const robe=mat(team==='dark'?0x5a2a7a:0x6b4a2e);
   add(new THREE.CylinderGeometry(0.16,0.21,0.42,14),robe,0.23);
   add(new THREE.SphereGeometry(0.13,14,10),skin,0.5);
   add(new THREE.ConeGeometry(0.1,0.2,10),mat(0xcac2b0),0.38);
   break;}
 }
 return g;
}

// ---- live game state wiring ----
let gameState=null,legalMoves=[],pieceGroups={},highlightMeshes=[],selected=null;
let busy=false; // true while an API call / animation is running — blocks extra clicks
let role=null,roleChosen=false; // role: 'player' (Fellowship) or 'computer' (Shadow army) — picked on the role screen
let offlineMode=false,gameOver=false; // offlineMode: initial API load failed, gameOver: win/lose/draw reached
const mySide=()=>role==='computer'?'computer':'player'; // which side the human controls
const isMine=n=>!!PIECE_INFO[n]&&(role==='computer'?PIECE_INFO[n].team!=='light':PIECE_INFO[n].team==='light');
const oppName=()=>role==='computer'?'Fellowship':'Computer';
function outcome(st){ // 'victory' | 'defeat' | 'draw' | null, from the human's point of view
 if(st.draw)return'draw';
 const won=role==='computer'?st.computer_won:st.player_won,lost=role==='computer'?st.player_won:st.computer_won;
 return won?'victory':lost?'defeat':null;
}
function tileXZ(tile){return pos(COLS.indexOf(tile[0]),+tile.slice(1));}
function clearPieces(){Object.values(pieceGroups).forEach(g=>scene.remove(g));pieceGroups={};}
function clearHighlights(){highlightMeshes.forEach(m=>scene.remove(m));highlightMeshes=[];}
function addPiece(name,val){
 const info=PIECE_INFO[name];if(!info||typeof val!=='string')return;
 const p=tileXZ(val);
 const grp=pieceMesh(info.type,info.team);
 if(name==='Gothmog')grp.scale.set(1.25,1.25,1.25); // commander, slightly larger
 const hit=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4,1,10),new THREE.MeshBasicMaterial({visible:false}));hit.position.y=0.5;grp.add(hit); // generous invisible click target
 grp.position.set(p.x,0,p.z);
 grp.userData={piece:name,tile:val};
 grp.traverse(o=>o.userData=grp.userData);
 scene.add(grp);pieceGroups[name]=grp;
}
function renderState(state){
 clearPieces();
 Object.entries(state).forEach(([name,val])=>addPiece(name,val));
}
// make the 3D pieces match a state exactly (safety net after animations)
function syncMeshes(state){
 Object.keys(PIECE_INFO).forEach(name=>{
  const val=state[name],g=pieceGroups[name];
  if(typeof val!=='string'){if(g){scene.remove(g);delete pieceGroups[name];}return;}
  if(!g){addPiece(name,val);return;}
  if(g.userData.tile!==val){const p=tileXZ(val);g.position.x=p.x;g.position.z=p.z;g.userData.tile=val;}
 });
}
function showHighlights(moves){
 clearHighlights();
 moves.forEach(mv=>{
  const p=tileXZ(mv.to);
  const ring=new THREE.Mesh(new THREE.RingGeometry(0.26,0.38,24),new THREE.MeshBasicMaterial({color:mv.capture?0xff4433:0x6adfff,side:THREE.DoubleSide,transparent:true,opacity:0.9}));
  ring.rotation.x=-Math.PI/2;ring.position.set(p.x,0.03,p.z);ring.userData={moveTarget:mv};
  const hp=new THREE.Mesh(new THREE.PlaneGeometry(0.96,0.96),new THREE.MeshBasicMaterial({visible:false,side:THREE.DoubleSide}));hp.userData={moveTarget:mv};ring.add(hp); // whole tile is clickable, not just the thin ring
  scene.add(ring);highlightMeshes.push(ring);
 });
}
function applyNewState(state,moves,note){
 gameState=state;legalMoves=moves||[];selected=null;clearHighlights();renderState(state);
 document.getElementById('t').textContent=outcome(state)==='victory'?'Victory!':outcome(state)==='defeat'?'Defeated...':outcome(state)==='draw'?'Draw':state.turn===mySide()?'Your move':oppName()+' thinking…';
 document.getElementById('s').textContent=note||'Tap a piece to see its moves';
}
// ---- offline fallback rules engine (approximate — only used when the real API is unreachable) ----
// keeps the offline demo playable indefinitely instead of dead-ending after one move
function occupantAt(state,tile){for(const n in PIECE_INFO){if(state[n]===tile)return n;}return null;}
function slide(state,name,dirs){
 const info=PIECE_INFO[name],from=state[name];const c0=COLS.indexOf(from[0]),r0=+from.slice(1);const moves=[];
 dirs.forEach(([dc,dr])=>{let c=c0,r=r0;
  while(true){c+=dc;r+=dr;if(c<0||c>5||r<1||r>6)break;
   const tile=COLS[c]+r,o=occupantAt(state,tile);
   if(!o){moves.push({piece:name,from,to:tile,capture:null});continue;}
   if(PIECE_INFO[o].team!==info.team)moves.push({piece:name,from,to:tile,capture:o});
   break;}});
 return moves;
}
function step(state,name,dirs,maxDist){
 const info=PIECE_INFO[name],from=state[name];const c0=COLS.indexOf(from[0]),r0=+from.slice(1);const moves=[];
 dirs.forEach(([dc,dr])=>{for(let d=1;d<=maxDist;d++){const c=c0+dc*d,r=r0+dr*d;if(c<0||c>5||r<1||r>6)break;
  const tile=COLS[c]+r,o=occupantAt(state,tile);
  if(!o){moves.push({piece:name,from,to:tile,capture:null});continue;}
  if(PIECE_INFO[o].team!==info.team)moves.push({piece:name,from,to:tile,capture:o});
  break;}});
 return moves;
}
const ROOK_DIRS=[[1,0],[-1,0],[0,1],[0,-1]],BISHOP_DIRS=[[1,1],[1,-1],[-1,1],[-1,-1]],ALL8=[...ROOK_DIRS,...BISHOP_DIRS];
function genMovesFor(state,name){
 if(!PIECE_INFO[name]||typeof state[name]!=='string')return[];
 switch(PIECE_INFO[name].type){
  case 'statue':return slide(state,name,ROOK_DIRS);
  case 'witch':case 'elf':return slide(state,name,BISHOP_DIRS);
  case 'crown':return slide(state,name,ALL8);
  case 'bearded':return step(state,name,ALL8,2);
  default:return step(state,name,ALL8,1); // boy, demon
 }
}
function genAllMoves(state,side){
 let all=[];
 Object.keys(PIECE_INFO).forEach(name=>{
  const isPlayer=PIECE_INFO[name].team==='light';
  if((side==='player')===isPlayer) all=all.concat(genMovesFor(state,name));
 });
 return all;
}
function applyMoveLocally(state,mv){const ns=Object.assign({},state);ns[mv.piece]=mv.to;if(mv.capture)delete ns[mv.capture];return ns;}
function offlineComputerTurn(){
 if(!gameState||gameState.turn!=='player'){
  const moves=genAllMoves(gameState,'computer');
  if(moves.length){
   const mv=moves[Math.floor(Math.random()*moves.length)];
   const ns=applyMoveLocally(gameState,mv);ns.turn='player';
   applyNewState(ns,genAllMoves(ns,'player'),'Computer moved '+mv.piece+' to '+mv.to+' (offline simplified AI — connect '+API_BASE+' for the real rules).');
  }else{
   const ns=Object.assign({},gameState);ns.player_won=true;applyNewState(ns,[],'No computer moves left — you win this offline demo round!');
  }
 }
}
// ---- API response timer: live count while waiting + final time shown afterwards ----
function startApiTimer(label){
 const t0=performance.now();
 const secs=()=>((performance.now()-t0)/1000).toFixed(1)+'s';
 const id=setInterval(()=>{
  document.getElementById('t').textContent=label+' '+secs();
  if(performance.now()-t0>10000)document.getElementById('s').textContent='Server is slow\u2026 still waiting';
 },100);
 return {secs,stop(){clearInterval(id);}};
}
function showApiTime(tag){ // append e.g. "API replied in 1.8s" under the status line
 if(!tag)return;const el=document.getElementById('s');el.textContent=(el.textContent?el.textContent+'  \u00B7  ':'')+tag;
}
// ---- animation helpers: smooth piece moves, capture puffs, fireworks ----
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const tweens=[],parts=[];
let fireTimer=0;
function tween(ms,fn){return new Promise(res=>{tweens.push({t0:performance.now(),ms,fn,res});});}
function updateTweens(now){
 for(let i=tweens.length-1;i>=0;i--){
  const tw=tweens[i],k=Math.min(1,(now-tw.t0)/tw.ms);
  tw.fn(k);
  if(k>=1){tweens.splice(i,1);tw.res();}
 }
}
const partGeo=new THREE.SphereGeometry(0.05,6,6);
function spawnBurst(x,y,z,color,n=24,speed=2.2,life=900){
 for(let i=0;i<n;i++){
  const m=new THREE.Mesh(partGeo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:1}));
  m.position.set(x,y,z);
  const a=Math.random()*Math.PI*2,b=Math.random()*Math.PI-Math.PI/2,sp=speed*(0.4+Math.random()*0.8);
  parts.push({m,vx:Math.cos(a)*Math.cos(b)*sp,vy:Math.sin(b)*sp+speed*0.4,vz:Math.sin(a)*Math.cos(b)*sp,t0:performance.now(),life});
  scene.add(m);
 }
}
function updateParts(now,dt){
 for(let i=parts.length-1;i>=0;i--){
  const p=parts[i],age=now-p.t0;
  if(age>=p.life){scene.remove(p.m);p.m.material.dispose();parts.splice(i,1);continue;}
  p.vy-=4.5*dt;
  p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;
  p.m.material.opacity=1-age/p.life;
  p.m.scale.setScalar(1-0.5*age/p.life);
 }
}
function movePiece(name,tile,ms=450){
 const g=pieceGroups[name];if(!g)return Promise.resolve();
 const a={x:g.position.x,z:g.position.z},b=tileXZ(tile);
 g.userData.tile=tile;
 return tween(ms,k=>{
  const e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2; // ease in-out
  g.position.x=a.x+(b.x-a.x)*e;g.position.z=a.z+(b.z-a.z)*e;
  g.userData.hop=k>=1?0:Math.sin(Math.PI*k)*0.35; // little hop while sliding
 });
}
async function removePiece(name,delay=0){ // captured piece: puff + shrink away
 const g=pieceGroups[name];if(!g)return;
 delete pieceGroups[name];
 if(delay)await wait(delay);
 const s0=g.scale.x;
 spawnBurst(g.position.x,0.5,g.position.z,PIECE_INFO[name].team==='dark'?0xff5533:0x6adfff,16,1.6,700);
 await tween(280,k=>{g.scale.setScalar(Math.max(0.001,s0*(1-k)));});
 scene.remove(g);
}
function markTile(tile,color,ms=800){ // brief expanding ring on a tile
 const p=tileXZ(tile);
 const ring=new THREE.Mesh(new THREE.RingGeometry(0.26,0.4,28),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:0.95}));
 ring.rotation.x=-Math.PI/2;ring.position.set(p.x,0.035,p.z);scene.add(ring);
 return tween(ms,k=>{
  ring.material.opacity=0.95*(1-k*k);ring.scale.setScalar(1+k*0.35);
  if(k>=1){scene.remove(ring);ring.geometry.dispose();ring.material.dispose();}
 });
}
function animatePlayerMove(mv){ // OPTIMISTIC UPDATE: runs immediately on click, before the API answers
 const jobs=[movePiece(mv.piece,mv.to,420)];
 if(mv.capture)jobs.push(removePiece(mv.capture,300));
 return Promise.all(jobs);
}
// The API answers with the player's move AND the computer's reply in ONE state.
// Compare what is on screen with that state: whatever differs is the computer's move — animate it.
async function playReply(next){
 const movers=[],gone=[];
 Object.keys(PIECE_INFO).forEach(name=>{
  const g=pieceGroups[name],val=next[name];
  if(!g)return;
  if(typeof val!=='string')gone.push(name);
  else if(g.userData.tile!==val)movers.push({name,from:g.userData.tile,to:val});
 });
 const notes=[];
 for(const m of movers){
  const cap=gone.find(n=>pieceGroups[n]&&pieceGroups[n].userData.tile===m.to)||null;
  if(isMine(m.name))console.warn('[game] the opponent reply moved one of YOUR pieces:',m.name,m.from,'->',m.to,'(check the backend)');
  document.getElementById('s').textContent=oppName()+' moves '+m.name+'\u2026';
  markTile(m.from,0xffaa44,800);markTile(m.to,0xff3322,800); // show the computer\u2019s intention first
  await wait(420);
  sfx.computer(!!cap);
  const jobs=[movePiece(m.name,m.to,520)];
  if(cap)jobs.push(removePiece(cap,380));
  await Promise.all(jobs);
  notes.push(oppName()+' moved '+m.name+' '+m.from+' \u2192 '+m.to+(cap?' and captured '+cap:''));
 }
 for(const n of gone){if(pieceGroups[n])await removePiece(n);} // any capture not tied to a move
 return notes.join(' ; ');
}
// ---- end of game: victory blast / defeat / draw ----
function celebrate(){
 sfx.victory();
 const cols=[0xffd54a,0xff6a3d,0x6adfff,0xff5fa2,0x9dff6a,0xffffff];
 const max=calm?3:16;let n=0;
 clearInterval(fireTimer);
 const fire=()=>{
  spawnBurst((Math.random()-0.5)*6,1.2+Math.random()*3.2,(Math.random()-0.5)*6,cols[n%cols.length],54,2.9,1600);
  sfx.boom();n++;
  if(n>=max)clearInterval(fireTimer);
 };
 fire();fireTimer=setInterval(fire,420);
}
function hideEnd(){clearInterval(fireTimer);const el=document.getElementById('endOverlay');if(el)el.className='';}
function showEnd(kind){
 const el=document.getElementById('endOverlay');if(!el)return;
 const shadow=role==='computer';
 const txt={victory:shadow?['VICTORY','The Fellowship is broken. The Shadow Kingdom reigns!']:['VICTORY','The Shadow Kingdom has fallen. The realm is saved!'],defeat:shadow?['DEFEATED','The Fellowship prevails\u2026 but the shadow will rise again.']:['DEFEATED','Darkness covers the land\u2026 but the fight is not over.'],draw:['DRAW','Neither side could claim the kingdom.']}[kind];
 el.querySelector('h2').textContent=txt[0];el.querySelector('p').textContent=txt[1];
 el.className='show '+kind;
 if(kind==='victory')celebrate();else if(kind==='defeat')sfx.defeat();else sfx.draw();
}
function announceIfOver(st){
 const kind=outcome(st);
 if(!kind)return false;
 gameOver=true;busy=true; // keep the board locked until "Play again"
 document.getElementById('t').textContent=kind==='victory'?'Victory!':kind==='defeat'?'Defeated...':'Draw';
 document.getElementById('s').textContent='';
 setTimeout(()=>{if(gameOver)showEnd(kind);},650); // let the final move finish first
 return true;
}
// ---- applying an API (or offline) reply ----
async function applyReply(next,nextMoves,fallbackNote){
 clearHighlights();
 document.getElementById('t').textContent=oppName()+' moves\u2026';
 const note=await playReply(next);
 syncMeshes(next); // safety net: board now matches the server state exactly
 gameState=next;legalMoves=nextMoves||[];selected=null;
 if(announceIfOver(next))return true;
 document.getElementById('t').textContent=next.turn===mySide()?'Your move':oppName()+' thinking\u2026';
 document.getElementById('s').textContent=note||fallbackNote||'Tap a piece to see its moves';
 return false;
}
function offlineReply(mv){ // offline demo only: simplified local rules + random opponent move
 const me=mySide(),opp=me==='player'?'computer':'player';
 const mid=applyMoveLocally(gameState,mv);
 const cm=genAllMoves(mid,opp);
 if(!cm.length){const w=Object.assign({},mid,{turn:me});w[me==='player'?'player_won':'computer_won']=true;return{state:w,moves:[]};}
 const c=cm[Math.floor(Math.random()*cm.length)];
 const ns=applyMoveLocally(mid,c);ns.turn=me;
 const pm=genAllMoves(ns,me);
 if(!pm.length)ns[opp==='player'?'player_won':'computer_won']=true;
 return{state:ns,moves:pm};
}
async function doMove(mv){
 if(busy)return;           // an API call is already running — ignore extra clicks
 busy=true;
 sfx.move(!!mv.capture);   // instant audio feedback
 // keep only the chosen tile ring (gold) while we wait, remove the others
 const chosen=highlightMeshes.find(m=>m.userData.moveTarget===mv);
 highlightMeshes.forEach(m=>{if(m!==chosen)scene.remove(m);});
 highlightMeshes=chosen?[chosen]:[];
 if(chosen)chosen.material.color.set(0xffd54a);
 selected=null;
 document.getElementById('t').textContent=oppName()+' thinking\u2026';
 document.getElementById('s').textContent='Sending move\u2026';
 // OPTIMISTIC UPDATE: the piece moves on screen right now. gameState is NOT touched here,
 // so it stays the server's last confirmed state and is what we send as previous_state.
 const playerAnim=animatePlayerMove(mv);
 const timer=startApiTimer(oppName()+' thinking\u2026');let tag='',data=null,err=null;
 if(offlineMode){await wait(450);}
 else{
  try{
   const res=await fetch(API_BASE+'/play',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({previous_state:gameState,movement:mv,player:mySide()})});
   if(!res.ok)throw new Error('HTTP '+res.status);
   data=await res.json();
   tag='API replied in '+timer.secs();
  }catch(e){err=e;tag='API failed after '+timer.secs();}
 }
 timer.stop();
 try{
  await playerAnim; // make sure the optimistic slide has finished
  if(offlineMode){const r=offlineReply(mv);await applyReply(r.state,r.moves,'Offline demo \u2014 simplified local rules, connect the API for the real game.');}
  else if(!err){await applyReply(data.state||data,data.possible_moves||[],'Connected to live API');}
  else{ // server rejected / unreachable: ROLL BACK the optimistic move
   clearHighlights();renderState(gameState);
   document.getElementById('t').textContent='Your move';
   document.getElementById('s').textContent='Move could not be sent \u2014 please try again';
  }
 }catch(e){
  console.error(e);clearHighlights();syncMeshes(gameState);
  document.getElementById('t').textContent='Your move';
  document.getElementById('s').textContent='Something went wrong \u2014 please try again';
 }finally{
  showApiTime(tag);
  if(!gameOver)busy=false; // unlock after success OR failure (stay locked once the game is over)
 }
}
async function loadInitial(){
 gameOver=false;busy=true;selected=null;clearHighlights();
 document.getElementById('t').textContent='Loading battle\u2026';
 const timer=startApiTimer('Loading battle\u2026');let tag='';
 try{
  const res=await fetch(API_BASE+'/initial-state?role='+mySide());
  if(!res.ok)throw new Error('bad response');
  const data=await res.json();
  offlineMode=false;
  applyNewState(data.state||data,data.possible_moves||[],'Connected to live API');
  tag='API replied in '+timer.secs();
 }catch(e){
  offlineMode=true;
  tag='API failed after '+timer.secs();
  const fs=Object.assign({},FALLBACK_STATE,{turn:mySide()});
  applyNewState(fs,role==='computer'?genAllMoves(fs,'computer'):FALLBACK_MOVES,'Offline demo data \u2014 this sandboxed preview can\u2019t reach your HTTP API (mixed-content/CSP). It will connect live from your Next.js app.');
 }finally{
  timer.stop();showApiTime(tag);busy=false;
 }
}
const againBtn=document.getElementById('againBtn');
function showRoleScreen(){ // play again: let the player pick a side again
 roleChosen=false;role=null;gameOver=false;busy=false;selected=null;clearHighlights();
 const tag=document.getElementById('roleTag');if(tag)tag.className='';
 const rs=document.getElementById('roleScreen');if(rs)rs.classList.add('show');
 document.getElementById('hud').style.opacity=0;
 renderState(FALLBACK_STATE);swapView(0);
}
if(againBtn)againBtn.onclick=()=>{hideEnd();showRoleScreen();};
renderState(FALLBACK_STATE); // decorative board behind the menus; the real state loads once a side is chosen

let th=0,ph=0.85,rad=9;
const LOOK=new THREE.Vector3(0,0,0);
function place(){sky.position.set(-Math.sin(th)*72,9,-Math.cos(th)*72);sky.rotation.y=th;if(sky.material.map)sky.material.map.offset.x=th*0.06;cam.position.set(rad*Math.sin(ph)*Math.sin(th),rad*Math.cos(ph),rad*Math.sin(ph)*Math.cos(th));cam.lookAt(LOOK);}
let drag=null,moved=0;
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};moved=0;cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);
 th=th-dx*0.006;ph=Math.min(1.45,Math.max(0.25,ph-dy*0.006));drag={x:e.clientX,y:e.clientY};});
cv.addEventListener('pointerup',e=>{cv.style.cursor='grab';if(drag&&moved<(e.pointerType==='touch'?14:8))pick(e);drag=null;});
cv.addEventListener('pointercancel',()=>{drag=null;cv.style.cursor='grab';});
cv.addEventListener('wheel',e=>{e.preventDefault();rad=Math.min(16,Math.max(5,rad+e.deltaY*0.01));},{passive:false});
let pinch=0;cv.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)rad=Math.min(16,Math.max(5,rad-(d-pinch)*0.03));pinch=d;}},{passive:true});
cv.addEventListener('touchend',()=>pinch=0);

// ---- role selection (Player / Computer): swaps the board so your side is at the bottom ----
function swapView(toTh){ // smooth orbit of the camera; shortest way round
 const from=th;let d=toTh-from;d=Math.atan2(Math.sin(d),Math.cos(d));
 return tween(1400,k=>{const e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;th=from+d*e;});
}
function chooseRole(r){
 if(roleChosen)return;
 role=r;roleChosen=true;
  sfx.select();
 const rs=document.getElementById('roleScreen');if(rs)rs.classList.remove('show');
 document.getElementById('hud').style.opacity=1;
 const tag=document.getElementById('roleTag');
 if(tag){tag.textContent=r==='player'?'Playing as: Player \u00B7 Fellowship':'Playing as: Computer \u00B7 Shadow army';tag.className='show '+r;}
 document.getElementById('s').textContent=r==='player'
  ?'You lead the Fellowship \u2014 tap a piece to see its moves'
  :'You command the Shadow army \u2014 tap one of your pieces to see its moves';
 swapView(r==='computer'?Math.PI:0);
 loadInitial(); // fetch the starting state for the chosen side
}
const rolePlayerBtn=document.getElementById('rolePlayer'),roleComputerBtn=document.getElementById('roleComputer');
if(rolePlayerBtn)rolePlayerBtn.onclick=()=>chooseRole('player');
if(roleComputerBtn)roleComputerBtn.onclick=()=>chooseRole('computer');

const ray=new THREE.Raycaster();
function pick(e){
 if(busy||!roleChosen)return; // ignore clicks while waiting for the API / before a role is chosen
 const b=cv.getBoundingClientRect();
 ray.setFromCamera(new THREE.Vector2(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1),cam);
 // one ray, nearest thing wins: a glowing tile (whole tile counts) or a piece (generous hit-box)
 const pieceMeshes=Object.values(pieceGroups).flatMap(g=>g.children);
 const hit=ray.intersectObjects([...highlightMeshes,...pieceMeshes],true)[0];
 if(hit){
  const ud=hit.object.userData;
  if(ud.moveTarget){doMove(ud.moveTarget);return;}
  const name=ud.piece;
  if(name){
   // clicking an enemy standing on a highlighted tile = capture it
   const tgt=highlightMeshes.map(m=>m.userData.moveTarget).find(m=>m.to===ud.tile);
   if(tgt){doMove(tgt);return;}
   document.getElementById('t').textContent=name;
   if(gameState&&gameState.turn===mySide()&&isMine(name)){
    selected=name;sfx.select();
    const mine=legalMoves.filter(m=>m.piece===name);
    showHighlights(mine);
    document.getElementById('s').textContent=mine.length?mine.length+' move(s) \u2014 tap a glowing tile':'No legal moves right now';
   }else{
    sfx.deny();
    document.getElementById('s').textContent='at '+ud.tile;
   }
   return;
  }
 }
 selected=null;clearHighlights();sfx.tick();
}

function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastT=0;
function loop(t){
 const dt=Math.min(0.05,(t-lastT)/1000||0.016);lastT=t;
 updateTweens(performance.now());updateParts(performance.now(),dt);
 Object.entries(pieceGroups).forEach(([name,grp],i)=>{const on=selected===name;grp.position.y=(on?0.2:0)+(grp.userData.hop||0)+(calm?0:Math.sin(t/800+i)*0.015);});
 if(busy)highlightMeshes.forEach(m=>m.scale.setScalar(1+Math.sin(t/150)*0.15)); // pulse chosen tile while waiting
 if(!calm)wisps.forEach(w=>{const tt=t/1500+w.ph;w.orb.position.set(w.bx+Math.cos(tt)*w.r,1.2+Math.sin(tt*1.3)*0.25,w.bz+Math.sin(tt)*w.r);});
 if(stopped)return;place();R.render(scene,cam);raf=requestAnimationFrame(loop);
}
raf=requestAnimationFrame(loop);
 return ()=>{sfx.dispose();clearInterval(fireTimer);stopped=true;cancelAnimationFrame(raf);clearInterval(wpTimer);removeEventListener('resize',resize);R.dispose();};
}
