// 图片裁剪功能初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('✂️ 初始化图片裁剪功能...');
    
    const elements = {
        uploadArea: document.getElementById('crop-upload-area'),
        imageInput: document.getElementById('crop-image-input'),
        selectBtn: document.getElementById('crop-select-btn'),
        uploadPlaceholder: document.getElementById('crop-upload-placeholder'),
        imagePreview: document.getElementById('crop-image-preview'),
        previewImg: document.getElementById('crop-preview-img'),
        removeBtn: document.getElementById('crop-remove-btn'),
        ratioSelect: document.getElementById('crop-ratio'),
        sizeSelect: document.getElementById('crop-output-size'),
        processBtn: document.getElementById('crop-process-btn'),
        resultEmpty: document.getElementById('crop-result-empty'),
        resultDisplay: document.getElementById('crop-result-display'),
        originalImg: document.getElementById('crop-original-img'),
        processedImg: document.getElementById('crop-processed-img'),
        downloadBtn: document.getElementById('crop-download-btn'),
        originalInfo: document.getElementById('crop-original-info'),
        processedInfo: document.getElementById('crop-processed-info')
    };
    
    if (!elements.selectBtn) {
        console.log('⏭️ 裁剪功能未加载');
        return;
    }
    
    let currentImage = null;
    let croppedImage = null;
    
    // 上传功能
    elements.selectBtn.addEventListener('click', () => {
        elements.imageInput.click();
    });
    
    elements.imageInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    });
    
    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            elements.previewImg.src = currentImage;
            elements.uploadPlaceholder.style.display = 'none';
            elements.imagePreview.style.display = 'block';
            elements.processBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    // 裁剪处理
    elements.processBtn.addEventListener('click', async () => {
        if (!currentImage) return;
        
        const ratio = elements.ratioSelect.value;
        const outputSize = elements.sizeSelect.value;
        
        try {
            const cropper = new ImageCropper(currentImage);
            
            let result;
            if (ratio === 'free') {
                result = await cropper.crop();
            } else {
                const size = outputSize === 'original' ? 1024 : parseInt(outputSize);
                const ratioValue = ImageCropper.RATIOS[ratio]?.value || 1;
                const width = size;
                const height = Math.round(size / ratioValue);
                result = await cropper.cropCenter(width, height);
            }
            
            croppedImage = result;
            elements.resultEmpty.style.display = 'none';
            elements.resultDisplay.style.display = 'block';
            elements.originalImg.src = currentImage;
            elements.processedImg.src = result;
            
            console.log('✅ 裁剪完成');
        } catch (error) {
            console.error('❌ 裁剪失败:', error);
            alert('裁剪失败：' + error.message);
        }
    });
    
    // 下载
    elements.downloadBtn.addEventListener('click', () => {
        if (!croppedImage) return;
        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = `cropped-${Date.now()}.png`;
        link.click();
    });
    
    console.log('✅ 裁剪功能初始化完成');
});

