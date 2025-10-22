// 首页主要功能脚本

document.addEventListener('DOMContentLoaded', function() {
    // 形状选择器
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const widthDisplay = document.getElementById('width-display');
    const heightDisplay = document.getElementById('height-display');
    
    // 尺寸映射
    const sizeMap = {
        '1:1': { width: 1024, height: 1024 },
        '9:16': { width: 1024, height: 1792 },
        '4:5': { width: 1024, height: 1280 },
        '3:4': { width: 768, height: 1024 },
        '2:3': { width: 682, height: 1024 },
        '16:9': { width: 1792, height: 1024 },
        '5:4': { width: 1280, height: 1024 },
        '4:3': { width: 1024, height: 768 },
        '3:2': { width: 1024, height: 682 }
    };
    
    shapeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有active类
            shapeButtons.forEach(btn => btn.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            
            // 更新尺寸显示
            const ratio = this.dataset.ratio;
            if (sizeMap[ratio]) {
                widthDisplay.textContent = sizeMap[ratio].width;
                heightDisplay.textContent = sizeMap[ratio].height;
            }
        });
    });
    
    // FAQ手风琴效果
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 如果当前项已激活，则关闭它
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            } else {
                // 关闭所有其他项
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                // 打开当前项
                item.classList.add('active');
            }
        });
    });
    
    // 提示词输入字符计数（如果需要）
    const promptInput = document.getElementById('prompt-input');
    if (promptInput) {
        promptInput.addEventListener('input', function() {
            // 可以添加字符计数功能
            console.log('Prompt length:', this.value.length);
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // 如果只是 #，跳过
            if (href === '#') {
                return;
            }
            
            e.preventDefault();
            
            try {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                // 忽略无效的选择器错误
                console.warn('Invalid selector:', href);
            }
        });
    });
});

