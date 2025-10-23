// 格式转换功能初始化（支持批量）
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 初始化格式转换功能...');
    
    const elements = {
        imageInput: document.getElementById('convert-image-input'),
        selectBtn: document.getElementById('convert-select-btn'),
        uploadPlaceholder: document.getElementById('convert-upload-placeholder'),
        fileList: document.getElementById('convert-file-list'),
        fileCount: document.getElementById('convert-file-count'),
        filesGrid: document.getElementById('convert-files-grid'),
        clearBtn: document.getElementById('convert-clear-btn'),
        formatSelect: document.getElementById('convert-format'),
        qualitySelect: document.getElementById('convert-quality'),
        processBtn: document.getElementById('convert-process-btn'),
        resultEmpty: document.getElementById('convert-result-empty'),
        progress: document.getElementById('convert-progress'),
        progressBar: document.getElementById('convert-progress-bar'),
        progressInfo: document.getElementById('convert-progress-info'),
        resultDisplay: document.getElementById('convert-result-display'),
        resultsGrid: document.getElementById('convert-results-grid'),
        downloadAllBtn: document.getElementById('convert-download-all-btn'),
        resultCount: document.getElementById('convert-result-count')
    };
    
    if (!elements.selectBtn) {
        console.log('⏭️ 转换功能未加载');
        return;
    }
    
    let selectedFiles = [];
    let convertedImages = [];
    
    // 选择文件
    elements.selectBtn.addEventListener('click', () => {
        elements.imageInput.click();
    });
    
    elements.imageInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
    });
    
    function handleFiles(files) {
        selectedFiles = [];
        elements.filesGrid.innerHTML = '';
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedFiles.push({
                    data: e.target.result,
                    name: file.name,
                    size: file.size
                });
                
                // 显示缩略图
                const thumb = document.createElement('div');
                thumb.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 5px;">`;
                elements.filesGrid.appendChild(thumb);
                
                updateFileList();
            };
            reader.readAsDataURL(file);
        });
    }
    
    function updateFileList() {
        elements.fileCount.textContent = selectedFiles.length;
        elements.uploadPlaceholder.style.display = 'none';
        elements.fileList.style.display = 'block';
        elements.processBtn.disabled = selectedFiles.length === 0;
    }
    
    // 清空
    elements.clearBtn.addEventListener('click', () => {
        selectedFiles = [];
        elements.imageInput.value = '';
        elements.uploadPlaceholder.style.display = 'block';
        elements.fileList.style.display = 'none';
        elements.processBtn.disabled = true;
    });
    
    // 转换处理
    elements.processBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;
        
        const format = elements.formatSelect.value;
        const quality = parseFloat(elements.qualitySelect.value);
        
        elements.resultEmpty.style.display = 'none';
        elements.progress.style.display = 'flex';
        elements.processBtn.disabled = true;
        
        const converter = new ImageConverter();
        convertedImages = [];
        
        for (let i = 0; i < selectedFiles.length; i++) {
            elements.progressBar.style.width = ((i / selectedFiles.length) * 100) + '%';
            elements.progressInfo.textContent = `${i + 1} / ${selectedFiles.length}`;
            
            try {
                const result = await converter.convert(selectedFiles[i].data, { format, quality });
                convertedImages.push({
                    ...result,
                    originalName: selectedFiles[i].name
                });
            } catch (error) {
                console.error('转换失败:', error);
            }
        }
        
        elements.progress.style.display = 'none';
        showResults();
    });
    
    function showResults() {
        elements.resultDisplay.style.display = 'block';
        elements.resultCount.textContent = `${convertedImages.length} 张图片`;
        elements.resultsGrid.innerHTML = '';
        
        convertedImages.forEach((img, index) => {
            const card = document.createElement('div');
            card.className = 'convert-result-card';
            card.innerHTML = `
                <img src="${img.dataUrl}" alt="Converted ${index + 1}">
                <div class="convert-result-info">
                    <div><i class="fas fa-file-image"></i> ${img.format.toUpperCase()}</div>
                    <div><i class="fas fa-weight-hanging"></i> ${img.size}KB</div>
                    <div><i class="fas fa-ruler-combined"></i> ${img.width} × ${img.height}</div>
                </div>
                <button onclick="downloadSingle(${index})" class="convert-download-btn">
                    <i class="fas fa-download"></i> <span data-i18n="btn.download">下载</span>
                </button>
            `;
            elements.resultsGrid.appendChild(card);
        });
        
        // 重新应用多语言
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
    }
    
    // 下载单个
    window.downloadSingle = (index) => {
        const img = convertedImages[index];
        const link = document.createElement('a');
        link.href = img.dataUrl;
        link.download = `converted-${index + 1}.${img.format}`;
        link.click();
    };
    
    // 批量下载
    elements.downloadAllBtn.addEventListener('click', () => {
        convertedImages.forEach((img, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = img.dataUrl;
                link.download = `converted-${index + 1}.${img.format}`;
                link.click();
            }, index * 200);
        });
    });
    
    console.log('✅ 转换功能初始化完成');
});

