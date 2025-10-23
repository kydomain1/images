#!/usr/bin/env node

/**
 * 自动更新资源文件的版本号
 * 基于文件内容生成哈希值，确保缓存正确更新
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 配置
const CONFIG = {
    // HTML文件
    htmlFiles: [
        'index.html',
        'tool.html',
        'pages/about.html',
        'pages/contact.html',
        'pages/privacy.html',
        'pages/terms.html'
    ],
    // 需要添加版本号的资源
    assets: {
        js: ['js/config.js', 'js/i18n.js', 'js/tool.js', 'js/img2img.js', 'js/api-config.js', 'js/tongyi-api.js', 'js/prompt-optimizer.js'],
        css: ['css/style.css', 'css/language-switcher.css', 'css/prompt-optimizer.css']
    }
};

/**
 * 生成文件哈希值
 */
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    } catch (error) {
        console.warn(`⚠️  无法读取文件: ${filePath}`);
        return 'v' + Date.now();
    }
}

/**
 * 更新HTML文件中的版本号
 */
function updateVersionsInHTML(htmlPath) {
    console.log(`\n📝 处理: ${htmlPath}`);
    
    let content;
    try {
        content = fs.readFileSync(htmlPath, 'utf8');
    } catch (error) {
        console.warn(`⚠️  跳过: ${htmlPath} (文件不存在)`);
        return;
    }
    
    let modified = false;
    
    // 更新JS文件版本
    CONFIG.assets.js.forEach(jsFile => {
        const hash = getFileHash(jsFile);
        const fileName = path.basename(jsFile);
        
        // 匹配多种模式
        const patterns = [
            new RegExp(`(src=["']${jsFile})\\?v=[^"']*`, 'g'),
            new RegExp(`(src=["']${jsFile})["']`, 'g')
        ];
        
        patterns.forEach(pattern => {
            const newContent = content.replace(pattern, `$1?v=${hash}"`);
            if (newContent !== content) {
                console.log(`  ✅ ${fileName}: ?v=${hash}`);
                content = newContent;
                modified = true;
            }
        });
    });
    
    // 更新CSS文件版本
    CONFIG.assets.css.forEach(cssFile => {
        const hash = getFileHash(cssFile);
        const fileName = path.basename(cssFile);
        
        const patterns = [
            new RegExp(`(href=["']${cssFile})\\?v=[^"']*`, 'g'),
            new RegExp(`(href=["']${cssFile})["']`, 'g')
        ];
        
        patterns.forEach(pattern => {
            const newContent = content.replace(pattern, `$1?v=${hash}"`);
            if (newContent !== content) {
                console.log(`  ✅ ${fileName}: ?v=${hash}`);
                content = newContent;
                modified = true;
            }
        });
    });
    
    // 保存文件
    if (modified) {
        fs.writeFileSync(htmlPath, content, 'utf8');
        console.log(`  💾 已更新`);
    } else {
        console.log(`  ⏭️  无需更新`);
    }
}

/**
 * 主函数
 */
function main() {
    console.log('🚀 开始更新版本号...\n');
    console.log('='.repeat(50));
    
    // 处理所有HTML文件
    CONFIG.htmlFiles.forEach(updateVersionsInHTML);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ 版本号更新完成！\n');
    console.log('💡 提示：');
    console.log('   - 版本号基于文件内容哈希生成');
    console.log('   - 文件未改变则版本号不变');
    console.log('   - 每次修改CSS/JS后运行此脚本\n');
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { getFileHash, updateVersionsInHTML };


