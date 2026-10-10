import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env.local');

let KEY = process.env.VITE_ELEVENLABS_API_KEY || '';
if (!KEY && fs.existsSync(envFile)) {
  const m = fs.readFileSync(envFile, 'utf8').match(/^VITE_ELEVENLABS_API_KEY\s*=\s*(.+)$/m);
  if (m) KEY = m[1].trim();
}
if (!KEY) {
  console.error('Missing VITE_ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const STYLE = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75 },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65 },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55 },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60 },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35 },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50 }
};

const outDir = path.join(root, 'public/assets/audio');
fs.mkdirSync(outDir, { recursive: true });

// Read audioMap
const audioMapPath = path.join(root, 'src/audioMap.js');
const { AUDIO_MAP } = await import(new URL(`file://${audioMapPath.replace(/\\/g, '/')}`).href);

const total = Object.keys(AUDIO_MAP).length;
console.log(`Starting generation for ${total} audio entries using voice ${VOICE_ID}...`);

let count = 0;
let skipped = 0;
let errors = 0;

for (const [key, entry] of Object.entries(AUDIO_MAP)) {
  count++;
  const filename = path.basename(entry.file);
  const filePath = path.join(outDir, filename);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    skipped++;
    continue;
  }

  const cfg = STYLE[entry.style] || STYLE.statement;
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': KEY,
        Accept: 'audio/mpeg'
      },
      body: JSON.stringify({
        text: entry.text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarity_boost,
          style: cfg.style,
          use_speaker_boost: true
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[${count}/${total}] FAIL ${key}: ${res.status} ${errText}`);
      errors++;
      if (res.status === 401 || res.status === 429) {
        console.error('Critical API error. Stopping.');
        break;
      }
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`[${count}/${total}] Saved ${filename} (${buffer.length} bytes)`);

    // Gentle pacing to avoid rate limits
    await new Promise(r => setTimeout(r, 250));
  } catch (err) {
    console.error(`[${count}/${total}] Network error for ${key}:`, err.message);
    errors++;
  }
}

console.log(`\nFinished! Total: ${total}, Skipped: ${skipped}, Saved: ${total - skipped - errors}, Errors: ${errors}`);
