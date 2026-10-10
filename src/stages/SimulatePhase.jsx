import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';
import { GiftBags, GardenArea, SignFlip } from './stations/Station1.jsx';
import { BalanceMoves, MistakeDetective, StepSorter } from './stations/Station2.jsx';
import { MysteryMachine, PerimeterPuzzle, EqualSavings } from './stations/Station3.jsx';

// 3 Brand-new Interactive Activities per Station (Grade 8: Equations with Brackets)
const STATION_ACTIVITIES = {
  1: [
    {
      id: 1,
      title: "Activity 1: Birthday Favor Packs",
      desc: "Leo packs identical gift bags for classmates. Each bag holds 1 mystery badge (x) and golden chocolate coins (c). Untie the ribbons, open the bags, and pool the items to discover how brackets expand in real life!",
      icon: "🎁",
      Comp: GiftBags
    },
    {
      id: 2,
      title: "Activity 2: School Eco-Garden Plots",
      desc: "Mia and Noah are laying out a community raised garden bed of length n meters and width (x ± b) meters. Adjust dimensions, switch between flower borders and stone walkways, and split the plots to calculate areas!",
      icon: "🌱",
      Comp: GardenArea
    },
    {
      id: 3,
      title: "Activity 3: Store & Lab Sign Detective",
      desc: "Explore real-world penalty fee waivers, winter chiller drops, and shield buffs. Tap each term to multiply by outside numbers and see why negative × negative flips into positive savings!",
      icon: "🕵️",
      Comp: SignFlip
    }
  ],
  2: [
    {
      id: 1,
      title: "Activity 1: Farmer's Market Apple Scale",
      desc: "Mia balances 2 crates of apples (x kg) plus 3 kg of bonus pears against 16 kg on an antique market scale: 2(x + 3) = 16. Choose Method 1 (Expand First) or Method 2 (Divide First) — make sure the scale stays balanced!",
      icon: "⚖️",
      Comp: BalanceMoves
    },
    {
      id: 2,
      title: "Activity 2: Peer Review: Science Fair Budget",
      desc: "Sam calculated the budget for 3 robotics kits at $(x − 2) each: 3(x − 2) = $21, but made a mistake on his homework sheet. Inspect the notebook lines, spot the error, and fix the algebra!",
      icon: "📓",
      Comp: MistakeDetective
    },
    {
      id: 3,
      title: "Activity 3: Rover Thermal Calibration",
      desc: "Calibrate the STEM Club delivery rover's thermal sensor formula: −2(x − 3) = 10. Tap the diagnostic moves in the correct logical sequence from expansion to flight check verification!",
      icon: "🤖",
      Comp: StepSorter
    }
  ],
  3: [
    {
      id: 1,
      title: "Activity 1: Arcade Mystery Ticket Machine",
      desc: "Insert secret tokens (x), receive +5 lucky bonus tokens, then hit the 4× prize multiplier to win 36 tickets! Pull the lever or use the 'Work Backwards' superpower to find the starting token count!",
      icon: "🕹️",
      Comp: MysteryMachine
    },
    {
      id: 2,
      title: "Activity 2: Sports Court Perimeter Fencing",
      desc: "The school groundskeeper has 32 meters of fence to enclose a court of width x meters and length (x + 4) meters: 2(2x + 4) = 32 m. Adjust court dimensions, test fence fit, and solve for x!",
      icon: "🏀",
      Comp: PerimeterPuzzle
    },
    {
      id: 3,
      title: "Activity 3: Charity Bake Sale Jars",
      desc: "Mia sells 3 cookie packs with $2 charity pins: 3(x + 2). Noah sells 2 cake tins with $5 donation mugs: 2(x + 5). Their charity totals match! Compare the donation jars and solve for the price of x!",
      icon: "🧁",
      Comp: EqualSavings
    }
  ]
};

const STATION_TABS = [
  { n: 1, icon: "🎁", title: "Station 1: Bracket Breaker", sub: "Open, split & flip brackets" },
  { n: 2, icon: "⚖️", title: "Station 2: Balance Builder", sub: "Solve it your own way" },
  { n: 3, icon: "🧩", title: "Station 3: Challenge Arena", sub: "Work backwards & check" }
];

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  const currentActivity = STATION_ACTIVITIES[station][actIdx];
  const ActivityComp = currentActivity.Comp;

  // Narrate activity guide narration whenever station or activity changes (with overlap cleanup)
  useEffect(() => {
    const actKey = `sim_${station}_act_${actIdx + 1}`;
    const stationKey = `sim_${station}`;
    const audioData = AUDIO_MAP[actKey] || AUDIO_MAP[stationKey];
    if (audioData) narrate(audioData, !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const nextActivity = () => {
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-3 relative overflow-hidden select-none z-10 w-full">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="w-full max-w-7xl h-full max-h-[calc(100vh-3.8rem)] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 md:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 overflow-hidden">
        
        {/* Compact Slim Top Bar for Laptops */}
        <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-purple-400/25 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🧪</span>
            <div>
              <h2 className="font-display font-900 text-lg sm:text-xl md:text-2xl text-white leading-tight">
                Simulation Stations
              </h2>
              <span className="text-xs sm:text-sm font-extrabold text-cyan-300">
                Interactive Real-World Laboratories · Grade 7/8
              </span>
            </div>
          </div>
          <div className="w-16 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.85)]" />
        </div>

        {/* 2-Column Responsive Flex Layout (Optimized for Laptops) */}
        <div className="flex flex-col md:flex-row gap-3 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="w-full md:w-64 lg:w-72 flex flex-col justify-between gap-2 shrink-0 overflow-hidden">
            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar">
              {STATION_TABS.map(t => (
                <button
                  key={t.n}
                  onClick={() => {
                    setStation(t.n);
                    setActIdx(0);
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === t.n
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_18px_rgba(56,189,248,0.4)] scale-[1.01]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold shrink-0 ${
                      station === t.n ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-xs sm:text-sm leading-tight text-white">{t.title}</p>
                      <p className="text-xs font-bold text-slate-300 mt-0.5">{t.sub}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm">🔓</span>
                </button>
              ))}
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-xs sm:text-sm py-2 px-3 shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-102 transition w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Box */}
          <div className="flex-1 min-w-0 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex flex-col justify-between shadow-inner min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/15 pb-1.5 mb-1.5 shrink-0">
                <h3 className="font-display font-900 text-base sm:text-lg md:text-xl text-cyan-300 flex items-center gap-2">
                  <span className="text-lg sm:text-xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-xs text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-slate-200 text-xs sm:text-sm leading-snug font-bold mb-1.5 shrink-0">
                {currentActivity.desc}
              </p>

              {/* Activity body */}
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <ActivityComp key={`${station}-${actIdx}`} muted={muted} />
              </div>
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 mt-1.5 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-xs sm:text-sm font-900 px-5 sm:px-6 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
