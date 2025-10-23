// ==================== 图片滤镜功能 ====================

class ImageFilter {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.originalImageData = null;
    }

    // 加载图片
    loadImage(imageSrc) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);
                
                // 保存原始图片数据
                this.originalImageData = this.ctx.getImageData(0, 0, img.width, img.height);
                
                console.log(`✅ 图片已加载: ${img.width}×${img.height}`);
                resolve(this.canvas.toDataURL());
            };
            
            img.onerror = reject;
            img.src = imageSrc;
        });
    }

    // 重置到原始图片
    reset() {
        if (this.originalImageData) {
            this.ctx.putImageData(this.originalImageData, 0, 0);
        }
    }

    // ==================== 基础调节滤镜 ====================

    // 亮度调节（-100 到 100）
    adjustBrightness(value) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + value));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 对比度调节（-100 到 100）
    adjustContrast(value) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const factor = (259 * (value + 255)) / (255 * (259 - value));
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 饱和度调节（0 到 200，100为原始）
    adjustSaturation(value) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const factor = value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 转换到HSL，调整饱和度
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            
            data[i] = Math.min(255, Math.max(0, gray + (r - gray) * factor));
            data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * factor));
            data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * factor));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 色温调节（-100 到 100）
    adjustTemperature(value) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (value > 0) {
                // 暖色调（增加红色，减少蓝色）
                data[i] = Math.min(255, data[i] + value * 0.5);
                data[i + 2] = Math.max(0, data[i + 2] - value * 0.5);
            } else {
                // 冷色调（减少红色，增加蓝色）
                data[i] = Math.max(0, data[i] + value * 0.5);
                data[i + 2] = Math.min(255, data[i + 2] - value * 0.5);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 色相调节（-180 到 180）
    adjustHue(value) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const angle = value * Math.PI / 180;
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, Math.max(0, 
                r * (0.299 + 0.701 * cos + 0.168 * sin) +
                g * (0.587 - 0.587 * cos + 0.330 * sin) +
                b * (0.114 - 0.114 * cos - 0.497 * sin)
            ));
            
            data[i + 1] = Math.min(255, Math.max(0,
                r * (0.299 - 0.299 * cos - 0.328 * sin) +
                g * (0.587 + 0.413 * cos + 0.035 * sin) +
                b * (0.114 - 0.114 * cos + 0.292 * sin)
            ));
            
            data[i + 2] = Math.min(255, Math.max(0,
                r * (0.299 - 0.3 * cos + 1.25 * sin) +
                g * (0.587 - 0.588 * cos - 1.05 * sin) +
                b * (0.114 + 0.886 * cos - 0.203 * sin)
            ));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // ==================== 预设滤镜 ====================

    // 黑白滤镜
    filterGrayscale() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = data[i + 1] = data[i + 2] = gray;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 复古滤镜
    filterVintage() {
        console.log('📜 应用复古滤镜...');
        this.reset();
        this.applyFilters({
            brightness: -5,
            contrast: -10,
            saturation: 80,
            temperature: 20,
            hue: 0
        });
    }

    // 冷色调
    filterCool() {
        console.log('❄️ 应用冷色调...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 0,
            saturation: 110,
            temperature: -40,
            hue: 0
        });
    }

    // 暖色调
    filterWarm() {
        console.log('🔥 应用暖色调...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 0,
            saturation: 110,
            temperature: 40,
            hue: 0
        });
    }

    // 胶片效果
    filterFilm() {
        console.log('🎞️ 应用胶片效果...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 15,
            saturation: 90,
            temperature: 0,
            hue: 0
        });
    }

    // 日落效果
    filterSunset() {
        console.log('🌅 应用日落效果...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 0,
            saturation: 120,
            temperature: 50,
            hue: -10
        });
    }

    // 海洋效果
    filterOcean() {
        console.log('🌊 应用海洋效果...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 0,
            saturation: 110,
            temperature: -30,
            hue: -20
        });
    }

    // 樱花效果
    filterSakura() {
        console.log('🌸 应用樱花效果...');
        this.reset();
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + 30);     // 增加红色
            data[i + 1] = Math.min(255, data[i + 1] + 10); // 轻微增加绿色
            data[i + 2] = Math.min(255, data[i + 2] + 20); // 增加蓝色
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.adjustSaturation(120);
    }

    // 秋天效果
    filterAutumn() {
        console.log('🍂 应用秋天效果...');
        this.reset();
        this.applyFilters({
            brightness: 0,
            contrast: 5,
            saturation: 115,
            temperature: 35,
            hue: 15
        });
    }

    // HDR效果
    filterHDR() {
        console.log('✨ 应用HDR效果...');
        this.reset();
        this.applyFilters({
            brightness: 10,
            contrast: 30,
            saturation: 120,
            temperature: 0,
            hue: 0
        });
    }

    // 反色效果
    filterInvert() {
        console.log('⚫ 应用反色效果...');
        this.reset();
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        console.log('✅ 反色完成');
    }

    // ==================== 特效滤镜 ====================

    // 暗角效果
    addVignette() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const vignette = 1 - Math.pow(dist / maxDist, 1.5) * 0.6;
                
                const idx = (y * width + x) * 4;
                data[idx] *= vignette;
                data[idx + 1] *= vignette;
                data[idx + 2] *= vignette;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // 应用组合滤镜（优化版 - 一次性处理）
    applyFilters(filters) {
        console.log('🎨 应用组合滤镜:', filters);
        
        // 确保从原始图片开始
        if (!this.originalImageData) {
            console.error('❌ 没有原始图片数据');
            return;
        }
        
        // 重置到原始图片
        this.ctx.putImageData(this.originalImageData, 0, 0);
        
        // 按顺序应用滤镜（每个滤镜都会读取当前canvas并修改）
        if (filters.brightness && filters.brightness !== 0) {
            console.log(`  亮度: ${filters.brightness}`);
            this.adjustBrightness(filters.brightness);
        }
        
        if (filters.contrast && filters.contrast !== 0) {
            console.log(`  对比度: ${filters.contrast}`);
            this.adjustContrast(filters.contrast);
        }
        
        if (filters.saturation && filters.saturation !== 100) {
            console.log(`  饱和度: ${filters.saturation}`);
            this.adjustSaturation(filters.saturation);
        }
        
        if (filters.temperature && filters.temperature !== 0) {
            console.log(`  色温: ${filters.temperature}`);
            this.adjustTemperature(filters.temperature);
        }
        
        if (filters.hue && filters.hue !== 0) {
            console.log(`  色相: ${filters.hue}`);
            this.adjustHue(filters.hue);
        }
        
        console.log('✅ 组合滤镜应用完成');
    }

    // 获取当前图片
    getImage() {
        return this.canvas.toDataURL('image/png');
    }
}

// 导出
window.ImageFilter = ImageFilter;

