import React from 'react';

/* Shared building blocks for the three simulation stations */

export const PANEL =
  "flex flex-col items-center gap-2 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full custom-scrollbar";

export const ROW =
  "flex items-center gap-2 sm:gap-2.5 bg-[#14082c] px-3 py-1.5 rounded-xl border border-cyan-400/30 w-full justify-center shrink-0 flex-wrap";

export function RealWorldTag({ icon = "🌍", title, children }) {
  return (
    <div className="w-full bg-cyan-950/70 border border-cyan-400/50 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center gap-2 text-left shrink-0 shadow-sm">
      <span className="text-lg sm:text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-cyan-300 font-display font-900 text-xs sm:text-sm mr-1.5">{title}:</span>
        <span className="text-slate-200 text-xs sm:text-sm font-bold leading-snug break-words">{children}</span>
      </div>
    </div>
  );
}

export function Banner({ ok, children }) {
  return (
    <div
      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-black w-full text-center shadow-lg shrink-0 fade-in-up break-words ${
        ok
          ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60'
          : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 animate-shake'
      }`}
    >
      {children}
    </div>
  );
}

export function GoldBtn({ children, onClick, disabled, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-gold text-xs sm:text-sm font-900 px-4 sm:px-5 py-1.5 sm:py-2 shadow-lg hover:scale-105 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer shrink-0 ${className}`}
    >
      {children}
    </button>
  );
}

export function SliderRow({ label, value, min, max, onChange, display }) {
  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
      <span className="text-xs sm:text-sm font-extrabold text-slate-200">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 hover:bg-white/25 disabled:opacity-30 text-white font-black text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          −
        </button>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-20 sm:w-28 accent-cyan-400 cursor-pointer"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 hover:bg-white/25 disabled:opacity-30 text-white font-black text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          +
        </button>
      </div>
      <span className="text-xs sm:text-sm font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30 min-w-[2.8rem] text-center">
        {display ?? value}
      </span>
    </div>
  );
}

/* Algebra tiles */
export const XTile = ({ ghost, count = 1 }) => (
  <span className={`inline-flex items-center justify-center px-2 py-0.5 h-6 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 border border-sky-200 text-white text-xs font-black shadow-sm transition-all ${ghost ? 'opacity-30' : ''}`}>
    {count > 1 ? `${count}x` : 'x'}
  </span>
);

export const UTile = ({ neg, ghost, label }) => (
  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border text-xs font-black text-white shadow-sm transition-all ${
    neg ? 'bg-rose-600 border-rose-300' : 'bg-emerald-600 border-emerald-300'
  } ${ghost ? 'opacity-30' : ''}`}>
    {label ?? (neg ? '−1' : '+1')}
  </span>
);

/* Beam balance scale that tilts when the learner makes an unbalanced move */
export function ScaleSVG({ left, right, tilt = 0, width = 280, leftSub, rightSub }) {
  const pw = t => Math.min(150, Math.max(90, String(t).length * 9 + 32));
  const wl = pw(left), wr = pw(right);
  const fs = t => (String(t).length > 10 ? 14 : 16);

  return (
    <div className="flex flex-col items-center shrink-0 max-w-full w-full">
      <svg
        width={width}
        height={width * 0.44}
        viewBox="0 0 380 170"
        className="drop-shadow-[0_0_16px_rgba(250,204,21,0.35)] shrink-0 max-w-full max-h-[135px] h-auto"
      >
        {/* Fulcrum stand */}
        <polygon points="190,52 165,166 215,166" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
        <rect x="135" y="160" width="110" height="9" rx="4.5" fill="#4338ca" stroke="#6366f1" strokeWidth="1.5" />

        {/* Pivot disc */}
        <circle cx="190" cy="46" r="10" fill="#facc15" stroke="#b45309" strokeWidth="2" />

        {/* Needle balance pointer */}
        <line
          x1="190" y1="46"
          x2={190 + Math.sin((tilt * Math.PI) / 180) * 30}
          y2={46 - Math.cos((tilt * Math.PI) / 180) * 30}
          stroke={tilt === 0 ? '#4ade80' : '#f43f5e'}
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Rotating beam */}
        <g
          style={{
            transformBox: 'view-box',
            transformOrigin: '190px 46px',
            transform: `rotate(${tilt}deg)`,
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Main golden beam */}
          <rect x="35" y="42" width="310" height="8" rx="4" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />

          {/* Left hanging pan */}
          <line x1="85" y1="47" x2={85 - wl / 2 + 8} y2="96" stroke="#94a3b8" strokeWidth="2" />
          <line x1="85" y1="47" x2={85 + wl / 2 - 8} y2="96" stroke="#94a3b8" strokeWidth="2" />
          <rect x={85 - wl / 2} y="96" width={wl} height="46" rx="10" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
          <text x="85" y="125" fill="#fff" fontSize={fs(left)} fontWeight="900" textAnchor="middle">{left}</text>

          {/* Right pan */}
          <line x1="295" y1="47" x2={295 - wr / 2 + 8} y2="96" stroke="#94a3b8" strokeWidth="2" />
          <line x1="295" y1="47" x2={295 + wr / 2 - 8} y2="96" stroke="#94a3b8" strokeWidth="2" />
          <rect x={295 - wr / 2} y="96" width={wr} height="46" rx="10" fill="#0e7490" stroke="#67e8f9" strokeWidth="2" />
          <text x="295" y="125" fill="#fff" fontSize={fs(right)} fontWeight="900" textAnchor="middle">{right}</text>
        </g>

        {/* Center state badge */}
        <rect x="170" y="15" width="40" height="20" rx="10" fill={tilt === 0 ? '#065f46' : '#881337'} stroke={tilt === 0 ? '#34d399' : '#f43f5e'} strokeWidth="1.5" />
        <text x="190" y="30" fill={tilt === 0 ? '#6ee7b7' : '#fda4af'} fontSize="14" fontWeight="900" textAnchor="middle">
          {tilt === 0 ? '=' : '≠'}
        </text>
      </svg>

      {/* Load descriptions rendered outside SVG pan rect so text never overflows pan box */}
      {(leftSub || rightSub) && (
        <div className="flex items-center justify-between w-full max-w-md gap-2 mt-1 px-1 shrink-0">
          <div className="flex-1 min-w-0 bg-purple-950/85 border border-purple-400/40 rounded-lg px-2 py-1 text-center shadow-sm">
            <span className="text-[11px] sm:text-xs font-bold text-purple-200 block truncate" title={leftSub}>
              📦 {leftSub}
            </span>
          </div>
          <span className="text-amber-400 font-black text-xs shrink-0">vs</span>
          <div className="flex-1 min-w-0 bg-cyan-950/85 border border-cyan-400/40 rounded-lg px-2 py-1 text-center shadow-sm">
            <span className="text-[11px] sm:text-xs font-bold text-cyan-200 block truncate" title={rightSub}>
              ⚖️ {rightSub}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
