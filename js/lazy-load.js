/**
 * 图片懒加载模块
 * 使用 Intersection Observer API 实现高性能图片懒加载
 */

class LazyLoadImages {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01,
            ...options
        };
        
        this.images = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // 检查浏览器是否支持 Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, loading all images immediately');
            this.loadAllImages();
            return;
        }
        
        // 创建观察者
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
        
        // 开始观察所有懒加载图片
        this.observeImages();
    }
    
    observeImages() {
        // 查找所有需要懒加载的图片
        this.images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        this.images.forEach(img => {
            this.observer.observe(img);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.observer.unobserve(img);
            }
        });
    }
    
    loadImage(img) {
        // 如果有 data-src 属性，使用它作为真实源
        const src = img.dataset.src || img.src;
        
        if (!src) return;
        
        // 创建新图片对象预加载
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            
            // 触发自定义事件
            img.dispatchEvent(new CustomEvent('imageLoaded', {
                detail: { src }
            }));
        };
        
        tempImage.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            img.classList.add('error');
        };
        
        tempImage.src = src;
    }
    
    loadAllImages() {
        // 降级方案：立即加载所有图片
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // 手动添加新图片到观察列表
    observe(img) {
        if (this.observer) {
            this.observer.observe(img);
        } else {
            this.loadImage(img);
        }
    }
    
    // 销毁观察者
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// 页面加载完成后自动初始化
let lazyLoader;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        lazyLoader = new LazyLoadImages();
    });
} else {
    lazyLoader = new LazyLoadImages();
}

// 导出供其他模块使用
window.LazyLoadImages = LazyLoadImages;
window.lazyLoader = lazyLoader;

