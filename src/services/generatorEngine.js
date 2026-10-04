import { HYPE_LEVELS } from '../data/buzzwords';

/**
 * 专为推特网感定制的标点符号清洗器：
 * 1. 绝对不要有句号（。）或者破折号（——、—）
 * 2. 几个字的短句直接换行留白，不要任何标点符号
 * 3. 语气词与惊叹情绪词（我操、卧槽、离谱、跪了）必须加感叹号（！）
 */
export function cleanTwitterPunctuation(text = '') {
  if (!text) return '';

  // 1. 移除所有句号（。）
  let cleaned = text.replace(/。/g, '');

  // 2. 移除所有破折号（——、—、--）
  cleaned = cleaned.replace(/——+/g, '\n');
  cleaned = cleaned.replace(/—+/g, ' ');
  cleaned = cleaned.replace(/--+/g, ' ');

  // 3. 将英文句号（非小数点的）清除
  cleaned = cleaned.replace(/(?<!\d)\.(?!\d)/g, '');

  // 4. 处理每一行
  const lines = cleaned.split('\n');
  const processedLines = lines.map((line) => {
    let trimmed = line.trim();
    if (!trimmed) return '';

    // 针对语气词/感叹词，确保有感叹号
    const shockKeywords = [
      '我操', '卧槽', '真特么离谱', '太离谱了', '直接看傻了',
      '直接跪了', '真特么神了', '头皮发麻', '彻底疯了', '纯纯降维打击',
      '笑死我了', '我特么真是服了', '纯纯智商税', '大冤种', '见证历史'
    ];

    for (const kw of shockKeywords) {
      if (trimmed === kw || trimmed === `🤯 ${kw}` || trimmed === `💥 ${kw}` || trimmed === `🍿 ${kw}`) {
        return trimmed.endsWith('！') || trimmed.endsWith('!') ? trimmed : `${trimmed}！`;
      }
    }

    // 如果该行字数较短（几个字，比如小于等于 14 个字符），去除末尾逗号、句号、冒号等，保持干净留白
    if (trimmed.length <= 14) {
      // 只要不是已经以 ！或 ? 结尾的情绪问号，就剥除结尾标点
      if (!/[！!？?]/.test(trimmed.slice(-1))) {
        trimmed = trimmed.replace(/[，,：:、；;]+$/, '');
      }
    } else {
      // 较长的句子末尾也不要逗号或句号
      trimmed = trimmed.replace(/[，,。.]+$/, '');
    }

    return trimmed;
  });

  return processedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * 随机获取数组元素
 */
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 核心本地生成引擎：根据主题、激动度、流派风格与高级选项，即时生成 3 条不同切入点的推特网感爆文
 * 每次生成都会加入丰富的随机池，保证每次点击都有全新推文变体
 */
export function generateTweetsLocally({
  topic = '',
  hypeLevel = 3, // 1 ~ 5
  style = 'wocao_shock',
  includeEmoji = true,
  includeCTA = true,
  includeThreadHook = false,
}) {
  const cleanTopic = topic.trim() || '某项最新颠覆性技术刚发布，性能直接把全行业掀桌了';
  const hypeConfig = HYPE_LEVELS.find((h) => h.level === hypeLevel) || HYPE_LEVELS[2];

  // 语气词池（严格带感叹号！）
  const shockOpeners = {
    1: [
      '有点意思',
      '讲真，确实超出预期',
      '这个突破值得关注',
      '很多人可能没注意到的细节',
    ],
    2: [
      '时代真的变了',
      '很多人可能还没意识到这意味着什么',
      '这个迭代太关键了',
      '不得不说确实有点东西',
    ],
    3: [
      includeEmoji ? '🤯 我操！刚测试完直接看傻了！' : '我操！刚测试完直接看傻了！',
      includeEmoji ? '卧槽！头皮发麻了兄弟们！' : '卧槽！头皮发麻了兄弟们！',
      includeEmoji ? '真特么离谱！这完全是降维打击！' : '真特么离谱！这完全是降维打击！',
      includeEmoji ? '我操！手抖着发这条推！' : '我操！手抖着发这条推！',
    ],
    4: [
      includeEmoji ? '💥 我操我操我操！！！' : '我操我操我操！！！',
      includeEmoji ? '我特么连夜把键盘敲烂了！' : '我特么连夜把键盘敲烂了！',
      includeEmoji ? '友商今晚集体爬上天台！这特么完全疯了！' : '友商今晚集体爬上天台！这特么完全疯了！',
      includeEmoji ? '这特么是碳基生物能做出来的东西？！' : '这特么是碳基生物能做出来的东西？！',
    ],
    5: [
      includeEmoji ? '🍿 笑死我了！我特么真是服了！' : '笑死我了！我特么真是服了！',
      includeEmoji ? '底裤都被扒光了！还在装！' : '底裤都被扒光了！还在装！',
      includeEmoji ? '纯纯智商税大冤种！谁买谁倒霉！' : '纯纯智商税大冤种！谁买谁倒霉！',
      includeEmoji ? '笑死！装睡的人根本叫不醒！' : '笑死！装睡的人根本叫不醒！',
    ],
  };

  // 随机挑选该级别的情绪词
  const getShock = () => sample(shockOpeners[hypeLevel] || shockOpeners[3]);

  // CTA 转化结尾（无句号，无破折号）
  const getCTA = (idx) => {
    if (!includeCTA) return '';
    const ctas = [
      includeEmoji ? '\n\n🔖 建议先存防和谐\n顺手转推让更多人少走半年弯路！' : '\n\n建议先存防和谐\n顺手转推让更多人少走半年弯路！',
      includeEmoji ? '\n\n你怎么看？评论区告诉我 👇' : '\n\n你怎么看？评论区告诉我',
      includeEmoji ? '\n\n留给普通人的窗口期可能就这几个月了\n冲就完事了！🚀' : '\n\n留给普通人的窗口期可能就这几个月了\n冲就完事了！',
      includeEmoji ? '\n\n觉得有启发\n顺手点个赞和转推！' : '\n\n觉得有启发\n顺手点个赞和转推！',
    ];
    return ctas[idx % ctas.length];
  };

  const threadPrefix = includeThreadHook ? '🧵 1/5 深度拆解\n\n' : '';

  // 针对不同风格定制内容（严格遵循短句换行、无句号、无破折号、语气词加感叹号）
  let v1 = '';
  let v2 = '';
  let v3 = '';

  const op1 = getShock();
  const op2 = getShock();
  const op3 = getShock();

  if (style === 'wocao_shock') {
    v1 = `${threadPrefix}${op1}

关于「${cleanTopic}」
以往要花几千块甚至几周时间搞定的事
现在居然被直接做成了基操

把友商底裤扒下来吊打
连夜测试完我整个人都在发颤

先说结论
这把真的见证历史了！${getCTA(0)}`;

    v2 = `${threadPrefix}我特么必须说一句！
如果你还没关注「${cleanTopic}」
你很快会被甩开一个时代

${op2}
今天通宵实测彻底破防了：
1️⃣ 原来大家以为的门槛直接被踏平了
2️⃣ 效率直接拉升10倍不止
3️⃣ 这不是升级这是直接掀桌子不带大家玩了

别等被淘汰了才喊冤
时代抛弃你连声招呼都不会打${getCTA(1)}`;

    v3 = `${threadPrefix}${op3}

还在怀疑「${cleanTopic}」是不是炒作？
看看现实吧

很多人还在键盘上打口水仗
懂行的人已经拿着新武器在闷声收割了

这一枪开出来
整个行业的底层逻辑都要被重新洗牌
信不信由你
反正我已经梭哈进去了！${getCTA(2)}`;

  } else if (style === 'contrarian') {
    v1 = `${threadPrefix}说句极其得罪人的大实话！
关于「${cleanTopic}」
99% 的人完全被带偏了

大家都以为是表面上的热闹
其实背后真正的杀招是：
彻底把既得利益者的护城河给填平了

${op1}
某些人还在装睡
而真相是时代早就翻篇了！${getCTA(0)}`;

    v2 = `${threadPrefix}千万别再当大冤种了！
如果你还在用老眼光看「${cleanTopic}」
请立刻停下来

大部分人之所以焦虑
是因为把垃圾当金子 把革命当玩笑

${op2}
核心逻辑只有一条：
谁先打破信息茧房 谁就掌握了接下来的降维打击主动权${getCTA(1)}`;

    v3 = `${threadPrefix}反常识暴论：
「${cleanTopic}」本质上不是给行业大佬看的
而是给普通人翻盘的最后船票

为什么这么说？
传统路径越来越卷
卷到最后都是无意义内耗

${op3}
看懂的人都在闷声发大财
只有韭菜还在评论区抬杠！${getCTA(2)}`;

  } else if (style === 'roast_meme') {
    v1 = `${threadPrefix}${op1}
今天看到关于「${cleanTopic}」的各种吹捧
我真的被气乐了

换个马甲就敢吹自己是划时代创新？
真当大家的钱是大风刮来的？
纯纯智商税大收割
底裤掉地上了还在摆造型！${getCTA(1)}`;

    v2 = `${threadPrefix}笑死我了！某些人还在死鸭子嘴硬呢？

关于「${cleanTopic}」
吹的时候天花乱坠 拳打这个脚踢那个
实际一上手连个基本体验都拉跨得不行

我特么直接问一句：
良心不痛吗？
谁买谁是大冤种 快醒醒吧！${getCTA(0)}`;

    v3 = `${threadPrefix}说个推特上没人敢说的事实！
「${cleanTopic}」完全就是一出精心包装的自嗨大戏

热闹都是宣发的
尴尬都是用户的

${op3}
别再跟着资本摇旗呐喊了
你以为你在拥抱未来
实际上你只是人家报表上的一个日活指标罢了${getCTA(1)}`;

  } else if (style === 'curation_alpha') {
    v1 = `${threadPrefix}🔥 连夜扒完「${cleanTopic}」
全网最硬核的信息差拆解：

${op1}
不想当韭菜被割 这3点必须吃透：

1️⃣ 核心痛点：为什么之前所有人都在走弯路
2️⃣ 破局关键：这次真正的技术杠杆在哪里
3️⃣ 落地路径：普通人从明天开始该怎么立刻抄作业

信息量巨大
建议立刻先存后看！${getCTA(0)}`;

    v2 = `${threadPrefix}花了一整晚把「${cleanTopic}」翻了个底朝天
少走3年弯路 直接上干货：

🔹 很多人忽略的隐藏红利：其实早就可以变现
🔹 官方不会明说的深坑：千万别盲目跟风
🔹 我的实操避坑心得：按这个节奏来至少省下几万块

${op2}
直接收藏起来
下周再看你绝对会回来感谢我！${getCTA(0)}`;

    v3 = `${threadPrefix}⚡️ 如果你只有30秒了解「${cleanTopic}」
看这条就够了：

• 本质：底层逻辑被彻底重构
• 杀伤力：过去80%的繁琐流程直接归零
• 你的机会：踩在巨人的肩膀上做一人公司

${op3}
别说没提醒过你
这就是你一直在找的 Alpha！${getCTA(2)}`;

  } else if (style === 'degen_fomo') {
    v1 = `${threadPrefix}兄弟们听我一句劝！
关于「${cleanTopic}」
留给你的窗口期真的只剩这几个月了

${op1}
每次大周期来临前 90% 的人都在质疑和观望
等全网都在讨论的时候 第一批上车的人早就落袋为安了
这波不冲 以后只能拍断大腿看着别人起飞！${getCTA(2)}`;

    v2 = `${threadPrefix}我特么真的急了！
看到身边还有人对「${cleanTopic}」无动于衷
我后背都在发凉

${op2}
这根本不是赚不赚钱的问题
这是你下半场入场资格的问题
认知差就是财富差
别再当那个永远慢半拍的大冤种了！${getCTA(1)}`;

    v3 = `${threadPrefix}很多人总抱怨自己没赶上风口
现在「${cleanTopic}」直接把答案摔在脸上了 你还在犹豫？

${op3}
财富从不会眷顾犹豫不决的人
敢于第一批吃螃蟹的 早就把本钱翻了几番了
闭眼冲 干就完了！${getCTA(0)}`;

  } else {
    v1 = `${threadPrefix}${op1}

关于「${cleanTopic}」
时代淘汰你的时候
连个我操都不会对你说！${getCTA(0)}`;

    v2 = `${threadPrefix}关于「${cleanTopic}」
看懂的人连夜掀桌
装睡的人还在吹牛逼

纯纯降维打击！
好戏才刚刚开场${getCTA(1)}`;

    v3 = `${threadPrefix}把「${cleanTopic}」搞明白了
你今年至少少亏5万块

不信？
三个月后回来看这条推！${getCTA(0)}`;
  }

  // 严格经过网感标点清洗器
  const cleanV1 = cleanTwitterPunctuation(v1);
  const cleanV2 = cleanTwitterPunctuation(v2);
  const cleanV3 = cleanTwitterPunctuation(v3);

  const randId = Date.now();

  return [
    {
      id: `tweet-${randId}-1`,
      title: '视角 A · 爆裂第一反应 (沉浸震惊)',
      content: cleanV1,
      hypeName: hypeConfig.name,
      hypeBadge: hypeConfig.badge,
      metrics: {
        views: '12.8万',
        likes: '3,820',
        retweets: '492',
        replies: '128',
        bookmarks: '1.5k',
        time: '下午4:20 · 2026年10月4日',
      },
    },
    {
      id: `tweet-${randId}-2`,
      title: '视角 B · 痛击灵魂反差 (认知暴击)',
      content: cleanV2,
      hypeName: hypeConfig.name,
      hypeBadge: hypeConfig.badge,
      metrics: {
        views: '48.5万',
        likes: '1.2万',
        retweets: '2,400',
        replies: '380',
        bookmarks: '4,800',
        time: '下午5:10 · 2026年10月4日',
      },
    },
    {
      id: `tweet-${randId}-3`,
      title: '视角 C · 极度辛辣锐评 (行动呼吁)',
      content: cleanV3,
      hypeName: hypeConfig.name,
      hypeBadge: hypeConfig.badge,
      metrics: {
        views: '105.2万',
        likes: '3.6万',
        retweets: '8,200',
        replies: '1,290',
        bookmarks: '1.4万',
        time: '下午6:05 · 2026年10月4日',
      },
    },
  ];
}

/**
 * 计算推特真实字符数（推特规则：英文字符/数字/标点算 1，中日韩双字节字符算 2，URL 算 23）
 */
export function calculateTwitterLength(text = '') {
  let count = 0;
  // 简易 URL 识别
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const textWithoutUrls = text.replace(urlRegex, () => {
    count += 23;
    return '';
  });

  for (let i = 0; i < textWithoutUrls.length; i++) {
    const code = textWithoutUrls.charCodeAt(i);
    // 双字节字符 (汉字、Emoji 等)
    if (code > 255 || (code >= 0xd800 && code <= 0xdbff)) {
      count += 2;
    } else {
      count += 1;
    }
  }

  return {
    weightedCount: count,
    maxLimit: 280,
    remaining: 280 - count,
    isOverLimit: count > 280,
    percentage: Math.min(100, Math.round((count / 280) * 100)),
  };
}
