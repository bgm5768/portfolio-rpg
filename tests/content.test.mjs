import test from 'node:test';
import assert from 'node:assert/strict';
import { safeLink, visibleProjects } from '../src/model.js';
import { profile, projects } from '../src/content.js';
test('empty projects produce no placeholder cards', () => { assert.deepEqual(visibleProjects(projects), []); });
test('incomplete projects stay hidden', () => { assert.equal(visibleProjects([{title:'Draft'}, {title:' ',summary:'Text'}]).length, 0); });
test('complete project can be added through data', () => { assert.equal(visibleProjects([{title:'Test',summary:'Summary'}]).length, 1); });
test('unsafe protocols are excluded', () => { for (const url of ['javascript:alert(1)', 'data:text/html,test', '/relative']) assert.equal(safeLink(url), null); assert.equal(safeLink('https://github.com'), 'https://github.com/'); });
test('resume-based content omits contact details until approved', () => { assert.ok(profile.name.includes('변재학')); assert.equal(profile.experience.length, 5); assert.deepEqual(profile.links, []); assert.equal(JSON.stringify(profile).includes('@'), false); });
