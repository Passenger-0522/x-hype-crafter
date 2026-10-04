import React, { useState, useRef, useEffect } from 'react';
import { calculateTwitterLength, cleanTwitterPunctuation } from '../services/generatorEngine';
import {
  Copy,
  Check,
  Send,
  Download,
  Edit3,
  CheckCircle2,
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  Share,
  BadgeCheck,
  BarChart2,
  SlidersHorizontal,
  Wand2,
  Dices,
  Clock
} from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export default function TweetCard({
  tweet,
  profile,
  onUpdateContent,
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMetricsEditor, setShowMetricsEditor] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [content, setContent] = useState(tweet.content);

  // 可自定义的推特互动数据
  const [metrics, setMetrics] = useState({
    views: tweet.metrics?.views || '38.2万',
    likes: tweet.metrics?.likes || '3.8k',
    retweets: tweet.metrics?.retweets || '492',
    replies: tweet.metrics?.replies || '128',
    bookmarks: tweet.metrics?.bookmarks || '1.5k',
    time: tweet.metrics?.time || '下午4:20 · 2026年10月4日',
  });

  // 当外部推文更新时同步更新
  useEffect(() => {
    setContent(tweet.content);
    if (tweet.metrics) {
      setMetrics(tweet.metrics);
    }
  }, [tweet]);

  const cardRef = useRef(null);
  const charStats = calculateTwitterLength(content);

  // 一键复制
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // 一键发布到 X (Twitter)
  const handlePostToTwitter = () => {
    const encoded = encodeURIComponent(content);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  };

  // 导出为精美图片（包含自定义的点赞、转推、浏览量）
  const handleExportImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#000000',
      });
      const link = document.createElement('a');
      link.download = `tweet-hype-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 保存文本编辑（并自动执行无句号、无破折号、语气词加感叹号清洗）
  const handleSaveEdit = () => {
    const cleaned = cleanTwitterPunctuation(content);
    setContent(cleaned);
    setIsEditing(false);
    onUpdateContent?.(tweet.id, cleaned);
  };

  // 一键应用网感标点规则
  const handleCleanPunctuation = () => {
    const cleaned = cleanTwitterPunctuation(content);
    setContent(cleaned);
    onUpdateContent?.(tweet.id, cleaned);
  };

  // 预设数据模板
  const applyMetricPreset = (type) => {
    switch (type) {
      case '100k':
        setMetrics({
          views: '12.8万',
          likes: '3,820',
          retweets: '492',
          replies: '128',
          bookmarks: '1.5k',
          time: '下午4:20 · 2026年10月4日',
        });
        break;
      case '1m':
        setMetrics({
          views: '128.5万',
          likes: '2.8万',
          retweets: '4,500',
          replies: '680',
          bookmarks: '8,900',
          time: '下午2:15 · 2026年10月4日',
        });
        break;
      case '10m':
        setMetrics({
          views: '1,280万',
          likes: '18.6万',
          retweets: '3.2万',
          replies: '4,200',
          bookmarks: '5.8万',
          time: '上午10:30 · 2026年10月4日',
        });
        break;
      case 'random':
        const rViews = (Math.random() * 80 + 10).toFixed(1) + '万';
        const rLikes = Math.floor(Math.random() * 8000 + 1200).toLocaleString();
        const rRetweets = Math.floor(Math.random() * 1500 + 200).toLocaleString();
        const rReplies = Math.floor(Math.random() * 300 + 45).toLocaleString();
        const rBookmarks = (Math.random() * 3 + 0.8).toFixed(1) + 'k';
        setMetrics({
          views: rViews,
          likes: rLikes,
          retweets: rRetweets,
          replies: rReplies,
          bookmarks: rBookmarks,
          time: '下午' + Math.floor(Math.random() * 8 + 1) + ':' + Math.floor(Math.random() * 50 + 10) + ' · 2026年10月4日',
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between transition-all hover:border-slate-700/80 group">
      {/* Card Header & Meta */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">
            {tweet.title || '推特爆款变体'}
          </span>
          {tweet.hypeBadge && (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-rose-400 font-medium">
              {tweet.hypeBadge}
            </span>
          )}
        </div>

        {/* Character Progress */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-mono text-[11px] font-semibold ${
              charStats.isOverLimit ? 'text-red-400 font-bold' : 'text-slate-400'
            }`}
          >
            {charStats.weightedCount} / {charStats.maxLimit}
          </span>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                charStats.isOverLimit
                  ? 'bg-red-500'
                  : charStats.percentage > 85
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, charStats.percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Realistic Twitter Post Container (Ref for export) */}
      <div
        ref={cardRef}
        className="bg-black text-white p-5 rounded-xl border border-neutral-800/80 font-sans shadow-inner selection:bg-rose-500 selection:text-white"
      >
        {/* User Info Bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[14px] text-white hover:underline cursor-pointer">
                  {profile.name}
                </span>
                {profile.verified && (
                  <BadgeCheck className="w-4 h-4 text-sky-400 fill-sky-400" />
                )}
              </div>
              <span className="text-neutral-500 text-[13px]">
                {profile.handle} · 刚刚
              </span>
            </div>
          </div>
          <div className="text-neutral-500 hover:text-white cursor-pointer px-2">
            ···
          </div>
        </div>

        {/* Tweet Body Content */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              placeholder="短句换行、无句号、语气词加感叹号..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-[14px] text-white leading-relaxed focus:outline-none focus:border-rose-500 font-sans resize-none"
            />
            <div className="flex justify-between items-center text-[11px] text-neutral-400">
              <span>💡 提示：短句无标点，语气词自动加！，绝不使用句号或破折号</span>
              <button
                type="button"
                onClick={handleCleanPunctuation}
                className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Wand2 className="w-3 h-3" />
                <span>一键规范标点</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[14px] sm:text-[15px] leading-relaxed text-neutral-100 whitespace-pre-wrap font-normal selection:bg-rose-500">
            {content}
          </div>
        )}

        {/* Post Timestamp & Custom Views Counter */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              onClick={() => setShowMetricsEditor(true)}
              title="点击修改发帖时间"
              className="hover:text-neutral-300 hover:underline cursor-pointer transition-colors"
            >
              {metrics.time}
            </span>
            <span className="hidden sm:inline">·</span>
            <span
              onClick={() => setShowMetricsEditor(true)}
              title="点击修改浏览量"
              className="hidden sm:flex items-center gap-1 font-semibold text-neutral-300 hover:text-sky-400 cursor-pointer transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>{metrics.views} 查看</span>
            </span>
          </div>
          <span
            onClick={() => setShowMetricsEditor(true)}
            className="text-[10px] text-neutral-600 hover:text-neutral-400 cursor-pointer"
          >
            ✏️ 修改数据
          </span>
        </div>

        {/* Simulated Twitter Action Counters (Clickable to edit directly!) */}
        <div className="mt-3 pt-3 border-t border-neutral-900 flex items-center justify-between text-neutral-500 text-xs px-1 select-none">
          <div
            onClick={() => setShowMetricsEditor(true)}
            title="点击修改评论数"
            className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer transition-colors group/m"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="group-hover/m:underline">{metrics.replies}</span>
          </div>
          <div
            onClick={() => setShowMetricsEditor(true)}
            title="点击修改转推数"
            className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer transition-colors group/m"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="group-hover/m:underline">{metrics.retweets}</span>
          </div>
          <div
            onClick={() => setShowMetricsEditor(true)}
            title="点击修改点赞数"
            className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer transition-colors group/m"
          >
            <Heart className="w-4 h-4" />
            <span className="group-hover/m:underline">{metrics.likes}</span>
          </div>
          <div
            onClick={() => setShowMetricsEditor(true)}
            title="点击修改收藏数"
            className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer transition-colors group/m"
          >
            <Bookmark className="w-4 h-4" />
            <span className="group-hover/m:underline">{metrics.bookmarks}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer transition-colors">
            <Share className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Customizable Metrics Drawer (点赞/转推/浏览量任意更改) */}
      {showMetricsEditor && (
        <div className="mt-3 p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
              <span>自由修改点赞、转推、浏览量</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyMetricPreset('100k')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
              >
                10万爆款
              </button>
              <button
                type="button"
                onClick={() => applyMetricPreset('1m')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
              >
                百万神推
              </button>
              <button
                type="button"
                onClick={() => applyMetricPreset('10m')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
              >
                千万顶流
              </button>
              <button
                type="button"
                onClick={() => applyMetricPreset('random')}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                title="随机数据"
              >
                <Dices className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">👁️ 浏览量</label>
              <input
                type="text"
                value={metrics.views}
                onChange={(e) => setMetrics({ ...metrics, views: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">❤️ 点赞量</label>
              <input
                type="text"
                value={metrics.likes}
                onChange={(e) => setMetrics({ ...metrics, likes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">🔁 转推量</label>
              <input
                type="text"
                value={metrics.retweets}
                onChange={(e) => setMetrics({ ...metrics, retweets: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">💬 评论量</label>
              <input
                type="text"
                value={metrics.replies}
                onChange={(e) => setMetrics({ ...metrics, replies: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">🔖 收藏量</label>
              <input
                type="text"
                value={metrics.bookmarks}
                onChange={(e) => setMetrics({ ...metrics, bookmarks: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">🕒 发布时间</label>
              <input
                type="text"
                value={metrics.time}
                onChange={(e) => setMetrics({ ...metrics, time: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowMetricsEditor(false)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
            >
              完成修改
            </button>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>保存修改</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑文本</span>
            </button>
          )}

          <button
            onClick={() => setShowMetricsEditor(!showMetricsEditor)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              showMetricsEditor
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>改点赞/浏览量</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? '生成图中...' : '导出长图'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已复制！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一键复制</span>
              </>
            )}
          </button>

          {/* Post to X Button */}
          <button
            onClick={handlePostToTwitter}
            className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>直发推特</span>
          </button>
        </div>
      </div>
    </div>
  );
}
