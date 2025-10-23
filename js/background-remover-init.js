// 调用 Remove.bg API
async function callRemoveBgAPI(imageData) {
    // 将 base64 转换为 Blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // 创建 FormData
    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    
    // 调用后端 API
    const apiResponse = await fetch('http://localhost:3000/api/remove-background', {
        method: 'POST',
        body: formData
    });
    
    const data = await apiResponse.json();
    
    if (!data.success) {
        if (data.fallback) {
            throw new Error(data.error || 'API 不可用，将使用本地算法');
        }
        throw new Error(data.error || 'API 调用失败');
    }
    
    return {
        imageUrl: data.result,
        creditsRemaining: data.creditsRemaining,
        service: data.service
    };
}

// 确保 DOM 完全加载后再初始化背景移除功能
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 开始初始化背景移除功能...');
    
    // ==================== 标签页切换逻辑 ====================
    console.log('📑 初始化标签页切换...');
    
    const toolTabs = document.querySelectorAll('.tool-tab');
    const toolPanels = document.querySelectorAll('.tool-panel');
    
    console.log(`找到 ${toolTabs.length} 个标签页, ${toolPanels.length} 个面板`);
    
    toolTabs.forEach((tab, index) => {
        console.log(`  标签 ${index + 1}: ${tab.textContent.trim()}`);
        
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            console.log(`🖱️ 点击标签页: ${tab.textContent.trim()} (目标: ${targetId})`);
            
            // 更新标签状态
            toolTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 更新面板显示
            toolPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });
            
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.style.display = 'block';
                console.log(`✅ 切换到面板: ${targetId}`);
            } else {
                console.error(`❌ 找不到面板: ${targetId}`);
            }
        });
    });
    
    console.log('✅ 标签页切换功能已初始化');
    
    // 检查所有必需的元素
    const elements = {
        bgUploadArea: document.getElementById('bg-upload-area'),
        bgImageInput: document.getElementById('bg-image-input'),
        bgSelectBtn: document.getElementById('bg-select-btn'),
        bgUploadPlaceholder: document.getElementById('bg-upload-placeholder'),
        bgImagePreview: document.getElementById('bg-image-preview'),
        bgPreviewImg: document.getElementById('bg-preview-img'),
        bgRemoveBtn: document.getElementById('bg-remove-btn'),
        bgImageInfo: document.getElementById('bg-image-info'),
        bgProcessBtn: document.getElementById('bg-remove-process-btn'),
        bgLoadingState: document.getElementById('bg-loading-state'),
        bgDownloadBtn: document.getElementById('bg-download-btn'),
        bgClearBtn: document.getElementById('bg-clear-btn'),
        bgCompareView: document.getElementById('bg-compare-view'),
        bgOriginalImg: document.getElementById('bg-original-img'),
        bgProcessedImg: document.getElementById('bg-processed-img')
    };
    
    // 检查哪些元素缺失（只检查关键元素）
    const critical = ['bgSelectBtn', 'bgImageInput', 'bgProcessBtn', 'bgLoadingState', 'bgCompareView'];
    const missing = [];
    
    for (const key of critical) {
        if (!elements[key]) {
            missing.push(key);
        }
    }
    
    if (missing.length > 0) {
        console.error('❌ 缺少关键元素:', missing);
        console.error('请确保已切换到"图片编辑器"标签页');
        return;
    }
    
    console.log('✅ 所有必需元素都已找到');
    console.log('元素详情:', {
        上传按钮: !!elements.bgSelectBtn,
        文件输入: !!elements.bgImageInput,
        处理按钮: !!elements.bgProcessBtn,
        加载状态: !!elements.bgLoadingState,
        结果显示: !!elements.bgCompareView
    });
    
    // 初始化按钮点击事件
    elements.bgSelectBtn.addEventListener('click', () => {
        console.log('🖱️ 点击了"选择图片"按钮');
        elements.bgImageInput.click();
    });
    
    // 文件选择事件
    elements.bgImageInput.addEventListener('change', (e) => {
        console.log('📁 文件选择事件触发');
        const file = e.target.files[0];
        if (file) {
            console.log(`📄 选中文件: ${file.name}, 大小: ${(file.size/1024).toFixed(2)} KB`);
            handleFileSelection(file, elements);
        }
    });
    
    // 拖拽上传
    elements.bgUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.bgUploadArea.classList.add('drag-over');
    });
    
    elements.bgUploadArea.addEventListener('dragleave', () => {
        elements.bgUploadArea.classList.remove('drag-over');
    });
    
    elements.bgUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.bgUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log('🎯 拖拽文件');
            handleFileSelection(files[0], elements);
        }
    });
    
    // 移除背景按钮
    elements.bgProcessBtn.addEventListener('click', async () => {
        console.log('🔘 点击了"移除背景"按钮');
        
        if (!window.currentBgImage) {
            console.error('❌ 没有上传图片');
            alert('请先上传图片！');
            return;
        }
        
        console.log('🚀 开始处理背景移除...');
        
        // 显示加载状态
        const emptyState = document.getElementById('bg-result-empty');
        if (emptyState) emptyState.style.display = 'none';
        
        elements.bgLoadingState.style.display = 'flex';
        elements.bgCompareView.style.display = 'none';
        elements.bgProcessBtn.disabled = true;
        
        try {
            // 获取用户设置
            const threshold = parseInt(document.getElementById('bg-threshold')?.value || 15);
            const smoothing = document.getElementById('bg-smoothing')?.checked ?? true;
            
            console.log('📝 处理参数:', { threshold, smoothing });
            
            // 优先尝试使用 Remove.bg API
            console.log('🚀 尝试使用 Remove.bg API...');
            
            try {
                const result = await callRemoveBgAPI(window.currentBgImage);
                
                // API 成功
                console.log('✅ Remove.bg API 处理成功！');
                
                // 显示结果
                elements.bgLoadingState.style.display = 'none';
                elements.bgCompareView.style.display = 'block';
                
                const emptyState = document.getElementById('bg-result-empty');
                if (emptyState) emptyState.style.display = 'none';
                elements.bgOriginalImg.src = window.currentBgImage;
                elements.bgProcessedImg.src = result.imageUrl;
                elements.bgDownloadBtn.disabled = false;
                elements.bgClearBtn.disabled = false;
                elements.bgProcessBtn.disabled = false;
                
                // 显示额度信息
                const serviceBadge = document.getElementById('api-service-badge');
                if (serviceBadge) {
                    serviceBadge.innerHTML = '<i class="fas fa-robot"></i> Remove.bg AI 处理';
                }
                
                if (result.creditsRemaining) {
                    console.log(`💳 剩余 API 额度: ${result.creditsRemaining} 次`);
                    
                    const creditsInfo = document.getElementById('credits-info');
                    const creditsCount = document.getElementById('credits-count');
                    if (creditsInfo && creditsCount) {
                        creditsInfo.style.display = 'block';
                        creditsCount.textContent = result.creditsRemaining;
                    }
                }
                
                window.processedBgImage = result.imageUrl;
                return;
                
            } catch (apiError) {
                console.warn('⚠️ Remove.bg API 不可用，降级到本地算法:', apiError.message);
            }
            
            // 如果 API 失败，使用本地算法
            console.log('🎨 使用本地算法处理...');
            
            // 检查 BackgroundRemover 类是否存在
            if (typeof BackgroundRemover === 'undefined') {
                throw new Error('BackgroundRemover 类未加载');
            }
            
            const remover = new BackgroundRemover();
            
            const result = await remover.removeBackground(window.currentBgImage, {
                threshold: threshold,
                smoothing: smoothing,
                erosion: 1,
                dilation: 2,
                onProgress: (stage, progress) => {
                    const stages = {
                        'analyzing': '正在分析图片...',
                        'detecting_background': '检测背景颜色...',
                        'creating_mask': '创建遮罩...',
                        'detecting_edges': '检测边缘...',
                        'optimizing_mask': '优化遮罩...',
                        'applying_mask': '应用遮罩...',
                        'smoothing_edges': '平滑边缘...',
                        'complete': '处理完成！'
                    };
                    
                    const text = stages[stage] || '处理中...';
                    console.log(`📊 进度: ${text} (${progress}%)`);
                    
                    const loadingText = elements.bgLoadingState.querySelector('p:first-of-type');
                    if (loadingText) {
                        loadingText.textContent = text;
                    }
                    
                    const progressBar = document.getElementById('bg-progress-bar');
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                }
            });
            
            console.log('✅ 背景移除成功！');
            
            // 显示结果
            elements.bgLoadingState.style.display = 'none';
            elements.bgCompareView.style.display = 'block';
            elements.bgOriginalImg.src = window.currentBgImage;
            elements.bgProcessedImg.src = result;
            elements.bgDownloadBtn.disabled = false;
            elements.bgClearBtn.disabled = false;
            elements.bgProcessBtn.disabled = false;
            
            // 更新服务标识
            const serviceBadge = document.getElementById('api-service-badge');
            if (serviceBadge) {
                serviceBadge.innerHTML = '<i class="fas fa-desktop"></i> 本地算法处理';
                serviceBadge.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
            
            // 隐藏额度信息（本地算法不消耗额度）
            const creditsInfo = document.getElementById('credits-info');
            if (creditsInfo) {
                creditsInfo.style.display = 'none';
            }
            
            // 保存处理后的图片
            window.processedBgImage = result;
            
        } catch (error) {
            console.error('❌ 背景移除失败:', error);
            elements.bgLoadingState.style.display = 'none';
            
            const emptyState = document.getElementById('bg-result-empty');
            if (emptyState) emptyState.style.display = 'block';
            
            elements.bgProcessBtn.disabled = false;
            alert('处理失败：' + error.message);
        }
    });
    
    // 下载按钮
    elements.bgDownloadBtn.addEventListener('click', () => {
        console.log('💾 下载处理后的图片');
        if (!window.processedBgImage) return;
        
        const link = document.createElement('a');
        link.href = window.processedBgImage;
        link.download = `background-removed-${Date.now()}.png`;
        link.click();
    });
    
    // 清空按钮
    if (elements.bgClearBtn) {
        elements.bgClearBtn.addEventListener('click', () => {
            console.log('🗑️ 清空结果');
            window.processedBgImage = null;
            elements.bgCompareView.style.display = 'none';
            
            const emptyState = document.getElementById('bg-result-empty');
            if (emptyState) emptyState.style.display = 'block';
            
            if (elements.bgDownloadBtn) elements.bgDownloadBtn.disabled = true;
            if (elements.bgClearBtn) elements.bgClearBtn.disabled = true;
        });
    }
    
    // 移除图片按钮
    if (elements.bgRemoveBtn) {
        elements.bgRemoveBtn.addEventListener('click', () => {
            console.log('❌ 移除已上传的图片');
            window.currentBgImage = null;
            window.processedBgImage = null;
            if (elements.bgImageInput) elements.bgImageInput.value = '';
            if (elements.bgUploadPlaceholder) elements.bgUploadPlaceholder.style.display = 'block';
            if (elements.bgImagePreview) elements.bgImagePreview.style.display = 'none';
            if (elements.bgProcessBtn) elements.bgProcessBtn.disabled = true;
            elements.bgCompareView.style.display = 'none';
            
            const emptyState = document.getElementById('bg-result-empty');
            if (emptyState) emptyState.style.display = 'block';
            
            if (elements.bgDownloadBtn) elements.bgDownloadBtn.disabled = true;
            if (elements.bgClearBtn) elements.bgClearBtn.disabled = true;
        });
    }
    
    console.log('🎉 背景移除功能初始化完成');
});

// 处理文件选择
function handleFileSelection(file, elements) {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    // 检查文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB！');
        return;
    }
    
    console.log('📖 开始读取图片...');
    
    // 读取图片
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log('✅ 图片读取成功');
        
        const imageData = e.target.result;
        elements.bgPreviewImg.src = imageData;
        elements.bgUploadPlaceholder.style.display = 'none';
        elements.bgImagePreview.style.display = 'block';
        
        // 显示图片信息
        const img = new Image();
        img.onload = () => {
            const sizeKB = (file.size / 1024).toFixed(2);
            elements.bgImageInfo.innerHTML = `
                <p><i class="fas fa-image"></i> ${img.width} × ${img.height} px</p>
                <p><i class="fas fa-file"></i> ${sizeKB} KB</p>
            `;
            console.log(`📐 图片尺寸: ${img.width} × ${img.height}`);
        };
        img.src = imageData;
        
        // 启用处理按钮
        elements.bgProcessBtn.disabled = false;
        
        // 保存到全局变量（如果需要）
        window.currentBgImage = imageData;
    };
    
    reader.onerror = () => {
        console.error('❌ 图片读取失败');
        alert('图片读取失败，请重试');
    };
    
    reader.readAsDataURL(file);
}

