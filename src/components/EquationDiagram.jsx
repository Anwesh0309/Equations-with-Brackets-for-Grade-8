import React from 'react';

const M = "−";
const sgn = n => (n < 0 ? M + Math.abs(n) : String(n));

function fitFont(text, base = 17, max = 12) {
  const len = String(text).length;
  if (len <= 8) return base;
  return Math.max(max, base - (len - 8) * 0.9);
}

/* A pan of the balance scale holding an expression */
function Pan({ cx, text, color, stroke }) {
  const w = Math.min(124, Math.max(70, String(text).length * 9 + 26));
  return (
    <g>
      <line x1={cx} y1="40" x2={cx - w / 2 + 6} y2="86" stroke="#94a3b8" strokeWidth="2" />
      <line x1={cx} y1="40" x2={cx + w / 2 - 6} y2="86" stroke="#94a3b8" strokeWidth="2" />
      <rect x={cx - w / 2} y="86" width={w} height="40" rx="14" fill={color} stroke={stroke} strokeWidth="3" />
      <text x={cx} y="112" fill="#ffffff" fontSize={fitFont(text)} fontWeight="900" textAnchor="middle">{text}</text>
    </g>
  );
}

export function EquationDiagram({ diagramData, size = 180 }) {
  if (!diagramData) return null;
  const { mode = 'balance' } = diagramData;
  const W = size * 1.75;
  const H = size * 0.82;

  /* ---------- BALANCE SCALE ---------- */
  if (mode === 'balance') {
    const { left = '', right = '' } = diagramData;
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <svg width={W} height={H} viewBox="0 0 340 160" className="drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
          {/* stand */}
          <polygon points="170,52 150,148 190,148" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
          <rect x="130" y="146" width="80" height="8" rx="4" fill="#4338ca" />
          {/* beam */}
          <rect x="52" y="36" width="236" height="8" rx="4" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="170" cy="40" r="9" fill="#facc15" stroke="#b45309" strokeWidth="2" />
          <Pan cx={90} text={left} color="#6d28d9" stroke="#c4b5fd" />
          <Pan cx={250} text={right} color="#0e7490" stroke="#67e8f9" />
          <text x="170" y="26" fill="#facc15" fontSize="20" fontWeight="900" textAnchor="middle">=</text>
        </svg>
      </div>
    );
  }

  /* ---------- AREA MODEL (expand) ---------- */
  if (mode === 'expand') {
    const { a = 3, k = 1, b = 4 } = diagramData;
    const ak = a * k;
    const ab = a * b;
    const x0 = 70, y0 = 44, h = 70;
    const wx = 40 + 20 * k;               // width for the kx part
    const wb = 20 + Math.min(Math.abs(b), 9) * 7; // width for the constant part
    const aTxt = sgn(a);
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <svg width={W} height={H} viewBox="0 0 340 160" className="drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]">
          {/* top labels */}
          <text x={x0 + wx / 2} y="30" fill="#38bdf8" fontSize="16" fontWeight="900" textAnchor="middle">{k === 1 ? 'x' : `${k}x`}</text>
          <text x={x0 + wx + wb / 2} y="30" fill="#4ade80" fontSize="16" fontWeight="900" textAnchor="middle">{b < 0 ? M + Math.abs(b) : '+' + b}</text>
          <line x1={x0} y1="38" x2={x0 + wx + wb} y2="38" stroke="#94a3b8" strokeWidth="2" />
          {/* left label */}
          <text x={x0 - 14} y={y0 + h / 2 + 6} fill="#facc15" fontSize="20" fontWeight="900" textAnchor="middle">{aTxt}</text>
          <line x1={x0 - 4} y1={y0} x2={x0 - 4} y2={y0 + h} stroke="#94a3b8" strokeWidth="2" />
          {/* areas */}
          <rect x={x0} y={y0} width={wx} height={h} rx="8" fill="#0369a1" stroke="#7dd3fc" strokeWidth="3" />
          <rect x={x0 + wx} y={y0} width={wb} height={h} rx="8" fill={b < 0 ? '#9a3412' : '#15803d'} stroke={b < 0 ? '#fdba74' : '#86efac'} strokeWidth="3" />
          <text x={x0 + wx / 2} y={y0 + h / 2 + 6} fill="#ffffff" fontSize="17" fontWeight="900" textAnchor="middle">?</text>
          <text x={x0 + wx + wb / 2} y={y0 + h / 2 + 6} fill="#ffffff" fontSize="17" fontWeight="900" textAnchor="middle">?</text>
          <text x="170" y="146" fill="#facc15" fontSize="13" fontWeight="900" textAnchor="middle">Outside number × every term inside</text>
        </svg>
      </div>
    );
  }

  /* ---------- RECTANGLE (perimeter) ---------- */
  if (mode === 'rect') {
    const { len = 'x + 3', wid = '4', P = 24 } = diagramData;
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <svg width={W} height={H} viewBox="0 0 340 160" className="drop-shadow-[0_0_18px_rgba(34,197,94,0.35)]">
          <rect x="70" y="42" width="200" height="86" rx="10" fill="#14532d" stroke="#86efac" strokeWidth="4" strokeDasharray="10 5" />
          <rect x="84" y="56" width="172" height="58" rx="8" fill="#166534" opacity="0.7" />
          <text x="170" y="92" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">🌳 Garden · P = {P} m</text>
          <text x="170" y="30" fill="#facc15" fontSize="16" fontWeight="900" textAnchor="middle">length = ({len})</text>
          <text x="40" y="90" fill="#38bdf8" fontSize="16" fontWeight="900" textAnchor="middle">{wid}</text>
          <text x="300" y="90" fill="#38bdf8" fontSize="16" fontWeight="900" textAnchor="middle">{wid}</text>
          <text x="170" y="148" fill="#facc15" fontSize="16" fontWeight="900" textAnchor="middle">length = ({len})</text>
        </svg>
      </div>
    );
  }

  /* ---------- GIFT BAGS (n groups) ---------- */
  if (mode === 'bags') {
    const { n = 3, inner = 'x + 4', total = 27 } = diagramData;
    const count = Math.min(n, 6);
    const gap = 300 / count;
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <svg width={W} height={H} viewBox="0 0 340 160" className="drop-shadow-[0_0_18px_rgba(244,63,94,0.35)]">
          {Array.from({ length: count }).map((_, i) => {
            const cx = 20 + gap * (i + 0.5);
            return (
              <g key={i}>
                <rect x={cx - 22} y="40" width="44" height="52" rx="8" fill="#be123c" stroke="#fda4af" strokeWidth="3" />
                <path d={`M ${cx - 10} 40 Q ${cx} 22 ${cx + 10} 40`} fill="none" stroke="#fda4af" strokeWidth="3" />
                <text x={cx} y="72" fill="#ffffff" fontSize={count > 4 ? 10 : 12} fontWeight="900" textAnchor="middle">{inner}</text>
              </g>
            );
          })}
          <text x="170" y="118" fill="#facc15" fontSize="15" fontWeight="900" textAnchor="middle">{n} equal bags</text>
          <text x="170" y="144" fill="#38bdf8" fontSize="17" fontWeight="900" textAnchor="middle">Total = {total}</text>
        </svg>
      </div>
    );
  }

  return null;
}
