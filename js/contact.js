// 联系表单处理脚本

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // 显示加载状态
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-i18n="contact.form.sending">发送中...</span>';
            submitBtn.disabled = true;
            
            try {
                // 发送到后端API
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // 成功提示
                    const messages = {
                        'zh-CN': '感谢您的留言！我们会尽快回复您。',
                        'en': 'Thank you for your message! We will get back to you soon.',
                        'ja': 'お問い合わせありがとうございます！すぐにご返信いたします。',
                        'ko': '메시지 감사합니다! 곧 연락드리겠습니다.',
                        'es': '¡Gracias por tu mensaje! Te responderemos pronto.',
                        'fr': 'Merci pour votre message ! Nous vous répondrons bientôt.',
                        'de': 'Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.'
                    };
                    
                    const currentLang = localStorage.getItem('language') || 'zh-CN';
                    const message = messages[currentLang] || messages['zh-CN'];
                    
                    alert(message);
                    
                    // 重置表单
                    contactForm.reset();
                } else {
                    // 错误提示
                    alert(result.error || '提交失败，请稍后再试。');
                }
            } catch (error) {
                console.error('提交表单时出错:', error);
                alert('网络错误，请检查连接后重试。');
            } finally {
                // 恢复按钮状态
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // 更新placeholder的多语言支持
    const updatePlaceholders = () => {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageTextarea = document.getElementById('message');
        
        if (nameInput && nameInput.hasAttribute('data-i18n-placeholder')) {
            const key = nameInput.getAttribute('data-i18n-placeholder');
            if (window.t && typeof window.t === 'function') {
                nameInput.placeholder = window.t(key);
            }
        }
        
        if (emailInput && emailInput.hasAttribute('data-i18n-placeholder')) {
            const key = emailInput.getAttribute('data-i18n-placeholder');
            if (window.t && typeof window.t === 'function') {
                emailInput.placeholder = window.t(key);
            }
        }
        
        if (messageTextarea && messageTextarea.hasAttribute('data-i18n-placeholder')) {
            const key = messageTextarea.getAttribute('data-i18n-placeholder');
            if (window.t && typeof window.t === 'function') {
                messageTextarea.placeholder = window.t(key);
            }
        }
    };
    
    // 在语言改变时更新placeholder
    document.addEventListener('languageChanged', updatePlaceholders);
    
    // 初始更新
    setTimeout(updatePlaceholders, 100);
});

