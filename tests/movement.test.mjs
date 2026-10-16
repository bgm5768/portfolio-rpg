import test from 'node:test';
import assert from 'node:assert/strict';
import {canStand,movePlayer,closestVillager,START} from '../src/movement.js';
import {villagers} from '../src/village-data.js';
test('first NPC is reachable immediately',()=>assert.equal(closestVillager(START,villagers).id,'intro'));
test('building blocks passage even for a large movement',()=>{
 const next=movePlayer({x:0,z:0},10,0,[{x:3,z:0,w:2,d:2}]);assert.ok(next.x<1.71);assert.ok(next.x>1.5);
});
test('collision permits sliding along a wall',()=>{
 const next=movePlayer({x:1.6,z:0},1,1,[{x:3,z:0,w:2,d:4}]);assert.ok(next.x<1.71);assert.ok(next.z>.99);
});
test('river is blocked but the bridge is walkable',()=>{
 assert.equal(canStand(10,0,[]),false);assert.equal(canStand(11,4,[]),true);assert.equal(canStand(13,4,[]),false);
});
test('world edges cannot be crossed',()=>{
 for(const [x,z] of [[-11,0],[0,-10],[0,10]])assert.equal(canStand(x,z,[]),false);
});
test('nearest NPC wins, distant NPC stays unavailable',()=>{
 assert.equal(closestVillager({x:-5.5,z:1},villagers).id,'backend');assert.equal(closestVillager({x:-10,z:8},villagers),null);
});
