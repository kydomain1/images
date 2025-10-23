// ==================== AI高清放大功能（完全免费的浏览器端实现）====================

class ImageUpscaler {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    // 主放大函数
    async upscale(imageData, options = {}) {
        const {
            scale = 2,           // 放大倍数（2x, 3x, 4x）
            algorithm = 'lanczos', // 算法：bicubic, lanczos, superresolution
            sharpen = true,      // 锐化
            denoise = false,     // 降噪
            onProgress = null
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = async () => {
                try {
                    if (onProgress) onProgress('loading', 10);
                    
                    const originalWidth = img.width;
                    const originalHeight = img.height;
                    const newWidth = Math.floor(originalWidth * scale);
                    const newHeight = Math.floor(originalHeight * scale);
                    
                    console.log(`📐 原始尺寸: ${originalWidth}×${originalHeight}`);
                    console.log(`🎯 目标尺寸: ${newWidth}×${newHeight}`);
                    
                    // 设置canvas尺寸
                    this.canvas.width = newWidth;
                    this.canvas.height = newHeight;
                    
                    if (onProgress) onProgress('processing', 30);
                    
                    // 根据算法选择处理方式
                    switch (algorithm) {
                        case 'lanczos':
                            await this.upscaleLanczos(img, scale, onProgress);
                            break;
                        case 'superresolution':
                            await this.upscaleSuperResolution(img, scale, onProgress);
                            break;
                        case 'bicubic':
                        default:
                            await this.upscaleBicubic(img, scale, onProgress);
                            break;
                    }
                    
                    if (onProgress) onProgress('enhancing', 80);
                    
                    // 后处理
                    if (sharpen) {
                        this.applySharpen();
                    }
                    
                    if (denoise) {
                        this.applyDenoise();
                    }
                    
                    if (onProgress) onProgress('complete', 100);
                    
                    // 转换为DataURL
                    resolve(this.canvas.toDataURL('image/png'));
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = imageData;
        });
    }

    // Lanczos重采样（增强版 - 多步骤渐进放大）
    async upscaleLanczos(img, scale, onProgress) {
        console.log(`🎨 开始多步骤渐进放大（${scale}x）...`);
        
        // 使用更多步骤以提高质量
        const steps = scale === 2 ? 2 : (scale === 3 ? 3 : 4);
        const stepScale = Math.pow(scale, 1 / steps);
        
        console.log(`   分${steps}步放大，每步${stepScale.toFixed(2)}倍`);
        
        let tempCanvas = document.createElement('canvas');
        let tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);
        
        for (let step = 0; step < steps; step++) {
            if (onProgress) {
                onProgress('processing', 30 + (step / steps) * 40);
            }
            
            const currentWidth = tempCanvas.width;
            const currentHeight = tempCanvas.height;
            const newWidth = Math.floor(currentWidth * stepScale);
            const newHeight = Math.floor(currentHeight * stepScale);
            
            console.log(`   步骤 ${step + 1}/${steps}: ${currentWidth}x${currentHeight} → ${newWidth}x${newHeight}`);
            
            // 创建新canvas
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            newCanvas.width = newWidth;
            newCanvas.height = newHeight;
            
            // 使用最高质量设置
            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';
            
            // 绘制放大的图片
            newCtx.drawImage(tempCanvas, 0, 0, currentWidth, currentHeight, 
                           0, 0, newWidth, newHeight);
            
            // 每步都应用轻微的锐化
            if (step < steps - 1) {
                const stepData = newCtx.getImageData(0, 0, newWidth, newHeight);
                this.applyLightSharpen(stepData);
                newCtx.putImageData(stepData, 0, 0);
            }
            
            tempCanvas = newCanvas;
            tempCtx = newCtx;
        }
        
        // 复制到主canvas
        this.ctx.drawImage(tempCanvas, 0, 0);
        console.log('✅ 多步骤放大完成');
    }
    
    // 轻度锐化（用于中间步骤）
    applyLightSharpen(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const original = new Uint8ClampedArray(data);
        
        const kernel = [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            sum += original[idx] * kernel[kernelIdx];
                        }
                    }
                    data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum));
                }
            }
        }
    }

    // 双三次插值（标准质量）
    async upscaleBicubic(img, scale, onProgress) {
        const newWidth = Math.floor(img.width * scale);
        const newHeight = Math.floor(img.height * scale);
        
        // 使用高质量的imageSmoothingQuality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // 绘制放大的图片
        this.ctx.drawImage(img, 0, 0, img.width, img.height, 
                          0, 0, newWidth, newHeight);
    }

    // 超分辨率模拟（增强版 - 多重技术组合）
    async upscaleSuperResolution(img, scale, onProgress) {
        console.log('🎨 开始超分辨率处理...');
        
        // 步骤1：多步骤Lanczos放大
        await this.upscaleLanczos(img, scale, onProgress);
        
        if (onProgress) onProgress('enhancing', 70);
        
        // 步骤2：CLAHE 对比度增强
        console.log('📊 应用CLAHE对比度增强...');
        this.applyCLAHE();
        
        if (onProgress) onProgress('enhancing', 75);
        
        // 步骤3：边缘增强和重建
        console.log('🔍 增强边缘...');
        this.enhanceEdges();
        
        if (onProgress) onProgress('enhancing', 80);
        
        // 步骤4：细节增强
        console.log('✨ 增强细节...');
        this.enhanceDetails();
        
        console.log('✅ 超分辨率处理完成');
    }
    
    // CLAHE - 自适应局部对比度增强
    applyCLAHE() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 分块处理（8x8块）
        const tileSize = Math.min(64, Math.floor(width / 8));
        const clipLimit = 3.0;
        
        for (let ty = 0; ty < height; ty += tileSize) {
            for (let tx = 0; tx < width; tx += tileSize) {
                const tileWidth = Math.min(tileSize, width - tx);
                const tileHeight = Math.min(tileSize, height - ty);
                
                // 对每个块应用直方图均衡化
                this.equalizeHistogramTile(data, width, tx, ty, tileWidth, tileHeight, clipLimit);
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    // 直方图均衡化（分块）
    equalizeHistogramTile(data, width, tx, ty, tileWidth, tileHeight, clipLimit) {
        // 计算灰度直方图
        const histogram = new Array(256).fill(0);
        let pixelCount = 0;
        
        for (let y = ty; y < ty + tileHeight; y++) {
            for (let x = tx; x < tx + tileWidth; x++) {
                const idx = (y * width + x) * 4;
                const gray = Math.floor((data[idx] + data[idx + 1] + data[idx + 2]) / 3);
                histogram[gray]++;
                pixelCount++;
            }
        }
        
        // 限制对比度（CLAHE的核心）
        const clipValue = (pixelCount / 256) * clipLimit;
        let clipped = 0;
        
        for (let i = 0; i < 256; i++) {
            if (histogram[i] > clipValue) {
                clipped += histogram[i] - clipValue;
                histogram[i] = clipValue;
            }
        }
        
        // 重新分配被裁剪的像素
        const redistribute = clipped / 256;
        for (let i = 0; i < 256; i++) {
            histogram[i] += redistribute;
        }
        
        // 累积分布函数
        const cdf = new Array(256);
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
            cdf[i] = cdf[i - 1] + histogram[i];
        }
        
        // 归一化CDF
        const scale = 255 / pixelCount;
        
        // 应用映射（增强对比度）
        for (let y = ty; y < ty + tileHeight; y++) {
            for (let x = tx; x < tx + tileWidth; x++) {
                const idx = (y * width + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                    const value = data[idx + c];
                    const newValue = Math.round(cdf[value] * scale);
                    data[idx + c] = Math.min(255, Math.max(0, newValue));
                }
            }
        }
    }
    
    // 细节增强
    enhanceDetails() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const original = new Uint8ClampedArray(data);
        
        // 高通滤波器（提取细节）
        const kernel = [
            -1, -1, -1,
            -1,  9, -1,
            -1, -1, -1
        ];
        
        const strength = 0.4;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            sum += original[idx] * kernel[kernelIdx];
                        }
                    }
                    
                    const idx = (y * width + x) * 4 + c;
                    const enhanced = original[idx] + sum * strength;
                    data[idx] = Math.min(255, Math.max(0, enhanced));
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    // USM 超级锐化（Unsharp Mask - Photoshop级别）
    applySharpen() {
        console.log('✨ 应用 USM 超级锐化...');
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 创建副本
        const original = new Uint8ClampedArray(data);
        
        // 步骤1：创建模糊版本（高斯模糊）
        const blurred = this.gaussianBlur(original, width, height, 1.5);
        
        // 步骤2：USM = 原图 + amount × (原图 - 模糊图)
        const amount = 1.5;   // 锐化强度
        const threshold = 10; // 阈值，避免锐化平滑区域
        
        for (let i = 0; i < data.length; i += 4) {
            for (let c = 0; c < 3; c++) {
                const idx = i + c;
                const diff = original[idx] - blurred[idx];
                
                // 只在差异大于阈值时锐化（避免噪点）
                if (Math.abs(diff) > threshold) {
                    data[idx] = Math.min(255, Math.max(0, 
                        original[idx] + amount * diff
                    ));
                } else {
                    data[idx] = original[idx];
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        console.log('✅ USM 锐化完成');
    }
    
    // 高斯模糊（用于USM）
    gaussianBlur(data, width, height, radius) {
        const blurred = new Uint8ClampedArray(data);
        const kernel = this.createGaussianKernel(radius);
        const kernelSize = kernel.length;
        const half = Math.floor(kernelSize / 2);
        
        // 水平模糊
        const temp = new Uint8ClampedArray(data.length);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    let weightSum = 0;
                    
                    for (let k = 0; k < kernelSize; k++) {
                        const xk = x + k - half;
                        if (xk >= 0 && xk < width) {
                            const idx = (y * width + xk) * 4 + c;
                            sum += data[idx] * kernel[k];
                            weightSum += kernel[k];
                        }
                    }
                    
                    temp[(y * width + x) * 4 + c] = sum / weightSum;
                }
            }
        }
        
        // 垂直模糊
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    let weightSum = 0;
                    
                    for (let k = 0; k < kernelSize; k++) {
                        const yk = y + k - half;
                        if (yk >= 0 && yk < height) {
                            const idx = (yk * width + x) * 4 + c;
                            sum += temp[idx] * kernel[k];
                            weightSum += kernel[k];
                        }
                    }
                    
                    blurred[(y * width + x) * 4 + c] = sum / weightSum;
                }
            }
        }
        
        return blurred;
    }
    
    // 创建高斯核
    createGaussianKernel(radius) {
        const size = Math.ceil(radius * 2) * 2 + 1;
        const kernel = new Float32Array(size);
        const sigma = radius / 2;
        const twoSigmaSquare = 2 * sigma * sigma;
        const center = Math.floor(size / 2);
        let sum = 0;
        
        for (let i = 0; i < size; i++) {
            const x = i - center;
            kernel[i] = Math.exp(-(x * x) / twoSigmaSquare);
            sum += kernel[i];
        }
        
        // 归一化
        for (let i = 0; i < size; i++) {
            kernel[i] /= sum;
        }
        
        return kernel;
    }

    // 双边滤波降噪（保留边缘的降噪）
    applyDenoise() {
        console.log('🔧 应用双边滤波降噪...');
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const original = new Uint8ClampedArray(data);
        
        const radius = 2;
        const sigmaSpace = 3;
        const sigmaColor = 25;
        
        for (let y = radius; y < height - radius; y++) {
            for (let x = radius; x < width - radius; x++) {
                const centerIdx = (y * width + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    let weightSum = 0;
                    const centerValue = original[centerIdx + c];
                    
                    // 双边滤波：同时考虑空间距离和颜色相似度
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const idx = ((y + dy) * width + (x + dx)) * 4 + c;
                            const value = original[idx];
                            
                            // 空间权重（高斯）
                            const spatialDist = dx * dx + dy * dy;
                            const spatialWeight = Math.exp(-spatialDist / (2 * sigmaSpace * sigmaSpace));
                            
                            // 颜色权重（高斯）
                            const colorDist = (value - centerValue) * (value - centerValue);
                            const colorWeight = Math.exp(-colorDist / (2 * sigmaColor * sigmaColor));
                            
                            const weight = spatialWeight * colorWeight;
                            sum += value * weight;
                            weightSum += weight;
                        }
                    }
                    
                    data[centerIdx + c] = Math.round(sum / weightSum);
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        console.log('✅ 双边滤波完成');
    }

    // 边缘增强和重建（增强版）
    enhanceEdges() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const original = new Uint8ClampedArray(data);
        
        // Sobel 边缘检测（更准确）
        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        // 拉普拉斯算子（细节增强）
        const laplacian = [0, -1, 0, -1, 4, -1, 0, -1, 0];
        
        const edgeStrength = 0.6;  // 提高边缘增强强度
        const detailStrength = 0.3;
        
        for (let y = 2; y < height - 2; y++) {
            for (let x = 2; x < width - 2; x++) {
                for (let c = 0; c < 3; c++) {
                    let sumX = 0, sumY = 0, sumLap = 0;
                    
                    // Sobel边缘检测
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            sumX += original[idx] * sobelX[kernelIdx];
                            sumY += original[idx] * sobelY[kernelIdx];
                            sumLap += original[idx] * laplacian[kernelIdx];
                        }
                    }
                    
                    // 计算边缘强度
                    const edgeMagnitude = Math.sqrt(sumX * sumX + sumY * sumY);
                    
                    const idx = (y * width + x) * 4 + c;
                    const originalValue = original[idx];
                    
                    // 组合边缘增强和细节增强
                    const enhanced = originalValue + 
                                   edgeMagnitude * edgeStrength + 
                                   sumLap * detailStrength;
                    
                    data[idx] = Math.min(255, Math.max(0, enhanced));
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
}

// 导出
window.ImageUpscaler = ImageUpscaler;

