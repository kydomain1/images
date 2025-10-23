// ==================== 滤镜功能初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 初始化滤镜功能...');
    
    const elements = {
        uploadArea: document.getElementById('filter-upload-area'),
        imageInput: document.getElementById('filter-image-input'),
        selectBtn: document.getElementById('filter-select-btn'),
        uploadPlaceholder: document.getElementById('filter-upload-placeholder'),
        imagePreview: document.getElementById('filter-image-preview'),
        previewImg: document.getElementById('filter-preview-img'),
        removeBtn: document.getElementById('filter-remove-btn'),
        resultEmpty: document.getElementById('filter-result-empty'),
        previewArea: document.getElementById('filter-preview-area'),
        originalImg: document.getElementById('filter-original-img'),
        processedImg: document.getElementById('filter-processed-img'),
        downloadBtn: document.getElementById('filter-download-btn'),
        applyBtn: document.getElementById('filter-apply-btn'),
        resetBtn: document.getElementById('filter-reset-btn')
    };
    
    // 检查关键元素
    if (!elements.selectBtn || !elements.imageInput) {
        console.log('⏭️ 滤镜功能暂未加载');
        return;
    }
    
    console.log('✅ 滤镜元素已找到');
    
    let filterEngine = null;
    window.currentFilterImage = null;
    
    // ==================== 上传功能 ====================
    
    elements.selectBtn.addEventListener('click', () => {
        console.log('🖱️ 点击选择图片');
        elements.imageInput.click();
    });
    
    elements.imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) await handleFilterFile(file);
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
        
        elements.uploadArea.addEventListener('drop', async (e) => {
            e.preventDefault();
            elements.uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) await handleFilterFile(files[0]);
        });
    }
    
    // 移除图片
    if (elements.removeBtn) {
        elements.removeBtn.addEventListener('click', () => {
            window.currentFilterImage = null;
            filterEngine = null;
            elements.imageInput.value = '';
            elements.uploadPlaceholder.style.display = 'block';
            elements.imagePreview.style.display = 'none';
            elements.previewArea.style.display = 'none';
            elements.resultEmpty.style.display = 'block';
            elements.applyBtn.disabled = true;
            elements.resetBtn.disabled = true;
            resetAllSliders();
        });
    }
    
    // ==================== 处理文件 ====================
    
    async function handleFilterFile(file) {
        console.log(`📁 选中文件: ${file.name}`);
        
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            window.currentFilterImage = imageData;
            
            // 显示预览
            elements.previewImg.src = imageData;
            elements.uploadPlaceholder.style.display = 'none';
            elements.imagePreview.style.display = 'block';
            
            // 初始化滤镜引擎
            if (typeof ImageFilter === 'undefined') {
                console.error('❌ ImageFilter类未加载');
                alert('滤镜引擎加载失败！请刷新页面重试。');
                return;
            }
            
            console.log('🎨 创建滤镜引擎...');
            filterEngine = new ImageFilter();
            await filterEngine.loadImage(imageData);
            console.log('✅ 滤镜引擎已就绪');
            
            // 显示预览区域
            elements.resultEmpty.style.display = 'none';
            elements.previewArea.style.display = 'block';
            elements.originalImg.src = imageData;
            elements.processedImg.src = imageData;
            
            elements.applyBtn.disabled = false;
            elements.resetBtn.disabled = false;
            
            console.log('✅ 滤镜引擎已初始化');
        };
        
        reader.readAsDataURL(file);
    }
    
    // ==================== 预设滤镜 ====================
    
    function initPresetButtons() {
        const presetBtns = document.querySelectorAll('.filter-preset-btn');
        console.log(`找到 ${presetBtns.length} 个预设滤镜按钮`);
        
        presetBtns.forEach((btn, index) => {
            const filterType = btn.dataset.filter;
            console.log(`  按钮 ${index + 1}: ${filterType}`);
            
            btn.addEventListener('click', () => {
                console.log(`🖱️ 点击了预设滤镜按钮: ${filterType}`);
                
                if (!filterEngine) {
                    console.error('❌ 滤镜引擎未初始化');
                    alert('请先上传图片！');
                    return;
                }
                
                console.log(`🎨 应用预设滤镜: ${filterType}`);
            
            // 应用滤镜
            try {
                switch (filterType) {
                    case 'grayscale':
                        filterEngine.filterGrayscale();
                        break;
                    case 'vintage':
                        filterEngine.filterVintage();
                        break;
                    case 'cool':
                        filterEngine.filterCool();
                        break;
                    case 'warm':
                        filterEngine.filterWarm();
                        break;
                    case 'film':
                        filterEngine.filterFilm();
                        break;
                    case 'sunset':
                        filterEngine.filterSunset();
                        break;
                    case 'ocean':
                        filterEngine.filterOcean();
                        break;
                    case 'sakura':
                        filterEngine.filterSakura();
                        break;
                    case 'autumn':
                        filterEngine.filterAutumn();
                        break;
                    case 'hdr':
                        filterEngine.filterHDR();
                        break;
                    case 'invert':
                        filterEngine.filterInvert();
                        break;
                    case 'reset':
                        filterEngine.reset();
                        resetAllSliders();
                        break;
                }
                
                // 更新预览
                const filteredImage = filterEngine.getImage();
                console.log('🖼️ 更新预览图片, 数据长度:', filteredImage.length);
                elements.processedImg.src = filteredImage;
                
                // 强制刷新图片显示
                elements.processedImg.style.opacity = '0';
                setTimeout(() => {
                    elements.processedImg.style.opacity = '1';
                }, 10);
                
            } catch (error) {
                console.error('❌ 滤镜应用失败:', error);
                alert('滤镜应用失败：' + error.message);
            }
            
                // 高亮当前按钮
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                console.log('✅ 滤镜已应用，预览已更新');
            });
        });
    }
    
    // 延迟初始化预设按钮（确保DOM完全加载）
    setTimeout(initPresetButtons, 500);
    
    // ==================== 调节滑块 ====================
    
    const sliders = {
        brightness: { input: document.getElementById('filter-brightness'), value: document.getElementById('filter-brightness-value') },
        contrast: { input: document.getElementById('filter-contrast'), value: document.getElementById('filter-contrast-value') },
        saturation: { input: document.getElementById('filter-saturation'), value: document.getElementById('filter-saturation-value') },
        temperature: { input: document.getElementById('filter-temperature'), value: document.getElementById('filter-temperature-value') }
    };
    
    // 添加滑块事件
    Object.entries(sliders).forEach(([key, slider]) => {
        if (slider.input && slider.value) {
            console.log(`✅ 添加滑块事件: ${key}`);
            
            slider.input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                slider.value.textContent = value;
                console.log(`🎚️ ${key} 调节到: ${value}`);
                
                if (filterEngine) {
                    applyCurrentFilters();
                } else {
                    console.warn('⚠️ 滤镜引擎未初始化');
                }
            });
        } else {
            console.error(`❌ 滑块元素未找到: ${key}`, {
                input: !!slider.input,
                value: !!slider.value
            });
        }
    });
    
    // 应用当前所有调节
    function applyCurrentFilters() {
        if (!filterEngine) {
            console.error('❌ 滤镜引擎不存在');
            return;
        }
        
        console.log('🎨 开始应用当前调节...');
        
        try {
            // 应用所有调节
            const filters = {
                brightness: parseInt(sliders.brightness.input.value),
                contrast: parseInt(sliders.contrast.input.value),
                saturation: parseInt(sliders.saturation.input.value),
                temperature: parseInt(sliders.temperature.input.value),
                hue: 0
            };
            
            console.log('📝 当前调节值:', filters);
            
            filterEngine.applyFilters(filters);
            
            // 更新预览
            const filteredImage = filterEngine.getImage();
            console.log('🖼️ 生成滤镜图片, 长度:', filteredImage.substring(0, 50) + '...');
            elements.processedImg.src = filteredImage;
            
            console.log('✅ 预览已更新');
            
        } catch (error) {
            console.error('❌ 应用滤镜失败:', error);
        }
    }
    
    // 重置所有滑块
    function resetAllSliders() {
        sliders.brightness.input.value = 0;
        sliders.brightness.value.textContent = '0';
        sliders.contrast.input.value = 0;
        sliders.contrast.value.textContent = '0';
        sliders.saturation.input.value = 100;
        sliders.saturation.value.textContent = '100';
        sliders.temperature.input.value = 0;
        sliders.temperature.value.textContent = '0';
        
        // 移除预设按钮的高亮
        presetBtns.forEach(b => b.classList.remove('active'));
    }
    
    // ==================== 应用和下载 ====================
    
    elements.applyBtn.addEventListener('click', () => {
        console.log('✅ 应用滤镜');
        if (filterEngine) {
            elements.processedImg.src = filterEngine.getImage();
            alert('滤镜已应用！可以下载了');
        }
    });
    
    elements.resetBtn.addEventListener('click', () => {
        console.log('🔄 重置滤镜');
        if (filterEngine) {
            filterEngine.reset();
            elements.processedImg.src = filterEngine.getImage();
            resetAllSliders();
        }
    });
    
    elements.downloadBtn.addEventListener('click', () => {
        console.log('💾 下载滤镜后的图片');
        if (!filterEngine) return;
        
        const link = document.createElement('a');
        link.href = filterEngine.getImage();
        link.download = `filtered-${Date.now()}.png`;
        link.click();
    });
    
    console.log('🎉 滤镜功能初始化完成');
});

