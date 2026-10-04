import React from 'react';
import { Flame, Sparkles, Settings, FileText, UserCircle, ExternalLink } from 'lucide-react';

export default function Header({
  isAiMode,
  setIsAiMode,
  onOpenSettings,
  onOpenPromptModal,
  onOpenProfileModal,
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-xl select-none">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                X-Hype Crafter
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                  卧槽体
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              推特高网感 · 情绪拉满 · 爆款短推熔炉
            </p>
          </div>
        </div>

        {/* Engine Switch & Tool Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Mode Toggle */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 flex items-center text-xs">
            <button
              onClick={() => setIsAiMode(false)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !isAiMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>内置秒级引擎</span>
            </button>
            <button
              onClick={() => setIsAiMode(true)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                isAiMode
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>AI 大模型强化</span>
            </button>
          </div>

          {/* Prompt Guide Button */}
          <button
            onClick={onOpenPromptModal}
            title="查看与复制爆文提示词"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 hidden md:flex items-center gap-1 text-xs font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>提示词库</span>
          </button>

          {/* Profile Setup Button */}
          <button
            onClick={onOpenProfileModal}
            title="自定义推特预览账号"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <UserCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="配置 API Key"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
