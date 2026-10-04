import { cleanTwitterPunctuation } from './generatorEngine';

/**
 * 推特爆款写作专家 Prompt 模板系统 & LLM API 联动服务
 */

export const DEFAULT_AI_SETTINGS = {
  endpoint: 'https://api.deepseek.com/v1',
  apiKey: '',
  model: 'deepseek-chat',
};

export const TWITTER_MASTER_PROMPT = `你是一名拥有 50 万粉丝的推特/X 科技与商业顶级 KOL（毒舌极客 + 爆款制造机）。
你的推特风格特点：
1. 【极强网感】：排版极度舒适，短句、换行留白充足，绝对不要出现任何 AI 味、公文味、知乎大长段。
2. 【标点符号铁律】：
   - 绝对不要出现任何句号（。）和破折号（——、—）！
   - 几个字的短句直接换行留白，末尾不需要任何标点符号！
   - 语气词与惊叹情绪词（如我操、卧槽、离谱、跪了、神了）末尾必须加感叹号（！）！
3. 【情绪拉满与口语化】：情绪激动、毫不遮掩，擅长使用推特野生口头禅，如“我操！”、“卧槽直接看傻了！”、“这特么太绝了！”、“头皮发麻！”、“纯纯降维打击！”、“把底裤都扒光了！”。
4. 【结构扎心】：
   - 第一句：黄金 Hook，制造认知颠覆、极大悬念或震惊体。
   - 中间：2-3 点极其精辟的短句对比或洞察，直击痛点。
   - 结尾：一句极具互动欲的 CTA（如“建议先存防和谐”、“你怎么看？评论区告诉我”）。
5. 【字数严格把控】：单条推文必须适合推特阅读，控制在 100~140 个中文字符左右，紧凑有力。`;

export function buildPromptForTopic({
  topic,
  hypeLevel = 3,
  style = 'wocao_shock',
  customInstruction = '',
}) {
  const hypeDescriptions = {
    1: '理智克制，带有一丝高冷与敏锐洞察',
    2: '推特专业 KOL，信息量密集，洞察毒辣',
    3: '情绪激动！必须大量使用“我操！”、“卧槽！”、“真特么神了”，头皮发麻，见证历史！',
    4: '疯狗式狂暴吹爆/震惊！必须多处带“我操我操我操”、“连夜把键盘敲烂”、“友商今晚集体上天台”！情绪达到顶峰！',
    5: '辛辣毒舌嘴替！毫不留情狂喷，嘲讽拉满，必须包含“笑死”、“纯纯大冤种”、“智商税”！',
  };

  const styleNames = {
    wocao_shock: '卧槽震撼流（见证历史、震惊破防）',
    contrarian: '暴论颠覆流（反常识、99%的人认知都是错的）',
    roast_meme: '辛辣嘴替流（吃瓜嘲讽、撕开底裤）',
    curation_alpha: '干货清单流（信息差拆解、建议先存防和谐）',
    degen_fomo: '暴富FOMO流（普通人最后窗口期、闭眼冲）',
    minimal_stab: '极简一击流（字少事大、单句暴击）',
  };

  return `${TWITTER_MASTER_PROMPT}

【本次任务指令】：
用户给出的主题/素材为：「${topic}」
选定流派风格：【${styleNames[style] || '卧槽震撼流'}】
情绪/激动度级别：【${hypeLevel} 级 - ${hypeDescriptions[hypeLevel] || '情绪饱满'}】
${customInstruction ? `额外补充要求：${customInstruction}` : ''}

请为该主题立刻生成 3 条不同切入点的推特网感爆文：
- 条目 1：爆裂第一反应（第一视角体验）
- 条目 2：痛击灵魂反差（认知暴击与反向思考）
- 条目 3：极度辛辣锐评（行动呼吁或未来预警）

输出格式必须为标准 JSON 格式，如下所示，不要包含 Markdown 代码块外的任何额外废话：
{
  "tweets": [
    {
      "title": "视角 A · 爆裂第一反应",
      "content": "这里是推文内容..."
    },
    {
      "title": "视角 B · 痛击灵魂反差",
      "content": "这里是推文内容..."
    },
    {
      "title": "视角 C · 极度辛辣锐评",
      "content": "这里是推文内容..."
    }
  ]
}`;
}

/**
 * 真实调用 OpenAI 兼容 API
 */
export async function generateTweetsWithAI({
  topic,
  hypeLevel,
  style,
  customInstruction,
  settings = {},
}) {
  const endpoint = (settings.endpoint || 'https://api.deepseek.com/v1').replace(/\/+$/, '');
  const apiKey = settings.apiKey;
  const model = settings.model || 'deepseek-chat';

  if (!apiKey) {
    throw new Error('未检测到 API Key，请点击右上角「设置」配置你的 API 密钥，或直接使用内置本地引擎生成！');
  }

  const prompt = buildPromptForTopic({ topic, hypeLevel, style, customInstruction });

  const response = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: TWITTER_MASTER_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content || '';

  // 尝试解析 JSON
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.tweets)) {
        return parsed.tweets.map((t, idx) => ({
          id: `ai-tweet-${Date.now()}-${idx}`,
          title: t.title || `AI 视角 ${idx + 1}`,
          content: cleanTwitterPunctuation(t.content),
          hypeName: 'AI 深度网感',
          hypeBadge: '🤖 智能生成',
          metrics: {
            views: '25.6万',
            likes: '6,400',
            retweets: '1,280',
            replies: '290',
            bookmarks: '3,200',
            time: '下午4:20 · 2026年10月4日',
          },
        }));
      }
    }
  } catch (err) {
    console.warn('JSON parsing failed, falling back to plaintext split', err);
  }

  // 兜底纯文本切分
  return [
    {
      id: `ai-tweet-${Date.now()}-1`,
      title: 'AI 爆款直推',
      content: cleanTwitterPunctuation(rawContent.replace(/```json|```/g, '').trim()),
      hypeName: 'AI 深度网感',
      hypeBadge: '🤖 智能生成',
      metrics: {
        views: '18.2万',
        likes: '4,200',
        retweets: '850',
        replies: '160',
        bookmarks: '2,100',
        time: '下午4:20 · 2026年10月4日',
      },
    },
  ];
}
