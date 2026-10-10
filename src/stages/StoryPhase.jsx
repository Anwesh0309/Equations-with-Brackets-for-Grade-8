import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

const STORY_SLIDES = [
  {
    id: 1,
    title: "Equations: A Perfectly Balanced Scale",
    audioKey: "story_1",
    image: "/assets/images/slide1.png",
    body: "An equation is like a balance scale. The left side and the right side must always be equal. So whatever we do to one side, we must do to the other side too!",
    quote: "Equation = two sides that are equal (=)",
    bubble: "Keep the scale balanced and the secret number will appear!"
  },
  {
    id: 2,
    title: "What Do Brackets Mean?",
    audioKey: "story_2",
    image: "/assets/images/slide2.png",
    body: "Brackets group things together. In 3(x + 4), the bracket holds x + 4, and the 3 outside tells us we have three whole groups of it.",
    quote: "3(x + 4) = (x + 4) + (x + 4) + (x + 4)",
    bubble: "Think of a bracket as a gift bag — the number outside counts the bags!"
  },
  {
    id: 3,
    title: "The Distributive Law: Share With Everyone",
    audioKey: "story_3",
    image: "/assets/images/slide3.png",
    body: "To expand a bracket, multiply the number outside by EVERY term inside. So 3(x + 4) becomes 3 × x + 3 × 4, which is 3x + 12.",
    quote: "a(b + c) = ab + ac",
    bubble: "Everyone inside the bag gets a gift from the number outside!"
  },
  {
    id: 4,
    title: "Careful With Minus Signs",
    audioKey: "story_4",
    image: "/assets/images/slide4.png",
    body: "Signs travel with the numbers! 2(x − 5) = 2x − 10. And when the number outside is negative, every sign inside flips: −3(x − 2) = −3x + 6.",
    quote: "Negative × Negative = Positive",
    bubble: "Watch the signs — they are sneaky little tricksters!"
  },
  {
    id: 5,
    title: "Solving Method 1: Expand First",
    audioKey: "story_5",
    image: "/assets/images/slide5.png",
    body: "Expand the bracket, subtract 12 from both sides, then divide both sides by 3. For 3(x + 4) = 27 we get 3x + 12 = 27, then 3x = 15, so x = 5.",
    quote: "3(x+4) = 27  →  3x+12 = 27  →  3x = 15  →  x = 5",
    bubble: "Expand first, then peel away the numbers one by one!"
  },
  {
    id: 6,
    title: "Solving Method 2: Divide First",
    audioKey: "story_6",
    image: "/assets/images/slide6.png",
    body: "If the number outside divides the other side exactly, divide both sides by it and keep the bracket as one block. 3(x + 4) = 27 becomes x + 4 = 9, so x = 5.",
    quote: "3(x+4) = 27  →  x+4 = 9  →  x = 5",
    bubble: "A handy shortcut — divide by the outside number first!"
  },
  {
    id: 7,
    title: "Real World Magic: Equal Savings",
    audioKey: "story_7",
    image: "/assets/images/slide7.png",
    body: "Mia has 2 bags with x + 3 coins in each. Noah has one bag of x coins plus 10 extra. Equal totals: 2(x + 3) = x + 10, so 2x + 6 = x + 10 and x = 4. Always check by substituting!",
    quote: "Check: 2(4 + 3) = 14 and 4 + 10 = 14 ✓",
    bubble: "Put your answer back into the equation to be 100% sure!"
  },
  {
    id: 8,
    title: "Step Into the Simulation Lab!",
    audioKey: "story_8",
    image: "/assets/images/slide8.png",
    body: "Awesome job! You've learned how brackets, expanding, and balancing work together. Now step into the lab to open gift bags, fix mistakes, and crack mystery number puzzles!",
    quote: "Ready to test your bracket-busting skills?",
    bubble: "Click below to enter the interactive lab!"
  }
];

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  // Report slide progress to the top nav (only when the slide changes)
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(slideIdx + 1, STORY_SLIDES.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIdx]);

  // Narrate the current slide (restarts only when the slide or mute state changes)
  useEffect(() => {
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Story Card with Maximum Grade 4 Visual Legibility & Scaled Image */}
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Extra Large Image Illustration */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 h-80 sm:h-[420px] md:h-[450px] w-full bg-black/40 flex items-center justify-center shrink-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column: Extra Large Typography & Callout Pills */}
        <div className="flex flex-col items-start text-left justify-center gap-4.5 overflow-y-auto max-h-full py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-xl sm:text-2xl leading-relaxed font-extrabold drop-shadow-sm">
            {slide.body}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-2xl px-6 py-3.5 text-center text-amber-300 font-display font-900 text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg">
            <span className="shrink-0 text-2xl">✨</span>
            <span className="leading-snug">"{slide.quote}"</span>
            <span className="shrink-0 text-2xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-4 w-full mt-1">
            <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-4xl shadow-lg shrink-0">
              🦁
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-7 py-3.5 font-display font-900 text-lg sm:text-xl shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-3 z-20 shrink-0">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-xl sm:text-2xl px-10 py-4 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-3.5">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-4.5 h-4.5 bg-amber-400 shadow-[0_0_18px_rgba(250,204,21,0.9)]'
                  : 'w-3.5 h-3.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xl sm:text-2xl px-11 py-4 font-900 flex items-center gap-2 shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
