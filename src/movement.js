export const START = { x:0, z:4.2 };
export function canStand(x,z,obstacles) {
  const riverBank=10.8+Math.sin(z*.32)*.55-1.45-.3;
  const onBridge=z>3.3 && z<4.7 && x<12.5;
  return x>-10.8 && x<12.5 && z>-9.1 && z<9.5 && (x<riverBank || onBridge) && !obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.3 && Math.abs(z-o.z)<o.d/2+.3);
}
export function movePlayer(position, dx, dz, obstacles) {
  const next={...position};
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dz))/.12));
  for(let i=0;i<steps;i++){
    if(canStand(next.x+dx/steps,next.z,obstacles)) next.x+=dx/steps;
    if(canStand(next.x,next.z+dz/steps,obstacles)) next.z+=dz/steps;
  }
  return next;
}
export function closestVillager(position,villagers,radius=2.7) {
  return villagers.map(n=>({npc:n,d:Math.hypot(position.x-n.x,position.z-n.z)})).filter(n=>n.d<radius).sort((a,b)=>a.d-b.d)[0]?.npc||null;
}
