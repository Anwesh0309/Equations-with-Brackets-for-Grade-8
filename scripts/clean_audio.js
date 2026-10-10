/* Deletes .mp3 files in public/assets/audio that are no longer referenced by src/audioMap.js */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { AUDIO_MAP } = await import(pathToFileURL(path.join(root, 'src/audioMap.js')).href);
const valid = new Set(Object.values(AUDIO_MAP).map(e => path.basename(e.file)));
const dir = path.join(root, 'public/assets/audio');
if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.mp3') && !valid.has(f)) { fs.unlinkSync(path.join(dir, f)); console.log('removed', f); }
