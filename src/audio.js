/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2
   ========================================================================= */
export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";

export const STYLE_SETTINGS = {
  celebration: {
    stability: 0.12,
    similarity_boost: 0.45,
    style: 0.75,
    rate: 1.06,
    pitch: 1.2
  },
  encouragement: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.65,
    rate: 1.0,
    pitch: 1.1
  },
  question: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.55,
    rate: 0.98,
    pitch: 1.08
  },
  emphasis: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.60,
    rate: 0.95,
    pitch: 1.05
  },
  thinking: {
    stability: 0.24,
    similarity_boost: 0.60,
    style: 0.35,
    rate: 0.90,
    pitch: 0.95
  },
  statement: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.50,
    rate: 1.0,
    pitch: 1.0
  }
};

export let audioMuted = false;
let ttsVoice = null;
let currentAudioElement = null;

function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    ttsVoice = pickVoice();
  };
  ttsVoice = pickVoice();
}

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

/* ---------- ElevenLabs dynamic fallback (used when a pre-generated .mp3 is missing) ---------- */
const ELEVEN_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) || '';
const MODEL_ID = "eleven_multilingual_v2";
const dynamicCache = new Map(); // text -> Promise<objectURL | null>

function fetchDynamicUrl(seg) {
  if (!ELEVEN_KEY || !seg || !seg.text) return Promise.resolve(null);
  if (dynamicCache.has(seg.text)) return dynamicCache.get(seg.text);
  const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
  const p = fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_KEY, Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: seg.text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: cfg.stability,
        similarity_boost: cfg.similarity_boost,
        style: cfg.style,
        use_speaker_boost: true
      }
    })
  })
    .then(r => (r.ok ? r.blob() : Promise.reject(new Error('TTS ' + r.status))))
    .then(b => URL.createObjectURL(b))
    .catch(() => {
      dynamicCache.delete(seg.text);
      return null;
    });
  dynamicCache.set(seg.text, p);
  return p;
}

let currentQueue = 0;

function playUrl(url, myQ) {
  return new Promise((resolve) => {
    if (myQ !== currentQueue || audioMuted) return resolve(false);

    if (currentAudioElement) {
      try {
        currentAudioElement.pause();
        currentAudioElement.currentTime = 0;
        currentAudioElement.src = '';
      } catch (e) {}
      currentAudioElement = null;
    }

    const audio = new Audio(url);
    currentAudioElement = audio;

    const cleanup = () => {
      audio.onended = null;
      audio.onerror = null;
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
    };

    audio.onended = () => {
      cleanup();
      resolve(myQ === currentQueue);
    };

    audio.onerror = () => {
      cleanup();
      resolve(false);
    };

    audio.play().catch(() => {
      cleanup();
      resolve(false);
    });
  });
}

export function speakSegment(seg, myQ) {
  return new Promise(async (resolve) => {
    if (audioMuted || !seg || !seg.text || myQ !== currentQueue) return resolve();

    // 1) Pre-generated static asset
    if (seg.file) {
      const ok = await playUrl(seg.file, myQ);
      if (myQ !== currentQueue || audioMuted) return resolve();
      if (ok) return resolve();
    }
    if (myQ !== currentQueue || audioMuted) return resolve();

    // 2) Dynamic ElevenLabs request (same Alice voice + per-style settings)
    try {
      const url = await fetchDynamicUrl(seg);
      if (myQ !== currentQueue || audioMuted) return resolve();
      if (url) {
        const ok = await playUrl(url, myQ);
        if (myQ !== currentQueue || audioMuted) return resolve();
        if (ok) return resolve();
      }
    } catch (e) {
      if (myQ !== currentQueue || audioMuted) return resolve();
    }

    // 3) Browser speech as fallback only if still on the active screen queue
    if (myQ === currentQueue && !audioMuted) {
      fallbackSpeech(seg, myQ).then(resolve);
    } else {
      resolve();
    }
  });
}

function fallbackSpeech(seg, myQ) {
  return new Promise((resolve) => {
    if (audioMuted || myQ !== currentQueue || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) {
      return resolve();
    }
    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = ++currentQueue;
  const segList = Array.isArray(segments) ? segments : [segments];
  for (const seg of segList) {
    if (myQueue !== currentQueue || audioMuted) return;
    const nextSeg = segList[segList.indexOf(seg) + 1];
    if (nextSeg && !nextSeg.file) fetchDynamicUrl(nextSeg);
    await speakSegment(seg, myQueue);
  }
}

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch (e) {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'encouragement' });

/* Short feedback voice lines (correct / wrong / etc.) — keys live in audioMap.js */
export function speakFeedback(entry, enabled = true) {
  if (!enabled || audioMuted || !entry) return;
  narrate(entry, true);
}
