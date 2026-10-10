import React, { useState, useRef, useEffect } from 'react';
import { AUDIO_MAP } from '../../audioMap.js';
import { speakFeedback } from '../../audio.js';
import { PANEL, RealWorldTag, Banner, GoldBtn, GhostBtn, ScaleSVG } from './ui.jsx';

/* =========================================================================
   STATION 2 · BALANCE BUILDER (Solve It Your Own Way · Grade 7 Friendly)
   ========================================================================= */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Activity 1: Balance Scale Moves (Farmer's Market Apple Crates) ---------- */
const MOVES = [
  {
    left: '2(x + 3)',
    right: '16 kg',
    leftSub: '2 crates with x kg apples + 3 kg pears',
    rightSub: '16 kg brass counterweight',
    choices: [
      { t: 'Method 1: Unpack crates → 2x + 6 kg', ok: true, go: 1, log: 'Expand → 2x + 6 = 16' },
      { t: 'Method 2: Take half the load (÷ 2) → x + 3 kg', ok: true, go: 4, log: '÷ 2 → x + 3 = 8' },
      { t: 'Remove 3 kg from left crate only', ok: false, hint: 'The 3 kg pears are sealed inside the 2 crates! You must unpack or divide first.' },
      { t: 'Add 2 kg to the left side only', ok: false, hint: 'Whatever you do to one pan, you must do to the other pan or the scale tips!' }
    ]
  },
  {
    left: '2x + 6 kg',
    right: '16 kg',
    leftSub: '2 bags of apples + 6 kg loose pears',
    rightSub: '16 kg brass counterweight',
    choices: [
      { t: 'Remove 6 kg pears from BOTH pans (− 6)', ok: true, go: 2, log: '− 6 → 2x = 10' },
      { t: 'Add 6 kg to both sides', ok: false, hint: 'Adding 6 kg makes 2x + 12 kg = 22 kg! To remove +6, subtract 6 from both sides.' },
      { t: 'Divide only the 2x by 2', ok: false, hint: 'You must divide the whole side, not just the x part!' },
      { t: 'Multiply both sides by 2', ok: false, hint: 'Multiplying makes the weights twice as heavy. We want x alone!' }
    ]
  },
  {
    left: '2x',
    right: '10 kg',
    leftSub: '2 bags of apples alone',
    rightSub: '10 kg counterweight',
    choices: [
      { t: 'Divide both pans by 2 (÷ 2)', ok: true, go: 3, log: '÷ 2 → x = 5' },
      { t: 'Subtract 2 from both sides', ok: false, hint: '2x means 2 TIMES x. Undo multiplication with division!' },
      { t: 'Multiply both sides by 2', ok: false, hint: 'That would give 4 bags of apples. Divide by 2 to find 1 bag.' }
    ]
  },
  {
    left: 'x = 5 kg',
    right: '5 kg',
    leftSub: '1 bag of apples',
    rightSub: '5 kg weight',
    done: true
  },
  {
    left: 'x + 3 kg',
    right: '8 kg',
    leftSub: '1 crate with apples + 3 kg pears',
    rightSub: '8 kg counterweight',
    choices: [
      { t: 'Remove 3 kg pears from BOTH pans (− 3)', ok: true, go: 3, log: '− 3 → x = 5' },
      { t: 'Add 3 kg to both pans', ok: false, hint: 'Adding 3 kg gives x + 6 kg = 11 kg. Subtract 3 kg to isolate x!' },
      { t: 'Divide both pans by 3', ok: false, hint: 'x + 3 is addition, not multiplication. Subtract 3 instead!' }
    ]
  }
];

export function BalanceMoves({ muted }) {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState(() => shuffle(MOVES[0].choices));
  const [log, setLog] = useState(['2(x + 3) = 16']);
  const [tilt, setTilt] = useState(0);
  const [msg, setMsg] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const cur = MOVES[step];

  const choose = ch => {
    if (ch.ok) {
      setMsg(null);
      setTilt(0);
      setLog(l => [...l, ch.log]);
      setStep(ch.go);
      if (MOVES[ch.go].choices) setOrder(shuffle(MOVES[ch.go].choices));
      else speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
    } else {
      setMsg(ch.hint);
      setTilt(Math.random() < 0.5 ? -10 : 10);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setTilt(0), 1200);
    }
  };

  const restart = () => {
    setStep(0);
    setOrder(shuffle(MOVES[0].choices));
    setLog(['2(x + 3) = 16']);
    setMsg(null);
    setTilt(0);
  };

  return (
    <div className={PANEL}>
      <RealWorldTag icon="⚖️" title="Farmer's Market Fruit Scale">
        Mia is buying 2 crates of apples ($x$ kg) with 3 kg of bonus pears in each crate: $2(x + 3)$. They balance a 16 kg weight on the market scale!
      </RealWorldTag>

      {/* Antique Balance Beam Scale */}
      <ScaleSVG
        left={cur.left}
        right={cur.right}
        leftSub={cur.leftSub}
        rightSub={cur.rightSub}
        tilt={tilt}
        width={280}
      />

      {!cur.done ? (
        <>
          <p className="font-display font-900 text-xs sm:text-sm text-white shrink-0 text-center">
            Pick your next move to keep the scale balanced:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg shrink-0">
            {order.map((ch, i) => (
              <button
                key={i}
                onClick={() => choose(ch)}
                className="py-2 px-3 sm:px-3.5 rounded-xl sm:rounded-2xl bg-[#14082e]/95 border-2 border-purple-400/40 text-white font-display font-900 text-xs sm:text-sm hover:border-cyan-400 hover:bg-[#1f0f45] hover:scale-[1.01] transition cursor-pointer text-left flex items-center justify-between"
              >
                <span className="flex-1 min-w-0 leading-snug">{ch.t}</span>
                <span className="text-cyan-300 text-sm ml-1.5 shrink-0">➜</span>
              </button>
            ))}
          </div>
          {msg && (
            <div className="w-full max-w-lg shrink-0">
              <Banner ok={false}>⚠️ Scale Tilted! {msg}</Banner>
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-lg flex flex-col items-center gap-2 shrink-0">
          <Banner ok>
            🎉 Balanced! Each bag of apples weighs x = 5 kg! Check: 2(5 + 3) = 2 × 8 = 16 kg ✓
          </Banner>
          <GhostBtn onClick={restart}>↺ Try the other solving method (Expand vs Divide)</GhostBtn>
        </div>
      )}

      {/* Solving Breadcrumb Log */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap shrink-0 mt-0.5 w-full max-w-lg">
        {log.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-amber-400 font-black text-xs">➜</span>}
            <span className="bg-white/10 border border-white/20 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-100">
              {l}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ---------- Activity 2: Mistake Detective (Peer Homework Review) ---------- */
const WORKED = [
  { line: 'Line 1: 3(x − 2) = 21', note: 'Original: 3 project kits at $(x − 2) each cost $21' },
  { line: 'Line 2: 3x − 2 = 21', note: 'Expanded bracket... wait, did Sam multiply BOTH terms?' },
  { line: 'Line 3: 3x = 23', note: 'Added 2 to both sides' },
  { line: 'Line 4: x = 7.67', note: 'Divided 23 by 3 (Can you buy 7.67 kits?)' }
];

const FIXES = [
  { t: '3x − 6 = 21', ok: true, exp: 'Correct! 3 × x = 3x, and 3 × (−2) = −6.' },
  { t: '3x + 6 = 21', ok: false, hint: 'Careful with signs! 3 × (−2) = −6, not +6.' },
  { t: '3x − 6 = 7', ok: false, hint: 'The right side stays 21 — we haven’t divided anything yet!' }
];

export function MistakeDetective({ muted }) {
  const [phase, setPhase] = useState(0); // 0: find · 1: fix · 2: done
  const [msg, setMsg] = useState(null);
  const [fixes] = useState(() => shuffle(FIXES));

  const pickLine = i => {
    if (phase !== 0) return;
    if (i === 0) {
      setMsg({ ok: false, t: 'Line 1 is just the starting equation — it is correct! Check Line 2.' });
    } else if (i === 1) {
      setMsg(null);
      setPhase(1);
    } else {
      setMsg({ ok: false, t: `Line ${i + 1} follows logically from the line before it. The error started earlier!` });
    }
  };

  const pickFix = f => {
    if (f.ok) {
      setMsg(null);
      setPhase(2);
      speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
    } else {
      setMsg({ ok: false, t: f.hint });
    }
  };

  return (
    <div className={PANEL}>
      <RealWorldTag icon="📓" title="Peer Review: Science Fair Budget">
        Sam is budgeting for 3 solar robotics kits. Each kit has a $2 student discount coupon: $3(x − 2) = $21$. Spot Sam's mistake!
      </RealWorldTag>

      {/* Notebook Homework Sheet */}
      <div className="w-full max-w-md bg-[#0e0626] border-2 border-purple-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1.5 shrink-0 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <p className="text-amber-300 font-display font-900 text-xs sm:text-sm">📝 Sam's Math Homework</p>
          <span className="text-xs font-bold text-slate-300">Class 7B Peer Review</span>
        </div>

        {WORKED.map((w, i) => {
          const isErrorLine = i === 1;
          const wrong = phase >= 1 && isErrorLine;
          return (
            <button
              key={i}
              onClick={() => pickLine(i)}
              className={`flex items-center justify-between rounded-xl px-2.5 sm:px-3 py-1.5 border-2 text-left transition cursor-pointer w-full ${
                phase === 2 && isErrorLine
                  ? 'border-emerald-400 bg-emerald-950/70 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : wrong
                  ? 'border-rose-400 bg-rose-950/70 animate-shake'
                  : 'border-white/15 bg-white/5 hover:border-cyan-400'
              }`}
            >
              <div className="flex-1 min-w-0 pr-2">
                <span className={`font-display font-900 text-xs sm:text-sm block ${wrong && phase === 1 ? 'text-rose-300 line-through' : 'text-white'}`}>
                  {phase === 2 && isErrorLine ? 'Line 2: 3x − 6 = 21' : w.line}
                </span>
                <p className="text-[11px] sm:text-xs font-bold text-slate-300 leading-snug break-words">{w.note}</p>
              </div>

              {wrong && phase === 1 && <span className="text-base sm:text-lg shrink-0">❌</span>}
              {phase === 2 && isErrorLine && <span className="text-base sm:text-lg shrink-0">✅</span>}
            </button>
          );
        })}
      </div>

      {phase === 0 && (
        <p className="text-cyan-200 font-extrabold text-xs sm:text-sm text-center shrink-0">
          🔍 Click on the FIRST line where Sam made an algebra mistake!
        </p>
      )}

      {phase === 1 && (
        <div className="w-full max-w-md flex flex-col items-center gap-1.5 shrink-0 fade-in-up">
          <p className="text-slate-100 font-bold text-xs sm:text-sm text-center leading-snug">
            Aha! Sam forgot to multiply the 3 with the −2 coupon. Which line should replace Line 2?
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center w-full">
            {fixes.map((f, i) => (
              <button
                key={i}
                onClick={() => pickFix(f)}
                className="py-1.5 px-3 sm:px-3.5 rounded-xl bg-[#14082e]/95 border-2 border-purple-400/40 text-white font-display font-900 text-xs sm:text-sm hover:border-cyan-400 hover:scale-105 transition cursor-pointer"
              >
                {f.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="w-full max-w-md shrink-0">
          <Banner ok>
            🎉 Homework Corrected! 3x − 6 = 21 → 3x = 27 → x = $9 per kit! Check: 3(9 − 2) = 3 × 7 = $21 ✓
          </Banner>
        </div>
      )}

      {msg && (
        <div className="w-full max-w-md shrink-0">
          <Banner ok={msg.ok}>⚠️ {msg.t}</Banner>
        </div>
      )}
    </div>
  );
}

/* ---------- Activity 3: Step Sorter (STEM Rover Calibration) ---------- */
const SORT_STEPS = [
  { t: '1. Expand bracket: −2x + 6 = 10', badge: 'Distribute −2' },
  { t: '2. Subtract 6 from both sides: −2x = 4', badge: 'Undo +6' },
  { t: '3. Divide both sides by −2: x = −2', badge: 'Undo ×(−2)' },
  { t: '4. Sensor flight check: −2(−2 − 3) = 10 ✓', badge: 'Verify' }
];

export function StepSorter({ muted }) {
  const [placed, setPlaced] = useState([]);
  const [deck] = useState(() => {
    let o = shuffle([0, 1, 2, 3]);
    while (o.every((v, i) => v === i)) o = shuffle([0, 1, 2, 3]);
    return o;
  });
  const [msg, setMsg] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  const tap = id => {
    if (id === placed.length) {
      const next = [...placed, id];
      setPlaced(next);
      setMsg(null);
      if (next.length === SORT_STEPS.length) speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
    } else {
      setShakeId(id);
      setTimeout(() => setShakeId(null), 450);
      setMsg(id > placed.length
        ? 'Not yet — an earlier algebraic move must happen first!'
        : 'That diagnostic step is already placed.');
    }
  };

  const done = placed.length === SORT_STEPS.length;

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🤖" title="Autonomous Rover Calibration">
        The STEM Club rover needs thermal sensor recalibration: $-2(x - 3) = 10$. Arrange the 4 diagnostic calibration steps in order!
      </RealWorldTag>

      {/* Target Slots */}
      <div className="w-full max-w-md flex flex-col gap-1.5 shrink-0">
        {SORT_STEPS.map((stepItem, slot) => (
          <div
            key={slot}
            className={`flex items-center justify-between rounded-xl px-2.5 sm:px-3 py-1.5 border-2 min-h-[36px] transition-all ${
              placed[slot] !== undefined
                ? 'bg-emerald-950/70 border-emerald-400/80 shadow-md'
                : 'bg-white/5 border-dashed border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shrink-0">
                {slot + 1}
              </span>
              <span className="font-display font-900 text-xs sm:text-sm text-white truncate">
                {placed[slot] !== undefined ? SORT_STEPS[placed[slot]].t : <span className="text-slate-500">Awaiting step {slot + 1}...</span>}
              </span>
            </div>
            {placed[slot] !== undefined && (
              <span className="text-[11px] sm:text-xs font-extrabold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-400/40 shrink-0">
                {SORT_STEPS[placed[slot]].badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {!done && (
        <div className="w-full max-w-md flex flex-col items-center gap-1.5 shrink-0">
          <p className="text-cyan-200 font-extrabold text-xs sm:text-sm text-center">
            Tap cards below in correct sequential solving order 👇
          </p>
          <div className="flex flex-wrap justify-center gap-2 w-full">
            {deck.filter(id => !placed.includes(id)).map(id => (
              <button
                key={id}
                onClick={() => tap(id)}
                className={`py-1.5 px-3 rounded-xl bg-[#14082e]/95 border-2 border-purple-400/40 text-white font-display font-900 text-xs sm:text-sm hover:border-cyan-400 hover:scale-102 transition cursor-pointer shadow-md text-left ${
                  shakeId === id ? 'animate-shake border-rose-400' : ''
                }`}
              >
                {SORT_STEPS[id].t}
              </button>
            ))}
          </div>
        </div>
      )}

      {msg && !done && (
        <div className="w-full max-w-md shrink-0">
          <Banner ok={false}>⚠️ {msg}</Banner>
        </div>
      )}

      {done && (
        <div className="w-full max-w-md flex flex-col items-center gap-2 shrink-0">
          <Banner ok>
            🚀 Calibration Complete! Sensor temperature is x = −2°C. Both sides match 10 = 10 ✓ Rover ready to roll!
          </Banner>
          <GhostBtn onClick={() => { setPlaced([]); setMsg(null); }}>↺ Recalibrate Again</GhostBtn>
        </div>
      )}
    </div>
  );
}
