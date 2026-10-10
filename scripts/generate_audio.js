/* Pre-generates every narration .mp3 listed in src/audioMap.js using ElevenLabs.
   Usage:  npm run generate-audio   (needs VITE_ELEVENLABS_API_KEY in .env.local, Node 18+) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env.local');
let KEY = process.env.VITE_ELEVENLABS_API_KEY || '';
if (!KEY && fs.existsSync(envFile)) {
  const m = fs.readFileSync(envFile, 'utf8').match(/^VITE_ELEVENLABS_API_KEY\s*=\s*(.+)$/m);
  if (m) KEY = m[1].trim();
}
if (!KEY) { console.error('Missing VITE_ELEVENLABS_API_KEY in .env.local'); process.exit(1); }

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const STYLE = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75 },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65 },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55 },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60 },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35 },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50 },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50 }
};

const { AUDIO_MAP } = await import(pathToFileURL(path.join(root, 'src/audioMap.js')).href);
const outDir = path.join(root, 'public/assets/audio');
fs.mkdirSync(outDir, { recursive: true });
const force = process.argv.includes('--force');

for (const [key, entry] of Object.entries(AUDIO_MAP)) {
  const file = path.join(outDir, path.basename(entry.file));
  if (fs.existsSync(file) && !force) { console.log('skip  ', key); continue; }
  const cfg = STYLE[entry.style] || STYLE.statement;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': KEY, Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: entry.text, model_id: MODEL_ID, voice_settings: { ...cfg, use_speaker_boost: true } })
  });
  if (!res.ok) { console.error('FAIL  ', key, res.status, await res.text()); process.exit(1); }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('saved ', key);
  await new Promise(r => setTimeout(r, 500)); // rate limit
}
console.log('Done. Audio is in public/assets/audio/');
