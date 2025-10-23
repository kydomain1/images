#!/usr/bin/env node

/**
 * CSS文件合并脚本
 * 将多个CSS文件合并为一个，减少HTTP请求
 */

const fs = require('fs');
const path = require('path');

// 配置
const CSS_FILES = [
    'css/style.css',
    'css/language-switcher.css',
    'css/prompt-optimizer.css'
];

const OUTPUT_FILE = 'css/bundle.css';

/**
 * 读取并合并CSS文件
 */
function buildCSS() {
    console.log('🎨 开始合并CSS文件...\n');
    console.log('='.repeat(50));
    
    let combinedCSS = '';
    combinedCSS += '/*!\n';
    combinedCSS += ' * AI图片生成器 - 合并CSS文件\n';
    combinedCSS += ` * 生成时间: ${new Date().toISOString()}\n`;
    combinedCSS += ' * 包含文件:\n';
    CSS_FILES.forEach(file => {
        combinedCSS += ` *   - ${file}\n`;
    });
    combinedCSS += ' */\n\n';
    
    // 逐个读取并合并
    CSS_FILES.forEach((file, index) => {
        console.log(`📄 读取: ${file}`);
        
        try {
            const content = fs.readFileSync(file, 'utf8');
            
            // 添加分隔注释
            combinedCSS += `/* ========================================\n`;
            combinedCSS += `   ${path.basename(file)}\n`;
            combinedCSS += `   ======================================== */\n\n`;
            
            // 添加CSS内容
            combinedCSS += content.trim();
            
            // 添加空行（除了最后一个文件）
            if (index < CSS_FILES.length - 1) {
                combinedCSS += '\n\n\n';
            }
            
            console.log(`  ✅ ${(content.length / 1024).toFixed(2)} KB`);
            
        } catch (error) {
            console.error(`  ❌ 读取失败: ${error.message}`);
            process.exit(1);
        }
    });
    
    // 写入合并后的文件
    try {
        fs.writeFileSync(OUTPUT_FILE, combinedCSS, 'utf8');
        const size = (combinedCSS.length / 1024).toFixed(2);
        
        console.log('\n' + '='.repeat(50));
        console.log(`✅ CSS合并完成！`);
        console.log(`📦 输出文件: ${OUTPUT_FILE}`);
        console.log(`📊 文件大小: ${size} KB`);
        console.log(`🚀 减少了 ${CSS_FILES.length - 1} 个HTTP请求\n`);
        
        // 显示使用说明
        console.log('💡 使用方法：');
        console.log('   在HTML中替换：');
        console.log('   <link rel="stylesheet" href="css/style.css">');
        console.log('   <link rel="stylesheet" href="css/language-switcher.css">');
        console.log('   <link rel="stylesheet" href="css/prompt-optimizer.css">');
        console.log('\n   为：');
        console.log('   <link rel="stylesheet" href="css/bundle.css">');
        console.log('');
        
    } catch (error) {
        console.error(`❌ 写入失败: ${error.message}`);
        process.exit(1);
    }
}

/**
 * 简单的CSS压缩（可选）
 */
function minifyCSS(css) {
    return css
        // 移除注释（保留版权信息）
        .replace(/\/\*(?![!*])([\s\S]*?)\*\//g, '')
        // 移除多余空白
        .replace(/\s+/g, ' ')
        // 移除空格（特定位置）
        .replace(/\s*([{}:;,])\s*/g, '$1')
        // 移除最后的分号
        .replace(/;}/g, '}')
        .trim();
}

/**
 * 生成压缩版本
 */
function buildMinified() {
    console.log('🗜️  生成压缩版本...');
    
    try {
        const bundleCSS = fs.readFileSync(OUTPUT_FILE, 'utf8');
        const minifiedCSS = minifyCSS(bundleCSS);
        const minifiedFile = OUTPUT_FILE.replace('.css', '.min.css');
        
        fs.writeFileSync(minifiedFile, minifiedCSS, 'utf8');
        
        const originalSize = (bundleCSS.length / 1024).toFixed(2);
        const minifiedSize = (minifiedCSS.length / 1024).toFixed(2);
        const savings = ((1 - minifiedCSS.length / bundleCSS.length) * 100).toFixed(1);
        
        console.log(`✅ 压缩完成: ${minifiedFile}`);
        console.log(`📊 原始大小: ${originalSize} KB`);
        console.log(`📦 压缩后: ${minifiedSize} KB`);
        console.log(`💰 节省: ${savings}%\n`);
        
    } catch (error) {
        console.error(`❌ 压缩失败: ${error.message}`);
    }
}

// 主函数
function main() {
    const args = process.argv.slice(2);
    
    buildCSS();
    
    // 如果指定了 --minify 参数，则生成压缩版本
    if (args.includes('--minify') || args.includes('-m')) {
        buildMinified();
    }
    
    console.log('🎉 构建完成！\n');
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { buildCSS, minifyCSS };


