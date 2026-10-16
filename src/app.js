import { profile, projects } from './content.js';
import { villagers } from './village-data.js';
import { safeLink } from './model.js';
const $=id=>document.getElementById(id);
const el=(tag,text)=>{const node=document.createElement(tag);node.textContent=text;return node;};
const media=matchMedia('(prefers-reduced-motion: reduce)');let reduce=media.matches;let world=null;const visited=new Set();let returnFocus=null;
let ready=false,skipRequested=false,dialogNpc=null,page=0,closing=false;
let returning=false;try{returning=sessionStorage.getItem('village-visited')==='yes';}catch{}
const introStart=performance.now();
function enterVillage(){if(!ready){skipRequested=true;$('entrance-status').textContent='준비되는 대로 바로 들어갈게요.';return;}if($('entrance').hidden)return;try{sessionStorage.setItem('village-visited','yes');}catch{}world?.enter(!reduce&&!skipRequested&&!returning);$('entrance').classList.add('leaving');setTimeout(()=>{$('entrance').hidden=true;if(!$('reader').open)$('world').focus({preventScroll:true});},reduce||skipRequested||returning?0:330);}
$('skip-entrance').addEventListener('click',()=>{skipRequested=true;enterVillage();});
function setMotion(value){reduce=value;$('motion-button').setAttribute('aria-pressed',String(value));$('motion-button').textContent=value?'움직임 줄임':'움직임 줄이기';if(value&&ready)enterVillage();}
setMotion(reduce);media.addEventListener('change',event=>setMotion(event.matches));$('motion-button').addEventListener('click',()=>setMotion(!reduce));
function tags(container,items){const row=el('div','');row.className='dialog-tags';items.forEach(t=>row.append(el('span',t)));container.append(row);}
function projectExtras(container,npc){if(npc.image?.src&&/^\.\/assets\/[\w./-]+$/.test(npc.image.src)){const img=new Image();img.src=npc.image.src;img.alt=npc.image.alt||'';img.className='project-image';container.append(img);}for(const link of npc.links||[]){const href=safeLink(link.url);if(!href)continue;const a=el('a',link.label+' ↗');a.href=href;a.target='_blank';a.rel='noopener noreferrer';container.append(a);}}
function rememberFocus(){returnFocus=document.activeElement;world?.clear();}
function restoreFocus(){if(returnFocus?.isConnected&&returnFocus.getClientRects().length&&!returnFocus.disabled)returnFocus.focus({preventScroll:true});else $('world').focus({preventScroll:true});}
function showConversation(npc){
  if($('reader').open||$('conversation').open)return;
  if(world?.nearby()?.id!==npc.id){$('nearby').textContent=`${npc.name} 가까이 걸어가 주세요.`;return;}
  rememberFocus();world?.focusOn(npc);dialogNpc=npc;page=0;closing=false;$('conversation').classList.remove('closing');$('dialog-kicker').textContent=npc.topic;$('dialog-icon').style.setProperty('--npc-color','#'+npc.color.toString(16).padStart(6,'0'));$('dialog-title').textContent=npc.name;$('dialog-role').textContent=npc.role;renderDialogue();
  visited.add(npc.id);$('progress').textContent=`${visited.size} / ${villagers.length}`;document.querySelector(`[data-quest="${npc.id}"]`)?.classList.add('visited');$('conversation').showModal();$('conversation').scrollTop=0;$('continue-button').focus();
}
function renderDialogue(){const final=page===dialogNpc.paragraphs.length-1;$('dialog-content').replaceChildren(el('p',dialogNpc.paragraphs[page]));if(final){tags($('dialog-content'),dialogNpc.tags);projectExtras($('dialog-content'),dialogNpc);}$('dialog-note').textContent=`${page+1} / ${dialogNpc.paragraphs.length}`;$('previous-button').disabled=page===0;$('continue-button').textContent=final?'산책 계속하기 →':'다음 이야기 →';}
function closeConversation(){if(closing||!$('conversation').open)return;closing=true;$('conversation').classList.add('closing');setTimeout(()=>{$('conversation').close();$('conversation').classList.remove('closing');closing=false;},reduce?0:140);}
function advanceDialogue(){if(closing)return;if(page<dialogNpc.paragraphs.length-1){page++;renderDialogue();}else closeConversation();}
$('previous-button').addEventListener('click',()=>{if(page>0&&!closing){page--;renderDialogue();}});
addEventListener('keydown',event=>{if($('conversation').open&&event.code==='KeyE'){event.preventDefault();if(!event.repeat)advanceDialogue();}});
for(const npc of villagers){const li=el('li',npc.topic);li.dataset.quest=npc.id;$('quest-list').append(li);}
$('progress').textContent=`0 / ${villagers.length}`;
for(const npc of villagers){const section=el('section','');section.append(el('h3',npc.topic));npc.paragraphs.forEach(p=>section.append(el('p',p)));tags(section,npc.tags);projectExtras(section,npc);$('reader-content').append(section);}
const history=el('section','');history.append(el('h3','경력 기록'));
for(const item of profile.experience){history.append(el('h4',item.organization+' · '+item.title),el('small',item.period),el('p',item.description));}$('reader-content').append(history);
function openReader(){rememberFocus();$('reader').showModal();$('close-reader').focus();}
$('read-button').addEventListener('click',openReader);$('fallback-read').addEventListener('click',openReader);
$('entrance-read').addEventListener('click',openReader);
$('close-dialog').addEventListener('click',closeConversation);$('conversation').addEventListener('cancel',event=>{event.preventDefault();closeConversation();});$('conversation').addEventListener('close',()=>{world?.focusOn(null);restoreFocus();});$('close-reader').addEventListener('click',()=>$('reader').close());$('reader').addEventListener('close',restoreFocus);
$('continue-button').addEventListener('click',advanceDialogue);$('talk-button').addEventListener('click',()=>{const npc=world?.nearby();if(npc)showConversation(npc);});$('reset-button').addEventListener('click',()=>world?.reset());
for(const button of document.querySelectorAll('[data-direction]')){
  button.addEventListener('pointerdown',event=>{event.preventDefault();button.setPointerCapture(event.pointerId);world?.setDirection(button.dataset.direction);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>world?.setDirection(null));
  button.addEventListener('click',event=>{if(event.detail===0){world?.setDirection(button.dataset.direction);setTimeout(()=>world?.setDirection(null),180);}});
}
function failure(error){world?.stop();$('entrance').hidden=true;$('loading').hidden=true;$('fallback').hidden=false;$('labels').hidden=true;$('talk-button').disabled=true;$('nearby').textContent='읽기 모드에서 모든 이야기를 볼 수 있어요.';if(error)console.warn('3D unavailable:',error.message||error);}
try {
// Local-only fault injection exercises the same fallback as a real WebGL failure.
if(['127.0.0.1','localhost'].includes(location.hostname)&&new URLSearchParams(location.search).get('qa')==='webgl-failure')throw new Error('Local QA: WebGL unavailable');
const {createWorld}=await import('./world.js');world=createWorld({host:$('world'),labels:$('labels'),villagers,onTalk:showConversation,onNearby:npc=>{$('nearby').textContent=npc?`${npc.name} · 이야기를 들어볼까요?`:'주민 가까이 가면 대화할 수 있어요.';$('talk-button').disabled=!npc;},isPaused:()=>$('conversation').open||$('reader').open||!$('entrance').hidden,reducedMotion:()=>reduce,onFailure:failure});$('loading').hidden=true;$('world').dataset.ready='true';ready=true;$('entrance-status').textContent='길이 열렸어요. 마을로 들어갑니다.';setTimeout(enterVillage,reduce||skipRequested||returning?0:Math.max(0,1000-(performance.now()-introStart)));}
catch(error){failure(error);}
