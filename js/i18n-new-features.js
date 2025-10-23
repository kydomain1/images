// 新功能多语言翻译补充
// 在i18n.js加载后执行

document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations === 'undefined') {
        console.error('i18n系统未加载');
        return;
    }
    
    // 补充中文翻译
    Object.assign(translations['zh-CN'], {
        // 背景移除预设
        'bg.preset.title': '图片类型（预设）',
        'bg.preset.auto': '🤖 自动检测',
        'bg.preset.portrait': '👤 人物照片',
        'bg.preset.product': '📦 产品图（纯色背景）',
        'bg.preset.pet': '🐱 宠物照片',
        'bg.preset.icon': '🎨 图标/Logo',
        'bg.preset.complex': '🌄 复杂场景',
        'bg.preset.custom': '⚙️ 自定义',
        'bg.preset.hint': '💡 选择图片类型可获得最佳效果',
        
        // 背景移除高级设置
        'bg.sensitivity': '敏感度',
        'bg.loose': '宽松（保留更多）',
        'bg.strict': '严格（移除更多）',
        'bg.hint': '💡 提示：当前值 = ',
        'bg.smoothing': '边缘平滑',
        'bg.smoothingHint': '启用后边缘更自然，但处理时间稍长',
        
        // AI高清放大（补充）
        'upscale.sharpenHint': '💡 锐化可提升细节，降噪可减少颗粒感',
        'upscale.info.original': '带背景的原始图片',
        'upscale.info.processed': '放大后的高清图片',
        
        // 滤镜效果（补充）
        'filter.info.original': '原始图片',
        'filter.info.processed': '应用滤镜后',
        'filter.dark': '暗',
        'filter.bright': '亮',
        'filter.low': '低',
        'filter.high': '高',
        'filter.cold': '冷',
        'filter.hot': '暖',
        'filter.bw': '黑白',
        'filter.vivid': '鲜艳',
        
        // 通用
        'tool.characters': '字符',
        
        // 页脚
        'footer.rights': '保留所有权利',
        
        // 裁剪功能
        'tool.crop': '图片裁剪',
        'crop.title': '图片裁剪',
        'crop.upload': '上传图片',
        'crop.ratio': '裁剪比例',
        'crop.free': '自由裁剪',
        'crop.square': '1:1 (正方形)',
        'crop.size': '输出尺寸',
        'crop.keepSize': '保持原尺寸',
        'crop.process': '执行裁剪',
        'crop.empty': '还没有裁剪图片',
        'crop.hint': '上传图片开始裁剪',
        'crop.cropped': '裁剪后',
        
        // 格式转换
        'tool.convert': '格式转换',
        'convert.title': '格式转换',
        'convert.upload': '上传图片（支持批量）',
        'convert.dragdrop': '拖拽图片到这里（可多选）',
        'convert.select': '选择图片（可多选）',
        'convert.formats': '支持 JPG, PNG, WebP',
        'convert.selected': '已选择',
        'convert.files': '张图片',
        'convert.targetFormat': '目标格式',
        'convert.png': 'PNG (无损，支持透明)',
        'convert.jpeg': 'JPEG (适合照片)',
        'convert.webp': 'WebP (体积小)',
        'convert.quality': '质量',
        'convert.best': '最佳质量 (100%)',
        'convert.high': '高质量 (92%)',
        'convert.good': '良好 (85%)',
        'convert.medium': '中等 (75%)',
        'convert.process': '开始转换',
        'convert.processing': '正在转换...',
        'convert.complete': '转换完成',
        'convert.downloadAll': '下载全部',
        'convert.empty': '还没有转换图片',
        'convert.hint': '上传图片开始格式转换',
    });
    
    // 补充英文翻译
    Object.assign(translations['en'], {
        // Tools
        'tool.text2img': 'Text to Image',
        'tool.editor': 'Background Removal',
        'tool.upscale': 'AI Upscale',
        'tool.filter': 'Filters',
        
        // Background Removal Presets
        'bg.preset.title': 'Image Type (Preset)',
        'bg.preset.auto': '🤖 Auto Detect',
        'bg.preset.portrait': '👤 Portrait',
        'bg.preset.product': '📦 Product (Solid Background)',
        'bg.preset.pet': '🐱 Pet Photo',
        'bg.preset.icon': '🎨 Icon/Logo',
        'bg.preset.complex': '🌄 Complex Scene',
        'bg.preset.custom': '⚙️ Custom',
        'bg.preset.hint': '💡 Select image type for best results',
        
        // Background Removal Advanced
        'bg.sensitivity': 'Sensitivity',
        'bg.loose': 'Loose (Keep More)',
        'bg.strict': 'Strict (Remove More)',
        'bg.hint': '💡 Tip: Current value = ',
        'bg.smoothing': 'Edge Smoothing',
        'bg.smoothingHint': 'When enabled, edges are more natural but take longer',
        
        // Background Removal
        'editor.bgRemover.title': 'Background Removal',
        'editor.bgRemover.upload': 'Upload Image',
        'editor.bgRemover.dragdrop': 'Drag & drop image here',
        'editor.bgRemover.or': 'or',
        'editor.bgRemover.select': 'Select Image',
        'editor.bgRemover.formats': 'Supports JPG, PNG, WebP, max 10MB',
        'editor.bgRemover.process': 'Remove Background',
        'editor.bgRemover.result': 'Result',
        'editor.bgRemover.empty': 'No processed images yet',
        'editor.bgRemover.hint': 'Upload image and click "Remove Background"',
        'editor.bgRemover.processing': 'AI Processing...',
        'editor.bgRemover.processingHint': 'This may take 5-10 seconds',
        'editor.bgRemover.original': 'Original',
        'editor.bgRemover.processed': 'Processed',
        
        // AI Upscale
        'upscale.title': 'AI Image Upscaler',
        'upscale.upload': 'Upload Image',
        'upscale.scale': 'Scale Factor',
        'upscale.scale2x': '2x Upscale (Recommended)',
        'upscale.scale3x': '3x Upscale',
        'upscale.scale4x': '4x Upscale',
        'upscale.algorithm': 'Algorithm',
        'upscale.lanczos': 'Lanczos (High Quality)',
        'upscale.superres': 'Super Resolution (Best)',
        'upscale.bicubic': 'Bicubic (Fast)',
        'upscale.sharpen': 'Sharpen Enhancement',
        'upscale.denoise': 'Denoise',
        'upscale.process': 'Start Upscaling',
        'upscale.processing': 'AI Upscaling...',
        'upscale.empty': 'No processed images yet',
        'upscale.hint': 'Upload image and click "Start Upscaling"',
        'upscale.original': 'Original',
        'upscale.processed': 'Upscaled',
        'upscale.sharpenHint': 'Sharpen enhances details, denoise reduces grain',
        
        // Filters
        'filter.title': 'Image Filters',
        'filter.upload': 'Upload Image',
        'filter.presets': 'Preset Filters (Quick Apply)',
        'filter.grayscale': 'Grayscale',
        'filter.vintage': 'Vintage',
        'filter.cool': 'Cool Tone',
        'filter.warm': 'Warm Tone',
        'filter.film': 'Film',
        'filter.sunset': 'Sunset',
        'filter.ocean': 'Ocean',
        'filter.sakura': 'Sakura',
        'filter.autumn': 'Autumn',
        'filter.hdr': 'HDR',
        'filter.invert': 'Invert',
        'filter.reset': 'Reset',
        'filter.brightness': 'Brightness',
        'filter.contrast': 'Contrast',
        'filter.saturation': 'Saturation',
        'filter.temperature': 'Temperature',
        'filter.apply': 'Apply Filter',
        'filter.resetBtn': 'Reset',
        'filter.download': 'Download',
        'filter.empty': 'No processed images yet',
        'filter.hint': 'Upload image to apply filters',
        'filter.dark': 'Dark',
        'filter.bright': 'Bright',
        'filter.low': 'Low',
        'filter.high': 'High',
        'filter.cold': 'Cold',
        'filter.hot': 'Warm',
        'filter.bw': 'B&W',
        'filter.vivid': 'Vivid',
        
        // Common
        'tool.characters': 'characters',
        
        // Footer
        'footer.rights': 'All rights reserved',
        
        // Crop
        'tool.crop': 'Image Crop',
        'crop.title': 'Image Cropper',
        'crop.upload': 'Upload Image',
        'crop.ratio': 'Aspect Ratio',
        'crop.free': 'Free Crop',
        'crop.square': '1:1 (Square)',
        'crop.size': 'Output Size',
        'crop.keepSize': 'Keep Original',
        'crop.process': 'Crop Image',
        'crop.empty': 'No cropped images',
        'crop.hint': 'Upload image to start cropping',
        'crop.cropped': 'Cropped',
        
        // Convert
        'tool.convert': 'Format Converter',
        'convert.title': 'Format Converter',
        'convert.upload': 'Upload Images (Batch Supported)',
        'convert.dragdrop': 'Drag & drop images here (Multiple)',
        'convert.select': 'Select Images (Multiple)',
        'convert.formats': 'Supports JPG, PNG, WebP',
        'convert.selected': 'Selected',
        'convert.files': 'images',
        'convert.targetFormat': 'Target Format',
        'convert.png': 'PNG (Lossless, Transparent)',
        'convert.jpeg': 'JPEG (For Photos)',
        'convert.webp': 'WebP (Small Size)',
        'convert.quality': 'Quality',
        'convert.best': 'Best (100%)',
        'convert.high': 'High (92%)',
        'convert.good': 'Good (85%)',
        'convert.medium': 'Medium (75%)',
        'convert.process': 'Convert',
        'convert.processing': 'Converting...',
        'convert.complete': 'Conversion Complete',
        'convert.downloadAll': 'Download All',
        'convert.empty': 'No converted images',
        'convert.hint': 'Upload images to convert format',
    });
    
    // 补充日文翻译
    Object.assign(translations['ja'], {
        'tool.text2img': 'テキストから画像生成',
        'tool.editor': '背景除去',
        'tool.upscale': 'AI高画質化',
        'tool.filter': 'フィルター効果',
        'tool.crop': '画像トリミング',
        'tool.convert': '形式変換',
        
        'bg.preset.title': '画像タイプ（プリセット）',
        'bg.preset.auto': '🤖 自動検出',
        'bg.preset.portrait': '👤 人物写真',
        'bg.preset.product': '📦 製品画像',
        'bg.preset.pet': '🐱 ペット写真',
        'bg.preset.custom': '⚙️ カスタム',
        
        'editor.bgRemover.title': '背景除去',
        'editor.bgRemover.process': '背景を削除',
        'upscale.title': 'AI高画質化',
        'upscale.process': '拡大開始',
        'filter.title': 'フィルター効果',
        'filter.apply': 'フィルター適用',
        'filter.grayscale': 'グレースケール',
        'filter.vintage': 'ビンテージ',
        'filter.cool': 'クールトーン',
        'filter.warm': 'ウォームトーン',
        
        // 裁剪
        'crop.title': '画像トリミング',
        'crop.upload': '画像アップロード',
        'crop.ratio': 'アスペクト比',
        'crop.free': '自由トリミング',
        'crop.square': '1:1 (正方形)',
        'crop.process': 'トリミング実行',
        
        // 转换
        'convert.title': '形式変換',
        'convert.upload': '画像アップロード（一括対応）',
        'convert.targetFormat': '変換先形式',
        'convert.quality': '品質',
        'convert.process': '変換開始',
        'convert.downloadAll': '一括ダウンロード',
    });
    
    // 补充韩文翻译
    Object.assign(translations['ko'], {
        'tool.text2img': '텍스트에서 이미지 생성',
        'tool.editor': '배경 제거',
        'tool.upscale': 'AI 업스케일',
        'tool.filter': '필터 효과',
        'tool.crop': '이미지 자르기',
        'tool.convert': '형식 변환',
        
        'bg.preset.title': '이미지 유형 (프리셋)',
        'bg.preset.auto': '🤖 자동 감지',
        'bg.preset.portrait': '👤 인물 사진',
        'bg.preset.product': '📦 제품 이미지',
        'bg.preset.pet': '🐱 애완동물 사진',
        'bg.preset.custom': '⚙️ 사용자 정의',
        
        'editor.bgRemover.title': '배경 제거',
        'editor.bgRemover.process': '배경 제거',
        'upscale.title': 'AI 이미지 업스케일',
        'upscale.process': '업스케일 시작',
        'filter.title': '필터 효과',
        'filter.apply': '필터 적용',
        'filter.grayscale': '흑백',
        'filter.vintage': '빈티지',
        'filter.cool': '쿨톤',
        'filter.warm': '웜톤',
        'crop.title': '이미지 자르기',
        'crop.process': '자르기',
        'filter.brightness': '밝기',
        'filter.contrast': '대비',
        'filter.saturation': '채도',
        'filter.temperature': '색온도',
        'convert.title': '형식 변환기',
        'convert.upload': '이미지 업로드 (일괄 지원)',
        'convert.png': 'PNG (무손실, 투명 지원)',
        'convert.jpeg': 'JPEG (사진용)',
        'convert.webp': 'WebP (작은 크기)',
        'convert.targetFormat': '대상 형식',
        'convert.quality': '품질',
        'convert.best': '최고 품질 (100%)',
        'convert.high': '고품질 (92%)',
        'convert.good': '좋음 (85%)',
        'convert.medium': '보통 (75%)',
        'convert.process': '변환',
        'convert.downloadAll': '전체 다운로드',
    });
    
    // 西班牙语翻译
    Object.assign(translations['es'], {
        'tool.text2img': 'Texto a Imagen',
        'tool.editor': 'Eliminar Fondo',
        'tool.upscale': 'Ampliar IA',
        'tool.filter': 'Filtros',
        'tool.crop': 'Recortar Imagen',
        'tool.convert': 'Convertir Formato',
        'bg.preset.title': 'Tipo de Imagen',
        'bg.preset.auto': '🤖 Auto',
        'editor.bgRemover.title': 'Eliminar Fondo',
        'editor.bgRemover.process': 'Eliminar Fondo',
        'upscale.title': 'Ampliar con IA',
        'upscale.process': 'Comenzar',
        'filter.title': 'Filtros de Imagen',
        'filter.apply': 'Aplicar Filtro',
        'filter.grayscale': 'Escala de Grises',
        'filter.vintage': 'Vintage',
        'crop.title': 'Recortar Imagen',
        'crop.process': 'Recortar',
        'convert.title': 'Convertir Formato',
        'convert.png': 'PNG (Sin pérdida, Transparente)',
        'convert.jpeg': 'JPEG (Para fotos)',
        'convert.webp': 'WebP (Tamaño pequeño)',
        'convert.process': 'Convertir',
        'convert.downloadAll': 'Descargar Todos',
    });
    
    // 法语翻译
    Object.assign(translations['fr'], {
        'tool.text2img': 'Texte vers Image',
        'tool.editor': 'Supprimer l\'Arrière-plan',
        'tool.upscale': 'Agrandissement IA',
        'tool.filter': 'Filtres',
        'tool.crop': 'Recadrer Image',
        'tool.convert': 'Convertir Format',
        'bg.preset.title': 'Type d\'Image',
        'bg.preset.auto': '🤖 Auto',
        'editor.bgRemover.title': 'Supprimer l\'Arrière-plan',
        'editor.bgRemover.process': 'Supprimer',
        'upscale.title': 'Agrandissement IA',
        'upscale.process': 'Commencer',
        'filter.title': 'Filtres d\'Image',
        'filter.apply': 'Appliquer',
        'filter.grayscale': 'Niveaux de Gris',
        'filter.vintage': 'Vintage',
        'crop.title': 'Recadrer Image',
        'crop.process': 'Recadrer',
        'convert.title': 'Convertir Format',
        'convert.process': 'Convertir',
        'convert.downloadAll': 'Télécharger Tout',
    });
    
    // 德语翻译
    Object.assign(translations['de'], {
        'tool.text2img': 'Text zu Bild',
        'tool.editor': 'Hintergrund Entfernen',
        'tool.upscale': 'KI Vergrößerung',
        'tool.filter': 'Filter',
        'tool.crop': 'Bild Zuschneiden',
        'tool.convert': 'Format Konvertieren',
        'bg.preset.title': 'Bildtyp',
        'bg.preset.auto': '🤖 Auto',
        'editor.bgRemover.title': 'Hintergrund Entfernen',
        'editor.bgRemover.process': 'Entfernen',
        'upscale.title': 'KI Bildvergrößerung',
        'upscale.process': 'Starten',
        'filter.title': 'Bildfilter',
        'filter.apply': 'Anwenden',
        'filter.grayscale': 'Graustufen',
        'filter.vintage': 'Vintage',
        'crop.title': 'Bild Zuschneiden',
        'crop.process': 'Zuschneiden',
        'convert.title': 'Format Konvertieren',
        'convert.process': 'Konvertieren',
        'convert.downloadAll': 'Alle Herunterladen',
    });
    
    // 葡萄牙语翻译
    Object.assign(translations['pt'], {
        'tool.text2img': 'Texto para Imagem',
        'tool.editor': 'Remover Fundo',
        'tool.upscale': 'Ampliar IA',
        'tool.filter': 'Filtros',
        'tool.crop': 'Cortar Imagem',
        'tool.convert': 'Converter Formato',
        'bg.preset.title': 'Tipo de Imagem',
        'bg.preset.auto': '🤖 Auto',
        'editor.bgRemover.title': 'Remover Fundo',
        'editor.bgRemover.process': 'Remover',
        'upscale.title': 'Ampliar com IA',
        'upscale.process': 'Começar',
        'filter.title': 'Filtros de Imagem',
        'filter.apply': 'Aplicar',
        'filter.grayscale': 'Escala de Cinza',
        'filter.vintage': 'Vintage',
        'crop.title': 'Cortar Imagem',
        'crop.process': 'Cortar',
        'convert.title': 'Converter Formato',
        'convert.process': 'Converter',
        'convert.downloadAll': 'Baixar Todos',
    });
    
    // 俄语翻译
    Object.assign(translations['ru'], {
        'tool.text2img': 'Текст в Изображение',
        'tool.editor': 'Удалить Фон',
        'tool.upscale': 'Увеличение ИИ',
        'tool.filter': 'Фильтры',
        'tool.crop': 'Обрезать Изображение',
        'tool.convert': 'Конвертер Форматов',
        'bg.preset.title': 'Тип Изображения',
        'bg.preset.auto': '🤖 Авто',
        'editor.bgRemover.title': 'Удалить Фон',
        'editor.bgRemover.process': 'Удалить',
        'upscale.title': 'Увеличение ИИ',
        'upscale.process': 'Начать',
        'filter.title': 'Фильтры',
        'filter.apply': 'Применить',
        'filter.grayscale': 'Оттенки Серого',
        'filter.vintage': 'Винтаж',
        'crop.title': 'Обрезка Изображения',
        'crop.process': 'Обрезать',
        'convert.title': 'Конвертер',
        'convert.process': 'Конвертировать',
        'convert.downloadAll': 'Скачать Все',
    });
    
    // 阿拉伯语翻译
    Object.assign(translations['ar'], {
        'tool.text2img': 'نص إلى صورة',
        'tool.editor': 'إزالة الخلفية',
        'tool.upscale': 'تكبير بالذكاء الاصطناعي',
        'tool.filter': 'المرشحات',
        'tool.crop': 'قص الصورة',
        'tool.convert': 'تحويل الصيغة',
        'editor.bgRemover.title': 'إزالة الخلفية',
        'editor.bgRemover.process': 'إزالة',
        'upscale.title': 'تكبير الصورة',
        'upscale.process': 'ابدأ',
        'filter.title': 'مرشحات الصورة',
        'filter.apply': 'تطبيق',
        'crop.title': 'قص الصورة',
        'crop.process': 'قص',
        'convert.title': 'محول الصيغ',
        'convert.process': 'تحويل',
        'convert.downloadAll': 'تحميل الكل',
    });
    
    // 印地语翻译
    Object.assign(translations['hi'], {
        'tool.text2img': 'टेक्स्ट से छवि',
        'tool.editor': 'पृष्ठभूमि हटाएं',
        'tool.upscale': 'एआई विस्तार',
        'tool.filter': 'फ़िल्टर',
        'tool.crop': 'छवि काटें',
        'tool.convert': 'प्रारूप परिवर्तक',
        'editor.bgRemover.title': 'पृष्ठभूमि हटाएं',
        'upscale.title': 'एआई विस्तार',
        'filter.title': 'छवि फ़िल्टर',
        'crop.title': 'छवि काटें',
        'convert.title': 'प्रारूप परिवर्तक',
    });
    
    // 泰语翻译
    Object.assign(translations['th'], {
        'tool.text2img': 'ข้อความเป็นรูปภาพ',
        'tool.editor': 'ลบพื้นหลัง',
        'tool.upscale': 'ขยาย AI',
        'tool.filter': 'ฟิลเตอร์',
        'tool.crop': 'ครอบตัดรูปภาพ',
        'tool.convert': 'แปลงรูปแบบ',
        'editor.bgRemover.title': 'ลบพื้นหลัง',
        'upscale.title': 'ขยายภาพ AI',
        'filter.title': 'ฟิลเตอร์รูปภาพ',
        'crop.title': 'ครอบตัดรูปภาพ',
        'convert.title': 'แปลงรูปแบบ',
    });
    
    // 越南语翻译
    Object.assign(translations['vi'], {
        'tool.text2img': 'Văn Bản Sang Hình Ảnh',
        'tool.editor': 'Xóa Nền',
        'tool.upscale': 'Phóng To AI',
        'tool.filter': 'Bộ Lọc',
        'tool.crop': 'Cắt Hình Ảnh',
        'tool.convert': 'Chuyển Đổi Định Dạng',
        'editor.bgRemover.title': 'Xóa Nền',
        'upscale.title': 'Phóng To Hình Ảnh',
        'filter.title': 'Bộ Lọc Hình Ảnh',
        'crop.title': 'Cắt Hình Ảnh',
        'convert.title': 'Chuyển Đổi Định Dạng',
    });
    
    // 印尼语翻译
    Object.assign(translations['id'], {
        'tool.text2img': 'Teks ke Gambar',
        'tool.editor': 'Hapus Latar',
        'tool.upscale': 'Perbesar AI',
        'tool.filter': 'Filter',
        'tool.crop': 'Potong Gambar',
        'tool.convert': 'Konversi Format',
        'editor.bgRemover.title': 'Hapus Latar Belakang',
        'upscale.title': 'Perbesar Gambar AI',
        'filter.title': 'Filter Gambar',
        'crop.title': 'Potong Gambar',
        'convert.title': 'Konversi Format',
    });
    
    // 意大利语翻译
    Object.assign(translations['it'], {
        'tool.text2img': 'Testo in Immagine',
        'tool.editor': 'Rimuovi Sfondo',
        'tool.upscale': 'Ingrandimento IA',
        'tool.filter': 'Filtri',
        'tool.crop': 'Ritaglia Immagine',
        'tool.convert': 'Convertitore Formato',
        'editor.bgRemover.title': 'Rimuovi Sfondo',
        'upscale.title': 'Ingrandimento IA',
        'filter.title': 'Filtri Immagine',
        'filter.grayscale': 'Scala di Grigi',
        'filter.vintage': 'Vintage',
        'crop.title': 'Ritaglia Immagine',
        'convert.title': 'Convertitore',
    });
    
    // 土耳其语翻译
    Object.assign(translations['tr'], {
        'tool.text2img': 'Metinden Görüntüye',
        'tool.editor': 'Arka Plan Kaldır',
        'tool.upscale': 'Yapay Zeka Büyütme',
        'tool.filter': 'Filtreler',
        'tool.crop': 'Görüntü Kırp',
        'tool.convert': 'Format Dönüştürücü',
        'editor.bgRemover.title': 'Arka Plan Kaldır',
        'upscale.title': 'Yapay Zeka ile Büyütme',
        'filter.title': 'Görüntü Filtreleri',
        'crop.title': 'Görüntü Kırpma',
        'convert.title': 'Format Dönüştürücü',
    });
    
    console.log('✅ 新功能多语言翻译已加载');
    
    // 强制更新所有翻译
    setTimeout(() => {
        const currentLang = localStorage.getItem('language') || 'zh-CN';
        console.log('🌍 当前语言:', currentLang);
        console.log('🔄 强制更新翻译...');
        
        // 查找所有有data-i18n属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`找到 ${elements.length} 个需要翻译的元素`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[currentLang]?.[key];
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // 处理title属性
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = translations[currentLang]?.[key];
            if (translation) {
                element.title = translation;
            }
        });
        
        console.log('✅ 翻译更新完成');
    }, 500);
});

