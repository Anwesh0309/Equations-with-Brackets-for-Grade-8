/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates unbounded non-repeating Grade 8 questions on
   Equations with Brackets (expand, solve, word problems, both sides).
   ========================================================================= */

import { PRACTICE_QUESTIONS } from './practiceQuestions.js';

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Gift Bag Gallery",  icon: "🎁", range: "Q1–10",   difficulty: 1, archetypes: ['expand_add'] },
  { id: 1, name: "Balance Bridge",    icon: "⚖️", range: "Q11–20",  difficulty: 1, archetypes: ['solve_add', 'expand_add'] },
  { id: 2, name: "Candy Counter",     icon: "🍬", range: "Q21–30",  difficulty: 2, archetypes: ['expand_sub', 'expand_coef'] },
  { id: 3, name: "Robot Workshop",    icon: "🤖", range: "Q31–40",  difficulty: 2, archetypes: ['solve_sub', 'solve_add'] },
  { id: 4, name: "Garden Fence",      icon: "🌳", range: "Q41–50",  difficulty: 3, archetypes: ['word_rect', 'word_packs'] },
  { id: 5, name: "Treasure Cove",     icon: "🏴‍☠️", range: "Q51–60",  difficulty: 3, archetypes: ['expand_neg', 'solve_neg'] },
  { id: 6, name: "Checkpoint Tower",  icon: "🗼", range: "Q61–70",  difficulty: 3, archetypes: ['evaluate', 'solve_coef'] },
  { id: 7, name: "Coin Bank",         icon: "🪙", range: "Q71–80",  difficulty: 4, archetypes: ['both_sides', 'solve_sub'] },
  { id: 8, name: "Space Market",      icon: "🪐", range: "Q81–90",  difficulty: 4, archetypes: ['bracket_plus', 'two_brackets'] },
  { id: 9, name: "Champion Summit",   icon: "🏆", range: "Q91–100", difficulty: 4, archetypes: ['solve_neg', 'both_sides', 'bracket_plus', 'two_brackets', 'word_rect', 'solve_coef'] }
];

/* ---------- small helpers ---------- */
const M = "−"; // proper minus sign

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function formatNum(val) {
  if (Number.isInteger(val)) return val < 0 ? M + Math.abs(val) : val.toString();
  const v = Number(val.toFixed(2));
  return v < 0 ? M + Math.abs(v) : v.toString();
}

export const numStr = n => formatNum(n);

/** ax + b  (handles 1, -1, 0 and negatives) */
export function lin(a, b = 0) {
  let s;
  if (a === 0) s = '';
  else if (a === 1) s = 'x';
  else if (a === -1) s = M + 'x';
  else s = (a < 0 ? M + Math.abs(a) : String(a)) + 'x';
  if (b !== 0) {
    if (s === '') return numStr(b);
    s += ` ${b < 0 ? M : '+'} ${Math.abs(b)}`;
  } else if (s === '') {
    s = '0';
  }
  return s;
}

/** a(kx + b) */
export function br(a, k, b) {
  const outer = a === 1 ? '' : a === -1 ? M : (a < 0 ? M + Math.abs(a) : String(a));
  return `${outer}(${lin(k, b)})`;
}

const xEq = v => `x = ${numStr(v)}`;

/** Build four shuffled options from a correct answer + candidate distractors */
function finalize(correct, candidates, fallbackFn) {
  const unique = [];
  for (const c of candidates) {
    if (c !== correct && !unique.includes(c) && c !== undefined && c !== null && !String(c).includes('NaN')) {
      unique.push(c);
    }
  }
  let guard = 0;
  while (unique.length < 3 && guard < 40) {
    const f = fallbackFn(guard++);
    if (f !== correct && !unique.includes(f)) unique.push(f);
  }
  const raw = [correct, ...unique.slice(0, 3)];
  const shuffled = [...raw];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { options: shuffled, correctIndex: shuffled.indexOf(correct) };
}

function xFallback(x) {
  return i => xEq(x + [1, -1, 2, -2, 3, -3, 4, 5][i % 8] * (1 + Math.floor(i / 8)));
}

/* ---------- archetype generators ---------- */

function genExpand(diff, name, { neg = false, sub = false, coef = false } = {}) {
  let a = randInt(2, 4 + diff);
  if (neg) a = -a;
  const k = coef ? randInt(2, 4) : 1;
  let b = randInt(1, 9);
  if (sub || (neg && Math.random() < 0.6)) b = -b;
  const ak = a * k, ab = a * b;

  const correct = lin(ak, ab);
  const cands = [
    lin(ak, b),            // forgot to multiply the 2nd term
    lin(ak, -ab),          // sign slip
    lin(-ak, ab),          // sign slip on first term
    lin(a, ab),            // forgot to multiply the coefficient (only if k != 1)
    lin(ak, a + b),        // added instead of multiplied
    lin(1, ab)             // lost the outside number on x
  ];
  const prompt = `${name} wants to expand ${br(a, k, b)}. Which expression is equal to it?`;
  const explanation = `Multiply every term inside by ${numStr(a)}: ${numStr(ak)}x and ${numStr(ab)}, so ${br(a, k, b)} = ${correct}.`;
  const { options, correctIndex } = finalize(correct, cands, i => lin(ak + i + 1, ab));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'expand', a, k, b },
    rule: neg ? 'SIGN FLIP RULE' : 'DISTRIBUTIVE LAW'
  };
}

function genSolve(diff, name, { sub = false, neg = false, coef = false } = {}) {
  let a = randInt(2, 3 + diff);
  const k = coef ? randInt(2, 3) : 1;
  let b = randInt(1, 9);
  if (sub) b = -b;
  const xMax = diff >= 3 ? 9 : 12;
  let x = randInt(neg || diff >= 3 ? -6 : 1, xMax);
  if (x === 0) x = 2;
  const outer = neg ? -a : a;
  const c = outer * (k * x + b);
  const ab = outer * b;

  const eq = `${br(outer, k, b)} = ${numStr(c)}`;
  const cands = [
    xEq((c - b) / (outer * k)),     // multiplied only the first term
    xEq(c / (outer * k) + b),       // sign error moving b
    xEq((c + ab) / (outer * k)),    // wrong sign when subtracting expanded term
    xEq(c - b),                     // forgot to divide
    xEq(-x),
    xEq(c / outer + b)
  ];
  const prompt = `${name} is solving ${eq}. What is the value of x?`;
  const explanation = `Expand: ${lin(outer * k, ab)} = ${numStr(c)}, so ${numStr(outer * k)}x = ${numStr(c - ab)} and x = ${numStr(x)}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'balance', left: br(outer, k, b), right: numStr(c) },
    rule: neg ? 'NEGATIVE OUTSIDE RULE' : 'BALANCE RULE'
  };
}

function genEvaluate(diff, name) {
  const a = randInt(2, 6);
  const b = randInt(1, 8) * (Math.random() < 0.4 ? -1 : 1);
  const x = randInt(2, 9);
  const d = randInt(1, 9);
  const val = a * (x + b) - d;
  const cands = [
    a * x + b - d,         // forgot to multiply b
    a * (x + b) + d,       // wrong sign on d
    a * x - d,             // dropped b
    (x + b) - d,           // dropped a
    a * (x - b) - d
  ].map(numStr);
  const prompt = `${name} substitutes x = ${x} into ${br(a, 1, b)} − ${d}. What is the value?`;
  const explanation = `x + ${numStr(b)} = ${numStr(x + b)}, then ${a} × ${numStr(x + b)} = ${numStr(a * (x + b))}, and minus ${d} gives ${numStr(val)}.`;
  const { options, correctIndex } = finalize(numStr(val), cands, i => numStr(val + (i + 1) * 2));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'balance', left: `${br(a, 1, b)} − ${d}`, right: '?' },
    rule: 'SUBSTITUTE & CHECK'
  };
}

function genWordRect(diff, name) {
  const w = randInt(2, 8);
  const b = randInt(1, 6);
  const x = randInt(2, 10);
  const P = 2 * (x + b + w);
  const cands = [
    xEq(P - b - w),
    xEq(P / 2 + b + w),
    xEq(P / 2 - b),
    xEq(P / 2 - w),
    xEq(P / 2)
  ];
  const prompt = `${name} fences a rectangular garden with length (x + ${b}) m and width ${w} m. The perimeter is ${P} m. Find x.`;
  const explanation = `2(x + ${b} + ${w}) = ${P} → x + ${b + w} = ${P / 2} → x = ${x}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'rect', len: `x + ${b}`, wid: String(w), P },
    rule: 'PERIMETER RULE'
  };
}

function genWordPacks(diff, name) {
  const n = randInt(2, 6);
  const b = randInt(1, 8);
  const x = randInt(3, 12);
  const T = n * (x + b);
  const [holder, item] = pick([['boxes', 'pencils'], ['bags', 'marbles'], ['packs', 'stickers'], ['trays', 'cupcakes'], ['jars', 'coins']]);
  const cands = [
    xEq(T / n + b),
    xEq((T - b) / n),
    xEq(T - n * b),
    xEq(T / n),
    xEq(T - b)
  ];
  const prompt = `${name} has ${n} ${holder}, each holding (x + ${b}) ${item}. In total there are ${T} ${item}. Find x.`;
  const explanation = `${n}(x + ${b}) = ${T} → x + ${b} = ${T / n} → x = ${x}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'bags', n, inner: `x + ${b}`, total: T },
    rule: 'GROUPS RULE'
  };
}

function genBothSides(diff, name) {
  const a = randInt(2, 5);
  const b = randInt(1, 7) * (Math.random() < 0.3 ? -1 : 1);
  const x = randInt(1, 10);
  const c = a * (x + b) - x;
  const rhs = `x ${c < 0 ? M : '+'} ${Math.abs(c)}`;
  const cands = [
    xEq((c - b) / (a - 1)),
    xEq((c + a * b) / (a - 1)),
    xEq((c - a * b) / (a + 1)),
    xEq((c + b) / (a - 1)),
    xEq(c - a * b)
  ];
  const prompt = `${name} balances both sides: ${br(a, 1, b)} = ${rhs}. Find x.`;
  const explanation = `Expand: ${lin(a, a * b)} = ${rhs}. Gather x's: ${a - 1}x = ${numStr(c - a * b)}, so x = ${numStr(x)}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'balance', left: br(a, 1, b), right: rhs },
    rule: 'BOTH SIDES RULE'
  };
}

function genBracketPlus(diff, name) {
  const a = randInt(2, 6);
  const b = randInt(1, 8) * (Math.random() < 0.35 ? -1 : 1);
  const x = randInt(1, 10);
  const d = randInt(1, 12) * (Math.random() < 0.35 ? -1 : 1);
  const e = a * (x + b) + d;
  const lhs = `${br(a, 1, b)} ${d < 0 ? M : '+'} ${Math.abs(d)}`;
  const cands = [
    xEq(e / a - b),
    xEq((e + d) / a - b),
    xEq((e - d) / a + b),
    xEq((e - d - b) / a),
    xEq(e - d - a * b)
  ];
  const prompt = `${name} solves ${lhs} = ${numStr(e)}. What is x?`;
  const explanation = `Take away ${numStr(d)} first: ${br(a, 1, b)} = ${numStr(e - d)}. Divide by ${a}: x ${b < 0 ? M : '+'} ${Math.abs(b)} = ${numStr((e - d) / a)}, so x = ${numStr(x)}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'balance', left: lhs, right: numStr(e) },
    rule: 'TWO-STEP RULE'
  };
}

function genTwoBrackets(diff, name) {
  const a = randInt(2, 4);
  const c = randInt(2, 4);
  const b = randInt(1, 6);
  const d = randInt(1, 6);
  const x = randInt(1, 9);
  const e = a * (x + b) + c * (x - d);
  const lhs = `${a}(x + ${b}) + ${c}(x ${M} ${d})`;
  const cands = [
    xEq((e - a * b - c * d) / (a + c)),
    xEq((e + a * b + c * d) / (a + c)),
    xEq((e - a * b + c * d) / (a - c === 0 ? 1 : a - c)),
    xEq((e + a * b - c * d) / (a + c)),
    xEq(e - a * b + c * d)
  ];
  const prompt = `${name} solves ${lhs} = ${numStr(e)}. Find x.`;
  const explanation = `Expand: ${a}x + ${a * b} + ${c}x ${M} ${c * d} = ${numStr(e)} → ${a + c}x ${a * b - c * d < 0 ? M : '+'} ${Math.abs(a * b - c * d)} = ${numStr(e)} → x = ${x}.`;
  const { options, correctIndex } = finalize(xEq(x), cands, xFallback(x));
  return {
    prompt, options, correctIndex, explanation,
    diagramData: { mode: 'balance', left: lhs, right: numStr(e) },
    rule: 'TWO BRACKETS RULE'
  };
}

/**
 * Generate a curated question for a given world and question index
 */
export function makeQuestion(worldIndex = 0, qIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const safeQ = Math.max(0, Math.min(9, qIndex % 10));

  if (PRACTICE_QUESTIONS && PRACTICE_QUESTIONS[worldIndex] && PRACTICE_QUESTIONS[worldIndex][safeQ]) {
    const q = PRACTICE_QUESTIONS[worldIndex][safeQ];
    return {
      world,
      ...q
    };
  }

  const name = pick(WESTERN_NAMES);
  const diff = world.difficulty;
  const type = pick(world.archetypes);

  let q;
  switch (type) {
    case 'expand_add':  q = genExpand(diff, name); break;
    case 'expand_sub':  q = genExpand(diff, name, { sub: true }); break;
    case 'expand_coef': q = genExpand(diff, name, { coef: true, sub: Math.random() < 0.5 }); break;
    case 'expand_neg':  q = genExpand(diff, name, { neg: true }); break;
    case 'solve_add':   q = genSolve(diff, name); break;
    case 'solve_sub':   q = genSolve(diff, name, { sub: true }); break;
    case 'solve_neg':   q = genSolve(diff, name, { neg: true, sub: Math.random() < 0.5 }); break;
    case 'solve_coef':  q = genSolve(diff, name, { coef: true, sub: Math.random() < 0.4 }); break;
    case 'evaluate':    q = genEvaluate(diff, name); break;
    case 'word_rect':   q = genWordRect(diff, name); break;
    case 'word_packs':  q = genWordPacks(diff, name); break;
    case 'both_sides':  q = genBothSides(diff, name); break;
    case 'bracket_plus':q = genBracketPlus(diff, name); break;
    case 'two_brackets':q = genTwoBrackets(diff, name); break;
    default:            q = genExpand(diff, name);
  }
  return { world, name, ...q };
}
