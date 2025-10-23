// ==================== 图片格式转换功能 ====================

class ImageConverter {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // 转换图片格式
    convert(imageData, options = {}) {
        const {
            format = 'png',     // 'png', 'jpeg', 'webp'
            quality = 0.92,     // 0-1，仅用于jpeg和webp
            resize = null       // {width, height} 可选调整尺寸
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // 设置canvas尺寸
                if (resize) {
                    this.canvas.width = resize.width;
                    this.canvas.height = resize.height;
                } else {
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                }
                
                // 绘制图片
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                
                // 转换格式
                const mimeType = this.getMimeType(format);
                const result = this.canvas.toDataURL(mimeType, quality);
                
                // 计算文件大小
                const sizeKB = Math.round(result.length * 0.75 / 1024);
                
                resolve({
                    dataUrl: result,
                    format: format,
                    size: sizeKB,
                    width: this.canvas.width,
                    height: this.canvas.height
                });
            };
            
            img.onerror = reject;
            img.src = imageData;
        });
    }

    // 获取MIME类型
    getMimeType(format) {
        const mimeTypes = {
            'png': 'image/png',
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'webp': 'image/webp'
        };
        return mimeTypes[format.toLowerCase()] || 'image/png';
    }

    // 获取文件扩展名
    getExtension(format) {
        return format.toLowerCase() === 'jpeg' ? 'jpg' : format.toLowerCase();
    }

    // 批量转换
    async convertBatch(images, options) {
        const results = [];
        
        for (let i = 0; i < images.length; i++) {
            try {
                const result = await this.convert(images[i], options);
                results.push({
                    ...result,
                    index: i,
                    success: true
                });
            } catch (error) {
                results.push({
                    index: i,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    // 压缩图片
    compress(imageData, maxSizeKB = 500) {
        return new Promise(async (resolve, reject) => {
            let quality = 0.9;
            let result;
            
            // 尝试不同质量直到满足大小要求
            for (let i = 0; i < 10; i++) {
                result = await this.convert(imageData, {
                    format: 'jpeg',
                    quality: quality
                });
                
                if (result.size <= maxSizeKB || quality <= 0.1) {
                    break;
                }
                
                quality -= 0.1;
            }
            
            resolve(result);
        });
    }
}

// 导出
window.ImageConverter = ImageConverter;

