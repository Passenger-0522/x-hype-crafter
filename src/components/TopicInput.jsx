import React from 'react';
import { QUICK_TOPIC_PRESETS } from '../data/buzzwords';
import { Sparkles, Dices, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function TopicInput({
  topic,
  setTopic,
  onSubmit,
  isGenerating,
  includeEmoji,
  setIncludeEmoji,
  includeCTA,
  setIncludeCTA,
  includeThreadHook,
  setIncludeThreadHook,
  isAiMode,
}) {
  const handleRandomPreset = () => {
    const randomIndex = Math.floor(Math.random() * QUICK_TOPIC_PRESETS.length);
    setTopic(QUICK_TOPIC_PRESETS[randomIndex].topic);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Label and Quick presets */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <span>输入素材 / 想要吐槽或吹爆的观点</span>
          <span className="text-xs text-rose-400 font-normal">*粗糙点没关系</span>
        </label>
        <button
          type="button"
          onClick={handleRandomPreset}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Dices className="w-3.5 h-3.5" />
          <span>换个随机灵感素材</span>
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：刚才试了最新的开源大模型，写代码速度直接碾压全场，完全不需要用昂贵闭源模型了…… 或者直接吐槽某件事！"
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
        />
        {topic && (
          <button
            type="button"
            onClick={() => setTopic('')}
            className="absolute top-3 right-3 text-xs text-slate-500 hover:text-slate-300 px-1.5 py-0.5 rounded bg-slate-800/80"
          >
            清空
          </button>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] text-slate-500 shrink-0">热门案例:</span>
        {QUICK_TOPIC_PRESETS.slice(0, 4).map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTopic(p.topic)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[11px] shrink-0 border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Engine Status Note */}
      <div className="text-[11px] text-emerald-400/90 flex items-center gap-1.5 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          {isAiMode
            ? '当前为「AI 大模型强化」模式（需在右上角设置配置 API Key）'
            : '当前为「内置离线引擎」：无需任何 API Key，输入素材直接点击生成，每次点击都会随机生成全新变体！'}
        </span>
      </div>

      {/* Switch options */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
            <input
              type="checkbox"
              checked={includeEmoji}
              onChange={(e) => setIncludeEmoji(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>丰富推特 Emoji 标点</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
            <input
              type="checkbox"
              checked={includeCTA}
              onChange={(e) => setIncludeCTA(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>爆款互动转化 CTA 结尾</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none hidden sm:flex">
            <input
              type="checkbox"
              checked={includeThreadHook}
              onChange={(e) => setIncludeThreadHook(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>🧵 Thread 连击模式</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isGenerating}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            isAiMode
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white shadow-indigo-500/20'
              : 'bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white shadow-rose-500/25'
          } ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>正在注入网感与情绪...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isAiMode ? 'AI 深度生成爆款' : '⚡️ 立即生成（无需 API Key）'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
