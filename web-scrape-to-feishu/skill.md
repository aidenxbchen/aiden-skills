# 技能：从网页抓取信息 → 写入飞书多维表格

## 前置条件

### Safari MCP
- Safari 已启用「允许 Apple 事件中的 JavaScript」（开发 → 开发者设置… → 勾选）
- 如未启用，执行：
  ```bash
  osascript -e 'tell application "Safari" to activate'
  osascript -e 'tell application "System Events" to tell process "Safari" to click menu item "开发者设置…" of menu "开发" of menu bar 1'
  ```
  然后通过 System Events 勾选复选框

### 飞书 MCP
- 已配置飞书 Lark MCP，具备 Bitable 读写权限

---

## 执行流程（3步，约5分钟）

### 第1步：Safari 抓取数据（~3分钟）

1. **navigate** → 目标页面（如搜索结果页、用户主页）
2. **execute_script** → 一次性获取所有条目的链接 + 缩略数据（如点赞数）
3. 在内存中排序/筛选，确定需要详细查看的 URL 列表
4. 逐一 **navigate** 到详情页 → **execute_script** 提取完整数据
   - 每页仅需一次 navigate + 一次 execute_script
   - **不要每页都截图**，只在首次探索页面结构时截图

> JS 返回值中不能包含换行符（会导致 AppleScript 报错），使用 ` ## ` 等分隔符替代 `\n`

### 第2步：创建飞书多维表格（~30秒）

1. `bitable_v1_app_create` → 创建多维表格应用
2. `bitable_v1_appTable_create` → 创建数据表
   - **不要包含公式字段！** 公式字段会导致表格长时间处于 "Data not ready" 状态
   - 先建简单字段（文本、数字），数据写完后再手动或 API 添加公式
3. `sleep 15` → 等待表格初始化完成

### 第3步：写入数据（~1分钟）

1. 逐条 `bitable_v1_appTableRecord_create` 写入记录
2. 遇到 TLS 断连错误直接重试即可
3. 全部写完后，返回多维表格 URL 给用户

---

## 踩坑记录

### Safari MCP

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `execute_script` / `click_element` 等报错 | Safari 未启用「允许 Apple 事件中的 JavaScript」 | 通过「开发 → 开发者设置」勾选 |
| JS 返回值报 `变量 jsResult 没有定义` | 返回值包含换行符 `\n` | 用 ` ## ` 等分隔符替代 |
| 每个页面截图+读图极慢 | 截图 + 多模态读取开销大 | 只首次截图理解结构，后续纯 JS |

### 小红书特定

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 访问 `/explore/noteId` 跳到发现页 | 缺少 xsec_token 认证 | 使用 `/user/profile/userId/noteId?xsec_token=xxx&xsec_source=pc_user` |
| 笔记互动数据选择器 | — | `span.count` 最后3个元素 = 点赞、收藏、评论；标题 = `#detail-title` |

### 飞书多维表格

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 持续报 `1254607 Data not ready` | 含公式字段的表格初始化极慢 | 先建不含公式的表，写完数据后再加公式 |
| TLS 连接断开 | 网络偶发问题 | 直接重试 |

---

## 关键优化原则

1. **批量获取，按需深入** — 先在列表页一次性抓缩略数据排序，只打开 Top N 详情页
2. **JS 优先，截图兜底** — 数据提取全用 execute_script，只在不确定页面结构时截图
3. **简单建表，延迟公式** — 飞书表先不加公式字段，避免初始化卡住
4. **提前检查环境** — 开始前确认 Safari JS 权限已启用
