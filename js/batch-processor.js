// ==================== 批量处理功能 ====================

class BatchProcessor {
    constructor() {
        this.queue = [];
        this.results = [];
        this.currentIndex = 0;
        this.onProgress = null;
    }

    // 添加任务到队列
    addTasks(tasks) {
        this.queue = tasks;
        this.results = [];
        this.currentIndex = 0;
    }

    // 执行批量处理
    async process(processFn) {
        this.results = [];
        
        for (let i = 0; i < this.queue.length; i++) {
            this.currentIndex = i;
            
            try {
                if (this.onProgress) {
                    this.onProgress({
                        current: i + 1,
                        total: this.queue.length,
                        percentage: Math.round(((i + 1) / this.queue.length) * 100),
                        status: 'processing'
                    });
                }
                
                const result = await processFn(this.queue[i], i);
                
                this.results.push({
                    index: i,
                    success: true,
                    data: result
                });
                
            } catch (error) {
                this.results.push({
                    index: i,
                    success: false,
                    error: error.message
                });
            }
        }
        
        if (this.onProgress) {
            this.onProgress({
                current: this.queue.length,
                total: this.queue.length,
                percentage: 100,
                status: 'complete'
            });
        }
        
        return this.results;
    }

    // 获取成功的结果
    getSuccessResults() {
        return this.results.filter(r => r.success);
    }

    // 获取失败的结果
    getFailedResults() {
        return this.results.filter(r => !r.success);
    }

    // 批量背景移除
    static async removeBgBatch(images, onProgress) {
        const processor = new BatchProcessor();
        processor.onProgress = onProgress;
        processor.addTasks(images);
        
        const results = await processor.process(async (imageData) => {
            // 调用背景移除API
            const response = await fetch(imageData);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append('image', blob, 'image.png');
            
            const apiResponse = await fetch('http://localhost:3000/api/remove-background', {
                method: 'POST',
                body: formData
            });
            
            const data = await apiResponse.json();
            
            if (!data.success) {
                throw new Error(data.error || 'API调用失败');
            }
            
            return data.result;
        });
        
        return results;
    }

    // 批量应用滤镜
    static async applyFilterBatch(images, filterOptions, onProgress) {
        const processor = new BatchProcessor();
        processor.onProgress = onProgress;
        processor.addTasks(images);
        
        const results = await processor.process(async (imageData) => {
            const filter = new ImageFilter();
            await filter.loadImage(imageData);
            
            // 应用滤镜
            if (filterOptions.preset) {
                // 应用预设滤镜
                filter[filterOptions.preset]();
            } else {
                // 应用自定义滤镜
                filter.applyFilters(filterOptions);
            }
            
            return filter.getImage();
        });
        
        return results;
    }
}

// 导出
window.BatchProcessor = BatchProcessor;

