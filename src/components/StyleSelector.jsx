import React from 'react';
import { STYLES } from '../data/buzzwords';
import { Sparkles, Flame, Smile, ListFilter, TrendingUp, Zap } from 'lucide-react';

const ICON_MAP = {
  Sparkles: Sparkles,
  Flame: Flame,
  Smile: Smile,
  ListFilter: ListFilter,
  TrendingUp: TrendingUp,
  Zap: Zap,
};

export default function StyleSelector({ currentStyle, onSelectStyle }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          爆款流派风格
        </label>
        <span className="text-xs text-slate-500">6 种推特成熟模型</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {STYLES.map((style) => {
          const isSelected = currentStyle === style.id;
          const IconComponent = ICON_MAP[style.icon] || Sparkles;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-500/10 border-rose-500/80 shadow-md shadow-rose-500/10'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {style.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                {style.desc}
              </p>

              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-bl-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
