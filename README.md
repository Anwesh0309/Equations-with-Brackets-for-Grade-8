# Equations with Brackets · Grade 8 (MOE)

Same architecture, UI/UX, viewport and ElevenLabs voice pipeline as the Circumference module — new content.

## Run
    npm install
    npm run dev          # http://localhost:5173
    npm run build        # production build in dist/

## Audio (ElevenLabs · Alice · eleven_multilingual_v2)
The API key is in `.env.local` (VITE_ELEVENLABS_API_KEY).
- `npm run generate-audio` pre-generates every narration line in `src/audioMap.js` into `public/assets/audio/` (add `-- --force` to regenerate).
- If an .mp3 is missing, the engine requests that line live from ElevenLabs (same voice + per-style settings), then falls back to browser speech.
- `npm run clean-audio` removes orphaned mp3 files.
- Note: a VITE_ key is bundled into the browser build — use a proxy or restricted key for public deployment.

## Where content lives
- `src/audioMap.js` narration · `src/mathData.js` 100 procedural practice questions (10 worlds)
- `src/stages/StoryPhase.jsx` story · `src/stages/stations/Station1-3.jsx` the 9 new activities
- `public/assets/images/slide1-8.png` story illustrations (replace with your own artwork using the same names)
