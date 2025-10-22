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
        // 调用imageAPI的图生图方法
        if (typeof imageAPI !== 'undefined' && imageAPI.generateImg2Img) {
            const results = await imageAPI.generateImg2Img(settings);
            return results[0]; // 返回第一个结果
        } else {
            // 降级方案：使用Pollinations.ai
            const { prompt, referenceImage, strength } = settings;
            const seed = Math.floor(Math.random() * 1000000);
            const encodedPrompt = encodeURIComponent(prompt);
            const enhanceParam = strength > 0.5 ? 'true' : 'false';
            
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&enhance=${enhanceParam}&nologo=true`;
            
            return {
                url: url,
                prompt: prompt,
                settings: settings,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // 显示结果
    function displayImg2ImgResult(result, settings) {
        // 清空之前的空状态
        const emptyState = img2imgOutputGrid.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
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
        
        // 显示操作按钮
        document.getElementById('img2img-download-all').style.display = 'inline-flex';
        document.getElementById('img2img-clear-all').style.display = 'inline-flex';
        
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
                <div class="empty-state">
                    <i class="fas fa-image"></i>
                    <p>还没有生成图片</p>
                    <p class="hint">上传图片并设置效果后，点击"开始转换"按钮</p>
                </div>
            `;
            document.getElementById('img2img-download-all').style.display = 'none';
            document.getElementById('img2img-clear-all').style.display = 'none';
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

