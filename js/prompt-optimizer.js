/**
 * AI提示词优化助手
 * 帮助用户将简单描述扩展为专业的AI绘画提示词
 */

// ==================== 提示词模板库 ====================

const promptTemplates = {
    // 人物类
    character: {
        zh: {
            prefix: "一位",
            quality: "高质量肖像, 专业摄影, 细节丰富, 8k超高清",
            lighting: "柔和的光线, 完美的光影",
            style: "写实风格, 电影级画质",
            suffix: "精致的五官, 自然的表情"
        },
        en: {
            prefix: "a portrait of",
            quality: "high quality portrait, professional photography, highly detailed, 8k uhd",
            lighting: "soft lighting, perfect shadows",
            style: "realistic style, cinematic quality",
            suffix: "delicate facial features, natural expression"
        }
    },
    
    // 风景类
    landscape: {
        zh: {
            prefix: "美丽的",
            quality: "风景摄影杰作, 超高清细节, 壮观的景色",
            lighting: "金色时刻的光线, 完美的曝光",
            style: "自然风光, 摄影级画质",
            suffix: "广角视野, 层次分明, 色彩饱和"
        },
        en: {
            prefix: "beautiful",
            quality: "landscape photography masterpiece, ultra detailed, stunning scenery",
            lighting: "golden hour lighting, perfect exposure",
            style: "natural landscape, photography quality",
            suffix: "wide angle view, well composed, vibrant colors"
        }
    },
    
    // 产品类
    product: {
        zh: {
            prefix: "",
            quality: "商业级产品摄影, 高端质感, 专业打光",
            lighting: "工作室灯光, 柔光箱照明",
            style: "产品展示, 电商摄影风格",
            suffix: "纯净背景, 细节清晰, 质感突出"
        },
        en: {
            prefix: "",
            quality: "commercial product photography, premium quality, professional lighting",
            lighting: "studio lighting, softbox illumination",
            style: "product showcase, e-commerce photography style",
            suffix: "clean background, sharp details, texture highlighted"
        }
    },
    
    // 动物类
    animal: {
        zh: {
            prefix: "一只",
            quality: "野生动物摄影, 自然纪录片风格, 超高清细节",
            lighting: "自然光线, 完美的捕捉时机",
            style: "写实风格, 生动的姿态",
            suffix: "清晰的毛发细节, 灵动的眼神"
        },
        en: {
            prefix: "a",
            quality: "wildlife photography, nature documentary style, ultra detailed",
            lighting: "natural lighting, perfect moment captured",
            style: "realistic style, dynamic pose",
            suffix: "clear fur details, vivid eyes"
        }
    },
    
    // 建筑类
    architecture: {
        zh: {
            prefix: "",
            quality: "建筑摄影杰作, 专业构图, 超高清细节",
            lighting: "完美的光影对比, 建筑灯光",
            style: "建筑设计风格, 现代感",
            suffix: "对称构图, 线条清晰, 透视准确"
        },
        en: {
            prefix: "",
            quality: "architectural photography masterpiece, professional composition, ultra detailed",
            lighting: "perfect light and shadow contrast, architectural lighting",
            style: "architectural design style, modern aesthetic",
            suffix: "symmetrical composition, clean lines, accurate perspective"
        }
    },
    
    // 食物类
    food: {
        zh: {
            prefix: "诱人的",
            quality: "美食摄影, 食欲大增, 专业拍摄",
            lighting: "柔和的顶光, 食物专用灯光",
            style: "美食杂志风格, 精致摆盘",
            suffix: "新鲜的食材, 色泽诱人, 细节丰富"
        },
        en: {
            prefix: "appetizing",
            quality: "food photography, mouth-watering, professional shoot",
            lighting: "soft top lighting, food-specific lighting",
            style: "food magazine style, elegant plating",
            suffix: "fresh ingredients, attractive colors, rich details"
        }
    }
};

// ==================== 风格预设 ====================

const stylePresets = {
    realistic: {
        zh: "写实风格, 照片级真实感, 专业摄影, 高细节",
        en: "realistic style, photorealistic, professional photography, highly detailed"
    },
    anime: {
        zh: "动漫风格, 日式插画, 鲜艳色彩, 清晰线条",
        en: "anime style, japanese illustration, vibrant colors, clean lines"
    },
    oil_painting: {
        zh: "油画风格, 古典艺术, 笔触明显, 色彩丰富",
        en: "oil painting style, classical art, visible brushstrokes, rich colors"
    },
    watercolor: {
        zh: "水彩风格, 柔和色调, 流畅笔触, 艺术气息",
        en: "watercolor style, soft tones, fluid brushwork, artistic atmosphere"
    },
    sketch: {
        zh: "素描风格, 铅笔画, 黑白灰, 线条艺术",
        en: "sketch style, pencil drawing, black and white, line art"
    },
    cyberpunk: {
        zh: "赛博朋克风格, 霓虹灯光, 未来科技感, 暗黑氛围",
        en: "cyberpunk style, neon lights, futuristic tech, dark atmosphere"
    },
    fantasy: {
        zh: "奇幻风格, 魔法元素, 梦幻色彩, 超现实",
        en: "fantasy style, magical elements, dreamy colors, surreal"
    },
    minimalist: {
        zh: "极简风格, 简洁构图, 纯色背景, 现代设计",
        en: "minimalist style, clean composition, solid background, modern design"
    },
    vintage: {
        zh: "复古风格, 怀旧色调, 胶片质感, 经典氛围",
        en: "vintage style, nostalgic tones, film texture, classic atmosphere"
    },
    '3d_render': {
        zh: "3D渲染, C4D风格, 光线追踪, 超级细节",
        en: "3D rendering, C4D style, ray tracing, ultra detailed"
    }
};

// ==================== 质量关键词 ====================

const qualityKeywords = {
    zh: [
        "8k超高清",
        "专业级",
        "细节丰富",
        "高品质",
        "精致",
        "完美构图",
        "色彩准确",
        "清晰锐利",
        "masterpiece",
        "best quality"
    ],
    en: [
        "8k uhd",
        "professional grade",
        "highly detailed",
        "high quality",
        "intricate",
        "perfect composition",
        "accurate colors",
        "sharp and clear",
        "masterpiece",
        "best quality"
    ]
};

// ==================== 负面提示词库 ====================

const negativePrompts = {
    common: {
        zh: "模糊, 低质量, 失真, 变形, 噪点, 像素化, 水印, 文字, 签名",
        en: "blurry, low quality, distorted, deformed, noise, pixelated, watermark, text, signature"
    },
    character: {
        zh: "多余的手指, 畸形的手, 多余的肢体, 不对称的脸, 眼睛不对齐",
        en: "extra fingers, malformed hands, extra limbs, asymmetric face, misaligned eyes"
    },
    realistic: {
        zh: "卡通, 动漫, 插画风格, 非真实",
        en: "cartoon, anime, illustration style, unrealistic"
    },
    anatomy: {
        zh: "解剖错误, 比例失调, 身体扭曲",
        en: "anatomical errors, wrong proportions, twisted body"
    }
};

// ==================== 主题分类检测 ====================

const categoryKeywords = {
    character: {
        zh: ['人', '女孩', '男孩', '女性', '男性', '孩子', '老人', '年轻', '美女', '帅哥', '肖像', '人物', '角色', '少女', '少年'],
        en: ['person', 'girl', 'boy', 'woman', 'man', 'child', 'old', 'young', 'beauty', 'handsome', 'portrait', 'character', 'people']
    },
    landscape: {
        zh: ['风景', '山', '海', '湖', '森林', '天空', '云', '日落', '日出', '自然', '户外', '景色', '山川', '河流'],
        en: ['landscape', 'mountain', 'sea', 'lake', 'forest', 'sky', 'cloud', 'sunset', 'sunrise', 'nature', 'outdoor', 'scenery', 'river']
    },
    animal: {
        zh: ['猫', '狗', '鸟', '动物', '宠物', '野生', '熊', '狼', '马', '兔子', '老虎', '狮子', '大象', '鱼'],
        en: ['cat', 'dog', 'bird', 'animal', 'pet', 'wild', 'bear', 'wolf', 'horse', 'rabbit', 'tiger', 'lion', 'elephant', 'fish']
    },
    product: {
        zh: ['产品', '商品', '物品', '手机', '电脑', '相机', '手表', '包', '鞋', '衣服', '化妆品', '食品'],
        en: ['product', 'item', 'object', 'phone', 'computer', 'camera', 'watch', 'bag', 'shoes', 'clothes', 'cosmetics', 'food']
    },
    architecture: {
        zh: ['建筑', '房子', '大厦', '城市', '街道', '桥', '塔', '宫殿', '寺庙', '教堂', '摩天楼'],
        en: ['architecture', 'building', 'house', 'tower', 'city', 'street', 'bridge', 'palace', 'temple', 'church', 'skyscraper']
    },
    food: {
        zh: ['食物', '美食', '菜', '蛋糕', '甜点', '饮料', '咖啡', '茶', '水果', '面包', '披萨'],
        en: ['food', 'cuisine', 'dish', 'cake', 'dessert', 'drink', 'coffee', 'tea', 'fruit', 'bread', 'pizza']
    }
};

// ==================== 核心优化函数 ====================

/**
 * 检测提示词的主题分类
 */
function detectCategory(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    let maxScore = 0;
    let detectedCategory = 'landscape'; // 默认风景类
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        let score = 0;
        // 检查中文关键词
        keywords.zh.forEach(keyword => {
            if (prompt.includes(keyword)) score += 2;
        });
        // 检查英文关键词
        keywords.en.forEach(keyword => {
            if (lowerPrompt.includes(keyword)) score += 2;
        });
        
        if (score > maxScore) {
            maxScore = score;
            detectedCategory = category;
        }
    }
    
    return detectedCategory;
}

/**
 * 检测语言
 */
function detectLanguage(text) {
    // 简单的中文检测
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
    return chineseChars && chineseChars.length > text.length * 0.3 ? 'zh' : 'en';
}

/**
 * 优化提示词
 */
function optimizePrompt(userInput, options = {}) {
    if (!userInput || userInput.trim() === '') {
        return {
            optimized: '',
            negative: '',
            category: '',
            style: ''
        };
    }
    
    // 检测语言和分类
    const lang = detectLanguage(userInput);
    const category = options.category || detectCategory(userInput);
    const style = options.style || 'realistic';
    
    // 获取模板
    const template = promptTemplates[category][lang];
    const styleText = stylePresets[style][lang];
    
    // 构建优化后的提示词
    let optimizedParts = [];
    
    // 1. 前缀（如果有）
    if (template.prefix) {
        optimizedParts.push(template.prefix);
    }
    
    // 2. 用户原始输入
    optimizedParts.push(userInput.trim());
    
    // 3. 风格
    optimizedParts.push(styleText);
    
    // 4. 质量描述
    optimizedParts.push(template.quality);
    
    // 5. 光线描述
    if (!options.skipLighting) {
        optimizedParts.push(template.lighting);
    }
    
    // 6. 后缀细节
    if (template.suffix) {
        optimizedParts.push(template.suffix);
    }
    
    // 7. 额外质量关键词（随机选2-3个）
    const extraKeywords = qualityKeywords[lang]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    optimizedParts.push(...extraKeywords);
    
    // 组合成最终提示词
    const separator = lang === 'zh' ? '，' : ', ';
    const optimized = optimizedParts.join(separator);
    
    // 构建负面提示词
    let negativeParts = [negativePrompts.common[lang]];
    if (category === 'character') {
        negativeParts.push(negativePrompts.character[lang]);
        negativeParts.push(negativePrompts.anatomy[lang]);
    }
    if (style === 'realistic') {
        negativeParts.push(negativePrompts.realistic[lang]);
    }
    
    const negative = negativeParts.join(separator);
    
    return {
        optimized,
        negative,
        category,
        style,
        language: lang
    };
}

/**
 * 获取提示词模板列表
 */
function getTemplatesByCategory(category, lang = 'zh') {
    const templates = {
        character: {
            zh: [
                '一位优雅的女性，穿着精致的礼服',
                '一个年轻的男孩，充满活力的笑容',
                '一位老者，慈祥的面容',
                '一个精灵，尖耳朵，梦幻的眼睛'
            ],
            en: [
                'an elegant woman wearing a refined dress',
                'a young boy with an energetic smile',
                'an elderly person with a kind face',
                'an elf with pointed ears and dreamy eyes'
            ]
        },
        landscape: {
            zh: [
                '壮丽的山脉，云雾缭绕',
                '宁静的湖泊，倒映着夕阳',
                '茂密的森林，阳光透过树叶',
                '广阔的草原，野花盛开'
            ],
            en: [
                'majestic mountains shrouded in mist',
                'serene lake reflecting the sunset',
                'dense forest with sunlight through leaves',
                'vast grassland with wildflowers blooming'
            ]
        },
        animal: {
            zh: [
                '一只可爱的橘猫，坐在窗台上',
                '一只威武的老虎，森林之王',
                '一群飞翔的鸟，自由翱翔',
                '一只温柔的兔子，在草地上'
            ],
            en: [
                'a cute orange cat sitting on a windowsill',
                'a majestic tiger, king of the forest',
                'a flock of birds flying freely',
                'a gentle rabbit on the grassland'
            ]
        },
        product: {
            zh: [
                '一部高端智能手机，极简设计',
                '一款奢华手表，金属质感',
                '一瓶香水，晶莹剔透的瓶身',
                '一双时尚运动鞋，动感设计'
            ],
            en: [
                'a high-end smartphone with minimalist design',
                'a luxury watch with metallic texture',
                'a perfume bottle with crystal-clear body',
                'fashionable sneakers with dynamic design'
            ]
        },
        architecture: {
            zh: [
                '现代化的摩天大楼，玻璃幕墙',
                '古老的城堡，石砌墙壁',
                '传统的中式庭院，红墙碧瓦',
                '未来感的建筑，流线型设计'
            ],
            en: [
                'modern skyscraper with glass curtain wall',
                'ancient castle with stone walls',
                'traditional Chinese courtyard with red walls',
                'futuristic building with streamlined design'
            ]
        },
        food: {
            zh: [
                '精致的法式甜点，色彩缤纷',
                '一碗热腾腾的拉面，香气扑鼻',
                '新鲜的水果拼盘，色泽鲜艳',
                '美味的比萨，芝士拉丝'
            ],
            en: [
                'exquisite French dessert with vibrant colors',
                'steaming bowl of ramen with aromatic fragrance',
                'fresh fruit platter with vivid colors',
                'delicious pizza with cheese pull'
            ]
        }
    };
    
    return templates[category] ? templates[category][lang] : [];
}

// ==================== 导出 ====================

window.PromptOptimizer = {
    optimizePrompt,
    detectCategory,
    detectLanguage,
    getTemplatesByCategory,
    stylePresets,
    promptTemplates,
    categoryKeywords
};

