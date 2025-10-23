// ==================== 背景移除功能 ====================

// DOM元素
const bgUploadArea = document.getElementById('bg-upload-area');
const bgImageInput = document.getElementById('bg-image-input');
const bgSelectBtn = document.getElementById('bg-select-btn');
const bgUploadPlaceholder = document.getElementById('bg-upload-placeholder');
const bgImagePreview = document.getElementById('bg-image-preview');
const bgPreviewImg = document.getElementById('bg-preview-img');
const bgRemoveBtn = document.getElementById('bg-remove-btn');
const bgImageInfo = document.getElementById('bg-image-info');
const bgProcessBtn = document.getElementById('bg-remove-process-btn');
const bgResultGrid = document.getElementById('bg-result-grid');
const bgLoadingState = document.getElementById('bg-loading-state');
const bgDownloadBtn = document.getElementById('bg-download-btn');
const bgClearBtn = document.getElementById('bg-clear-btn');
const bgCompareView = document.getElementById('bg-compare-view');
const bgOriginalImg = document.getElementById('bg-original-img');
const bgProcessedImg = document.getElementById('bg-processed-img');

// 全局变量
let currentImage = null;
let processedImage = null;

// ==================== 标签页切换逻辑 ====================
document.querySelectorAll('.tool-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        
        // 更新标签状态
        document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 更新面板显示
        document.querySelectorAll('.tool-panel').forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        });
        
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
            targetPanel.style.display = 'block';
        }
    });
});

// ==================== 高级设置交互 ====================

// 预设配置
const BG_PRESETS = {
    'auto': { threshold: 15, smoothing: true, name: '自动检测' },
    'portrait': { threshold: 12, smoothing: true, name: '人物照片' },
    'product': { threshold: 22, smoothing: true, name: '产品图' },
    'pet': { threshold: 14, smoothing: true, name: '宠物照片' },
    'icon': { threshold: 25, smoothing: false, name: '图标/Logo' },
    'complex': { threshold: 8, smoothing: true, name: '复杂场景' },
    'custom': { threshold: 15, smoothing: true, name: '自定义' }
};

// 预设模式选择
const bgPresetSelect = document.getElementById('bg-preset');
const bgThresholdSlider = document.getElementById('bg-threshold');
const bgThresholdValue = document.getElementById('bg-threshold-value');
const bgThresholdHint = document.getElementById('bg-threshold-hint');
const bgSmoothingCheckbox = document.getElementById('bg-smoothing');
const bgAdvancedPanel = document.getElementById('bg-advanced-panel');

if (bgPresetSelect) {
    bgPresetSelect.addEventListener('change', (e) => {
        const preset = BG_PRESETS[e.target.value];
        if (preset && e.target.value !== 'custom') {
            // 应用预设
            bgThresholdSlider.value = preset.threshold;
            bgThresholdValue.textContent = preset.threshold;
            bgSmoothingCheckbox.checked = preset.smoothing;
            
            // 更新提示
            updateThresholdHint(preset.threshold);
            
            // 收起高级设置（除非是自定义模式）
            if (bgAdvancedPanel && e.target.value !== 'custom') {
                bgAdvancedPanel.style.display = 'none';
                const icon = document.querySelector('#toggle-bg-advanced .fa-chevron-up, #toggle-bg-advanced .fa-chevron-down');
                if (icon) icon.className = 'fas fa-chevron-down';
            }
            
            console.log(`🎨 应用预设: ${preset.name}`, preset);
        } else if (e.target.value === 'custom') {
            // 展开高级设置
            if (bgAdvancedPanel) {
                bgAdvancedPanel.style.display = 'block';
                const icon = document.querySelector('#toggle-bg-advanced .fa-chevron-up, #toggle-bg-advanced .fa-chevron-down');
                if (icon) icon.className = 'fas fa-chevron-up';
            }
        }
    });
}

// 敏感度滑块
if (bgThresholdSlider && bgThresholdValue) {
    bgThresholdSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        bgThresholdValue.textContent = value;
        updateThresholdHint(value);
        
        // 自动切换到自定义模式
        if (bgPresetSelect && bgPresetSelect.value !== 'custom') {
            bgPresetSelect.value = 'custom';
        }
    });
}

// 更新阈值提示
function updateThresholdHint(value) {
    if (!bgThresholdHint) return;
    
    if (value < 10) {
        bgThresholdHint.textContent = '非常宽松（保留最多）';
        bgThresholdHint.style.color = '#10b981';
    } else if (value < 15) {
        bgThresholdHint.textContent = '宽松模式';
        bgThresholdHint.style.color = '#14b8a6';
    } else if (value < 20) {
        bgThresholdHint.textContent = '平衡模式';
        bgThresholdHint.style.color = '#3b82f6';
    } else if (value < 25) {
        bgThresholdHint.textContent = '严格模式';
        bgThresholdHint.style.color = '#f59e0b';
    } else {
        bgThresholdHint.textContent = '非常严格（移除最多）';
        bgThresholdHint.style.color = '#ef4444';
    }
}

// 高级设置展开/收起（使用上面已定义的变量）
if (toggleBgAdvanced && bgAdvancedPanel) {
    toggleBgAdvanced.addEventListener('click', () => {
        const isOpen = bgAdvancedPanel.style.display !== 'none';
        bgAdvancedPanel.style.display = isOpen ? 'none' : 'block';
        
        // 更新箭头方向
        const icon = toggleBgAdvanced.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (icon) {
            icon.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
        }
    });
}

// ==================== 图片上传功能 ====================

// 点击选择图片
if (bgSelectBtn && bgImageInput) {
    bgSelectBtn.addEventListener('click', () => {
        console.log('🖱️ 选择图片按钮被点击');
        bgImageInput.click();
    });
} else {
    console.error('❌ 找不到上传按钮或文件输入框', {
        bgSelectBtn: !!bgSelectBtn,
        bgImageInput: !!bgImageInput
    });
}

// 文件选择处理
if (bgImageInput) {
    bgImageInput.addEventListener('change', handleFileSelect);
}

// 拖拽上传
if (bgUploadArea) {
    bgUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        bgUploadArea.classList.add('drag-over');
    });

    bgUploadArea.addEventListener('dragleave', () => {
        bgUploadArea.classList.remove('drag-over');
    });

    bgUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        bgUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

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
    
    // 读取图片
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        showImagePreview(e.target.result, file);
    };
    reader.readAsDataURL(file);
}

// 显示图片预览
function showImagePreview(imageSrc, file) {
    bgPreviewImg.src = imageSrc;
    bgUploadPlaceholder.style.display = 'none';
    bgImagePreview.style.display = 'block';
    
    // 显示图片信息
    const img = new Image();
    img.onload = () => {
        const sizeKB = (file.size / 1024).toFixed(2);
        bgImageInfo.innerHTML = `
            <p><i class="fas fa-image"></i> ${img.width} x ${img.height} px</p>
            <p><i class="fas fa-file"></i> ${sizeKB} KB</p>
        `;
    };
    img.src = imageSrc;
    
    // 启用处理按钮
    bgProcessBtn.disabled = false;
}

// 移除图片
if (bgRemoveBtn) {
    bgRemoveBtn.addEventListener('click', () => {
        currentImage = null;
        if (bgImageInput) bgImageInput.value = '';
        if (bgUploadPlaceholder) bgUploadPlaceholder.style.display = 'block';
        if (bgImagePreview) bgImagePreview.style.display = 'none';
        if (bgProcessBtn) bgProcessBtn.disabled = true;
        
        // 清空结果
        clearResults();
    });
}

// ==================== 背景移除处理 ====================

if (bgProcessBtn) {
    bgProcessBtn.addEventListener('click', async () => {
        if (!currentImage) {
            alert('请先上传图片！');
            return;
        }
        
        // 显示加载状态
        showLoading();
        
        try {
            // 获取用户设置
            const threshold = parseInt(document.getElementById('bg-threshold')?.value || 15);
            const smoothing = document.getElementById('bg-smoothing')?.checked ?? true;
            
            console.log('📝 用户设置:', { threshold, smoothing });
            
            // 调用背景移除API
            const result = await removeBackground(currentImage, { threshold, smoothing });
            
            // 显示结果
            showResult(result);
            
        } catch (error) {
            console.error('背景移除失败:', error);
            hideLoading();
            alert('处理失败：' + error.message);
        }
    });
}

// 背景移除API调用
async function removeBackground(imageData, options = {}) {
    const { threshold = 15, smoothing = true } = options;
    
    try {
        // 优先使用改进的算法
        console.log('🎨 使用改进算法处理...', options);
        const result = await removeBackgroundWithAI(imageData, threshold, smoothing);
        return result;
        
    } catch (error) {
        console.warn('⚠️ 算法失败，尝试使用 ClipDrop API:', error.message);
        
        // 降级到 ClipDrop API
        try {
            const result = await removeBackgroundWithRemoveBg(imageData);
            return result;
        } catch (apiError) {
            console.warn('⚠️ API也失败，使用基础算法:', apiError.message);
            
            // 最后降级到基础本地算法
            try {
                const result = await removeBackgroundLocal(imageData);
                return result;
            } catch (localError) {
                throw new Error('背景移除失败：' + localError.message);
            }
        }
    }
}

// 使用改进的算法移除背景
async function removeBackgroundWithAI(imageData, threshold = 15, smoothing = true) {
    try {
        // 使用改进的背景移除算法
        console.log('🎨 使用高级算法处理...', { threshold, smoothing });
        
        const remover = new BackgroundRemover();
        
        const result = await remover.removeBackground(imageData, {
            threshold: threshold,      // 颜色差异阈值（用户可调）
            smoothing: smoothing,      // 启用边缘平滑（用户可调）
            erosion: 1,               // 腐蚀次数
            dilation: 2,              // 膨胀次数
            onProgress: (stage, progress) => {
                // 更新进度
                const stages = {
                    'analyzing': { text: '正在分析图片...', info: '识别图片内容' },
                    'detecting_background': { text: '检测背景颜色...', info: '智能采样边缘区域' },
                    'creating_mask': { text: '创建遮罩...', info: '区分前景和背景' },
                    'detecting_edges': { text: '检测边缘...', info: '保护主体细节' },
                    'optimizing_mask': { text: '优化遮罩...', info: '形态学处理' },
                    'applying_mask': { text: '应用遮罩...', info: '移除背景' },
                    'smoothing_edges': { text: '平滑边缘...', info: '优化边缘效果' },
                    'complete': { text: '处理完成！', info: '背景已成功移除' }
                };
                
                const stageInfo = stages[stage] || { text: '处理中...', info: '' };
                updateLoadingStatus(stageInfo.text, progress, stageInfo.info);
            }
        });
        
        console.log('✅ 背景移除成功');
        return result;
        
    } catch (error) {
        console.error('高级算法处理失败:', error);
        throw error;
    }
}

// 更新加载状态文本和进度
function updateLoadingStatus(text, progress = null, info = null) {
    const loadingState = document.getElementById('bg-loading-state');
    if (loadingState) {
        const loadingText = loadingState.querySelector('p:first-of-type');
        if (loadingText) {
            loadingText.textContent = text;
        }
        
        // 更新进度条
        if (progress !== null) {
            const progressBar = document.getElementById('bg-progress-bar');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }
        
        // 更新提示信息
        if (info !== null) {
            const loadingInfo = document.getElementById('bg-loading-info');
            if (loadingInfo) {
                loadingInfo.textContent = info;
            }
        }
    }
}

// 本地背景移除（改进算法）
async function removeBackgroundLocal(imageData) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制原图
            ctx.drawImage(img, 0, 0);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // 改进的背景移除算法（使用边缘检测和颜色聚类）
            const tolerance = 60;
            const edgeTolerance = 30;
            
            // 获取四个角和边缘的颜色作为背景色
            const backgroundColor = getBackgroundColor(data, canvas.width, canvas.height);
            
            // 边缘检测 - 保护主体边缘
            const edges = detectEdges(data, canvas.width, canvas.height);
            
            // 第一遍：移除明显的背景
            for (let i = 0; i < data.length; i += 4) {
                const pixelIndex = i / 4;
                const x = pixelIndex % canvas.width;
                const y = Math.floor(pixelIndex / canvas.width);
                
                // 跳过边缘像素（保护主体）
                if (edges[pixelIndex]) {
                    continue;
                }
                
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // 计算与背景色的差异
                const diff = Math.abs(r - backgroundColor.r) +
                           Math.abs(g - backgroundColor.g) +
                           Math.abs(b - backgroundColor.b);
                
                // 如果颜色接近背景色，设置为透明
                if (diff < tolerance) {
                    data[i + 3] = 0;
                } else {
                    // 边缘柔化：如果接近但不完全匹配，降低透明度
                    if (diff < tolerance + edgeTolerance) {
                        const alpha = ((diff - tolerance) / edgeTolerance) * 255;
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
            }
            
            // 第二遍：形态学处理（移除孤立像素）
            const tempData = new Uint8ClampedArray(data);
            for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                    const i = (y * canvas.width + x) * 4;
                    
                    // 如果当前像素是透明的，检查周围像素
                    if (tempData[i + 3] === 0) {
                        let opaqueNeighbors = 0;
                        // 检查 3x3 邻域
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const ni = ((y + dy) * canvas.width + (x + dx)) * 4;
                                if (tempData[ni + 3] > 128) {
                                    opaqueNeighbors++;
                                }
                            }
                        }
                        // 如果大部分邻居是不透明的，恢复这个像素
                        if (opaqueNeighbors >= 5) {
                            data[i + 3] = tempData[i + 3];
                        }
                    }
                }
            }
            
            // 将处理后的数据放回canvas
            ctx.putImageData(imageData, 0, 0);
            
            // 转换为DataURL
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = reject;
        img.src = imageData;
    });
}

// 获取背景颜色（边缘采样）
function getBackgroundColor(data, width, height) {
    const samples = [];
    
    // 采样四角
    const corners = [
        0, // 左上
        (width - 1) * 4, // 右上
        (height - 1) * width * 4, // 左下
        ((height - 1) * width + width - 1) * 4 // 右下
    ];
    
    // 采样四边中点
    const edges = [
        (width / 2) * 4, // 上边中点
        (height - 1) * width * 4 + (width / 2) * 4, // 下边中点
        (height / 2) * width * 4, // 左边中点
        (height / 2) * width * 4 + (width - 1) * 4 // 右边中点
    ];
    
    [...corners, ...edges].forEach(index => {
        samples.push({
            r: data[Math.floor(index)],
            g: data[Math.floor(index) + 1],
            b: data[Math.floor(index) + 2]
        });
    });
    
    // 计算中位数（更稳健）
    samples.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
    const mid = samples[Math.floor(samples.length / 2)];
    
    return mid;
}

// 边缘检测（简化的 Sobel 算子）
function detectEdges(data, width, height) {
    const edges = new Uint8Array(width * height);
    const threshold = 50; // 边缘阈值
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const i = (y * width + x) * 4;
            
            // Sobel算子 - 计算梯度
            let gx = 0, gy = 0;
            
            // 简化的3x3卷积
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ni = ((y + dy) * width + (x + dx)) * 4;
                    const intensity = (data[ni] + data[ni + 1] + data[ni + 2]) / 3;
                    
                    gx += intensity * dx;
                    gy += intensity * dy;
                }
            }
            
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            
            if (magnitude > threshold) {
                edges[y * width + x] = 1;
            }
        }
    }
    
    return edges;
}

// 使用Remove.bg API（需要API Key）
async function removeBackgroundWithRemoveBg(imageData) {
    // 将 base64 转换为 Blob
    const blob = await fetch(imageData).then(r => r.blob());
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    
    // 调用后端API
    const response = await fetch('http://localhost:3000/api/remove-background', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    
    if (!data.success) {
        // 如果返回 fallback 标志，触发降级
        if (data.fallback) {
            throw new Error(data.error || 'API不可用');
        }
        throw new Error(data.error || 'API请求失败');
    }
    
    // 显示剩余额度
    if (data.creditsRemaining !== null) {
        console.log(`✅ Remove.bg API 成功！剩余额度: ${data.creditsRemaining}`);
    }
    
    return data.result;
}

// ==================== 结果显示 ====================

function showLoading() {
    bgResultGrid.querySelector('.empty-output').style.display = 'none';
    bgLoadingState.style.display = 'block';
    bgCompareView.style.display = 'none';
    bgProcessBtn.disabled = true;
}

function hideLoading() {
    bgLoadingState.style.display = 'none';
    bgProcessBtn.disabled = false;
}

function showResult(processedImageData) {
    hideLoading();
    
    processedImage = processedImageData;
    
    // 更新对比视图
    bgOriginalImg.src = currentImage;
    bgProcessedImg.src = processedImageData;
    
    // 显示对比视图
    bgCompareView.style.display = 'block';
    
    // 启用按钮
    bgDownloadBtn.disabled = false;
    bgClearBtn.disabled = false;
}

// ==================== 下载和清空 ====================

if (bgDownloadBtn) {
    bgDownloadBtn.addEventListener('click', () => {
        if (!processedImage) return;
        
        // 创建下载链接
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `background-removed-${Date.now()}.png`;
        link.click();
    });
}

if (bgClearBtn) {
    bgClearBtn.addEventListener('click', () => {
        clearResults();
        
        // 重置上传区
        currentImage = null;
        if (bgImageInput) bgImageInput.value = '';
        if (bgUploadPlaceholder) bgUploadPlaceholder.style.display = 'block';
        if (bgImagePreview) bgImagePreview.style.display = 'none';
        if (bgProcessBtn) bgProcessBtn.disabled = true;
    });
}

function clearResults() {
    processedImage = null;
    bgCompareView.style.display = 'none';
    bgResultGrid.querySelector('.empty-output').style.display = 'block';
    bgDownloadBtn.disabled = true;
    bgClearBtn.disabled = true;
}

// ==================== 初始化 ====================

console.log('✅ 背景移除功能已加载');

