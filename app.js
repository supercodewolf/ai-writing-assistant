// ==================== AI Writing Assistant ====================

class WritingAssistant {
    constructor() {
        // State
        this.currentType = 'news';
        this.isGenerating = false;
        this.generatedContent = '';
        
        // Writing Templates
        this.templates = {
            news: {
                name: '新闻稿',
                prompt: `你是一位专业的新闻稿写手。请根据提供的主题撰写一篇新闻稿，要求：
1. 结构清晰：标题、导语、正文、结语
2. 语言简洁正式，客观陈述事实
3. 包含必要的5W1H要素（何时、何地、何人、何事、何故、如何）
4. 适当引用相关人士的话增加可信度
请用简体中文撰写。`
            },
            marketing: {
                name: '营销文案',
                prompt: `你是一位资深的营销文案专家。请根据提供的主题撰写一篇营销文案，要求：
1. 标题吸引眼球，激发阅读兴趣
2. 内容突出产品/服务的核心价值和独特卖点
3. 情感共鸣强，能打动目标受众
4. 包含明确的行动号召（CTA）
5. 语言富有感染力和号召力
请用简体中文撰写。`
            },
            email: {
                name: '商务邮件',
                prompt: `你是一位专业的商务沟通专家。请根据提供的主题撰写一封商务邮件，要求：
1. 格式规范：主题、称呼、正文、落款
2. 语言专业得体，礼貌周全
3. 逻辑清晰，要点明确
4. 根据邮件类型调整语气（请求、感谢、通知等）
5. 长度适中，信息完整
请用简体中文撰写，邮件格式。`
            },
            report: {
                name: '分析报告',
                prompt: `你是一位专业的行业分析师。请根据提供的主题撰写一份分析报告，要求：
1. 结构完整：摘要、背景、分析、结论、建议
2. 数据支撑，有理有据
3. 逻辑严密，分析深入
4. 结论清晰，建议可行
5. 语言正式专业
请用简体中文撰写。`
            },
            social: {
                name: '社交媒体',
                prompt: `你是一位社交媒体运营专家。请根据提供的主题撰写一篇社交媒体内容，要求：
1. 简短精炼，适合平台阅读习惯
2. 语言活泼有趣，有话题性
3. 善用表情符号和标签增加互动性
4. 引发用户共鸣和讨论
5. 根据平台特性调整风格
请用简体中文撰写。`
            },
            story: {
                name: '故事创作',
                prompt: `你是一位优秀的创意写作专家。请根据提供的主题创作一个故事，要求：
1. 情节丰富，有起承转合
2. 人物形象鲜明立体
3. 细节描写生动，画面感强
4. 主题深刻，有寓意
5. 语言优美流畅
请用简体中文撰写，可以包含章节。`
            }
        };
        
        // API 服务商配置
        this.apiProviders = {
            'openai': {
                name: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                models: [
                    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (推荐)' },
                    { id: 'gpt-4', name: 'GPT-4' },
                    { id: 'gpt-4o', name: 'GPT-4o' }
                ]
            },
            'siliconflow': {
                name: '硅基流动 (SiliconFlow)',
                endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
                models: [
                    { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen2.5-7B (推荐)' },
                    { id: 'Qwen/Qwen2.5-14B-Instruct', name: 'Qwen2.5-14B' },
                    { id: 'deepseek-ai/DeepSeek-V2.5', name: 'DeepSeek V2.5' }
                ]
            },
            'zhipu': {
                name: '智谱 AI (GLM)',
                endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                models: [
                    { id: 'glm-4', name: 'GLM-4 (推荐)' },
                    { id: 'glm-4-flash', name: 'GLM-4-Flash' }
                ]
            },
            'baidu': {
                name: '百度文心一言',
                endpoint: 'https://qianfan.baidubce.com/v2/app/conversation',
                models: [
                    { id: 'eb-instant', name: 'ERNIE-Speed (推荐)' },
                    { id: 'ernie-3.5-8k', name: 'ERNIE-3.5' }
                ]
            },
            'aliyun': {
                name: '阿里通义千问',
                endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                models: [
                    { id: 'qwen-turbo', name: 'Qwen-Turbo (推荐)' },
                    { id: 'qwen-plus', name: 'Qwen-Plus' }
                ]
            },
            'deepseek': {
                name: 'DeepSeek',
                endpoint: 'https://api.deepseek.com/v1/chat/completions',
                models: [
                    { id: 'deepseek-chat', name: 'DeepSeek Chat (推荐)' }
                ]
            },
            'azure': {
                name: 'Azure OpenAI',
                endpoint: '',
                models: [
                    { id: 'gpt-35-turbo', name: 'GPT-3.5 Turbo' },
                    { id: 'gpt-4', name: 'GPT-4' }
                ]
            }
        };
        
        // 当前选中的服务商
        this.currentProvider = localStorage.getItem('writing_provider') || 'openai';
        
        // Settings
        this.settings = {
            apiEndpoint: localStorage.getItem('writing_api_endpoint') || this.apiProviders[this.currentProvider].endpoint,
            apiKey: localStorage.getItem('writing_api_key') || '',
            model: localStorage.getItem('writing_model') || this.apiProviders[this.currentProvider].models[0]?.id
        };
        
        // DOM Elements
        this.typeCards = document.querySelectorAll('.type-card');
        this.toneSelect = document.getElementById('toneSelect');
        this.lengthSelect = document.getElementById('lengthSelect');
        this.audienceInput = document.getElementById('audienceInput');
        this.keywordsInput = document.getElementById('keywordsInput');
        this.topicInput = document.getElementById('topicInput');
        this.generateBtn = document.getElementById('generateBtn');
        this.previewContent = document.getElementById('previewContent');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettings = document.getElementById('saveSettings');
        
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.initSettings();
        this.updateTypeCards();
        this.updateModelOptions();
    }
    
    // ==================== Event Listeners ====================
    initEventListeners() {
        this.typeCards.forEach(card => {
            card.addEventListener('click', () => {
                this.currentType = card.dataset.type;
                this.updateTypeCards();
            });
        });
        
        this.generateBtn.addEventListener('click', () => this.generate());
        this.copyBtn.addEventListener('click', () => this.copyContent());
        this.clearBtn.addEventListener('click', () => this.clearContent());
        
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettingsModal();
        });
        this.saveSettings.addEventListener('click', () => this.saveSettingsData());
        
        // Provider change
        const providerSelect = document.getElementById('providerSelect');
        providerSelect.addEventListener('change', () => {
            this.currentProvider = providerSelect.value;
            this.updateModelOptions();
            this.updateEndpointField();
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generate();
            }
        });
    }
    
    updateModelOptions() {
        const provider = this.apiProviders[this.currentProvider];
        const modelSelect = document.getElementById('modelSelect');
        
        modelSelect.innerHTML = provider.models.map(m => 
            `<option value="${m.id}">${m.name}</option>`
        ).join('');
        
        if (provider.models.length > 0) {
            modelSelect.value = provider.models[0].id;
        }
    }
    
    updateEndpointField() {
        const provider = this.apiProviders[this.currentProvider];
        const endpointInput = document.getElementById('apiEndpoint');
        
        if (this.currentProvider === 'azure') {
            endpointInput.placeholder = '输入 Azure 端点 URL';
            endpointInput.value = '';
        } else {
            endpointInput.placeholder = provider.endpoint;
            endpointInput.value = provider.endpoint;
        }
    }
    
    // ==================== Settings ====================
    initSettings() {
        document.getElementById('providerSelect').value = this.currentProvider;
        document.getElementById('apiEndpoint').value = this.settings.apiEndpoint;
        document.getElementById('apiEndpoint').placeholder = this.apiProviders[this.currentProvider].endpoint;
        document.getElementById('apiKey').value = this.settings.apiKey;
    }
    
    openSettings() {
        // 从 localStorage 读取最新值
        this.currentProvider = localStorage.getItem('writing_provider') || 'openai';
        this.settings.apiEndpoint = localStorage.getItem('writing_api_endpoint') || this.apiProviders[this.currentProvider].endpoint;
        this.settings.apiKey = localStorage.getItem('writing_api_key') || '';
        this.settings.model = localStorage.getItem('writing_model') || this.apiProviders[this.currentProvider].models[0]?.id;
        
        document.getElementById('providerSelect').value = this.currentProvider;
        document.getElementById('apiEndpoint').value = this.settings.apiEndpoint;
        document.getElementById('apiEndpoint').placeholder = this.apiProviders[this.currentProvider].endpoint;
        document.getElementById('apiKey').value = this.settings.apiKey;
        
        this.updateModelOptions();
        document.getElementById('modelSelect').value = this.settings.model;
        
        this.settingsModal.classList.add('active');
    }
    
    closeSettingsModal() {
        this.settingsModal.classList.remove('active');
    }
    
    saveSettingsData() {
        this.currentProvider = document.getElementById('providerSelect').value;
        this.settings.apiEndpoint = document.getElementById('apiEndpoint').value || this.apiProviders[this.currentProvider].endpoint;
        this.settings.apiKey = document.getElementById('apiKey').value;
        this.settings.model = document.getElementById('modelSelect').value;
        
        localStorage.setItem('writing_provider', this.currentProvider);
        localStorage.setItem('writing_api_endpoint', this.settings.apiEndpoint);
        localStorage.setItem('writing_api_key', this.settings.apiKey);
        localStorage.setItem('writing_model', this.settings.model);
        
        this.closeSettingsModal();
        this.showToast(`已切换到 ${this.apiProviders[this.currentProvider].name}`);
    }
    
    // ==================== Type Selection ====================
    updateTypeCards() {
        this.typeCards.forEach(card => {
            card.classList.toggle('active', card.dataset.type === this.currentType);
        });
    }
    
    // ==================== Generation ====================
    async generate() {
        const topic = this.topicInput.value.trim();
        if (!topic) {
            this.showToast('请输入写作主题');
            this.topicInput.focus();
            return;
        }
        
        if (!this.settings.apiKey) {
            this.showToast('请先在设置中配置API Key');
            this.openSettings();
            return;
        }
        
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.updateGenerateButton();
        this.clearContent();
        
        const template = this.templates[this.currentType];
        const tone = this.toneSelect.value;
        const length = this.lengthSelect.value;
        const audience = this.audienceInput.value.trim();
        const keywords = this.keywordsInput.value.trim();
        
        let prompt = template.prompt + '\n\n';
        prompt += `写作主题：${topic}\n`;
        prompt += `语气风格：${this.getToneText(tone)}\n`;
        prompt += `内容长度：${this.getLengthText(length)}\n`;
        if (audience) prompt += `目标受众：${audience}\n`;
        if (keywords) prompt += `关键词：${keywords}\n`;
        
        try {
            this.generatedContent = await this.callAI(prompt);
            this.displayContent(this.generatedContent);
            this.updateStats(this.generatedContent);
            this.copyBtn.disabled = false;
            this.clearBtn.disabled = false;
        } catch (error) {
            this.showToast(`生成失败：${error.message}`);
        }
        
        this.isGenerating = false;
        this.updateGenerateButton();
    }
    
    async callAI(prompt) {
        const provider = this.apiProviders[this.currentProvider];
        
        let response = await fetch(this.settings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.settings.apiKey}`
            },
            body: JSON.stringify({
                model: this.settings.model,
                messages: [
                    { role: 'system', content: '你是一位专业、优秀的写作助手。请用简体中文回复。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 2500
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API请求失败 (${response.status})`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    getToneText(tone) {
        const tones = {
            formal: '正式严肃',
            casual: '轻松随意',
            friendly: '友好亲切',
            professional: '专业权威'
        };
        return tones[tone] || tone;
    }
    
    getLengthText(length) {
        const lengths = {
            short: '简短（200字内）',
            medium: '中等（500字内）',
            long: '详细（1000字内）'
        };
        return lengths[length] || length;
    }
    
    // ==================== Display ====================
    displayContent(content) {
        let html = content
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .split('\n\n')
            .map(p => p.trim())
            .filter(p => p)
            .map(p => {
                if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) {
                    return p;
                }
                return `<p>${p.replace(/\n/g, '<br>')}</p>`;
            })
            .join('');
        
        this.previewContent.innerHTML = `<div class="output-text">${html}</div>`;
    }
    
    updateStats(content) {
        const chars = content.length;
        const words = content.replace(/\s/g, '').length;
        this.charCount.textContent = chars;
        this.wordCount.textContent = words;
    }
    
    // ==================== Actions ====================
    async copyContent() {
        if (!this.generatedContent) return;
        
        try {
            await navigator.clipboard.writeText(this.generatedContent);
            this.showToast('已复制到剪贴板');
        } catch (error) {
            this.showToast('复制失败');
        }
    }
    
    clearContent() {
        this.generatedContent = '';
        this.previewContent.innerHTML = `
            <div class="preview-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                    <path d="M2 2l7.586 7.586"/>
                </svg>
                <p>生成的文字将显示在这里</p>
            </div>
        `;
        this.charCount.textContent = '0';
        this.wordCount.textContent = '0';
        this.copyBtn.disabled = true;
        this.clearBtn.disabled = true;
    }
    
    updateGenerateButton() {
        this.generateBtn.disabled = this.isGenerating;
        this.generateBtn.classList.toggle('loading', this.isGenerating);
        this.generateBtn.querySelector('span').textContent = this.isGenerating ? '生成中...' : '开始生成';
    }
    
    // ==================== Toast ====================
    showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.writingApp = new WritingAssistant();
});
