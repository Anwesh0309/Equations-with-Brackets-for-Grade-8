import React, { useState } from 'react';
import { numStr, lin, br } from '../../mathData.js';
import { PANEL, ROW, RealWorldTag, GoldBtn, GhostBtn, SliderRow, XTile, UTile } from './ui.jsx';

/* =========================================================================
   STATION 1 · BRACKET BREAKER (Real-World Distributive Law Exploration)
   ========================================================================= */

/* ---------- Activity 1: Open the Gift Bags (Party Favor Packing) ---------- */
export function GiftBags() {
  const [n, setN] = useState(3); // bags (2 to 5)
  const [c, setC] = useState(4); // coins per bag (1 to 6)
  const [testVal, setTestVal] = useState(5); // Grade 7 substitution value for x
  const [showTest, setShowTest] = useState(false);
  const [stage, setStage] = useState(0); // 0: tied · 1: untied · 2: pooled on table

  const change = setter => v => {
    setter(v);
    setStage(0);
  };

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🎁" title="Birthday Party Favor Packs">
        Leo is packing {n} identical party gift bags for classmates. Each bag contains 1 mystery collector badge ($x$) and {c} golden chocolate coins ($c$).
      </RealWorldTag>

      <div className={ROW}>
        <SliderRow label="Gift Bags (outside number n):" value={n} min={2} max={5} onChange={change(setN)} />
        <SliderRow label="Coins per Bag (constant c):" value={c} min={1} max={6} onChange={change(setC)} />
      </div>

      {/* Gift Bags Display */}
      <div className="flex items-end justify-center gap-2.5 sm:gap-3.5 w-full flex-wrap shrink-0 py-1">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className={`rounded-xl sm:rounded-2xl border-2 sm:border-3 px-2.5 pt-1.5 pb-2 flex flex-col items-center gap-1 min-w-[90px] max-w-[115px] transition-all duration-300 shadow-lg ${
              stage === 0
                ? 'bg-gradient-to-b from-rose-700/90 to-rose-950 border-rose-300 scale-100'
                : stage === 1
                ? 'bg-gradient-to-b from-purple-900/90 to-indigo-950 border-cyan-300/80 scale-105'
                : 'bg-purple-950/30 border-purple-400/25 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between w-full text-xs font-black text-rose-200">
              <span>Bag #{i + 1}</span>
              <span>{stage === 0 ? '🎀 Tied' : '✨ Open'}</span>
            </div>
            <span className="text-2xl sm:text-3xl filter drop-shadow">🎁</span>

            {stage === 0 ? (
              <div className="bg-black/40 border border-white/20 rounded-lg px-2 py-0.5 text-center">
                <span className="font-display font-900 text-amber-300 text-xs sm:text-sm">(x + {c})</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="flex items-center gap-1">
                  <XTile ghost={stage === 2} />
                  <span className="text-xs font-bold text-sky-200">1 badge</span>
                </div>
                <div className="flex flex-wrap justify-center gap-[3px] max-w-[80px]">
                  {Array.from({ length: c }).map((__, j) => (
                    <UTile key={j} ghost={stage === 2} label="🟡" />
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-200">{c} coins</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage 2: Pooled Tiles on Table */}
      {stage === 2 && (
        <div className="flex items-stretch justify-center gap-3 w-full flex-wrap shrink-0 fade-in-up">
          {/* Mystery Badges Group */}
          <div className="bg-sky-950/90 border-2 border-sky-400/70 rounded-xl sm:rounded-2xl p-2.5 flex flex-col items-center gap-1.5 shadow-lg min-w-[150px]">
            <span className="text-xs font-black text-sky-300 uppercase tracking-wide">📦 Total Mystery Badges</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {Array.from({ length: n }).map((_, i) => (
                <XTile key={i} />
              ))}
            </div>
            <span className="text-white font-display font-900 text-sm sm:text-base">{n} × x = {n}x badges</span>
          </div>

          {/* Golden Coins Group */}
          <div className="bg-emerald-950/90 border-2 border-emerald-400/70 rounded-xl sm:rounded-2xl p-2.5 flex flex-col items-center gap-1.5 shadow-lg min-w-[180px] max-w-[300px]">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">🪙 Total Chocolate Coins</span>
            <div className="flex flex-wrap justify-center gap-1 max-h-14 overflow-y-auto custom-scrollbar">
              {Array.from({ length: n * c }).map((_, i) => (
                <UTile key={i} label="🟡" />
              ))}
            </div>
            <span className="text-white font-display font-900 text-sm sm:text-base">{n} bags × {c} = {n * c} coins</span>
          </div>
        </div>
      )}

      {/* Algebraic Distributive Formula Banner */}
      <div className="w-full bg-amber-400/15 border-2 border-amber-400/60 rounded-xl sm:rounded-2xl py-1.5 px-3 text-center font-display font-900 text-base sm:text-xl text-amber-300 shadow-lg shrink-0 flex items-center justify-center gap-2.5">
        <span>{n}(x + {c})</span>
        <span className="text-white">→</span>
        <span className={stage === 2 ? 'text-emerald-300 underline' : 'text-slate-300'}>
          {stage === 2 ? `${n}x + ${n * c}` : stage === 1 ? `${n} × x + ${n} × ${c}` : '? (Open bags to see)'}
        </span>
      </div>

      {/* Grade 7 Interactive Value Tester */}
      <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 shrink-0 flex-wrap gap-2 text-xs sm:text-sm">
        <button
          onClick={() => setShowTest(t => !t)}
          className="font-extrabold text-cyan-300 hover:text-cyan-200 cursor-pointer flex items-center gap-1.5"
        >
          <span>{showTest ? '▼ Hide Real-World Price Calculator' : '▶ Try It: What if each badge $x = $5?'}</span>
        </button>

        {showTest && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center fade-in-up">
            <span className="font-bold text-slate-200">If x = ${testVal}:</span>
            <input
              type="range"
              min={1}
              max={10}
              value={testVal}
              onChange={e => setTestVal(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span className="font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
              {n}({testVal} + {c}) = {n * (testVal + c)} items ✓
            </span>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {stage === 0 && <GoldBtn onClick={() => setStage(1)}>🎀 Untie Ribbons & Open Bags</GoldBtn>}
        {stage === 1 && <GoldBtn onClick={() => setStage(2)}>🧺 Pool All Items Together</GoldBtn>}
        {stage === 2 && <GhostBtn onClick={() => setStage(0)}>↺ Pack New Favor Bags</GhostBtn>}
      </div>
    </div>
  );
}

/* ---------- Activity 2: Split the Garden (Mia & Noah's Eco Garden Plot) ---------- */
export function GardenArea() {
  const [n, setN] = useState(3); // garden height (meters)
  const [b, setB] = useState(4); // constant (meters)
  const [minus, setMinus] = useState(false); // add flower border vs cut out walkway
  const [split, setSplit] = useState(false);
  const [testX, setTestX] = useState(5); // Grade 7 real-world test value for x

  const sign = minus ? '−' : '+';
  const result = minus ? `${n}x − ${n * b}` : `${n}x + ${n * b}`;
  const totalAreaNum = minus ? n * (testX - b) : n * (testX + b);

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🌱" title="Mia & Noah's School Eco-Garden">
        Mia and Noah are laying out a raised garden bed with length {n} m and width (x {sign} {b}) m.
        {minus
          ? ` They cut out a ${b} m stone pathway from the vegetable bed.`
          : ` They add a ${b} m flowering border to the vegetable bed.`}
      </RealWorldTag>

      <div className={ROW}>
        <SliderRow label="Garden Length / Height (n):" value={n} min={2} max={5} onChange={v => { setN(v); setSplit(false); }} display={`${n} m`} />
        <SliderRow label={`Border / Cut (b):`} value={b} min={1} max={minus ? 4 : 6} onChange={v => { setB(v); setSplit(false); }} display={`${b} m`} />
        <div className="flex items-center gap-2">
          {[false, true].map(m => (
            <button
              key={String(m)}
              onClick={() => { setMinus(m); setSplit(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-black transition cursor-pointer ${
                minus === m ? 'bg-amber-400 text-slate-950 scale-105 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {m ? '✂️ Pathway Cut (x − b)' : '🌻 Flower Border (x + b)'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Garden Illustration */}
      <svg viewBox="0 0 340 160" className="drop-shadow-[0_0_18px_rgba(34,197,94,0.45)] shrink-0 max-w-full w-full max-w-[320px] max-h-[140px] h-auto">
        <defs>
          <pattern id="soilPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#14532d" />
            <circle cx="3" cy="3" r="1" fill="#166534" />
            <circle cx="9" cy="9" r="1.2" fill="#15803d" />
          </pattern>
          <pattern id="flowerPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#854d0e" />
            <circle cx="10" cy="10" r="3" fill="#facc15" />
          </pattern>
          <pattern id="stonePattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#475569" stroke="#334155" strokeWidth="1" />
          </pattern>
        </defs>

        <g transform="translate(65,28)">
          {/* Dimensions Header */}
          <text x={115} y="-12" fill="#facc15" fontSize="14" fontWeight="900" textAnchor="middle">
            Total Width: (x {sign} {b}) m
          </text>
          <line x1="0" y1="-5" x2={230} y2="-5" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />

          {/* Height Label */}
          <text x="-24" y={46} fill="#38bdf8" fontSize="15" fontWeight="900" textAnchor="middle">{n} m</text>
          <line x1="-10" y1="0" x2="-10" y2={85} stroke="#94a3b8" strokeWidth="2" />

          {/* Garden Plots */}
          {!minus ? (
            <>
              {/* Vegetable section (x width) */}
              <rect x="0" y="0" width="130" height="85" rx="8" fill="url(#soilPattern)" stroke="#86efac" strokeWidth="2.5" />
              <text x="65" y="38" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">🍓 Veggie Zone</text>
              <text x="65" y="56" fill="#86efac" fontSize="12" fontWeight="800" textAnchor="middle">width: x m</text>

              {/* Dividing fence if split */}
              {split && (
                <line x1="130" y1="0" x2="130" y2="85" stroke="#facc15" strokeWidth="3" strokeDasharray="5 3" />
              )}

              {/* Flower section (b width) */}
              <rect x="130" y="0" width={b * 16} height="85" rx="8" fill="url(#flowerPattern)" stroke="#fde047" strokeWidth="2.5" />
              <text x={130 + (b * 16) / 2} y="38" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">🌻 Flowers</text>
              <text x={130 + (b * 16) / 2} y="56" fill="#fef08a" fontSize="12" fontWeight="800" textAnchor="middle">{b} m</text>

              {/* Sub-areas below if split */}
              {split && (
                <>
                  <text x="65" y="105" fill="#4ade80" fontSize="12.5" fontWeight="900" textAnchor="middle">
                    Area = {n}x m²
                  </text>
                  <text x={130 + (b * 16) / 2} y="105" fill="#fde047" fontSize="12.5" fontWeight="900" textAnchor="middle">
                    Area = {n * b} m²
                  </text>
                </>
              )}
            </>
          ) : (
            <>
              {/* Whole plot with pathway cut */}
              <rect x="0" y="0" width={130 + b * 16} height="85" rx="8" fill="url(#soilPattern)" stroke="#86efac" strokeWidth="2.5" />
              <text x="65" y="38" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">🍓 Veggie Plot</text>
              <text x="65" y="56" fill="#86efac" fontSize="12" fontWeight="800" textAnchor="middle">width: x m</text>

              {split && (
                <>
                  <rect x={130} y="0" width={b * 16} height="85" rx="8" fill="url(#stonePattern)" stroke="#f87171" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x={130 + (b * 16) / 2} y="38" fill="#fca5a5" fontSize="13" fontWeight="900" textAnchor="middle">🧱 Cutout</text>
                  <text x={130 + (b * 16) / 2} y="56" fill="#fff" fontSize="14" fontWeight="900" textAnchor="middle">✂️ −{b} m</text>

                  <text x="65" y="105" fill="#4ade80" fontSize="12.5" fontWeight="900" textAnchor="middle">
                    Full: {n}x m²
                  </text>
                  <text x={130 + (b * 16) / 2} y="105" fill="#f87171" fontSize="12.5" fontWeight="900" textAnchor="middle">
                    Cut: −{n * b} m²
                  </text>
                </>
              )}
            </>
          )}
        </g>
      </svg>

      {/* Expanded Area Calculation */}
      <div className="w-full bg-amber-400/15 border-2 border-amber-400/60 rounded-xl sm:rounded-2xl py-1.5 px-3 text-center font-display font-900 text-base sm:text-xl text-amber-300 shadow-lg shrink-0">
        Total Area = {n}(x {sign} {b}) = {split ? `${result} m² ✨` : '? m² (Click split below)'}
      </div>

      {/* Grade 7 Real-World Dimension Calculator */}
      <div className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm font-extrabold text-slate-200 shrink-0">
        <span className="text-cyan-300 font-display font-900">📐 If vegetable width x = {testX} m:</span>
        <div className="flex items-center gap-2">
          <span>x:</span>
          <input
            type="range"
            min={minus ? b + 1 : 2}
            max={10}
            value={testX}
            onChange={e => setTestX(Number(e.target.value))}
            className="w-24 accent-emerald-400"
          />
          <span className="text-emerald-300 font-black bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/40">
            {n} × ({testX} {sign} {b}) = {totalAreaNum} m²
          </span>
        </div>
      </div>

      {/* Split Button */}
      <div className="shrink-0">
        {!split ? (
          <GoldBtn onClick={() => setSplit(true)}>
            {minus ? '✂️ Cut Out the Pathway Section' : '🪓 Split Garden Into Two Color Plots'}
          </GoldBtn>
        ) : (
          <GhostBtn onClick={() => setSplit(false)}>↺ Recombine Whole Garden</GhostBtn>
        )}
      </div>
    </div>
  );
}

/* ---------- Activity 3: Sign Flip Detective (The Discount & Chiller Store) ---------- */
const SIGN_SCENARIOS = [
  {
    m: -3, b: -2,
    tag: "🏷️ Store Debt Waiver",
    ctx: "The student store cancels 3 penalty notices (−3). Each penalty was for a textbook fee x minus a $2 early-bird credit (x − $2).",
    why: "Canceling 3 fees of −$2 is −3 × (−$2) = +$6 saved in your pocket!"
  },
  {
    m: -2, b: 5,
    tag: "❄️ Winter Cryo-Chiller",
    ctx: "A lab freezer cools by 2°C per cycle (−2). Each cycle runs for time t plus a 5-minute pre-chill stage (t + 5).",
    why: "Multiplying −2 × (+5) gives −10°C drop from the pre-chill!"
  },
  {
    m: 4, b: -3,
    tag: "🎮 Game Score Shield",
    ctx: "A game hero drinks 4 potions (+4). Each potion provides base points x minus 3 poison damage (x − 3).",
    why: "4 potions × (−3 poison) = −12 total poison absorbed."
  }
];

export function SignFlip() {
  const [idx, setIdx] = useState(0);
  const [rev, setRev] = useState({ x: false, b: false });
  const cur = SIGN_SCENARIOS[idx];
  const { m, b } = cur;
  const done = rev.x && rev.b;

  const pick = i => {
    setIdx(i);
    setRev({ x: false, b: false });
  };

  const cardCls = shown =>
    `rounded-xl sm:rounded-2xl border-2 sm:border-3 px-3.5 sm:px-4 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all cursor-pointer min-w-[140px] sm:min-w-[155px] shadow-lg ${
      shown
        ? 'bg-emerald-950/90 border-emerald-300 scale-105'
        : 'bg-[#2a1760] border-cyan-400/60 hover:scale-105 hover:border-amber-300'
    }`;

  return (
    <div className={PANEL}>
      <RealWorldTag icon="🕵️" title={cur.tag}>
        {cur.ctx}
      </RealWorldTag>

      {/* Scenario Picker */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
        {SIGN_SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              idx === i
                ? 'bg-amber-400 text-slate-950 scale-105 shadow-md border-2 border-amber-300'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {s.tag}: {br(s.m, 1, s.b)}
          </button>
        ))}
      </div>

      {/* Main Equation Highlight */}
      <div className="font-display font-900 text-2xl sm:text-3xl text-white shrink-0 tracking-wide">
        {br(m, 1, b)}
      </div>
      <p className="text-slate-300 text-xs sm:text-sm font-bold shrink-0">
        Tap each term inside to multiply by outside number <span className="text-amber-400 font-black">{numStr(m)}</span> 👇
      </p>

      {/* Interactive Multiplication Cards */}
      <div className="flex items-center justify-center gap-3.5 sm:gap-4 shrink-0 flex-wrap">
        <button onClick={() => setRev(r => ({ ...r, x: true }))} className={cardCls(rev.x)}>
          <span className="font-display font-900 text-base sm:text-lg text-cyan-200">First Term: x</span>
          <span className="text-xs font-bold text-slate-300">{rev.x ? `${numStr(m)} × x` : `tap to multiply`}</span>
          {rev.x && <span className="font-display font-900 text-xl sm:text-2xl text-emerald-300 fade-in-up">{lin(m, 0)}</span>}
        </button>

        <button onClick={() => setRev(r => ({ ...r, b: true }))} className={cardCls(rev.b)}>
          <span className="font-display font-900 text-base sm:text-lg text-cyan-200">Second Term: {numStr(b)}</span>
          <span className="text-xs font-bold text-slate-300">{rev.b ? `${numStr(m)} × (${numStr(b)})` : `tap to multiply`}</span>
          {rev.b && (
            <span className="font-display font-900 text-xl sm:text-2xl text-emerald-300 fade-in-up">
              {m * b >= 0 ? `+${m * b}` : numStr(m * b)}
            </span>
          )}
        </button>
      </div>

      {/* Real-World Sneaky Sign Explanation */}
      {rev.b && (
        <div className="w-full bg-rose-950/80 border-2 border-rose-300/60 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 text-center text-rose-100 font-bold text-xs sm:text-sm fade-in-up shrink-0 shadow-md">
          <p className="font-black text-amber-300 mb-0.5">🔍 Why does the sign flip in real life?</p>
          <p>{cur.why}</p>
        </div>
      )}

      {/* Expanded Equation Banner */}
      <div
        className={`w-full rounded-xl sm:rounded-2xl py-1.5 sm:py-2 px-3 text-center font-display font-900 text-base sm:text-xl shadow-lg shrink-0 border-2 ${
          done
            ? 'bg-emerald-950/80 border-emerald-400/70 text-emerald-300'
            : 'bg-amber-400/10 border-amber-400/40 text-amber-300'
        }`}
      >
        {br(m, 1, b)} = {done ? `${lin(m, m * b)} ✨` : '?'}
      </div>
    </div>
  );
}
