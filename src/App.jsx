import React, { useState } from 'react';
import Header from './components/Header';
import HypeSlider from './components/HypeSlider';
import StyleSelector from './components/StyleSelector';
import TopicInput from './components/TopicInput';
import BuzzwordTray from './components/BuzzwordTray';
import TweetCard from './components/TweetCard';
import SettingsModal from './components/SettingsModal';
import PromptModal from './components/PromptModal';
import ProfileModal from './components/ProfileModal';
import { generateTweetsLocally } from './services/generatorEngine';
import { generateTweetsWithAI, DEFAULT_AI_SETTINGS } from './services/aiService';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

const DEFAULT_PROFILE = {
  name: '野生极客 · 卧槽老KOL',
  handle: '@HypeTweetMaster',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  verified: true,
};

export default function App() {
  const [topic, setTopic] = useState('刚刚试了最新的开源大模型，写代码速度直接碾压全场，完全不需要用昂贵闭源模型了');
  const [hypeLevel, setHypeLevel] = useState(3); // 默认 3: 卧槽狂暴
  const [style, setStyle] = useState('wocao_shock');
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [includeThreadHook, setIncludeThreadHook] = useState(false);

  const [isAiMode, setIsAiMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Settings & Profile in localStorage
  const [aiSettings, setAiSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('x_hype_ai_settings');
      return saved ? JSON.parse(saved) : DEFAULT_AI_SETTINGS;
    } catch {
      return DEFAULT_AI_SETTINGS;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('x_hype_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Generated Tweets State (Initial load generates instantly with strict punctuation)
  const [tweets, setTweets] = useState(() => {
    return generateTweetsLocally({
      topic: '刚刚试了最新的开源大模型，写代码速度直接碾压全场，完全不需要用昂贵闭源模型了',
      hypeLevel: 3,
      style: 'wocao_shock',
      includeEmoji: true,
      includeCTA: true,
      includeThreadHook: false,
    });
  });

  const handleSaveSettings = (newSettings) => {
    setAiSettings(newSettings);
    localStorage.setItem('x_hype_ai_settings', JSON.stringify(newSettings));
  };

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('x_hype_profile', JSON.stringify(newProfile));
  };

  // 插入关键词到输入框
  const handleInsertWord = (word) => {
    setTopic((prev) => (prev ? `${prev} ${word}` : word));
  };

  // 生成推文核心逻辑
  const handleGenerate = async () => {
    setErrorMsg('');
    setToastMsg('');
    setIsGenerating(true);

    try {
      if (isAiMode) {
        // AI 增强模式
        const results = await generateTweetsWithAI({
          topic,
          hypeLevel,
          style,
          settings: aiSettings,
        });
        setTweets(results);
        setToastMsg('🎉 AI 深度生成成功！已严格清洗标点（无句号无破折号、短句无标点、语气词感叹号）');
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        // 本地离线引擎（无需 API Key）
        setTimeout(() => {
          const results = generateTweetsLocally({
            topic,
            hypeLevel,
            style,
            includeEmoji,
            includeCTA,
            includeThreadHook,
          });
          setTweets(results);
          setIsGenerating(false);
          setToastMsg('🎉 成功生成 3 条全新网感短推！（无需 API Key，标点规则已严格执行）');
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          setTimeout(() => setToastMsg(''), 4000);
        }, 150);
        return;
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || '生成失败，请检查网络或配置');
    } finally {
      if (isAiMode) {
        setIsGenerating(false);
      }
    }
  };

  const handleSwitchToLocalAndGenerate = () => {
    setIsAiMode(false);
    setErrorMsg('');
    setTimeout(() => {
      const results = generateTweetsLocally({
        topic,
        hypeLevel,
        style,
        includeEmoji,
        includeCTA,
        includeThreadHook,
      });
      setTweets(results);
      setToastMsg('⚡️ 已自动切换为【免 API Key 本地引擎】并生成完毕！');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setToastMsg(''), 4000);
    }, 100);
  };

  const handleUpdateTweetContent = (id, newContent) => {
    setTweets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: newContent } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] bg-grid-pattern text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        isAiMode={isAiMode}
        setIsAiMode={setIsAiMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold animate-fire">
            <Flame className="w-3.5 h-3.5" />
            <span>推特流量密码 · 卧槽体爆发器</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            专写<span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">推特短推</span>的网感制造机
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            拒绝温吞说教，一键把平淡素材锻造成情绪炸裂、短句留白、充满「我操！直接跪了」的推特爆款推文。
          </p>
        </section>

        {/* Success Toast */}
        {toastMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMsg}</span>
          </div>
        )}

        {/* Error Notification with 1-click fallback */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSwitchToLocalAndGenerate}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                ⚡️ 一键切换免 Key 离线生成
              </button>
              {errorMsg.includes('API Key') && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  前往配置
                </button>
              )}
            </div>
          </div>
        )}

        {/* Core Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input, Hype, & Styles (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Hype Level Slider */}
            <HypeSlider currentLevel={hypeLevel} onChange={setHypeLevel} />

            {/* Style Selector */}
            <StyleSelector currentStyle={style} onSelectStyle={setStyle} />

            {/* Buzzword insertion tray */}
            <BuzzwordTray onInsertWord={handleInsertWord} />
          </div>

          {/* Right: Topic Box & Output Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Topic Input Box */}
            <TopicInput
              topic={topic}
              setTopic={setTopic}
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
              includeEmoji={includeEmoji}
              setIncludeEmoji={setIncludeEmoji}
              includeCTA={includeCTA}
              setIncludeCTA={setIncludeCTA}
              includeThreadHook={includeThreadHook}
              setIncludeThreadHook={setIncludeThreadHook}
              isAiMode={isAiMode}
            />

            {/* Generated Results Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <h2 className="text-base font-bold text-white">
                    推特爆款生成结果 ({tweets.length} 条变体)
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>再换一批全新变体</span>
                  </button>
                </div>
              </div>

              {/* Tweet Cards Grid */}
              <div className="space-y-6">
                {tweets.map((t) => (
                  <TweetCard
                    key={t.id}
                    tweet={t}
                    profile={profile}
                    onUpdateContent={handleUpdateTweetContent}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <span>X-Hype Crafter · 推特卧槽体生成神器</span>
          <span>·</span>
          <span>短句留白 · 无句号无破折号 · 语气词感叹号</span>
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={aiSettings}
        onSaveSettings={handleSaveSettings}
      />

      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
