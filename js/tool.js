// 工具页面功能脚本

document.addEventListener('DOMContentLoaded', function() {
    // 元素获取
    const promptInput = document.getElementById('tool-prompt');
    const charCounter = document.getElementById('char-counter');
    const generateBtn = document.getElementById('generate-btn');
    const outputGrid = document.getElementById('output-grid');
    const loadingState = document.getElementById('loading-state');
    const downloadAllBtn = document.getElementById('download-all');
    const clearAllBtn = document.getElementById('clear-all');
    const imageCountSelect = document.getElementById('image-count');
    const imageSizeSelect = document.getElementById('image-size');
    const artStyleSelect = document.getElementById('art-style');
    const qualitySelect = document.getElementById('quality');
    const negativePrompt = document.getElementById('negative-prompt');
    const creativitySlider = document.getElementById('creativity');
    const creativityValue = document.getElementById('creativity-value');
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedPanel = document.getElementById('advanced-panel');
    const historyList = document.getElementById('history-list');
    
    // 提示词优化器元素
    const optimizeBtn = document.getElementById('optimizeBtn');
    const showTemplatesBtn = document.getElementById('showTemplatesBtn');
    const showStylesBtn = document.getElementById('showStylesBtn');
    const optimizerPanel = document.getElementById('optimizerPanel');
    const categorySelect = document.getElementById('categorySelect');
    const styleSelect = document.getElementById('styleSelect');
    const applyOptimizeBtn = document.getElementById('applyOptimizeBtn');
    const cancelOptimizeBtn = document.getElementById('cancelOptimizeBtn');
    const templatesPanel = document.getElementById('templatesPanel');
    const stylesPanel = document.getElementById('stylesPanel');
    const templatesGrid = document.getElementById('templatesGrid');
    const stylesGrid = document.getElementById('stylesGrid');
    const closeTemplates = document.getElementById('closeTemplates');
    const closeStyles = document.getElementById('closeStyles');
    
    // 生成的图片数组
    let generatedImages = [];
    let generationHistory = loadHistoryFromStorage();
    
    // 字符计数
    promptInput.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = length;
        
        if (length > 2000) {
            charCounter.style.color = 'var(--danger-color)';
        } else {
            charCounter.style.color = 'var(--text-muted)';
        }
    });
    
    // 创意度滑块
    creativitySlider.addEventListener('input', function() {
        creativityValue.textContent = this.value;
    });
    
    // 高级设置切换
    toggleAdvancedBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        advancedPanel.classList.toggle('active');
    });
    
    // 推荐提示词点击
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            promptInput.value = this.dataset.prompt;
            promptInput.dispatchEvent(new Event('input'));
            // 平滑滚动到输入区
            document.querySelector('.input-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    // 生成图片
    generateBtn.addEventListener('click', async function() {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            alert('请输入图片描述');
            promptInput.focus();
            return;
        }
        
        if (prompt.length > 2000) {
            alert('描述文字不能超过2000个字符');
            return;
        }
        
        // 获取设置
        const settings = {
            prompt: prompt,
            negativePrompt: negativePrompt.value.trim(),
            count: parseInt(imageCountSelect.value),
            size: imageSizeSelect.value,
            style: artStyleSelect.value,
            quality: qualitySelect.value,
            creativity: parseInt(creativitySlider.value)
        };
        
        // 显示加载状态
        showLoading();
        
        // 模拟API调用（实际应用中替换为真实API）
        await simulateImageGeneration(settings);
    });
    
    // 显示加载状态
    function showLoading() {
        outputGrid.style.display = 'none';
        loadingState.style.display = 'flex';
        generateBtn.disabled = true;
    }
    
    // 隐藏加载状态
    function hideLoading() {
        outputGrid.style.display = 'grid';
        loadingState.style.display = 'none';
        generateBtn.disabled = false;
    }
    
    // 真实API图片生成
    async function simulateImageGeneration(settings) {
        try {
            // 检查是否已配置API
            if (typeof imageAPI !== 'undefined') {
                // 使用真实API生成
                generatedImages = await imageAPI.generate(settings);
            } else {
                // 降级使用免费的Pollinations API
                generatedImages = await generateWithPollinationsAPI(settings);
            }
            
            // 显示图片
            displayImages(generatedImages);
            
            // 添加到历史记录
            if (generatedImages.length > 0) {
                addToHistory(generatedImages[0]);
            }
            
            // 隐藏加载状态
            hideLoading();
            
            // 启用操作按钮
            downloadAllBtn.disabled = false;
            clearAllBtn.disabled = false;
            
        } catch (error) {
            console.error('图片生成失败:', error);
            hideLoading();
            alert('图片生成失败: ' + error.message + '\n\n请检查API配置或网络连接');
        }
    }
    
    // 免费的Pollinations API（无需API Key）
    async function generateWithPollinationsAPI(settings) {
        const { prompt, count, size } = settings;
        const [width, height] = size.split('x');
        const images = [];
        
        // 优化提示词
        const optimizedPrompt = prompt.trim();
        
        for (let i = 0; i < count; i++) {
            const seed = Math.floor(Math.random() * 1000000);
            const encodedPrompt = encodeURIComponent(optimizedPrompt);
            
            // 添加enhance参数提升图片质量和准确性
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
            
            // 预加载图片确保可以访问
            await preloadImage(url);
            
            images.push({
                url: url,
                prompt: optimizedPrompt,
                settings: settings,
                timestamp: new Date().toISOString(),
                seed: seed
            });
        }
        
        return images;
    }
    
    // 预加载图片函数
    function preloadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => {
                console.warn('图片预加载失败，但继续使用:', url);
                resolve(url); // 即使失败也继续
            };
            // 设置10秒超时
            setTimeout(() => resolve(url), 10000);
            img.src = url;
        });
    }
    
    // 显示图片
    function displayImages(images) {
        outputGrid.innerHTML = '';
        
        images.forEach((image, index) => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
                <img src="${image.url}" alt="Generated image ${index + 1}">
                <div class="image-card-actions">
                    <button onclick="downloadImage('${image.url}', ${index})" title="下载">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="viewImage('${image.url}')" title="查看大图">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="regenerateFromImage(${index})" title="重新生成">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            `;
            
            // 点击图片查看大图
            card.querySelector('img').addEventListener('click', function() {
                viewImage(image.url);
            });
            
            outputGrid.appendChild(card);
        });
    }
    
    // 查看图片大图
    window.viewImage = function(url) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        modal.classList.add('active');
        modalImg.src = url;
        
        // 设置下载按钮
        document.getElementById('modal-download').onclick = function() {
            downloadImageFromUrl(url);
        };
    };
    
    // 关闭模态框
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('image-modal').classList.remove('active');
    });
    
    // 点击模态框外部关闭
    document.getElementById('image-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // 下载单张图片
    window.downloadImage = async function(url, index) {
        await downloadImageFromUrl(url, `ai-image-${index + 1}.jpg`);
    };
    
    // 从URL下载图片
    async function downloadImageFromUrl(url, filename = 'ai-image.jpg') {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('下载失败:', error);
            alert('图片下载失败，请重试');
        }
    }
    
    // 下载所有图片
    downloadAllBtn.addEventListener('click', async function() {
        for (let i = 0; i < generatedImages.length; i++) {
            await downloadImage(generatedImages[i].url, i);
            // 添加延迟避免浏览器阻止多个下载
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    });
    
    // 清空所有图片
    clearAllBtn.addEventListener('click', function() {
        if (confirm('确定要清空所有生成的图片吗？')) {
            generatedImages = [];
            outputGrid.innerHTML = `
                <div class="empty-output">
                    <i class="fas fa-image fa-3x"></i>
                    <p>您生成的图片将在这里显示</p>
                    <p class="hint">输入描述并点击"生成图片"开始创作</p>
                </div>
            `;
            downloadAllBtn.disabled = true;
            clearAllBtn.disabled = true;
        }
    });
    
    // 重新生成
    window.regenerateFromImage = function(index) {
        const image = generatedImages[index];
        if (image) {
            promptInput.value = image.prompt;
            if (image.settings.negativePrompt) {
                negativePrompt.value = image.settings.negativePrompt;
            }
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // 添加到历史记录
    function addToHistory(image) {
        generationHistory.unshift(image);
        
        // 限制历史记录数量
        if (generationHistory.length > 20) {
            generationHistory.pop();
        }
        
        // 保存到localStorage
        saveHistoryToStorage();
        
        updateHistoryDisplay();
    }
    
    // 从localStorage加载历史记录
    function loadHistoryFromStorage() {
        try {
            const stored = localStorage.getItem('imageGenerationHistory');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
        return [];
    }
    
    // 保存历史记录到localStorage
    function saveHistoryToStorage() {
        try {
            localStorage.setItem('imageGenerationHistory', JSON.stringify(generationHistory));
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }
    
    // 删除历史记录项
    window.deleteHistoryItem = function(index) {
        generationHistory.splice(index, 1);
        saveHistoryToStorage();
        updateHistoryDisplay();
    };
    
    // 清空所有历史记录
    window.clearAllHistory = function() {
        const confirmMsg = typeof t !== 'undefined' ? t('history.confirmClear', '确定要清空所有历史记录吗？') : '确定要清空所有历史记录吗？';
        if (confirm(confirmMsg)) {
            generationHistory = [];
            saveHistoryToStorage();
            updateHistoryDisplay();
        }
    };
    
    // 更新历史记录显示
    function updateHistoryDisplay() {
        if (generationHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-state" data-i18n="history.empty">暂无生成记录</p>';
            return;
        }
        
        historyList.innerHTML = '';
        
        generationHistory.forEach((item, index) => {
            // 安全检查：确保必要的属性存在
            if (!item || !item.url) {
                return; // 跳过无效的历史记录项
            }
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.timestamp || Date.now());
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            
            let timeStr;
            if (isToday) {
                timeStr = date.toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            } else {
                timeStr = date.toLocaleDateString('zh-CN', { 
                    month: 'numeric', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            
            // 截断过长的提示词（添加安全检查）
            const promptText = item.prompt || '未知提示词';
            const displayPrompt = promptText.length > 60 
                ? promptText.substring(0, 60) + '...' 
                : promptText;
            
            historyItem.innerHTML = `
                <div class="history-item-image">
                    <img src="${item.url}" alt="History ${index + 1}">
                    <div class="history-item-overlay">
                        <button class="history-delete-btn" onclick="event.stopPropagation(); deleteHistoryItem(${index})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="history-item-content">
                    <p class="history-item-prompt" title="${promptText}">${displayPrompt}</p>
                    <small class="history-item-time">${timeStr}</small>
                </div>
            `;
            
            historyItem.addEventListener('click', function(e) {
                // 防止点击删除按钮时触发
                if (e.target.closest('.history-delete-btn')) {
                    return;
                }
                
                // 安全检查
                if (item.prompt) {
                    promptInput.value = item.prompt;
                }
                
                if (item.settings) {
                    if (item.settings.negativePrompt) {
                        negativePrompt.value = item.settings.negativePrompt;
                    }
                    if (item.settings.imageSize) {
                        imageSizeSelect.value = item.settings.imageSize;
                    }
                    if (item.settings.artStyle) {
                        artStyleSelect.value = item.settings.artStyle;
                    }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // 初始化时显示历史记录
    updateHistoryDisplay();
    
    // 模态框分享功能
    document.getElementById('modal-share').addEventListener('click', function() {
        const url = document.getElementById('modal-image').src;
        
        if (navigator.share) {
            navigator.share({
                title: 'AI生成的图片',
                text: '看看我用AI生成的图片！',
                url: url
            }).catch(err => console.log('分享失败:', err));
        } else {
            // 复制链接
            navigator.clipboard.writeText(url).then(() => {
                alert('图片链接已复制到剪贴板');
            });
        }
    });
    
    // 模态框重新编辑
    document.getElementById('modal-edit').addEventListener('click', function() {
        document.getElementById('image-modal').classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        promptInput.focus();
    });
    
    // ==================== 提示词优化器功能 ====================
    
    // 优化按钮点击
    optimizeBtn.addEventListener('click', function() {
        const currentPrompt = promptInput.value.trim();
        
        if (!currentPrompt) {
            // 显示模板面板
            hideAllPanels();
            templatesPanel.style.display = 'block';
            initializeTemplates();
            return;
        }
        
        // 显示优化选项面板
        hideAllPanels();
        optimizerPanel.style.display = 'block';
        
        // 自动检测分类
        const detectedCategory = window.PromptOptimizer.detectCategory(currentPrompt);
        categorySelect.value = detectedCategory;
    });
    
    // 显示模板按钮
    showTemplatesBtn.addEventListener('click', function() {
        hideAllPanels();
        templatesPanel.style.display = 'block';
        initializeTemplates();
    });
    
    // 显示风格按钮
    showStylesBtn.addEventListener('click', function() {
        hideAllPanels();
        stylesPanel.style.display = 'block';
        initializeStyles();
    });
    
    // 应用优化
    applyOptimizeBtn.addEventListener('click', function() {
        const userInput = promptInput.value.trim();
        if (!userInput) {
            alert(t('optimizer.emptyPrompt', '请先输入提示词'));
            return;
        }
        
        const category = categorySelect.value === 'auto' ? null : categorySelect.value;
        const style = styleSelect.value;
        
        const result = window.PromptOptimizer.optimizePrompt(userInput, {
            category,
            style
        });
        
        // 更新提示词
        promptInput.value = result.optimized;
        promptInput.dispatchEvent(new Event('input'));
        
        // 更新负面提示词
        if (result.negative && negativePrompt) {
            negativePrompt.value = result.negative;
        }
        
        // 隐藏面板
        optimizerPanel.style.display = 'none';
        
        // 显示成功提示
        optimizeBtn.classList.add('success');
        setTimeout(() => {
            optimizeBtn.classList.remove('success');
        }, 1000);
    });
    
    // 取消优化
    cancelOptimizeBtn.addEventListener('click', function() {
        hideAllPanels();
    });
    
    // 关闭模板面板
    closeTemplates.addEventListener('click', function() {
        templatesPanel.style.display = 'none';
    });
    
    // 关闭风格面板
    closeStyles.addEventListener('click', function() {
        stylesPanel.style.display = 'none';
    });
    
    // 初始化模板
    function initializeTemplates() {
        const categories = ['character', 'landscape', 'animal', 'product', 'architecture', 'food'];
        templatesGrid.innerHTML = '';
        
        const currentLang = localStorage.getItem('selectedLanguage') || 'zh-CN';
        const lang = currentLang === 'zh-CN' || currentLang === 'zh-TW' ? 'zh' : 'en';
        
        categories.forEach(category => {
            const templates = window.PromptOptimizer.getTemplatesByCategory(category, lang);
            templates.forEach(template => {
                const item = document.createElement('div');
                item.className = 'template-item';
                item.textContent = template;
                item.addEventListener('click', function() {
                    promptInput.value = template;
                    promptInput.dispatchEvent(new Event('input'));
                    templatesPanel.style.display = 'none';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                templatesGrid.appendChild(item);
            });
        });
    }
    
    // 初始化风格
    function initializeStyles() {
        stylesGrid.innerHTML = '';
        
        const currentLang = localStorage.getItem('selectedLanguage') || 'zh-CN';
        const lang = currentLang === 'zh-CN' || currentLang === 'zh-TW' ? 'zh' : 'en';
        
        const styles = [
            { key: 'realistic', icon: 'fa-camera', name_zh: '写实', name_en: 'Realistic' },
            { key: 'anime', icon: 'fa-dragon', name_zh: '动漫', name_en: 'Anime' },
            { key: 'oil_painting', icon: 'fa-paint-brush', name_zh: '油画', name_en: 'Oil Painting' },
            { key: 'watercolor', icon: 'fa-droplet', name_zh: '水彩', name_en: 'Watercolor' },
            { key: 'sketch', icon: 'fa-pencil', name_zh: '素描', name_en: 'Sketch' },
            { key: 'cyberpunk', icon: 'fa-robot', name_zh: '赛博朋克', name_en: 'Cyberpunk' },
            { key: 'fantasy', icon: 'fa-wand-magic-sparkles', name_zh: '奇幻', name_en: 'Fantasy' },
            { key: 'minimalist', icon: 'fa-minus', name_zh: '极简', name_en: 'Minimalist' },
            { key: 'vintage', icon: 'fa-clock-rotate-left', name_zh: '复古', name_en: 'Vintage' },
            { key: '3d_render', icon: 'fa-cube', name_zh: '3D渲染', name_en: '3D Render' }
        ];
        
        styles.forEach(style => {
            const item = document.createElement('div');
            item.className = 'style-item';
            item.innerHTML = `
                <i class="fas ${style.icon}"></i>
                <div>${lang === 'zh' ? style.name_zh : style.name_en}</div>
            `;
            item.addEventListener('click', function() {
                // 移除所有选中状态
                document.querySelectorAll('.style-item').forEach(el => {
                    el.classList.remove('selected');
                });
                // 添加选中状态
                this.classList.add('selected');
                
                // 更新风格选择器
                styleSelect.value = style.key;
                
                // 如果有提示词，立即应用
                const currentPrompt = promptInput.value.trim();
                if (currentPrompt) {
                    setTimeout(() => {
                        stylesPanel.style.display = 'none';
                        optimizerPanel.style.display = 'block';
                    }, 300);
                }
            });
            stylesGrid.appendChild(item);
        });
    }
    
    // 隐藏所有面板
    function hideAllPanels() {
        optimizerPanel.style.display = 'none';
        templatesPanel.style.display = 'none';
        stylesPanel.style.display = 'none';
    }
    
    // 点击外部关闭面板
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-group') && 
            !e.target.closest('.optimizer-panel') &&
            !e.target.closest('.templates-panel') &&
            !e.target.closest('.styles-panel')) {
            // hideAllPanels(); // 暂时注释掉，避免影响其他交互
        }
    });
});

