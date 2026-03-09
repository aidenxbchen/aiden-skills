# Aiden Skills

AI Agent 可复用技能集合 — 从实战中提炼，每个技能都经过真实场景验证。

## Skills 一览

| 技能 | 一句话描述 | 依赖工具 |
|------|-----------|----------|
| [candidate-summary](./candidate-summary/) | 候选人沟通录音 → 结构化面试总结 | faster-whisper |
| [feishu-calendar](./feishu-calendar/) | 通过 API 创建飞书日历日程 | Feishu Open API (Node.js) |
| [feishu-full-access](./feishu-full-access/) | 飞书完整权限技能（日历+云文档+多维表格） | Feishu OpenAPI (OAuth) |
| [feishu-html-content](./feishu-html-content/) | 将 HTML 代码完整写入飞书云文档 | Feishu/Lark MCP |
| [frontend-slides](./frontend-slides/) | 创建零依赖、动画丰富的 HTML 演示文稿 | 纯 HTML/CSS/JS |
| [html2feishu](./html2feishu/) | HTML 文件 → 飞书云文档（支持大文件分块） | Feishu/Lark MCP |
| [web-scrape-to-feishu](./web-scrape-to-feishu/) | 网页数据抓取 → 飞书多维表格 | Safari MCP + Feishu/Lark MCP |

## 技能详情

### candidate-summary
将候选人面谈录音通过 `faster-whisper` 转写，再按照特定语言风格整理为结构化沟通总结。输出包含候选人背景、经历、评价和面试建议，风格简洁克制、以事实为主。

### feishu-calendar
Node.js 脚本，通过飞书开放 API 在个人日历中创建日程事件。支持自定义标题、描述、时间和时区，通过环境变量配置即可运行。

### feishu-full-access
飞书完整权限技能，使 AI 能够通过 OAuth 用户授权后访问日历、云文档和多维表格。支持批量授权 64 个权限，包含日程管理、云文档 CRUD、多维表格数据操作、文档搜索等完整功能。适合需要深度集成飞书的场景。

### feishu-html-content
将生成的 HTML 代码完整复制到飞书云文档中分享。对于超过 10KB 的大文件，自动在 HTML 标签边界处分块写入，保证结构完整性。

### frontend-slides
从零创建或从 PPT 转换为单文件 HTML 演示文稿。零依赖、CSS/JS 内联、支持键盘/滚轮/触摸导航。提供 7 种预设视觉风格，每张幻灯片严格适配视口。

### html2feishu
将 HTML 文件上传为飞书云文档，优先完整写入，仅在超限时自动分块。经实战验证可处理 50KB+ 文件，保持代码完整无损。

### web-scrape-to-feishu
通过 Safari MCP 浏览网页并用 JavaScript 批量提取数据，排序筛选后写入飞书多维表格。包含小红书等平台的选择器经验和飞书 API 踩坑记录。

## 目录结构

```
aiden-skills/
├── README.md                    # 本文件
├── candidate-summary/
│   ├── README.md
│   └── SKILL.md
├── feishu-calendar/
│   ├── README.md
│   ├── SKILL.md
│   ├── create_event.js
│   └── package.json
├── feishu-full-access/
│   ├── README.md
│   └── SKILL.md
├── feishu-html-content/
│   ├── README.md
│   └── SKILL.md
├── frontend-slides/
│   ├── README.md
│   ├── SKILL.md
│   ├── STYLE_PRESETS.md
│   └── LICENSE
├── html2feishu/
│   ├── README.md
│   └── SKILL.md
└── web-scrape-to-feishu/
    ├── README.md
    └── skill.md
```

## 使用方式

每个技能文件夹中：
- **README.md** — 快速了解功能、依赖和使用方法
- **SKILL.md / skill.md** — 完整的执行流程、提示词和踩坑记录，供 AI Agent 直接参考

## License

MIT
