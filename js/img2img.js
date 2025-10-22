// 图生图功能脚本

document.addEventListener('DOMContentLoaded', function() {
    // 标签切换功能
    const toolTabs = document.querySelectorAll('.tool-tab');
    const toolPanels = document.querySelectorAll('.tool-panel');
    
    toolTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.dataset.tab;
            
            // 切换标签激活状态
            toolTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 切换面板显示
            toolPanels.forEach(panel => {
                if (panel.id === targetPanel) {
                    panel.classList.add('active');
                    panel.style.display = 'block';
                } else {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                }
            });
        });
    });
    
    // 检查后端状态并更新UI
    async function updateBackendStatus() {
        const banner = document.getElementById('img2img-mode-banner');
        const text = document.getElementById('img2img-mode-text');
        
        if (!banner || !text) return;
        
        try {
            const response = await fetch('http://localhost:3000/health', {
                method: 'GET',
                signal: AbortSignal.timeout(3000)
            });
            
            if (response.ok) {
                // 后端服务器正在运行
                banner.style.background = '#2D5F3F';
                banner.style.borderLeftColor = '#4CAF50';
                text.innerHTML = `
                    ✅ <strong>后端模式：</strong>真实图生图功能已启用<br>
                    📸 <strong>说明：</strong>上传图片，系统将基于您的图片进行AI转换<br>
                    🎨 <strong>功能：</strong>支持风格转换、细节增强、氛围调整等
                `;
            } else {
                throw new Error('服务器响应异常');
            }
        } catch (error) {
            // 后端服务器未运行
            banner.style.background = '#4A5568';
            banner.style.borderLeftColor = '#7F9DAC';
            text.innerHTML = `
                💡 <strong>降级模式：</strong>使用Pollinations.ai免费服务<br>
                📝 <strong>说明：</strong>基于文字描述生成图片（上传图片仅作参考）<br>
                🚀 <strong>启用完整功能：</strong>运行 <code style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 3px;">node server-with-r2.js</code> 启动后端服务器
            `;
        }
    }
    
    // 页面加载后检测后端状态
    setTimeout(updateBackendStatus, 500);
    
    // 图生图功能
    const referenceImageInput = document.getElementById('reference-image');
    const selectImageBtn = document.getElementById('select-image-btn');
    const uploadArea = document.getElementById('image-upload-area');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const imageInfo = document.getElementById('image-info');
    
    const img2imgPrompt = document.getElementById('img2img-prompt');
    const img2imgCharCounter = document.getElementById('img2img-char-counter');
    const img2imgStrength = document.getElementById('img2img-strength');
    const strengthValue = document.getElementById('strength-value');
    const img2imgGenerateBtn = document.getElementById('img2img-generate-btn');
    const img2imgOutputGrid = document.getElementById('img2img-output-grid');
    const img2imgLoadingState = document.getElementById('img2img-loading-state');
    
    let uploadedImageFile = null;
    let uploadedImageDataURL = null;
    
    // 选择图片按钮
    selectImageBtn.addEventListener('click', () => {
        referenceImageInput.click();
    });
    
    // 文件选择
    referenceImageInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadPlaceholder.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadPlaceholder.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadPlaceholder.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // 处理文件选择
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }
    
    // 处理文件
    function handleFile(file) {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }
        
        // 检查文件大小（10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('图片大小不能超过10MB！');
            return;
        }
        
        uploadedImageFile = file;
        
        // 读取文件并预览
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageDataURL = e.target.result;
            previewImg.src = e.target.result;
            
            // 隐藏占位符，显示预览
            uploadPlaceholder.style.display = 'none';
            imagePreview.style.display = 'block';
            
            // 显示图片信息
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const fileSizeKB = (file.size / 1024).toFixed(2);
                imageInfo.innerHTML = `
                    <span><i class="fas fa-file-image"></i> ${file.name}</span>
                    <span><i class="fas fa-ruler-combined"></i> ${img.width} × ${img.height}</span>
                    <span><i class="fas fa-weight"></i> ${fileSizeKB} KB</span>
                `;
            };
        };
        reader.readAsDataURL(file);
    }
    
    // 移除图片
    removeImageBtn.addEventListener('click', () => {
        uploadedImageFile = null;
        uploadedImageDataURL = null;
        previewImg.src = '';
        referenceImageInput.value = '';
        
        uploadPlaceholder.style.display = 'block';
        imagePreview.style.display = 'none';
    });
    
    // 字符计数
    img2imgPrompt.addEventListener('input', function() {
        const length = this.value.length;
        img2imgCharCounter.textContent = length;
        
        if (length > 1000) {
            img2imgCharCounter.style.color = 'var(--danger-color)';
        } else {
            img2imgCharCounter.style.color = 'var(--text-muted)';
        }
    });
    
    // ==================== 图生图提示词优化功能 ====================
    
    // 图生图专用模板
    const img2imgTemplates = {
        styleTransfer: [
            { name: '油画风格', prompt: '转换为印象派油画风格，可见的笔触，丰富的色彩层次，艺术感强' },
            { name: '动漫风格', prompt: '转换为日系动漫风格，清晰的线条，明亮的色彩，二次元美学' },
            { name: '水彩画', prompt: '转换为水彩画风格，柔和的色彩，水润的质感，纸张纹理' },
            { name: '素描风格', prompt: '转换为铅笔素描风格，清晰的线条，明暗对比，黑白画面' },
            { name: '赛博朋克', prompt: '转换为赛博朋克风格，霓虹灯光效果，未来科技感，蓝紫色调' },
            { name: '复古胶片', prompt: '转换为复古胶片照片，褪色效果，颗粒质感，怀旧氛围' }
        ],
        enhancement: [
            { name: '细节增强', prompt: '增强图片细节，提高清晰度，锐化边缘，保持自然' },
            { name: '色彩增强', prompt: '增强色彩饱和度，提高对比度，色彩更加鲜艳生动' },
            { name: '光线优化', prompt: '优化光线效果，增强明暗对比，添加柔和光照，氛围更好' },
            { name: '艺术化', prompt: '添加艺术效果，增强美感，细节丰富，视觉冲击力强' }
        ],
        mood: [
            { name: '温暖氛围', prompt: '调整为温暖色调，金黄色光线，温馨舒适的氛围' },
            { name: '冷色调', prompt: '调整为冷色调，蓝色光线，宁静冷峻的氛围' },
            { name: '梦幻感', prompt: '添加梦幻效果，柔和的光晕，朦胧美感，仙境般的氛围' },
            { name: '戏剧性', prompt: '增强戏剧性效果，强烈的光影对比，张力十足' }
        ],
        special: [
            { name: '黑白艺术', prompt: '转换为黑白照片，高对比度，经典胶片质感，艺术摄影风格' },
            { name: '极简风格', prompt: '简化画面，极简主义，清爽干净，突出主体' },
            { name: '3D渲染', prompt: '转换为3D渲染效果，光滑表面，专业建模，真实材质' },
            { name: '插画风格', prompt: '转换为扁平插画风格，简洁的造型，明快的色彩，现代设计感' }
        ]
    };
    
    // 优化效果描述
    const img2imgEffectEnhancements = {
        style: {
            realistic: '转换为写实风格，真实的光影，细腻的质感，照片级效果',
            anime: '转换为动漫风格，清晰的线条，明亮的色彩，日系美学',
            oil_painting: '转换为油画风格，可见的笔触，丰富的色彩，印象派质感',
            watercolor: '转换为水彩画风格，柔和的色彩，水润质感，艺术氛围',
            sketch: '转换为素描风格，细腻的线条，明暗对比，黑白艺术',
            cyberpunk: '转换为赛博朋克风格，霓虹灯光，科技感，未来都市',
            fantasy: '转换为奇幻风格，魔法氛围，神秘感，幻想世界',
            minimalist: '转换为极简风格，简洁构图，纯净色彩，现代美学',
            vintage: '转换为复古风格，怀旧色调，胶片质感，年代感',
            '3d_render': '转换为3D渲染效果，光滑表面，真实材质，专业建模'
        },
        enhance: '增强图片质量，提高清晰度，优化细节，色彩更鲜艳',
        mood: '调整画面氛围，优化光线效果，增强情感表达',
        color: '优化色彩搭配，调整色调，增强视觉冲击力',
        composition: '优化构图，调整画面平衡，突出主体，更好的视觉效果'
    };
    
    // 图生图优化按钮
    const img2imgOptimizeBtn = document.getElementById('img2img-optimizeBtn');
    const img2imgShowTemplatesBtn = document.getElementById('img2img-showTemplatesBtn');
    const img2imgShowStylesBtn = document.getElementById('img2img-showStylesBtn');
    const img2imgOptimizerPanel = document.getElementById('img2img-optimizerPanel');
    const img2imgEffectSelect = document.getElementById('img2img-effectSelect');
    const img2imgStyleSelect = document.getElementById('img2img-styleSelect');
    const img2imgApplyOptimizeBtn = document.getElementById('img2img-applyOptimizeBtn');
    const img2imgCancelOptimizeBtn = document.getElementById('img2img-cancelOptimizeBtn');
    const img2imgTemplatesPanel = document.getElementById('img2img-templatesPanel');
    const img2imgStylesPanel = document.getElementById('img2img-stylesPanel');
    const img2imgTemplatesGrid = document.getElementById('img2img-templatesGrid');
    const img2imgStylesGrid = document.getElementById('img2img-stylesGrid');
    const img2imgCloseTemplates = document.getElementById('img2img-closeTemplates');
    const img2imgCloseStyles = document.getElementById('img2img-closeStyles');
    
    // 显示优化面板
    if (img2imgOptimizeBtn) {
        img2imgOptimizeBtn.addEventListener('click', function() {
            const isVisible = img2imgOptimizerPanel.style.display === 'block';
            img2imgOptimizerPanel.style.display = isVisible ? 'none' : 'block';
            img2imgTemplatesPanel.style.display = 'none';
            img2imgStylesPanel.style.display = 'none';
        });
    }
    
    // 显示模板面板
    if (img2imgShowTemplatesBtn) {
        img2imgShowTemplatesBtn.addEventListener('click', function() {
            img2imgTemplatesPanel.style.display = 'block';
            img2imgOptimizerPanel.style.display = 'none';
            img2imgStylesPanel.style.display = 'none';
            renderImg2ImgTemplates();
        });
    }
    
    // 显示风格面板
    if (img2imgShowStylesBtn) {
        img2imgShowStylesBtn.addEventListener('click', function() {
            img2imgStylesPanel.style.display = 'block';
            img2imgOptimizerPanel.style.display = 'none';
            img2imgTemplatesPanel.style.display = 'none';
            renderImg2ImgStyles();
        });
    }
    
    // 应用优化
    if (img2imgApplyOptimizeBtn) {
        img2imgApplyOptimizeBtn.addEventListener('click', function() {
            const currentPrompt = img2imgPrompt.value.trim();
            const effect = img2imgEffectSelect.value;
            const style = img2imgStyleSelect.value;
            
            let optimized = currentPrompt;
            
            // 根据效果类型优化
            if (effect === 'style') {
                optimized = currentPrompt ? 
                    `${currentPrompt}，${img2imgEffectEnhancements.style[style]}` :
                    img2imgEffectEnhancements.style[style];
            } else {
                const effectText = img2imgEffectEnhancements[effect];
                optimized = currentPrompt ? 
                    `${currentPrompt}，${effectText}` :
                    effectText;
            }
            
            img2imgPrompt.value = optimized;
            img2imgPrompt.dispatchEvent(new Event('input'));
            img2imgOptimizerPanel.style.display = 'none';
        });
    }
    
    // 取消优化
    if (img2imgCancelOptimizeBtn) {
        img2imgCancelOptimizeBtn.addEventListener('click', function() {
            img2imgOptimizerPanel.style.display = 'none';
        });
    }
    
    // 关闭模板面板
    if (img2imgCloseTemplates) {
        img2imgCloseTemplates.addEventListener('click', function() {
            img2imgTemplatesPanel.style.display = 'none';
        });
    }
    
    // 关闭风格面板
    if (img2imgCloseStyles) {
        img2imgCloseStyles.addEventListener('click', function() {
            img2imgStylesPanel.style.display = 'none';
        });
    }
    
    // 渲染模板
    function renderImg2ImgTemplates() {
        if (!img2imgTemplatesGrid) return;
        
        let html = '';
        
        // 风格转换
        html += '<div class="template-category"><h5>🎨 风格转换</h5><div class="template-items">';
        img2imgTemplates.styleTransfer.forEach(template => {
            html += `
                <div class="template-item" data-prompt="${template.prompt}">
                    <strong>${template.name}</strong>
                    <p>${template.prompt}</p>
                </div>
            `;
        });
        html += '</div></div>';
        
        // 细节增强
        html += '<div class="template-category"><h5>✨ 细节增强</h5><div class="template-items">';
        img2imgTemplates.enhancement.forEach(template => {
            html += `
                <div class="template-item" data-prompt="${template.prompt}">
                    <strong>${template.name}</strong>
                    <p>${template.prompt}</p>
                </div>
            `;
        });
        html += '</div></div>';
        
        // 氛围调整
        html += '<div class="template-category"><h5>🌟 氛围调整</h5><div class="template-items">';
        img2imgTemplates.mood.forEach(template => {
            html += `
                <div class="template-item" data-prompt="${template.prompt}">
                    <strong>${template.name}</strong>
                    <p>${template.prompt}</p>
                </div>
            `;
        });
        html += '</div></div>';
        
        // 特殊效果
        html += '<div class="template-category"><h5>🎭 特殊效果</h5><div class="template-items">';
        img2imgTemplates.special.forEach(template => {
            html += `
                <div class="template-item" data-prompt="${template.prompt}">
                    <strong>${template.name}</strong>
                    <p>${template.prompt}</p>
                </div>
            `;
        });
        html += '</div></div>';
        
        img2imgTemplatesGrid.innerHTML = html;
        
        // 添加点击事件
        document.querySelectorAll('#img2img-templatesGrid .template-item').forEach(item => {
            item.addEventListener('click', function() {
                const prompt = this.dataset.prompt;
                img2imgPrompt.value = prompt;
                img2imgPrompt.dispatchEvent(new Event('input'));
                img2imgTemplatesPanel.style.display = 'none';
            });
        });
    }
    
    // 渲染风格
    function renderImg2ImgStyles() {
        if (!img2imgStylesGrid) return;
        
        const styles = [
            { name: '油画', value: '印象派油画风格，明显的笔触，丰富的色彩', emoji: '🖼️' },
            { name: '水彩', value: '柔和的水彩画风格，淡雅的色调，水润质感', emoji: '💧' },
            { name: '动漫', value: '日系动漫风格，清晰线条，明亮色彩，二次元', emoji: '🎭' },
            { name: '素描', value: '铅笔素描风格，细腻线条，明暗对比，黑白', emoji: '✏️' },
            { name: '赛博朋克', value: '赛博朋克风格，霓虹灯效果，科技感，未来都市', emoji: '🌃' },
            { name: '复古', value: '复古胶片风格，褪色效果，颗粒质感，怀旧', emoji: '📷' },
            { name: '极简', value: '极简主义风格，简洁构图，纯净色彩，现代', emoji: '⬜' },
            { name: '3D渲染', value: '3D渲染效果，光滑表面，真实材质，专业', emoji: '🎲' }
        ];
        
        let html = '';
        styles.forEach(style => {
            html += `
                <div class="style-item" data-style="${style.value}">
                    <div class="style-emoji">${style.emoji}</div>
                    <div class="style-name">${style.name}</div>
                </div>
            `;
        });
        
        img2imgStylesGrid.innerHTML = html;
        
        // 添加点击事件
        document.querySelectorAll('#img2img-stylesGrid .style-item').forEach(item => {
            item.addEventListener('click', function() {
                const styleValue = this.dataset.style;
                const currentPrompt = img2imgPrompt.value.trim();
                img2imgPrompt.value = currentPrompt ? 
                    `${currentPrompt}，${styleValue}` :
                    styleValue;
                img2imgPrompt.dispatchEvent(new Event('input'));
                img2imgStylesPanel.style.display = 'none';
            });
        });
    }
    
    // 强度滑块
    img2imgStrength.addEventListener('input', function() {
        strengthValue.textContent = this.value;
    });
    
    // 生成按钮
    img2imgGenerateBtn.addEventListener('click', async function() {
        if (!uploadedImageFile || !uploadedImageDataURL) {
            alert('请先上传参考图片！');
            return;
        }
        
        const prompt = img2imgPrompt.value.trim();
        if (!prompt) {
            alert('请输入效果描述！');
            img2imgPrompt.focus();
            return;
        }
        
        if (prompt.length > 1000) {
            alert('描述文字不能超过1000个字符');
            return;
        }
        
        // 获取设置
        const settings = {
            prompt: prompt,
            negativePrompt: document.getElementById('img2img-negative-prompt').value.trim(),
            strength: parseFloat(img2imgStrength.value),
            style: document.getElementById('img2img-art-style').value,
            size: document.getElementById('img2img-size').value,
            referenceImage: uploadedImageDataURL
        };
        
        // 显示加载状态
        img2imgLoadingState.style.display = 'block';
        img2imgGenerateBtn.disabled = true;
        img2imgGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 转换中...';
        
        try {
            // 调用API
            const result = await generateImg2Img(settings);
            
            // 显示结果
            displayImg2ImgResult(result, settings);
            
        } catch (error) {
            console.error('图生图生成失败:', error);
            alert('生成失败：' + error.message);
        } finally {
            // 恢复按钮状态
            img2imgLoadingState.style.display = 'none';
            img2imgGenerateBtn.disabled = false;
            img2imgGenerateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> 开始转换';
        }
    });
    
    // 图生图API调用
    async function generateImg2Img(settings) {
        const { prompt, referenceImage, strength, style, size, negativePrompt } = settings;
        
        // 尝试使用后端API
        try {
            // 检查是否有后端服务器运行
            const backendAvailable = await checkBackendAvailability();
            
            if (backendAvailable) {
                console.log('✅ 使用后端API进行图生图');
                return await generateWithBackend(settings);
            } else {
                console.info('⚠️ 后端服务器未运行，使用Pollinations.ai降级方案');
                return await generateWithPollinations(settings);
            }
        } catch (error) {
            console.error('图片生成失败:', error);
            // 如果后端失败，尝试降级方案
            try {
                console.info('🔄 尝试降级方案...');
                return await generateWithPollinations(settings);
            } catch (fallbackError) {
                throw new Error('图片生成失败，请稍后重试');
            }
        }
    }
    
    // 检查后端可用性
    async function checkBackendAvailability() {
        try {
            const response = await fetch('http://localhost:3000/health', {
                method: 'GET',
                timeout: 2000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // 使用后端API生成
    async function generateWithBackend(settings) {
        const { prompt, referenceImage, strength, style, size, negativePrompt } = settings;
        
        // 创建FormData
        const formData = new FormData();
        
        // 添加图片文件
        if (referenceImage instanceof File) {
            formData.append('image', referenceImage);
        } else if (typeof referenceImage === 'string') {
            // 如果是base64或URL，需要转换为Blob
            const blob = await fetch(referenceImage).then(r => r.blob());
            formData.append('image', blob, 'reference.jpg');
        }
        
        // 添加其他参数
        formData.append('prompt', prompt || '保持原图风格');
        formData.append('strength', strength);
        formData.append('style', style);
        formData.append('count', '1');
        
        if (negativePrompt) {
            formData.append('negativePrompt', negativePrompt);
        }
        
        // 发送请求
        const response = await fetch('http://localhost:3000/api/img2img/generate', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || '生成失败');
        }
        
        // 返回第一张图片
        return {
            url: data.images[0],
            prompt: prompt,
            settings: settings,
            timestamp: new Date().toISOString(),
            backend: true
        };
    }
    
    // 使用Pollinations.ai降级方案
    async function generateWithPollinations(settings) {
        const { prompt, strength, style, size } = settings;
        const seed = Math.floor(Math.random() * 1000000);
        const [width, height] = size.split('x');
        
        // 构建提示词
        let fullPrompt = prompt || '保持原图风格';
        
        // 根据选择的风格添加描述
        const styleDescriptions = {
            '<auto>': '',
            '<3d cartoon>': ', 3D卡通风格',
            '<anime>': ', 日系动漫风格',
            '<oil painting>': ', 油画风格',
            '<watercolor>': ', 水彩画风格',
            '<sketch>': ', 素描风格',
            '<chinese painting>': ', 中国画风格',
            '<flat illustration>': ', 扁平插画风格'
        };
        
        if (style && styleDescriptions[style]) {
            fullPrompt += styleDescriptions[style];
        }
        
        // 根据强度调整
        if (strength < 0.3) {
            fullPrompt += ', 保持原图特征';
        } else if (strength > 0.7) {
            fullPrompt += ', 大幅艺术化';
        }
        
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const enhanceParam = strength > 0.5 ? 'true' : 'false';
        
        // 使用Pollinations.ai生成
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&enhance=${enhanceParam}&nologo=true`;
        
        return {
            url: url,
            prompt: fullPrompt,
            settings: settings,
            timestamp: new Date().toISOString(),
            seed: seed,
            fallback: true,
            note: '使用Pollinations.ai生成（降级方案）'
        };
    }
    
    // 显示结果
    function displayImg2ImgResult(result, settings) {
        // 清空之前的空状态
        const emptyOutput = img2imgOutputGrid.querySelector('.empty-output');
        if (emptyOutput) {
            emptyOutput.remove();
        }
        
        // 创建图片卡片
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${result.url}" alt="Generated Image" loading="lazy">
                <div class="image-overlay">
                    <button class="overlay-btn download-btn" onclick="downloadImage('${result.url}', 'img2img-result.png')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="overlay-btn view-btn" onclick="viewImageModal('${result.url}')">
                        <i class="fas fa-search-plus"></i>
                    </button>
                </div>
            </div>
            <div class="image-info-card">
                <p class="image-prompt">${settings.prompt}</p>
                <div class="image-meta">
                    <span><i class="fas fa-palette"></i> ${settings.style}</span>
                    <span><i class="fas fa-sliders-h"></i> 强度: ${settings.strength}</span>
                </div>
            </div>
        `;
        
        img2imgOutputGrid.appendChild(card);
        
        // 启用操作按钮
        document.getElementById('img2img-download-all').disabled = false;
        document.getElementById('img2img-clear-all').disabled = false;
        
        // 平滑滚动到结果区
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 下载全部和清空全部按钮
    document.getElementById('img2img-download-all')?.addEventListener('click', () => {
        const images = img2imgOutputGrid.querySelectorAll('.image-card img');
        images.forEach((img, index) => {
            downloadImage(img.src, `img2img-result-${index + 1}.png`);
        });
    });
    
    document.getElementById('img2img-clear-all')?.addEventListener('click', () => {
        if (confirm('确定要清空所有生成的图片吗？')) {
            img2imgOutputGrid.innerHTML = `
                <div class="empty-output">
                    <i class="fas fa-image fa-3x"></i>
                    <p>还没有生成图片</p>
                    <p class="hint">上传图片并设置效果后，点击"开始转换"按钮</p>
                </div>
            `;
            // 禁用操作按钮
            document.getElementById('img2img-download-all').disabled = true;
            document.getElementById('img2img-clear-all').disabled = true;
        }
    });
});

// 下载图片函数
function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 查看图片模态框
function viewImageModal(url) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    if (modal && modalImg) {
        modal.style.display = 'flex';
        modalImg.src = url;
    }
}

