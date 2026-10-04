import React, { useState } from 'react';
import { X, UserCircle, BadgeCheck, Check } from 'lucide-react';

export default function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) {
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <UserCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">推特拟真卡片设置</h3>
            <p className="text-xs text-slate-400">
              用于生成可导出的真实推特截图
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              昵称 (Display Name)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              推特账号 (Handle)
            </label>
            <input
              type="text"
              value={formData.handle}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              头像图片 URL
            </label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-rose-500 text-xs"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) =>
                  setFormData({ ...formData, verified: e.target.checked })
                }
                className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
              />
              <span className="flex items-center gap-1 font-medium">
                显示蓝V官方认证标
                <BadgeCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 shadow-lg shadow-rose-600/20"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已保存</span>
                </>
              ) : (
                <span>保存</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
