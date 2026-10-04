import React from 'react';
import { HYPE_LEVELS } from '../data/buzzwords';
import { Flame, Zap, ShieldAlert, HeartCrack, Sparkles } from 'lucide-react';

export default function HypeSlider({ currentLevel, onChange }) {
  const currentConfig = HYPE_LEVELS.find((h) => h.level === currentLevel) || HYPE_LEVELS[2];

  const getIcon = (level) => {
    switch (level) {
      case 1:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 2:
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 3:
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 4:
        return <Flame className="w-4 h-4 text-rose-500 animate-bounce" />;
      case 5:
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${currentConfig.color} pointer-events-none transition-all duration-500`}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">
            激动度 & 卧槽指数
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
            {getIcon(currentLevel)}
            <span>Lv.{currentLevel} {currentConfig.name}</span>
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-rose-400 tracking-wider">
          {currentConfig.intensityWord}
        </span>
      </div>

      {/* Slider input */}
      <div className="relative py-2">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentLevel}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
        />

        {/* Step Ticks */}
        <div className="flex justify-between text-[11px] font-medium text-slate-500 mt-2 px-1">
          {HYPE_LEVELS.map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => onChange(item.level)}
              className={`transition-colors text-left flex flex-col items-center ${
                currentLevel === item.level
                  ? 'text-rose-400 font-bold scale-105'
                  : 'hover:text-slate-300'
              }`}
            >
              <span>{item.level}</span>
              <span className="text-[10px] hidden sm:inline">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description & Representative words */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-slate-400">
          <strong className="text-slate-200">{currentConfig.badge}：</strong>
          {currentConfig.desc}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-slate-500 text-[10px]">典型口头禅:</span>
          {currentConfig.shockPhrases.slice(0, 3).map((phrase, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]"
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
