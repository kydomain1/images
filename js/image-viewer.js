// ==================== 图片查看功能 ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🖼️ 初始化图片查看功能...');
    
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');
    const modalDownload = document.getElementById('modal-download');
    
    if (!modal || !modalImage) {
        console.log('⏭️ 图片模态框未找到');
        return;
    }
    
    let currentImageSrc = '';
    
    // 为所有结果图片添加点击事件
    function enableImageClick() {
        // 背景移除的图片
        const bgImages = document.querySelectorAll('#bg-original-img, #bg-processed-img');
        bgImages.forEach(img => {
            if (img && !img.dataset.clickEnabled) {
                img.style.cursor = 'pointer';
                img.title = '点击查看大图';
                img.addEventListener('click', () => openImageModal(img.src));
                img.dataset.clickEnabled = 'true';
                console.log('✅ 已为背景移除图片添加点击事件');
            }
        });
        
        // AI放大的图片
        const upscaleImages = document.querySelectorAll('#upscale-original-img, #upscale-processed-img');
        upscaleImages.forEach(img => {
            if (img && !img.dataset.clickEnabled) {
                img.style.cursor = 'pointer';
                img.title = '点击查看大图';
                img.addEventListener('click', () => openImageModal(img.src));
                img.dataset.clickEnabled = 'true';
                console.log('✅ 已为AI放大图片添加点击事件');
            }
        });
        
        // 文字生成的图片
        const generatedImages = document.querySelectorAll('#output-grid img');
        generatedImages.forEach(img => {
            if (img && !img.dataset.clickEnabled) {
                img.style.cursor = 'pointer';
                img.title = '点击查看大图';
                img.addEventListener('click', () => openImageModal(img.src));
                img.dataset.clickEnabled = 'true';
            }
        });
    }
    
    // 打开模态框
    function openImageModal(imageSrc) {
        if (!imageSrc || imageSrc === '') return;
        
        console.log('🖼️ 打开图片查看器');
        currentImageSrc = imageSrc;
        modalImage.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }
    
    // 关闭模态框
    function closeImageModal() {
        console.log('❌ 关闭图片查看器');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 点击关闭按钮
    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeImageModal();
        }
    });
    
    // 下载按钮
    if (modalDownload) {
        modalDownload.addEventListener('click', () => {
            console.log('💾 下载当前图片');
            if (!currentImageSrc) return;
            
            const link = document.createElement('a');
            link.href = currentImageSrc;
            link.download = `image-${Date.now()}.png`;
            link.click();
        });
    }
    
    // 初始时启用点击
    enableImageClick();
    
    // 监听DOM变化，自动为新图片添加点击事件
    const observer = new MutationObserver(() => {
        enableImageClick();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ 图片查看功能初始化完成');
});

