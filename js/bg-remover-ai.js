// 高级背景移除 - 使用 Canvas 和图像处理算法
// 这是一个改进的纯 JavaScript 实现，不依赖外部库

class BackgroundRemover {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    async removeBackground(imageData, options = {}) {
        const {
            threshold = 15,        // 颜色差异阈值（越小越严格）
            smoothing = true,      // 边缘平滑
            erosion = 1,          // 腐蚀次数
            dilation = 2,         // 膨胀次数
            onProgress = null     // 进度回调
        } = options;

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = async () => {
                try {
                    // 设置 canvas 大小
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                    
                    // 绘制原图
                    this.ctx.drawImage(img, 0, 0);
                    
                    if (onProgress) onProgress('analyzing', 10);
                    
                    // 获取图像数据
                    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    const data = imgData.data;
                    
                    // 步骤 1: 分析背景颜色
                    if (onProgress) onProgress('detecting_background', 20);
                    const bgColor = this.detectBackgroundColor(data, this.canvas.width, this.canvas.height);
                    
                    // 步骤 2: 创建遮罩
                    if (onProgress) onProgress('creating_mask', 40);
                    const mask = this.createMask(data, bgColor, threshold);
                    
                    // 步骤 3: 边缘检测和保护
                    if (onProgress) onProgress('detecting_edges', 50);
                    const edges = this.detectEdges(data, this.canvas.width, this.canvas.height);
                    
                    // 步骤 4: 优化遮罩
                    if (onProgress) onProgress('optimizing_mask', 60);
                    this.refineMask(mask, edges, this.canvas.width, this.canvas.height, erosion, dilation);
                    
                    // 步骤 5: 应用遮罩
                    if (onProgress) onProgress('applying_mask', 80);
                    this.applyMask(data, mask, smoothing);
                    
                    // 步骤 6: 边缘平滑
                    if (smoothing && onProgress) onProgress('smoothing_edges', 90);
                    if (smoothing) {
                        this.smoothEdges(data, mask, this.canvas.width, this.canvas.height);
                    }
                    
                    // 放回处理后的数据
                    this.ctx.putImageData(imgData, 0, 0);
                    
                    if (onProgress) onProgress('complete', 100);
                    
                    // 转换为 DataURL
                    resolve(this.canvas.toDataURL('image/png'));
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = imageData;
        });
    }

    // 智能检测背景颜色
    detectBackgroundColor(data, width, height) {
        const samples = [];
        const sampleSize = 20; // 采样大小
        
        // 采样边缘区域
        for (let i = 0; i < sampleSize; i++) {
            // 上边
            const topIdx = (Math.floor(width * i / sampleSize)) * 4;
            samples.push(this.getPixel(data, topIdx));
            
            // 下边
            const bottomIdx = ((height - 1) * width + Math.floor(width * i / sampleSize)) * 4;
            samples.push(this.getPixel(data, bottomIdx));
            
            // 左边
            const leftIdx = (Math.floor(height * i / sampleSize) * width) * 4;
            samples.push(this.getPixel(data, leftIdx));
            
            // 右边
            const rightIdx = (Math.floor(height * i / sampleSize) * width + width - 1) * 4;
            samples.push(this.getPixel(data, rightIdx));
        }
        
        // 使用 K-means 聚类找出主要背景色
        return this.findDominantColor(samples);
    }

    getPixel(data, index) {
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }

    findDominantColor(samples) {
        // 计算所有样本的平均值
        let r = 0, g = 0, b = 0;
        samples.forEach(sample => {
            r += sample.r;
            g += sample.g;
            b += sample.b;
        });
        
        return {
            r: Math.round(r / samples.length),
            g: Math.round(g / samples.length),
            b: Math.round(b / samples.length)
        };
    }

    // 创建初始遮罩（改进版 - 使用更智能的阈值）
    createMask(data, bgColor, threshold) {
        const mask = new Uint8Array(data.length / 4);
        const differences = [];
        
        // 第一步：计算所有像素与背景色的差异
        for (let i = 0; i < data.length; i += 4) {
            const diff = this.colorDifference(
                { r: data[i], g: data[i + 1], b: data[i + 2] },
                bgColor
            );
            differences.push(diff);
        }
        
        // 第二步：计算差异的统计信息
        const sortedDiffs = [...differences].sort((a, b) => a - b);
        const median = sortedDiffs[Math.floor(sortedDiffs.length / 2)];
        const percentile25 = sortedDiffs[Math.floor(sortedDiffs.length * 0.25)];
        const percentile75 = sortedDiffs[Math.floor(sortedDiffs.length * 0.75)];
        
        // 动态调整阈值（更保守的策略）
        // 使用较低的阈值以保留更多内容
        const adaptiveThreshold = Math.min(
            threshold * 10,
            percentile25 * 1.5  // 只移除最接近背景色的像素
        );
        
        console.log('📊 阈值分析:', {
            userThreshold: threshold,
            adaptiveThreshold: adaptiveThreshold.toFixed(2),
            median: median.toFixed(2),
            p25: percentile25.toFixed(2),
            p75: percentile75.toFixed(2)
        });
        
        // 第三步：应用保守的阈值策略
        // 统计：只移除最接近背景色的 20-30% 像素
        let foregroundCount = 0;
        let backgroundCount = 0;
        
        for (let i = 0; i < differences.length; i++) {
            // 更保守的判断：只有非常接近背景色才标记为背景
            if (differences[i] < adaptiveThreshold * 0.5) {
                // 非常接近背景色
                mask[i] = 0;
                backgroundCount++;
            } else if (differences[i] < adaptiveThreshold) {
                // 可能是背景或边缘 - 使用渐变
                const ratio = (differences[i] - adaptiveThreshold * 0.5) / (adaptiveThreshold * 0.5);
                mask[i] = Math.round(ratio * 255);
            } else {
                // 明显不同于背景色，保留为前景
                mask[i] = 255;
                foregroundCount++;
            }
        }
        
        const totalPixels = differences.length;
        const bgRatio = (backgroundCount / totalPixels * 100).toFixed(1);
        const fgRatio = (foregroundCount / totalPixels * 100).toFixed(1);
        
        console.log('📊 初始遮罩统计:', {
            背景像素: `${backgroundCount} (${bgRatio}%)`,
            前景像素: `${foregroundCount} (${fgRatio}%)`,
            边缘像素: `${totalPixels - backgroundCount - foregroundCount}`
        });
        
        // 如果移除的像素太多（>40%），说明阈值太高，需要重新调整
        if (backgroundCount > totalPixels * 0.4) {
            console.warn('⚠️ 移除比例过高，重新调整遮罩...');
            // 降低阈值，只保留最确定的背景
            for (let i = 0; i < differences.length; i++) {
                if (mask[i] === 0 && differences[i] > adaptiveThreshold * 0.3) {
                    mask[i] = 128; // 改为半透明
                }
            }
        }
        
        return mask;
    }

    colorDifference(color1, color2) {
        // 使用加权欧氏距离（更符合人眼感知）
        const dr = color1.r - color2.r;
        const dg = color1.g - color2.g;
        const db = color1.b - color2.b;
        
        return Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db);
    }

    // 边缘检测
    detectEdges(data, width, height) {
        const edges = new Uint8Array(width * height);
        const threshold = 30;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Sobel 算子
                let gx = 0, gy = 0;
                
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nidx = ((y + dy) * width + (x + dx)) * 4;
                        const intensity = (data[nidx] + data[nidx + 1] + data[nidx + 2]) / 3;
                        
                        gx += intensity * dx;
                        gy += intensity * dy;
                    }
                }
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                edges[y * width + x] = magnitude > threshold ? 255 : 0;
            }
        }
        
        return edges;
    }

    // 优化遮罩（更保守的形态学操作）
    refineMask(mask, edges, width, height, erosion, dilation) {
        // 第一步：保护所有边缘区域（更保守）
        const edgeProtection = new Uint8Array(mask.length);
        for (let i = 0; i < mask.length; i++) {
            if (edges[i] > 0 && mask[i] > 50) {  // 降低阈值，保护更多边缘
                edgeProtection[i] = 1;
                mask[i] = 255; // 强制标记为前景
            }
        }
        
        // 保护中心区域（通常是主体）
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const protectRadius = Math.min(width, height) / 3;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果在中心区域且不是明确的背景，保护它
                if (distance < protectRadius && mask[idx] > 30) {
                    edgeProtection[idx] = 1;
                    if (mask[idx] < 200) {
                        mask[idx] = 200; // 提高中心区域的不透明度
                    }
                }
                
                // 对图片边缘区域更激进地移除背景
                const edgeThreshold = Math.min(width, height) * 0.1; // 边缘10%区域
                const isEdge = x < edgeThreshold || x > width - edgeThreshold || 
                              y < edgeThreshold || y > height - edgeThreshold;
                
                if (isEdge && mask[idx] < 100 && !edgeProtection[idx]) {
                    mask[idx] = 0; // 边缘的半透明像素改为完全透明
                }
            }
        }
        
        // 第二步：非常温和的腐蚀操作（几乎不腐蚀，只处理明显的孤立点）
        // 减少腐蚀次数，避免过度处理
        for (let iter = 0; iter < Math.min(erosion, 1); iter++) {
            const temp = new Uint8Array(mask);
            for (let y = 3; y < height - 3; y++) {
                for (let x = 3; x < width - 3; x++) {
                    const idx = y * width + x;
                    
                    // 跳过受保护的区域
                    if (edgeProtection[idx]) continue;
                    
                    if (mask[idx] === 0) {
                        // 检查 7x7 邻域（更大范围）
                        let backgroundCount = 0;
                        let totalCount = 0;
                        
                        for (let dy = -3; dy <= 3; dy++) {
                            for (let dx = -3; dx <= 3; dx++) {
                                const nidx = (y + dy) * width + (x + dx);
                                totalCount++;
                                if (mask[nidx] === 0) {
                                    backgroundCount++;
                                }
                            }
                        }
                        
                        // 只有当背景像素非常少时才认为是孤立点
                        if (backgroundCount < totalCount * 0.15) {
                            temp[idx] = 255; // 直接恢复为前景
                        }
                    }
                }
            }
            mask.set(temp);
        }
        
        // 第三步：选择性膨胀操作
        for (let iter = 0; iter < dilation; iter++) {
            const temp = new Uint8Array(mask);
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    const idx = y * width + x;
                    
                    // 只在中心区域进行膨胀，边缘区域不膨胀
                    const dx = x - centerX;
                    const dy = y - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const isNearCenter = distance < protectRadius * 1.5;
                    
                    if ((mask[idx] === 255 || mask[idx] > 200) && isNearCenter) {
                        // 温和膨胀：只影响直接相邻的像素
                        const neighbors = [
                            (y - 1) * width + x,     // 上
                            (y + 1) * width + x,     // 下
                            y * width + (x - 1),     // 左
                            y * width + (x + 1),     // 右
                        ];
                        
                        neighbors.forEach(nidx => {
                            if (temp[nidx] > 50 && temp[nidx] < 255) {
                                temp[nidx] = Math.max(temp[nidx], 200);
                            }
                        });
                    }
                }
            }
            mask.set(temp);
        }
        
        // 第四步：清理边缘残留
        // 对边缘区域的低透明度像素进行二次清理
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                const edgeThreshold = Math.min(width, height) * 0.15;
                const isNearEdge = x < edgeThreshold || x > width - edgeThreshold || 
                                  y < edgeThreshold || y > height - edgeThreshold;
                
                // 边缘区域：如果透明度低于150，直接设为透明
                if (isNearEdge && mask[idx] < 150 && !edgeProtection[idx]) {
                    mask[idx] = 0;
                }
                
                // 孤立的半透明像素：检查周围，如果大部分是透明的，也设为透明
                if (mask[idx] > 0 && mask[idx] < 100) {
                    let transparentNeighbors = 0;
                    let totalNeighbors = 0;
                    
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nx = x + dx;
                            const ny = y + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                const nidx = ny * width + nx;
                                totalNeighbors++;
                                if (mask[nidx] < 50) {
                                    transparentNeighbors++;
                                }
                            }
                        }
                    }
                    
                    // 如果周围大部分是透明的，这个像素也设为透明
                    if (transparentNeighbors > totalNeighbors * 0.6) {
                        mask[idx] = 0;
                    }
                }
            }
        }
        
        console.log('✅ 遮罩优化完成');
    }

    // 应用遮罩（改进版 - 保留原始Alpha）
    applyMask(data, mask, smoothing) {
        let removedPixels = 0;
        let keptPixels = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const pixelIdx = i / 4;
            const alpha = mask[pixelIdx];
            const originalAlpha = data[i + 3];
            
            if (alpha === 0) {
                // 完全透明
                data[i + 3] = 0;
                removedPixels++;
            } else if (alpha === 255) {
                // 完全不透明 - 保持原始Alpha
                data[i + 3] = originalAlpha;
                keptPixels++;
            } else {
                // 部分透明（边缘） - 混合原始Alpha
                data[i + 3] = Math.round((alpha / 255) * originalAlpha);
            }
        }
        
        const totalPixels = data.length / 4;
        const removalRate = (removedPixels / totalPixels * 100).toFixed(1);
        const keepRate = (keptPixels / totalPixels * 100).toFixed(1);
        
        console.log('📊 处理统计:', {
            移除: `${removedPixels} (${removalRate}%)`,
            保留: `${keptPixels} (${keepRate}%)`,
            边缘: `${totalPixels - removedPixels - keptPixels}`
        });
    }

    // 边缘平滑
    smoothEdges(data, mask, width, height) {
        const temp = new Uint8ClampedArray(data);
        const radius = 2; // 平滑半径
        
        for (let y = radius; y < height - radius; y++) {
            for (let x = radius; x < width - radius; x++) {
                const idx = (y * width + x) * 4;
                const pixelIdx = y * width + x;
                
                // 只平滑边缘附近的像素
                const alpha = mask[pixelIdx];
                if (alpha > 0 && alpha < 255) {
                    let sumR = 0, sumG = 0, sumB = 0, sumA = 0, count = 0;
                    
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const nidx = ((y + dy) * width + (x + dx)) * 4;
                            const npixelIdx = (y + dy) * width + (x + dx);
                            
                            if (mask[npixelIdx] > 0) {
                                sumR += temp[nidx];
                                sumG += temp[nidx + 1];
                                sumB += temp[nidx + 2];
                                sumA += temp[nidx + 3];
                                count++;
                            }
                        }
                    }
                    
                    if (count > 0) {
                        data[idx] = Math.round(sumR / count);
                        data[idx + 1] = Math.round(sumG / count);
                        data[idx + 2] = Math.round(sumB / count);
                        data[idx + 3] = Math.round(sumA / count);
                    }
                }
            }
        }
    }
}

// 导出
window.BackgroundRemover = BackgroundRemover;

