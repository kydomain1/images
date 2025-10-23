// ==================== AI高清放大功能初始化 ====================

// 调用 ClipDrop Upscale API
async function callClipdropUpscaleAPI(imageData) {
    console.log('📤 准备调用 ClipDrop API...');
    
    // 将 base64 转换为 Blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    console.log('📦 图片大小:', (blob.size / 1024).toFixed(2), 'KB');
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    
    // 调用后端 API
    console.log('🚀 发送请求到后端...');
    const apiResponse = await fetch('http://localhost:3000/api/upscale', {
        method: 'POST',
        body: formData
    });
    
    console.log('📡 响应状态:', apiResponse.status);
    
    const data = await apiResponse.json();
    console.log('📊 响应数据:', data);
    
    if (!data.success) {
        if (data.fallback) {
            throw new Error(data.error || 'API 不可用');
        }
        throw new Error(data.error || 'API 调用失败');
    }
    
    return {
        imageUrl: data.result,
        service: data.service
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 初始化AI高清放大功能...');
    
    // 检查元素
    const elements = {
        uploadArea: document.getElementById('upscale-upload-area'),
        imageInput: document.getElementById('upscale-image-input'),
        selectBtn: document.getElementById('upscale-select-btn'),
        uploadPlaceholder: document.getElementById('upscale-upload-placeholder'),
        imagePreview: document.getElementById('upscale-image-preview'),
        previewImg: document.getElementById('upscale-preview-img'),
        removeBtn: document.getElementById('upscale-remove-btn'),
        imageInfo: document.getElementById('upscale-image-info'),
        processBtn: document.getElementById('upscale-process-btn'),
        resultEmpty: document.getElementById('upscale-result-empty'),
        loadingState: document.getElementById('upscale-loading-state'),
        compareView: document.getElementById('upscale-compare-view'),
        originalImg: document.getElementById('upscale-original-img'),
        processedImg: document.getElementById('upscale-processed-img'),
        downloadBtn: document.getElementById('upscale-download-btn'),
        clearBtn: document.getElementById('upscale-clear-btn'),
        originalInfo: document.getElementById('upscale-original-info'),
        processedInfo: document.getElementById('upscale-processed-info')
    };
    
    // 检查关键元素
    const missing = [];
    ['selectBtn', 'imageInput', 'processBtn'].forEach(key => {
        if (!elements[key]) missing.push(key);
    });
    
    if (missing.length > 0) {
        console.log('⏭️ AI高清放大功能暂未加载（元素缺失）');
        return;
    }
    
    console.log('✅ AI高清放大元素已找到');
    
    // 全局变量
    window.currentUpscaleImage = null;
    window.processedUpscaleImage = null;
    
    // ==================== 上传功能 ====================
    
    elements.selectBtn.addEventListener('click', () => {
        console.log('🖱️ 点击选择图片');
        elements.imageInput.click();
    });
    
    elements.imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleUpscaleFile(file, elements);
    });
    
    // 拖拽上传
    if (elements.uploadArea) {
        elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.add('drag-over');
        });
        
        elements.uploadArea.addEventListener('dragleave', () => {
            elements.uploadArea.classList.remove('drag-over');
        });
        
        elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) handleUpscaleFile(files[0], elements);
        });
    }
    
    // 移除图片
    if (elements.removeBtn) {
        elements.removeBtn.addEventListener('click', () => {
            window.currentUpscaleImage = null;
            elements.imageInput.value = '';
            elements.uploadPlaceholder.style.display = 'block';
            elements.imagePreview.style.display = 'none';
            elements.processBtn.disabled = true;
        });
    }
    
    // ==================== 处理功能 ====================
    
    elements.processBtn.addEventListener('click', async () => {
        console.log('🚀 开始高清放大处理');
        
        if (!window.currentUpscaleImage) {
            alert('请先上传图片！');
            return;
        }
        
        // 显示加载状态
        elements.resultEmpty.style.display = 'none';
        elements.loadingState.style.display = 'flex';
        elements.compareView.style.display = 'none';
        elements.processBtn.disabled = true;
        
        try {
            // 获取设置
            const scale = parseInt(document.getElementById('upscale-scale').value);
            const algorithm = document.getElementById('upscale-algorithm').value;
            const sharpen = document.getElementById('upscale-sharpen').checked;
            const denoise = document.getElementById('upscale-denoise').checked;
            
            console.log('📝 放大参数:', { scale, algorithm, sharpen, denoise });
            
            // 优先尝试使用 ClipDrop AI（免费）
            if (scale === 2) {
                console.log('🚀 尝试使用 ClipDrop AI（免费2倍放大）...');
                
                try {
                    const result = await callClipdropUpscaleAPI(window.currentUpscaleImage);
                    
                    console.log('✅ ClipDrop AI 放大成功！');
                    showUpscaleResult(result.imageUrl, elements, 2, 'ClipDrop AI（免费）');
                    return;
                    
                } catch (apiError) {
                    console.warn('⚠️ ClipDrop API 不可用，降级到浏览器算法:', apiError.message);
                }
            } else {
                console.log('ℹ️ 放大倍数不是2x，使用浏览器算法');
            }
            
            // 使用浏览器端算法
            console.log('🎨 使用浏览器端算法...');
            
            // 检查Upscaler类
            if (typeof ImageUpscaler === 'undefined') {
                throw new Error('ImageUpscaler类未加载');
            }
            
            const upscaler = new ImageUpscaler();
            
            // 执行放大
            const result = await upscaler.upscale(window.currentUpscaleImage, {
                scale,
                algorithm,
                sharpen,
                denoise,
                onProgress: (stage, progress) => {
                    const stages = {
                        'loading': '加载图片...',
                        'processing': '放大处理中...',
                        'enhancing': '增强细节...',
                        'complete': '处理完成！'
                    };
                    
                    const text = stages[stage] || '处理中...';
                    const loadingTitle = document.getElementById('upscale-loading-title');
                    const loadingInfo = document.getElementById('upscale-loading-info');
                    const progressBar = document.getElementById('upscale-progress-bar');
                    
                    if (loadingTitle) loadingTitle.textContent = text;
                    if (loadingInfo) loadingInfo.textContent = `算法: ${algorithm} | 倍数: ${scale}x`;
                    if (progressBar) progressBar.style.width = progress + '%';
                    
                    console.log(`📊 进度: ${text} (${progress}%)`);
                }
            });
            
            console.log('✅ 浏览器端放大成功！');
            
            // 显示结果
            showUpscaleResult(result, elements, scale, '浏览器端算法');
            
        } catch (error) {
            console.error('❌ 放大失败:', error);
            elements.loadingState.style.display = 'none';
            elements.resultEmpty.style.display = 'block';
            elements.processBtn.disabled = false;
            alert('处理失败：' + error.message);
        }
    });
    
    // ==================== 下载和清空 ====================
    
    elements.downloadBtn.addEventListener('click', () => {
        console.log('💾 下载放大后的图片');
        if (!window.processedUpscaleImage) return;
        
        const link = document.createElement('a');
        link.href = window.processedUpscaleImage;
        link.download = `upscaled-${Date.now()}.png`;
        link.click();
    });
    
    elements.clearBtn.addEventListener('click', () => {
        console.log('🗑️ 清空结果');
        window.processedUpscaleImage = null;
        elements.compareView.style.display = 'none';
        elements.resultEmpty.style.display = 'block';
    });
    
    console.log('🎉 AI高清放大功能初始化完成');
});

// 处理上传的文件
function handleUpscaleFile(file, elements) {
    console.log(`📁 选中文件: ${file.name}`);
    
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        window.currentUpscaleImage = imageData;
        
        // 显示预览
        elements.previewImg.src = imageData;
        elements.uploadPlaceholder.style.display = 'none';
        elements.imagePreview.style.display = 'block';
        
        // 获取图片信息
        const img = new Image();
        img.onload = () => {
            const sizeKB = (file.size / 1024).toFixed(2);
            elements.imageInfo.innerHTML = `
                <p><i class="fas fa-image"></i> ${img.width} × ${img.height} px</p>
                <p><i class="fas fa-file"></i> ${sizeKB} KB</p>
            `;
            console.log(`📐 图片尺寸: ${img.width}×${img.height}`);
        };
        img.src = imageData;
        
        // 启用处理按钮
        elements.processBtn.disabled = false;
    };
    
    reader.onerror = () => {
        alert('图片读取失败！');
    };
    
    reader.readAsDataURL(file);
}

// 显示放大结果
function showUpscaleResult(resultData, elements, scale, serviceName = '浏览器端算法') {
    elements.loadingState.style.display = 'none';
    elements.compareView.style.display = 'block';
    elements.resultEmpty.style.display = 'none';
    
    // 更新服务标识
    const serviceBadge = document.getElementById('upscale-service-badge');
    if (serviceBadge) {
        if (serviceName.includes('ClipDrop')) {
            serviceBadge.innerHTML = '<i class="fas fa-robot"></i> ' + serviceName;
            serviceBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            serviceBadge.innerHTML = '<i class="fas fa-desktop"></i> ' + serviceName;
            serviceBadge.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }
    }
    
    // 显示图片
    elements.originalImg.src = window.currentUpscaleImage;
    elements.processedImg.src = resultData;
    
    // 获取原图尺寸
    const originalImg = new Image();
    originalImg.onload = () => {
        const originalSize = `${originalImg.width} × ${originalImg.height} px`;
        const originalKB = Math.round(window.currentUpscaleImage.length * 0.75 / 1024);
        elements.originalInfo.innerHTML = `
            <i class="fas fa-info-circle"></i> ${originalSize} (约${originalKB}KB)
        `;
    };
    originalImg.src = window.currentUpscaleImage;
    
    // 获取放大后尺寸
    const processedImg = new Image();
    processedImg.onload = () => {
        const processedSize = `${processedImg.width} × ${processedImg.height} px`;
        const processedKB = Math.round(resultData.length * 0.75 / 1024);
        const improvement = `${scale}x 放大`;
        elements.processedInfo.innerHTML = `
            <i class="fas fa-expand"></i> ${processedSize} (约${processedKB}KB) | ${improvement}
        `;
        
        console.log('📊 处理统计:', {
            原始: `${originalImg.width}×${originalImg.height}`,
            放大后: `${processedImg.width}×${processedImg.height}`,
            倍数: `${scale}x`
        });
    };
    processedImg.src = resultData;
    
    // 保存结果
    window.processedUpscaleImage = resultData;
    
    // 启用按钮
    elements.downloadBtn.disabled = false;
    elements.clearBtn.disabled = false;
    elements.processBtn.disabled = false;
}

