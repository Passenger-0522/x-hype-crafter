import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { TWITTER_MASTER_PROMPT } from '../services/aiService';

export default function PromptModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(TWITTER_MASTER_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">推特顶级爆款 Master Prompt</h3>
            <p className="text-xs text-slate-400">
              专为推特网感打磨的系统提示词，可直接复制到 ChatGPT / Claude / DeepSeek 网页端使用
            </p>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {TWITTER_MASTER_PROMPT}
          </pre>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            💡 提示：在网页端和大模型对话时，贴入此提示词，附上你的素材即可！
          </span>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制提示词！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>一键复制 Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
