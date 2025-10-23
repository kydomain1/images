// ==================== 图片裁剪功能 ====================

class ImageCropper {
    constructor(imageElement, options = {}) {
        this.image = imageElement;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.cropArea = {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        };
        
        this.aspectRatio = options.aspectRatio || null; // null表示自由裁剪
    }

    // 设置裁剪区域
    setCropArea(x, y, width, height) {
        this.cropArea = { x, y, width, height };
    }

    // 设置固定比例
    setAspectRatio(ratio) {
        this.aspectRatio = ratio; // 例如：16/9, 1, 4/5等
    }

    // 执行裁剪
    crop() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // 设置canvas尺寸为裁剪区域大小
                this.canvas.width = this.cropArea.width;
                this.canvas.height = this.cropArea.height;
                
                // 绘制裁剪后的图片
                this.ctx.drawImage(
                    img,
                    this.cropArea.x, this.cropArea.y,
                    this.cropArea.width, this.cropArea.height,
                    0, 0,
                    this.cropArea.width, this.cropArea.height
                );
                
                resolve(this.canvas.toDataURL('image/png'));
            };
            
            img.onerror = reject;
            img.src = this.image.src || this.image;
        });
    }

    // 预设比例裁剪
    static RATIOS = {
        'free': { value: null, name: '自由裁剪' },
        '1:1': { value: 1, name: '1:1 (正方形)' },
        '16:9': { value: 16/9, name: '16:9 (横向)' },
        '9:16': { value: 9/16, name: '9:16 (竖向)' },
        '4:3': { value: 4/3, name: '4:3 (横向)' },
        '3:4': { value: 3/4, name: '3:4 (竖向)' },
        '21:9': { value: 21/9, name: '21:9 (超宽)' },
        'instagram-post': { value: 1, name: 'Instagram帖子' },
        'instagram-story': { value: 9/16, name: 'Instagram故事' },
        'facebook-cover': { value: 820/312, name: 'Facebook封面' },
        'twitter-header': { value: 3, name: 'Twitter头图' },
    };

    // 智能居中裁剪
    cropCenter(targetWidth, targetHeight) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const sourceWidth = img.width;
                const sourceHeight = img.height;
                
                // 计算裁剪区域（居中）
                const sourceAspect = sourceWidth / sourceHeight;
                const targetAspect = targetWidth / targetHeight;
                
                let cropWidth, cropHeight, cropX, cropY;
                
                if (sourceAspect > targetAspect) {
                    // 源图片更宽，裁剪左右
                    cropHeight = sourceHeight;
                    cropWidth = sourceHeight * targetAspect;
                    cropX = (sourceWidth - cropWidth) / 2;
                    cropY = 0;
                } else {
                    // 源图片更高，裁剪上下
                    cropWidth = sourceWidth;
                    cropHeight = sourceWidth / targetAspect;
                    cropX = 0;
                    cropY = (sourceHeight - cropHeight) / 2;
                }
                
                // 设置canvas
                this.canvas.width = targetWidth;
                this.canvas.height = targetHeight;
                
                // 绘制裁剪并缩放的图片
                this.ctx.drawImage(
                    img,
                    cropX, cropY, cropWidth, cropHeight,
                    0, 0, targetWidth, targetHeight
                );
                
                resolve(this.canvas.toDataURL('image/png'));
            };
            
            img.onerror = reject;
            img.src = this.image.src || this.image;
        });
    }
}

// 导出
window.ImageCropper = ImageCropper;

