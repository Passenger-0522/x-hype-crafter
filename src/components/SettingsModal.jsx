import React, { useState } from 'react';
import { X, Key, Globe, Cpu, Check, AlertCircle } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) {
  const [formData, setFormData] = useState({
    endpoint: settings.endpoint || 'https://api.deepseek.com/v1',
    apiKey: settings.apiKey || '',
    model: settings.model || 'deepseek-chat',
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">大模型 API 设置</h3>
            <p className="text-xs text-slate-400">
              兼容 OpenAI、DeepSeek、Moonshot、Ollama 等接口
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>API Base URL</span>
            </label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) =>
                setFormData({ ...formData, endpoint: e.target.value })
              }
              placeholder="https://api.deepseek.com/v1"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              默认使用 DeepSeek 极速 API，也支持填入中转或本地 Ollama 地址
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>API Key</span>
            </label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) =>
                setFormData({ ...formData, apiKey: e.target.value })
              }
              placeholder="sk-..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              密钥仅安全保存在你的本地浏览器缓存中，不会被上传到任何第三方服务器
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Model 模型名称</span>
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              placeholder="deepseek-chat 或 gpt-4o-mini"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>已保存！</span>
                </>
              ) : (
                <span>保存设置</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
