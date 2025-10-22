// 政策页面交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化多语言功能
    initLanguageSwitcher();
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
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
                console.warn('Invalid selector:', href);
            }
        });
    });
    
    // 添加活动链接高亮
    const currentPage = window.location.pathname.split('/').pop();
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    footerLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
});

// 初始化语言切换器
function initLanguageSwitcher() {
    const languageSwitcher = document.getElementById('languageSwitcher');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLanguageDisplay = document.getElementById('currentLanguage');
    
    if (!languageSwitcher || !languageDropdown) {
        console.warn('Language switcher elements not found');
        return;
    }
    
    // 从本地存储读取语言设置
    const savedLang = localStorage.getItem('preferredLanguage') || 'zh-CN';
    updateLanguage(savedLang);
    
    // 切换下拉菜单显示
    languageSwitcher.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // 选择语言
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            updateLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
            languageDropdown.classList.remove('show');
        });
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('show');
    });
}

// 更新页面语言
function updateLanguage(lang) {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded');
        return;
    }
    
    const langData = translations[lang] || translations['en'];
    
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // 判断元素类型
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = langData[key];
            } else {
                element.textContent = langData[key];
            }
        }
    });
    
    // 更新所有带有 data-i18n-placeholder 属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            element.placeholder = langData[key];
        }
    });
    
    // 更新语言显示
    const currentLanguageDisplay = document.getElementById('currentLanguage');
    if (currentLanguageDisplay) {
        const languageNames = {
            'zh-CN': '中文',
            'zh-TW': '繁體中文',
            'en': 'English',
            'ja': '日本語',
            'ko': '한국어',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'pt': 'Português',
            'ru': 'Русский',
            'ar': 'العربية',
            'hi': 'हिन्दी',
            'th': 'ไทย',
            'vi': 'Tiếng Việt',
            'id': 'Bahasa Indonesia',
            'it': 'Italiano',
            'tr': 'Türkçe'
        };
        currentLanguageDisplay.textContent = languageNames[lang] || 'English';
    }
    
    // 更新HTML lang属性
    document.documentElement.lang = lang;
}


