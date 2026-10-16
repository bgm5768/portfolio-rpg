import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('assets/vendor',{recursive:true});
for(const file of ['three.module.js','three.core.js']) await copyFile(`node_modules/three/build/${file}`,`assets/vendor/${file}`);
await copyFile('node_modules/three/LICENSE','assets/vendor/THREE-LICENSE.txt');
console.log('Vendored Three.js with MIT license');
