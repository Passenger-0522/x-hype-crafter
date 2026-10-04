import React, { useState } from 'react';
import { BUZZWORD_CHIPS } from '../data/buzzwords';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function BuzzwordTray({ onInsertWord }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>推特爆款连招词库（点击直接插入）</span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
        <span className="text-[11px] text-slate-500">网感词汇库</span>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-800/60">
          {BUZZWORD_CHIPS.map((cat, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium mr-1 select-none">
                {cat.category}:
              </span>
              {cat.words.map((word, wIdx) => (
                <button
                  key={wIdx}
                  type="button"
                  onClick={() => onInsertWord(word)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 text-[11px] transition-all hover:scale-105 active:scale-95"
                >
                  +{word}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
