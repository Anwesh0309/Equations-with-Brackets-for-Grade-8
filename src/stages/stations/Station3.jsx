import React, { useState } from 'react';
import { AUDIO_MAP } from '../../audioMap.js';
import { speakFeedback } from '../../audio.js';
import { PANEL, RealWorldTag, Banner, GoldBtn, GhostBtn } from './ui.jsx';

/* =========================================================================
   STATION 3 · CHALLENGE ARENA (Real-World Word Problems · Grade 7 Friendly)
   ========================================================================= */

const inputCls =
  "bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-3 py-1.5 sm:py-2 text-white font-display font-900 text-xs sm:text-sm md:text-base text-center outline-none focus:border-amber-400 w-36 sm:w-44 shadow-inner";

/* ---------- Activity 1: Mystery Number Machine (Arcade Ticket Dispenser) ---------- */
const TARGET = 36;
const SECRET = 4; // 4(x + 5) = 36

export function MysteryMachine({ muted }) {
  const [guess, setGuess] = useState('');
  const [run, setRun] = useState(null);
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [workBackwards, setWorkBackwards] = useState(false);

  const solved = run && run.out === TARGET;

  const doRun = () => {
    const g = parseFloat(guess);
    if (Number.isNaN(g)) return;
    const added = g + 5;
    const out = added * 4;
    setRun({ g, added, out });
    setTries(t => t + 1);
    if (out === TARGET) speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
  };

  const node = (label, sub, value, color) => (
    <div className="flex flex-col items-center gap-1">
      <div className={`min-w-[76px] sm:min-w-[82px] px-2.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 sm:border-3 font-display font-900 text-xs sm:text-sm text-white text-center shadow-lg ${color}`}>
        <div>{label}</div>
        <div className="text-xs font-bold text-slate-200 mt-0.5">{sub}</div>
      </div>
      <span className={`text-xs font-black h-4 ${value === undefined ? 'text-transparent' : 'text-amber-300'}`}>
        {value === undefined ? '·' : `${value}`}
      </span>
    </div>
  );

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🕹️" title="Arcade Mystery Ticket Machine">
        You feed in $x$ tokens. The machine awards 5 bonus tokens $(x + 5)$, then spins the $4\times$ multiplier wheel to spit out 36 arcade tickets: $4(x + 5) = 36$!
      </RealWorldTag>

      {/* Machine Chute Animation Display */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 shrink-0 flex-wrap py-0.5">
        {node('Token In', 'x = ?', run ? `${run.g} tokens` : undefined, 'bg-violet-800 border-violet-300')}
        <span className="text-amber-400 font-black text-lg mb-3">➔</span>
        {node('Bonus Hopper', '+ 5 bonus', run ? `${run.added}` : undefined, 'bg-sky-800 border-sky-300')}
        <span className="text-amber-400 font-black text-lg mb-3">➔</span>
        {node('Prize Wheel', '× 4 mult', run ? `${run.out}` : undefined, 'bg-rose-800 border-rose-300')}
        <span className="text-amber-400 font-black text-lg mb-3">➔</span>
        {node('Dispenser', 'Target: 36', '36 tickets', 'bg-emerald-800 border-emerald-300')}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 w-full justify-center shrink-0 flex-wrap">
        <input
          type="number"
          placeholder="Guess tokens x"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doRun()}
          className={inputCls}
        />
        <GoldBtn onClick={doRun}>🎰 Pull Lever</GoldBtn>
        <GhostBtn onClick={() => setWorkBackwards(b => !b)}>
          {workBackwards ? 'Hide Steps' : '🔄 Work Backwards'}
        </GhostBtn>
        <GhostBtn onClick={() => setShowHint(h => !h)}>💡 Hint</GhostBtn>
      </div>

      {/* Grade 7 Work Backwards Helper */}
      {workBackwards && (
        <div className="w-full bg-[#110729] border-2 border-cyan-400/50 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1 text-xs sm:text-sm text-cyan-200 fade-in-up shrink-0">
          <p className="font-display font-900 text-amber-300">🔄 Grade 7 Superpower: Reverse the Machine!</p>
          <p>• <strong>Step 1:</strong> Undo the $\times 4$ wheel by dividing 36 tickets by 4 $\rightarrow 36 \div 4 = 9$ tokens in hopper.</p>
          <p>• <strong>Step 2:</strong> Undo the $+ 5$ bonus by subtracting 5 $\rightarrow 9 - 5 = 4$ starting tokens!</p>
        </div>
      )}

      {showHint && (
        <div className="p-2 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
          💡 Divide both sides by 4 first: $x + 5 = 9$, then subtract 5 from both sides!
        </div>
      )}

      {run && !solved && (
        <Banner ok={false}>
          {run.out > TARGET ? '⬇️ Too High' : '⬆️ Too Low'}: Input x = {run.g} produced {run.out} tickets. You need 36 tickets!
        </Banner>
      )}

      {solved && (
        <Banner ok>
          🎉 BINGO! Secret input x = {SECRET} tokens! In {tries} {tries === 1 ? 'try' : 'tries'}, you cracked it: 4(4 + 5) = 4 × 9 = 36 ✓
        </Banner>
      )}
    </div>
  );
}

/* ---------- Activity 2: Perimeter Puzzle (Sports Court Fencing) ---------- */
export function PerimeterPuzzle({ muted }) {
  const [xVal, setXVal] = useState(6);
  const [typedAns, setTypedAns] = useState('');
  const [fb, setFb] = useState(null);

  const length = xVal + 4;
  const currentPerimeter = 2 * (xVal + length);
  const isMatch = currentPerimeter === 32;

  const checkTyped = () => {
    const num = parseFloat(typedAns);
    if (num === 6) {
      setFb({ ok: true, t: '🎉 Correct! Width = 6 m and Length = 10 m give Perimeter = 2(6 + 10) = 32 m ✓' });
      speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
    } else {
      setFb({ ok: false, t: `Not quite. If x = ${num}, Perimeter = 2(${num} + ${num + 4}) = ${2 * (2 * num + 4)} m, not 32 m.` });
    }
  };

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🏀" title="School Sports Court Fencing">
        The school groundskeeper has 32 m of fence to enclose a new court. Width is $x$ m, and length is $(x + 4)$ m: $2(2x + 4) = 32$ m!
      </RealWorldTag>

      {/* Architectural Court Blueprint */}
      <div className="flex items-center justify-center gap-4 w-full flex-wrap shrink-0">
        <svg width="250" height="125" viewBox="0 0 290 130" className="drop-shadow-[0_0_16px_rgba(56,189,248,0.4)] shrink-0 overflow-visible max-h-[125px] h-auto">
          {/* Outer perimeter fence line */}
          <rect
            x="35" y="24" width="220" height="78" rx="8"
            fill="#0369a1" stroke={isMatch ? '#4ade80' : '#f59e0b'}
            strokeWidth="3"
            strokeDasharray={isMatch ? '0' : '6 4'}
          />
          {/* Inner court surface */}
          <rect x="45" y="32" width="200" height="62" rx="6" fill="#0284c7" opacity="0.8" />
          <line x1="145" y1="32" x2="145" y2="94" stroke="#bae6fd" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="145" cy="63" r="12" fill="none" stroke="#bae6fd" strokeWidth="2" />

          {/* Court Labels */}
          <text x="145" y="67" fill="#fff" fontSize="12" fontWeight="900" textAnchor="middle">🏀 Sports Court</text>
          <text x="145" y="16" fill="#facc15" fontSize="12" fontWeight="900" textAnchor="middle">Length: (x + 4) = {length} m</text>
          <text x="18" y="67" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">{xVal} m</text>
          <text x="145" y="118" fill={isMatch ? '#4ade80' : '#fde047'} fontSize="12" fontWeight="900" textAnchor="middle">
            Fence Perimeter = {currentPerimeter} m / 32 m {isMatch ? '✓' : ''}
          </text>
        </svg>

        {/* Real-World Formula Facts */}
        <div className="text-left text-xs sm:text-sm font-bold text-slate-100 flex flex-col gap-1 bg-[#14082c] border border-cyan-400/30 rounded-xl p-2 sm:p-2.5 min-w-[190px]">
          <p>• Width = <span className="text-cyan-300 font-black">{xVal} m</span></p>
          <p>• Length = (x + 4) = <span className="text-amber-300 font-black">{length} m</span></p>
          <p>• Perimeter = 2 × (width + length)</p>
          <p className="font-mono text-cyan-200">2(2x + 4) = 32</p>
        </div>
      </div>

      {/* Interactive Width Stepper */}
      <div className="w-full flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-1.5 shrink-0 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-slate-200">Test Width (x):</span>
        <div className="flex items-center gap-1.5">
          {[4, 5, 6, 7].map(val => (
            <button
              key={val}
              onClick={() => { setXVal(val); setTypedAns(String(val)); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                xVal === val
                  ? val === 6
                    ? 'bg-emerald-500 text-slate-950 scale-105 shadow-md font-black'
                    : 'bg-amber-400 text-slate-950 scale-105 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              x = {val} m {val === 6 && '✨'}
            </button>
          ))}
        </div>
      </div>

      {/* Typed Check Answer */}
      <div className="flex items-center gap-2.5 w-full justify-center shrink-0 flex-wrap">
        <input
          type="number"
          placeholder="Enter x in metres"
          value={typedAns}
          onChange={e => setTypedAns(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkTyped()}
          className={inputCls}
        />
        <GoldBtn onClick={checkTyped}>Check Fence Fit ✨</GoldBtn>
      </div>

      {fb && <Banner ok={fb.ok}>{fb.t}</Banner>}
    </div>
  );
}

/* ---------- Activity 3: Equal Savings Showdown (Bake Sale Jars) ---------- */
export function EqualSavings({ muted }) {
  const [testCost, setTestCost] = useState(4);
  const [typedCost, setTypedCost] = useState('');
  const [fb, setFb] = useState(null);
  const [showSteps, setShowSteps] = useState(false);

  const miaTotal = 3 * (testCost + 2);
  const noahTotal = 2 * (testCost + 5);
  const isMatch = miaTotal === noahTotal;

  const check = () => {
    const num = parseFloat(typedCost);
    if (num === 4) {
      setFb({
        ok: true,
        t: '🎉 Exactly $4! Mia made 3(4 + 2) = $18, Noah made 2(4 + 5) = $18. Both charity jars are 100% equal!'
      });
      speakFeedback(AUDIO_MAP.fb_station_ok, !muted);
    } else {
      setFb({
        ok: false,
        t: `Not equal. For x = $${num}: Mia has $${3 * (num + 2)}, Noah has $${2 * (num + 5)}. Difference: $${Math.abs(3 * (num + 2) - 2 * (num + 5))}.`
      });
    }
  };

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🧁" title="School Bake Sale Charity Banks">
        Mia sells 3 cookie boxes with a $2 charity badge: $3(x + 2)$. Noah sells 2 cake tins with a $5 donation mug: $2(x + 5)$. Their charity totals are equal!
      </RealWorldTag>

      {/* Visual Donation Jars Side by Side */}
      <div className="flex items-center justify-center gap-3 w-full flex-wrap shrink-0">
        {/* Mia's Jar */}
        <div className="bg-purple-950/80 border-2 border-purple-400/60 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col items-center gap-1 min-w-[130px] sm:min-w-[145px] shadow-lg">
          <p className="text-purple-200 font-display font-900 text-xs sm:text-sm">Mia: 3 Boxes of (x + $2)</p>
          <div className="flex gap-1 py-0.5">
            <span className="text-xl sm:text-2xl">📦</span>
            <span className="text-xl sm:text-2xl">📦</span>
            <span className="text-xl sm:text-2xl">📦</span>
          </div>
          <span className="text-xs font-bold text-amber-300">
            Total = 3 × (${testCost} + 2) = ${miaTotal}
          </span>
        </div>

        {/* Equal Balance Badge */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl sm:text-2xl font-black text-amber-400">{isMatch ? '⚖️ =' : '≠'}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${isMatch ? 'bg-emerald-950 text-emerald-300 border border-emerald-400/50' : 'bg-rose-950 text-rose-300'}`}>
            {isMatch ? 'EQUAL TOTALS' : 'NOT EQUAL'}
          </span>
        </div>

        {/* Noah's Jar */}
        <div className="bg-cyan-950/80 border-2 border-cyan-400/60 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col items-center gap-1 min-w-[130px] sm:min-w-[145px] shadow-lg">
          <p className="text-cyan-200 font-display font-900 text-xs sm:text-sm">Noah: 2 Tins of (x + $5)</p>
          <div className="flex gap-1 py-0.5">
            <span className="text-xl sm:text-2xl">🎁</span>
            <span className="text-xl sm:text-2xl">🎁</span>
          </div>
          <span className="text-xs font-bold text-amber-300">
            Total = 2 × (${testCost} + 5) = ${noahTotal}
          </span>
        </div>
      </div>

      {/* Grade 7 Interactive Value Stepper */}
      <div className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 shrink-0 flex-wrap text-xs sm:text-sm font-bold text-slate-200">
        <span>Test Cookie Value x:</span>
        {[2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => { setTestCost(v); setTypedCost(String(v)); }}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition cursor-pointer ${
              testCost === v
                ? v === 4
                  ? 'bg-emerald-500 text-slate-950 scale-105 shadow-md'
                  : 'bg-amber-400 text-slate-950 scale-105 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            ${v} {v === 4 && '✨'}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2.5 w-full justify-center shrink-0 flex-wrap">
        <input
          type="number"
          placeholder="Enter x (dollars)"
          value={typedCost}
          onChange={e => setTypedCost(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          className={inputCls}
        />
        <GoldBtn onClick={check}>Verify Equal Totals ✨</GoldBtn>
        <GhostBtn onClick={() => setShowSteps(s => !s)}>
          {showSteps ? 'Hide Solution' : '💡 Step-by-Step Proof'}
        </GhostBtn>
      </div>

      {/* Step by Step Proof for Grade 7 */}
      {showSteps && (
        <div className="w-full bg-[#110729] border-2 border-purple-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1 text-xs sm:text-sm text-slate-200 fade-in-up shrink-0">
          <p className="text-amber-300 font-display font-900">📝 Grade 7 Step-by-Step Algebraic Proof:</p>
          <p>1. Write equation: <span className="font-mono text-cyan-300 font-bold">3(x + 2) = 2(x + 5)</span></p>
          <p>2. Expand both brackets: <span className="font-mono text-cyan-300 font-bold">3x + 6 = 2x + 10</span></p>
          <p>3. Subtract 2x from both sides: <span className="font-mono text-cyan-300 font-bold">x + 6 = 10</span></p>
          <p>4. Subtract 6 from both sides: <span className="font-mono text-emerald-300 font-bold">x = 4</span> ✓</p>
        </div>
      )}

      {fb && <Banner ok={fb.ok}>{fb.t}</Banner>}
    </div>
  );
}
