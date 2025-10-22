/**
 * 网站性能优化模块
 * 包括性能监控、资源预加载、缓存管理等
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        // 页面加载完成后执行优化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.optimize();
            });
        } else {
            this.optimize();
        }
        
        // 监控性能指标
        this.monitorPerformance();
    }
    
    optimize() {
        // 1. 预加载关键资源
        this.preloadCriticalResources();
        
        // 2. 延迟加载非关键脚本
        this.deferNonCriticalScripts();
        
        // 3. 优化字体加载
        this.optimizeFontLoading();
        
        // 4. 启用浏览器缓存提示
        this.setupCaching();
        
        // 5. 压缩和优化图片
        this.optimizeImages();
    }
    
    preloadCriticalResources() {
        // 预加载关键CSS
        const criticalCSS = [
            'css/style.css',
            'css/language-switcher.css'
        ];
        
        criticalCSS.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                document.head.appendChild(link);
            }
        });
    }
    
    deferNonCriticalScripts() {
        // 标记非关键脚本延迟加载
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
            script.defer = true;
        });
    }
    
    optimizeFontLoading() {
        // 使用 font-display: swap 优化字体加载
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                console.log('✅ 所有字体已加载');
            });
        }
    }
    
    setupCaching() {
        // 设置Service Worker进行离线缓存（可选）
        if ('serviceWorker' in navigator) {
            // 注释掉以避免影响开发
            // navigator.serviceWorker.register('/sw.js').then(reg => {
            //     console.log('Service Worker registered:', reg);
            // });
        }
    }
    
    optimizeImages() {
        // 为所有图片添加 loading="lazy" 属性
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.loading = 'lazy';
            
            // 添加解码提示
            img.decoding = 'async';
        });
    }
    
    monitorPerformance() {
        // 使用 Performance API 监控页面性能
        if (!window.performance) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;
                
                this.metrics = {
                    pageLoadTime,
                    connectTime,
                    renderTime,
                    domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart
                };
                
                console.log('📊 性能指标:', {
                    '页面加载时间': `${pageLoadTime}ms`,
                    '服务器响应时间': `${connectTime}ms`,
                    '渲染时间': `${renderTime}ms`,
                    'DOM就绪时间': `${this.metrics.domReady}ms`
                });
                
                // 发送性能数据（可选）
                this.reportPerformance();
            }, 0);
        });
        
        // 监控Web Vitals (Core Web Vitals)
        this.monitorWebVitals();
    }
    
    monitorWebVitals() {
        // 监控 First Contentful Paint (FCP)
        if (window.PerformanceObserver) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            console.log('🎨 FCP:', entry.startTime, 'ms');
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                // PerformanceObserver not supported
            }
        }
    }
    
    reportPerformance() {
        // 可以发送性能数据到分析服务
        // 例如：Google Analytics, 自定义后端等
        
        // 示例：检测慢速页面
        if (this.metrics.pageLoadTime > 3000) {
            console.warn('⚠️ 页面加载较慢:', this.metrics.pageLoadTime, 'ms');
            
            // 可以在此处发送警报或记录日志
        } else {
            console.log('✅ 页面加载性能良好');
        }
    }
    
    // 压缩本地存储数据
    compressLocalStorage() {
        try {
            const storage = { ...localStorage };
            const compressed = JSON.stringify(storage);
            
            console.log('💾 LocalStorage 大小:', 
                new Blob([compressed]).size, 'bytes');
                
            // 清理过期数据
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
            const now = Date.now();
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('history_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data.timestamp && (now - data.timestamp > maxAge)) {
                            localStorage.removeItem(key);
                            console.log('🗑️ 清理过期数据:', key);
                        }
                    } catch (e) {
                        // 忽略无效数据
                    }
                }
            });
        } catch (e) {
            console.error('压缩本地存储失败:', e);
        }
    }
    
    // 获取性能报告
    getReport() {
        return {
            metrics: this.metrics,
            resources: this.getResourceTiming(),
            memory: this.getMemoryInfo()
        };
    }
    
    getResourceTiming() {
        if (!window.performance || !window.performance.getEntriesByType) {
            return [];
        }
        
        return window.performance.getEntriesByType('resource')
            .map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize
            }))
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10); // 返回前10个最慢的资源
    }
    
    getMemoryInfo() {
        if (window.performance && window.performance.memory) {
            return {
                usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                limit: window.performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
}

// 自动初始化
const performanceOptimizer = new PerformanceOptimizer();

// 导出供其他模块使用
window.PerformanceOptimizer = PerformanceOptimizer;
window.performanceOptimizer = performanceOptimizer;

// 定期清理本地存储（每天一次）
setInterval(() => {
    performanceOptimizer.compressLocalStorage();
}, 24 * 60 * 60 * 1000);

