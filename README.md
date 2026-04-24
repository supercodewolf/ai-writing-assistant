# AI Writing Assistant - 智能写作助手

## Concept & Vision
一款优雅的AI写作助手，以「墨韵」为设计理念，融合传统书房的宁静与现代科技的智能。界面采用温暖的米白色调配合淡雅的墨绿色点缀，营造沉浸、专注的写作氛围。每一次文字生成都如同毛笔落纸般流畅自然。

## Design Language

### Aesthetic Direction
书房墨韵主题 (Study Ink Theme)
- 主背景：温暖的米白色 (`#faf8f5`)
- 次级背景：淡雅的宣纸色 (`#f5f3ef`)
- 主色调：墨绿色 (`#2d5a4a`)
- 辅助色：古铜金 (`#b8860b`)
- 强调色：朱砂红 (`#c75643`)
- 文字色：墨黑 (`#2c2c2c`)，次级 (`#6b6b6b`)

### Typography
- 主字体：Noto Serif SC (中文衬线体) + Lora (英文衬线体)
- 标题：700 weight, tracking-normal
- 正文：400 weight, leading-relaxed
- 字体大小：标题 1.5rem-2rem，正文 1rem-1.125rem

### Spatial System
- 基础单位：8px
- 卡片圆角：8px - 12px
- 输入框圆角：6px
- 内边距：16px - 32px

### Motion Philosophy
- 入场动画：淡入，400ms ease-out
- 内容生成：逐字显示，打字机效果
- 按钮交互：微微下压 + 颜色变化
- 状态切换：平滑过渡，200ms
- 加载状态：优雅的脉冲动画

## Layout & Structure

### 整体布局
```
┌────────────────────────────────────────────────────┐
│  Header (Logo + 写作类型选择)                       │
├──────────────────────┬─────────────────────────────┤
│                      │                             │
│  Writing Panel       │  Preview Panel              │
│  - 类型选择器         │  - 实时预览                  │
│  - 参数配置           │  - 格式渲染                  │
│  - 内容输入           │  - 一键复制                  │
│  - 生成按钮           │                             │
│                      │                             │
├──────────────────────┴─────────────────────────────┤
│  Footer (字数统计 + 操作按钮)                       │
└────────────────────────────────────────────────────┘
```

### 响应式策略
- 桌面端：双栏布局，左侧编辑，右侧预览
- 平板端：标签切换，编辑/预览切换
- 移动端：单栏，底部操作栏

## Features & Interactions

### 核心功能
1. **多类型写作**
   - 新闻稿：正式、客观、简洁
   - 营销文案：吸引眼球、情感共鸣
   - 邮件：专业、有礼、结构清晰
   - 报告：数据支撑、逻辑严密
   - 社交媒体：简短、活泼、有话题性
   - 故事创作：情节丰富、人物立体

2. **智能配置**
   - 语气选择：正式/轻松/友好/专业
   - 长度控制：简短/中等/详细
   - 关键词强调
   - 目标受众设定

3. **实时预览**
   - Markdown 实时渲染
   - 所见即所得
   - 一键复制
   - 导出功能

### 交互细节
- **模板选择**：点击切换，图标+文字组合
- **内容输入**：支持富文本，支持粘贴
- **生成内容**：逐字显示，支持中断
- **复制结果**：点击复制，成功提示

### 边界情况
- 空输入：提示输入内容
- 内容过长：分批处理
- 生成中断：保留已生成内容
- 网络错误：友好提示，可重试

## Component Inventory

### TypeSelector
- 图标+文字组合
- 悬停效果：背景色变化
- 选中状态：边框高亮+背景色

### ParameterPanel
- 下拉选择器（语气、长度）
- 关键词输入框
- 受众选择器

### EditorPanel
- 大文本输入框
- 占位符提示
- 字符计数器

### PreviewPanel
- 渲染后的内容展示
- Markdown 格式支持
- 操作按钮组

### GenerateButton
- 主按钮样式
- 加载状态：旋转图标
- 禁用状态：灰色

## Technical Approach

### 前端技术
- 纯 HTML5 + CSS3 + Vanilla JavaScript
- CSS Grid 双栏布局
- CSS 变量管理主题
- Marked.js 渲染 Markdown

### AI 集成
- 预留 OpenAI API 接口
- 支持流式输出
- 支持自定义参数

### 数据结构
```javascript
// 写作请求
{
  type: 'news' | 'marketing' | 'email' | 'report' | 'social' | 'story',
  tone: 'formal' | 'casual' | 'friendly' | 'professional',
  length: 'short' | 'medium' | 'long',
  keywords: string[],
  audience: string,
  content: string
}

// 写作模板
{
  type: string,
  icon: string,
  title: string,
  description: string,
  prompt: string
}
```

### API 配置
```javascript
{
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  temperature: 0.8,
  maxTokens: 2000
}
```
