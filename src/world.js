import * as T from '../assets/vendor/three.module.js';
import { START, movePlayer, closestVillager } from './movement.js';

export function createWorld({host, villagers, labels, onNearby, onTalk, isPaused, reducedMotion, onFailure}) {
  const scene=new T.Scene(); scene.background=new T.Color('#e9efdf');scene.fog=new T.Fog('#e9efdf',45,95);
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputColorSpace=T.SRGBColorSpace; renderer.setClearColor('#e9efdf'); host.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();onFailure();});
  const camera=new T.OrthographicCamera(-20,20,15,-15,.1,150);
  const light=new T.DirectionalLight(0xfff0d2,3.2);light.position.set(-12,24,12);light.castShadow=true;light.shadow.mapSize.set(1024,1024);
  Object.assign(light.shadow.camera,{left:-23,right:23,top:23,bottom:-23,near:1,far:70});light.shadow.normalBias=.06;scene.add(light,new T.HemisphereLight(0xe8f3ff,0xa1ad75,2.3));
  const materials=new Map(); const material=c=>{if(!materials.has(c))materials.set(c,new T.MeshStandardMaterial({color:c,roughness:1,flatShading:true}));return materials.get(c);};
  function mesh(geometry,color,x,y,z,parent=scene){const m=new T.Mesh(geometry,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function box(w,h,d,c,x,y,z,parent=scene){return mesh(new T.BoxGeometry(w,h,d),c,x,y,z,parent);}
  function cylinder(r1,r2,h,c,x,y,z,segments=8,parent=scene){return mesh(new T.CylinderGeometry(r1,r2,h,segments),c,x,y,z,parent);}
  let seed=117;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  // All geometry is original and deterministic; no downloaded models/textures.
  const meadow=mesh(new T.PlaneGeometry(120,120),0xbace94,0,-.025,0);meadow.rotation.x=-Math.PI/2;meadow.castShadow=false;
  // A soft outer landscape grounds the miniature diorama.
  for(const [x,z,s] of [[-23,-25,10],[-8,-34,13],[12,-36,12],[28,-22,11],[-29,7,9],[29,18,8]]){const hill=mesh(new T.IcosahedronGeometry(s,1),0xb4c98e,x,-1,z);hill.scale.y=.43;hill.castShadow=false;}
  // Meandering river on the east side, built as a strip rather than a repeated tile.
  const vertices=[],indices=[]; const riverSegments=50;
  function riverX(z){return 10.8+Math.sin(z*.32)*.55;}
  for(let i=0;i<=riverSegments;i++){const z=-45+i*90/riverSegments;vertices.push(riverX(z)-1.45,.001,z,riverX(z)+1.45,.001,z);if(i<riverSegments){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}}
  const waterGeo=new T.BufferGeometry();waterGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));waterGeo.setIndex(indices);waterGeo.computeVertexNormals();
  const water=new T.Mesh(waterGeo,new T.MeshStandardMaterial({color:0x7ebbbb,roughness:.42,metalness:.05,side:T.DoubleSide}));scene.add(water);
  const ripples=[];for(let i=0;i<23;i++){let z=-11+random()*22;const r=box(.22+random()*.55,.012,.025,0xc2e0cf,riverX(z)+(random()-.5)*2,.04,z);r.castShadow=false;r.userData.origin=z;ripples.push(r);}
  // Sand paths lead directly to every NPC.
  box(3,.035,19,0xe2d5ac,0,.03,-.3);box(16,.035,2.8,0xe2d5ac,0,.035,-1);cylinder(3.1,3.1,.045,0xe6d9b4,0,.035,2.5,16);
  for(let i=0;i<22;i++){const s=box(.45+random()*.25,.05,.3+random()*.2,0xd1c8aa,(random()-.5)*1.5,.07,-8+i*.76);s.rotation.y=random()*.35;}
  const obstacles=[];
  function house(x,z,w,d,roofColor,wallColor){
    const g=new T.Group();g.position.set(x,0,z);scene.add(g);box(w,2.1,d,wallColor,0,1.05,0,g);box(w+.15,.25,d+.15,0xb7ae91,0,.13,0,g);
    const roof=mesh(new T.CylinderGeometry(0,w*.83,1.4,4),roofColor,0,2.7,0,g);roof.rotation.y=Math.PI/4;roof.scale.z=d/w;
    box(.65,1.35,.08,0x725d48,0,.8,d/2+.05,g);box(.08,.12,.1,0xd7b56f,.2,.85,d/2+.12,g);
    for(const side of [-1,1]){box(.62,.7,.08,0xf7e5a3,side*w*.31,1.2,d/2+.06,g);box(.72,.08,.15,0x9a7f5d,side*w*.31,.84,d/2+.1,g);box(.045,.7,.1,0x9c805c,side*w*.31,1.2,d/2+.1,g);}
    box(.42,.8,.45,0xc0a68b,w*.25,3,0,g);obstacles.push({x,z,w:w+.2,d:d+.2});return g;
  }
  house(-6.2,-4.2,3.5,3.1,0xb87555,0xf1dfb7);house(5.8,-4.4,3.2,3,0x6b9290,0xf0e5c3);house(0,-9,3.9,3,0xa27988,0xeed9b0);
  // A waterwheel beside the workshop, with a wooden axle and distinct paddles.
  const wheel=new T.Group();wheel.position.set(8,-.0,-4.4);scene.add(wheel);
  const rim=new T.Mesh(new T.TorusGeometry(1.05,.1,4,12),material(0x886c4a));rim.rotation.y=Math.PI/2;rim.position.y=1.15;wheel.add(rim);
  const wheelRotor=new T.Group();wheelRotor.position.y=1.15;wheel.add(wheelRotor);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const spoke=box(.12,.12,2.05,0x98784f,0,0,0,wheelRotor);spoke.rotation.x=a;const paddle=box(.65,.14,.38,0xb39461,0,Math.sin(a)*1.04,Math.cos(a)*1.04,wheelRotor);paddle.rotation.x=-a;}
  // Bridge is scenery beyond the walkable bank.
  for(let i=0;i<12;i++)box(.28,.13,2.1,0xc4a77b,9.15+i*.3,.18,4);
  for(const z of [3,5]){box(4,.1,.1,0x947c57,10.7,.7,z);for(const x of [9,10.8,12.5])box(.13,.9,.13,0x947c57,x,.4,z);}
  function tree(x,z,size,type){const group=new T.Group();group.position.set(x,0,z);group.rotation.y=random()*6.28;group.scale.setScalar(size);scene.add(group);cylinder(.13,.21,1.5,0x97754c,0,.75,0,6,group);
    if(type===0){for(let j=0;j<3;j++)cylinder(0,1.05-j*.2,1.55, [0x719862,0x7ba268,0x8bae73][j],0,1.5+j*.6,0,7,group);}
    else {for(const [dx,dy,dz,r] of [[0,2.3,0,1.2],[-.6,1.9,.15,.85],[.6,2,.1,.8]])mesh(new T.IcosahedronGeometry(r,0),type===1?0x8daa60:0xa9ba72,dx,dy,dz,group);}
    obstacles.push({x,z,w:.55*size,d:.55*size});}
  const treeSpots=[[-10,-8,1.2,0],[-9,-5,.85,1],[-11,-2,1,2],[-9,2,1.1,0],[-10,6,.9,1],[-7,8,1,2],[-4,9,.75,1],[4,8,.85,0],[7,7,1,1],[8,1,.7,2],[7,-9,1.2,0],[4,-10,.8,1],[-4,-10,.8,2],[-11,9,.8,0],[-12,-10,.7,1]];
  treeSpots.forEach(p=>tree(...p));
  for(const [x,z,s,t] of [[-15,-13,1.6,0],[-17,-8,1.3,1],[-13,12,1.5,2],[16,-11,1.3,0],[18,-5,1.6,1],[15,11,1.3,2],[-8,-18,1.4,0],[2,-19,1.2,1],[20,6,1.5,0],[-17,3,1.7,0],[-19,13,1.3,1]])tree(x,z,s,t);
  // Asymmetric grass and flower clusters: small, grouped accents, clear main paths.
  for(let i=0;i<115;i++){const x=-11.8+random()*20.5,z=-10.5+random()*20;if(Math.abs(x)<2||Math.abs(z+1)<1.8||obstacles.some(o=>Math.abs(x-o.x)<o.w/2+1&&Math.abs(z-o.z)<o.d/2+1))continue;
    for(let j=0;j<3;j++){const blade=cylinder(0,.065,.18+random()*.18,[0x8eae70,0x9cb879,0xa6be81][j],x+j*.12,.12,z+j*.08,3);blade.rotation.z=(random()-.5)*.6;}
    if(i%4===0){cylinder(.025,.025,.3,0x819566,x,.15,z,4);mesh(new T.IcosahedronGeometry(.12,0),i%8===0?0xf4d78b:0xefb79e,x,.36,z);}}
  for(const [x,z] of [[-4.2,3.4],[3.9,4.5],[-8,-7.7],[7.9,8.6],[-2,7.6]]){const rock=mesh(new T.DodecahedronGeometry(.45,0),0xb3b6a0,x,.18,z);rock.scale.set(1.3,.6,.85);rock.rotation.y=random()*3;}
  // Benches, crates, lanterns and a signpost make a lived-in, hand-placed scene.
  function bench(x,z){box(1.8,.14,.55,0xb79a65,x,.6,z);box(1.8,.45,.12,0xb79a65,x,.91,z-.23);for(const dx of [-.6,.6])box(.12,.6,.4,0x7b7358,x+dx,.3,z);obstacles.push({x,z,w:1.8,d:.65});}
  bench(-3.7,5.3);bench(3.8,2.7);
  for(const [x,z] of [[-8.5,-3.1],[3.9,-5.3],[-2.6,-8.5]]){box(.65,.6,.65,0xb99866,x,.3,z);box(.72,.08,.72,0xcbb083,x,.64,z);}
  for(const [x,z] of [[-2.3,1],[2.2,-5.7]]){cylinder(.055,.07,1.7,0x6b7355,x,.85,z,6);box(.28,.35,.28,0xf4d997,x,1.8,z);cylinder(0,.28,.25,0x647153,x,2.08,z,4);}
  cylinder(.07,.09,1.15,0xa18a60,-2.7, .58,3.1,6);const sign=box(.9,.3,.1,0xd4bc89,-2.7,1.08,3.1);sign.rotation.y=.2;
  function person(color,hat=false){const g=new T.Group();const torso=box(.5,.62,.32,color,0,.79,0,g);cylinder(.25,.23,.38,0xf2cc9f,0,1.31,0,8,g);box(.46,.13,.38,0x5d5544,0,1.51,-.025,g);
    for(const x of [-.09,.09])box(.04,.045,.02,0x514e41,x,1.34,.234,g);
    if(hat){cylinder(.36,.36,.09,0xddc58f,0,1.55,0,8,g);cylinder(.23,.25,.22,0xddc58f,0,1.7,0,8,g);}
    const legs=[];for(const x of [-.145,.145]){const leg=box(.19,.38,.22,0x535f54,x,.27,0,g);legs.push(leg);box(.2,.11,.3,0x514c40,x,.07,.04,g);box(.15,.48,.18,color,x*2.25,.83,0,g);}
    g.userData.legs=legs;return g;}
  const player=person(0xcb7951,true);player.position.set(START.x,0,START.z);scene.add(player);
  box(.4,.4,.18,0x9a6848,0,.8,-.25,player);
  const playerRing=new T.Mesh(new T.RingGeometry(.38,.46,32),new T.MeshBasicMaterial({color:0xfff7cf,side:T.DoubleSide}));playerRing.rotation.x=-Math.PI/2;playerRing.position.y=.08;scene.add(playerRing);
  const npcObjects=villagers.map((npc,i)=>{const g=person(npc.color,i===0);g.position.set(npc.x,0,npc.z);g.rotation.y=i%2?.25:-.3;scene.add(g);
    const ring=new T.Mesh(new T.RingGeometry(.5,.57,24),new T.MeshBasicMaterial({color:0xfff1c0,side:T.DoubleSide,transparent:true,opacity:.7}));ring.rotation.x=-Math.PI/2;ring.position.set(npc.x,.08,npc.z);scene.add(ring);
    const label=document.createElement('button');label.className='npc-label';label.textContent=npc.name;label.setAttribute('aria-label',`${npc.name} · ${npc.topic}`);label.addEventListener('click',()=>onTalk(npc));labels.append(label);obstacles.push({x:npc.x,z:npc.z,w:.55,d:.55});return{npc,g,label,ring};});
  let position={...START}, currentNearby=null, keys=new Set(), touch=null,last=performance.now(),walk=0,raf,failed=false,entranceAt=0,entranceAnimated=false,conversationFocus=null,conversationBlend=0;
  const lookAhead=new T.Vector3();
  const cameraTarget=new T.Vector3(START.x*.9,0,START.z*.9-1.2); const projected=new T.Vector3();
  function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);const half=w<700?9:8.5;camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  function updateNearby(){const next=closestVillager(position,villagers);if(next?.id!==currentNearby?.id){currentNearby=next;onNearby(next);npcObjects.forEach(n=>n.label.classList.toggle('near',n.npc.id===next?.id));}}
  const directionKeys={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
  function keydown(e){if(isPaused()||e.target.matches('input,textarea,[contenteditable="true"]'))return;if(directionKeys[e.code]){e.preventDefault();keys.add(directionKeys[e.code]);}if(e.code==='KeyE'&&!e.repeat){e.preventDefault();if(currentNearby)onTalk(currentNearby);}}
  function clear(){keys.clear();touch=null;}
  addEventListener('keydown',keydown);addEventListener('keyup',e=>keys.delete(directionKeys[e.code]));addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
  function frame(now){if(failed)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;if(document.hidden)return;
    const active=!isPaused();if(!active)clear();let sx=0,sy=0;
    if(active){if(keys.has('up')||touch==='up')sy-=1;if(keys.has('down')||touch==='down')sy+=1;if(keys.has('left')||touch==='left')sx-=1;if(keys.has('right')||touch==='right')sx+=1;}
    if(sx||sy){entranceAnimated=false;const len=Math.hypot(sx,sy);sx/=len;sy/=len;const dx=(sx+sy)*.707*dt*3.7,dz=(-sx+sy)*.707*dt*3.7;position=movePlayer(position,dx,dz,obstacles);player.rotation.y=Math.atan2(dx,dz);walk+=dt*10;}
    player.position.x=position.x;player.position.z=position.z;player.position.y=(!reducedMotion()&&(sx||sy))?Math.abs(Math.sin(walk))*.055:0;
    player.userData.legs.forEach((leg,i)=>leg.rotation.x=!reducedMotion()&&(sx||sy)?Math.sin(walk+i*Math.PI)*.35:0);
    playerRing.position.set(position.x,.08,position.z);
    const reduced=reducedMotion(),small=host.clientWidth<700;
    const desired=new T.Vector3(position.x*.9,0,position.z*.9-1.2);
    lookAhead.lerp(new T.Vector3((sx+sy)*.32,0,(-sx+sy)*.32),1-Math.exp(-dt*3));
    conversationBlend=reduced?0:T.MathUtils.lerp(conversationBlend,conversationFocus?1:0,1-Math.exp(-dt*4));
    if(!reduced){desired.add(lookAhead);if(conversationFocus){const focus=new T.Vector3((position.x+conversationFocus.x)/2+.7,0,(position.z+conversationFocus.z)/2+.6);desired.lerp(focus,conversationBlend);}}
    const entrance=entranceAnimated&&!reduced?Math.max(0,1-(now-entranceAt)/1800):0;
    const sweep=entrance*entrance*(3-2*entrance);
    if(sweep>0)desired.lerp(new T.Vector3(-1,0,-2),sweep*.55);
    if(reduced){cameraTarget.copy(desired);}else cameraTarget.lerp(desired,1-Math.exp(-dt*3.8));
    const turn=-sweep*.2+conversationBlend*(small?.035:.07);
    const offset=new T.Vector3(13,18+sweep*4,18).applyAxisAngle(new T.Vector3(0,1,0),turn);
    camera.zoom=1-sweep*.1+conversationBlend*(small?.025:.055);camera.updateProjectionMatrix();camera.position.copy(cameraTarget).add(offset);camera.lookAt(cameraTarget);
    if(!reducedMotion()){wheelRotor.rotation.x+=dt*.22;ripples.forEach((r,i)=>{r.position.z=-11.5+((r.userData.origin+11.5+now*.00022)%23);r.position.x=riverX(r.position.z)+Math.sin(i*2)*.8;});}
    updateNearby();npcObjects.forEach(({npc,label,g,ring},i)=>{g.rotation.y=Math.atan2(position.x-npc.x,position.z-npc.z);projected.set(npc.x,2.1,npc.z).project(camera);const x=(projected.x*.5+.5)*host.clientWidth,y=(-projected.y*.5+.5)*host.clientHeight;label.style.left=`${x}px`;label.style.top=`${y}px`;label.hidden=currentNearby?.id!==npc.id||x<0||x>host.clientWidth||y<65||y>host.clientHeight-65;ring.material.opacity=currentNearby?.id===npc.id?1:.4;});
    host.dataset.position=`${position.x.toFixed(2)},${position.z.toFixed(2)}`;host.dataset.nearby=currentNearby?.id||'';host.dataset.motion=reducedMotion()?'reduced':'full';
    host.dataset.cameraMode=reduced?'stable':conversationFocus?'conversation':sweep>0?'entrance':'follow';
    renderer.render(scene,camera);
  }
  frame(performance.now());
  return {focusOn(npc){conversationFocus=npc;},enter(animated){entranceAt=performance.now();entranceAnimated=animated;},setDirection(value){touch=value;},clear,reset(){clear();position={...START};conversationFocus=null;updateNearby();host.focus({preventScroll:true});},nearby(){return currentNearby;},stop(){failed=true;cancelAnimationFrame(raf);clear();},dispose(){failed=true;cancelAnimationFrame(raf);observer.disconnect();renderer.dispose();removeEventListener('keydown',keydown);}};
}
