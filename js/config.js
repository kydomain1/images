/**
 * 全局配置文件
 * 统一管理应用配置，支持开发环境和生产环境
 */

(function(window) {
    'use strict';
    
    // 检测环境
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    const isDevelopment = isLocalhost || window.location.hostname.includes('localhost');
    
    // 应用配置
    const CONFIG = {
        // 环境信息
        environment: isDevelopment ? 'development' : 'production',
        isDevelopment: isDevelopment,
        isProduction: !isDevelopment,
        
        // 域名配置
        baseURL: isDevelopment ? 
            'http://localhost:3000' : 
            window.location.origin,
        
        // API端点
        api: {
            base: isDevelopment ? 
                'http://localhost:3000/api' : 
                window.location.origin + '/api',
            
            // 各个API端点
            tongyi: '/tongyi-generate',
            contact: '/contact',
            health: '/health'
        },
        
        // R2存储配置
        storage: {
            publicURL: 'https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev'
        },
        
        // 日志配置
        logging: {
            // 生产环境禁用console.log
            enabled: isDevelopment,
            level: isDevelopment ? 'debug' : 'error'
        },
        
        // 性能配置
        performance: {
            enableMonitoring: true,
            enableLazyLoad: true,
            enablePreload: true
        },
        
        // 功能开关
        features: {
            multiLanguage: true,
            promptOptimizer: true,
            history: true,
            // 已禁用的功能
            img2img: false,
            upscale: false
        },
        
        // SEO配置
        seo: {
            siteName: 'AI图片生成器',
            siteDescription: '免费在线AI图片生成器，输入文字即可生成高质量图片',
            ogImage: '/assets/og-image.jpg'
        },
        
        // 应用版本
        version: '1.0.0'
    };
    
    // 日志工具函数
    const Logger = {
        log: function(...args) {
            if (CONFIG.logging.enabled) {
                console.log(...args);
            }
        },
        
        error: function(...args) {
            // 错误总是记录
            console.error(...args);
        },
        
        warn: function(...args) {
            if (CONFIG.logging.enabled || CONFIG.logging.level === 'warn') {
                console.warn(...args);
            }
        },
        
        info: function(...args) {
            if (CONFIG.logging.enabled) {
                console.info(...args);
            }
        },
        
        debug: function(...args) {
            if (CONFIG.logging.enabled && CONFIG.logging.level === 'debug') {
                console.debug(...args);
            }
        }
    };
    
    // 获取完整的API URL
    CONFIG.getApiURL = function(endpoint) {
        return this.api.base + (this.api[endpoint] || endpoint);
    };
    
    // 导出到全局
    window.APP_CONFIG = CONFIG;
    window.Logger = Logger;
    
    // 打印配置信息（仅开发环境）
    if (CONFIG.isDevelopment) {
        console.log('🔧 应用配置:', CONFIG);
        console.log('🌐 环境:', CONFIG.environment);
        console.log('🔗 基础URL:', CONFIG.baseURL);
        console.log('📡 API端点:', CONFIG.api.base);
        console.log('📦 版本:', CONFIG.version);
    }
    
})(window);

