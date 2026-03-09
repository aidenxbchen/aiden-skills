---
name: feishu-full-access
description: |
  飞书完整权限技能。包含日历管理、云文档（云空间）、多维表格的完整操作能力。
  适用于需要读取用户所有飞书日历、云文档、多维表格的场景。
  需要用户完成 OAuth 授权（一次性批量授权 64 个权限）。
---

# 飞书完整权限技能 (feishu-full-access)

## 🚨 执行前必读

- ✅ **时区固定**：Asia/Shanghai（UTC+8）
- ✅ **时间格式**：ISO 8601 / RFC 3339（带时区），例如 `2026-02-25T14:00:00+08:00`
- ✅ **用户身份**：所有操作使用用户身份（通过 OAuth 授权）
- ✅ **授权要求**：首次使用需要用户完成批量授权（64个权限）

---

## 📋 快速索引

| 功能 | 工具 | 用途 |
|------|------|------|
| 日程管理 | feishu_calendar_event | 创建/查询/修改/删除日程 |
| 日历管理 | feishu_calendar_calendar | 获取用户主日历 ID |
| 忙闲查询 | feishu_calendar_freebusy | 查询用户忙碌/空闲状态 |
| 云文档 | feishu_drive_file | 列出/上传/下载/删除文件 |
| 多维表格 | feishu_bitable_app | 列出/创建/管理多维表格 |
| 多维表格数据 | feishu_bitable_app_table_record | 增删改查多维表格记录 |
| 文档搜索 | feishu_search_doc_wiki | 搜索云文档和知识库 |
| 用户信息 | feishu_get_user | 获取当前用户信息 |
| 批量授权 | feishu_oauth_batch_auth | 一次性申请所有权限 |

---

## 🔐 授权流程

### ⚠️ 授权机制核心要点（必须理解）

**飞书 MCP 工具的授权流程是自动化的**，AI 无需手动拼接授权链接：

1. **当调用需要授权的 API 时**：
   - 如果用户尚未授权，工具会**自动**向用户发送授权请求卡片
   - 卡片中包含飞书官方的授权链接（由飞书系统生成，格式类似 `https://open.feishu.cn/...`）
   - AI 只需等待用户完成授权，无需关心链接的具体内容

2. **用户完成授权的标志**：
   - 用户点击授权卡片中的链接，完成飞书 OAuth 授权
   - 系统会发送 `auth-complete` 事件（消息元数据中包含 `auth-complete`）
   - 用户也会口头告诉 AI "我已完成授权"

3. **收到授权后**：
   - 再次调用之前失败的 API 即可

### ❌ 常见错误：不要手动拼接授权链接

很多 OpenClaw 实例犯的错误是：
- 试图自己生成授权链接
- 使用固定的、格式错误的链接
- 链接缺少必要的参数（如 app_id、state 等）

**正确的做法**：
- ✅ 依赖 `feishu_oauth_batch_auth` 工具自动生成授权请求
- ✅ 或依赖各 API 工具在需要授权时自动返回授权卡片
- ❌ **不要**尝试自己拼接 URL，如 `https://open.feishu.cn/auth?xxx`

### 首次使用：批量授权（推荐）

对于首次使用或需要完整权限的场景，推荐使用批量授权工具：

```json
{
  "action": "invoke",
  "tool": "feishu_oauth_batch_auth"
}
```

**返回**：
```json
{
  "success": true,
  "message": "已发送批量授权请求卡片，共需授权 50 个权限。请在卡片中完成授权。\n授权完成后，还需授权剩余 14 个权限"
}
```

**流程**：
1. 调用 `feishu_oauth_batch_auth`
2. 向用户展示返回的授权卡片（系统自动发送）
3. 用户点击卡片中的链接完成第一轮授权（50个权限）
4. 用户说"我已完成授权"后，再次调用 `feishu_oauth_batch_auth`
5. 用户完成第二轮授权（剩余14个权限）
6. 授权完成！

### 按需授权（自动触发）

如果不确定需要哪些权限，可以直接调用目标 API：

1. **调用任意需要授权的 API**，如：
   ```json
   {
     "action": "invoke",
     "tool": "feishu_drive_file",
     "params": {
       "action": "list"
     }
   }
   ```

2. **返回 `awaiting_authorization: true`**：
   ```json
   {
     "success": true,
     "message": "已发送授权请求卡片，请用户在卡片中扫码或点击链接完成授权。授权完成后请重新执行之前的操作。",
     "awaiting_authorization": true
   }
   ```

3. **系统自动向用户发送授权卡片**，用户点击完成授权

4. **收到 `auth-complete` 事件**（观察消息元数据）

5. **再次调用相同的 API** 即可成功

### 授权状态检测

| 情况 | API 返回 | 处理方式 |
|------|----------|----------|
| 未授权 | `awaiting_authorization: true` | 等待用户完成授权 |
| 授权过期 | `token_expired` 错误 | 调用 `feishu_oauth` revoke 后重新授权 |
| 已授权 | 正常返回数据 | 继续执行 |

---

## 📅 日历与日程

### 获取用户主日历 ID

```json
{
  "action": "invoke",
  "tool": "feishu_calendar_calendar",
  "params": {
    "action": "primary"
  }
}
```

**返回**：
```json
{
  "calendars": [{
    "calendar": {
      "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
      "summary": "陈曦斌",
      "type": "primary"
    }
  }]
}
```

### 查看今日日程

```json
{
  "action": "invoke",
  "tool": "feishu_calendar_event",
  "params": {
    "action": "instance_view",
    "start_time": "2026-03-09T00:00:00+08:00",
    "end_time": "2026-03-09T23:59:59+08:00",
    "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn"
  }
}
```

**说明**：
- `instance_view` 会自动展开重复日程为多个实例
- 时间区间不能超过 40 天
- 返回实例数量上限 1000

### 查询忙闲状态

```json
{
  "action": "invoke",
  "tool": "feishu_calendar_freebusy",
  "params": {
    "action": "list",
    "time_min": "2026-03-09T09:00:00+08:00",
    "time_max": "2026-03-09T18:00:00+08:00",
    "user_ids": ["ou_2776c2bca8c3694a0a1baafb9fcdac27"]
  }
}
```

---

## 📁 云文档管理

### 列出用户云空间根目录文件

```json
{
  "action": "invoke",
  "tool": "feishu_drive_file",
  "params": {
    "action": "list"
  }
}
```

**返回文件类型**：
- `folder` - 文件夹
- `docx` - 新版文档
- `doc` - 旧版文档
- `sheet` - 表格
- `bitable` - 多维表格
- `file` - 文件（PDF、Excel等）
- `slides` - 幻灯片
- `mindnote` - 思维导图

### 下载文件

```json
{
  "action": "invoke",
  "tool": "feishu_drive_file",
  "params": {
    "action": "download",
    "file_token": "xxx",
    "type": "file",
    "output_path": "/tmp/document.pdf"
  }
}
```

### 上传文件

```json
{
  "action": "invoke",
  "tool": "feishu_drive_file",
  "params": {
    "action": "upload",
    "file_path": "/tmp/example.pdf",
    "parent_node": "folder_token"
  }
}
```

---

## 📊 多维表格管理

### 列出用户所有多维表格

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app",
  "params": {
    "action": "list"
  }
}
```

### 列出多维表格中的数据表

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app_table",
  "params": {
    "action": "list",
    "app_token": "U1pPbdWkEa0bETsr8dAchCf3nPg"
  }
}
```

### 查询多维表格记录

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app_table_record",
  "params": {
    "action": "list",
    "app_token": "U1pPbdWkEa0bETsr8dAchCf3nPg",
    "table_id": "tblxxx",
    "page_size": 50
  }
}
```

### 筛选记录

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app_table_record",
  "params": {
    "action": "list",
    "app_token": "xxx",
    "table_id": "xxx",
    "filter": {
      "conjunction": "and",
      "conditions": [
        {"field_name": "姓名", "operator": "contains", "value": ["陈"]},
        {"field_name": "状态", "operator": "is", "value": ["面试中"]}
      ]
    }
  }
}
```

### 创建记录

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app_table_record",
  "params": {
    "action": "create",
    "app_token": "xxx",
    "table_id": "xxx",
    "fields": {
      "姓名": "张三",
      "岗位": "产品经理",
      "状态": "待面试"
    }
  }
}
```

### 批量创建记录

```json
{
  "action": "invoke",
  "tool": "feishu_bitable_app_table_record",
  "params": {
    "action": "batch_create",
    "app_token": "xxx",
    "table_id": "xxx",
    "records": [
      {"fields": {"姓名": "张三", "岗位": "产品经理"}},
      {"fields": {"姓名": "李四", "岗位": "设计师"}}
    ]
  }
}
```

---

## 🔍 搜索文档

### 搜索云文档和知识库

```json
{
  "action": "invoke",
  "tool": "feishu_search_doc_wiki",
  "params": {
    "action": "search",
    "query": "候选人申请表"
  }
}
```

**支持筛选**：
```json
{
  "action": "invoke",
  "tool": "feishu_search_doc_wiki",
  "params": {
    "action": "search",
    "query": "面试",
    "filter": {
      "doc_types": ["DOCX", "BITABLE"],
      "only_title": false
    }
  }
}
```

---

## 👤 获取用户信息

```json
{
  "action": "invoke",
  "tool": "feishu_get_user"
}
```

**返回**：
```json
{
  "user": {
    "open_id": "ou_2776c2bca8c3694a0a1baafb9fcdac27",
    "name": "陈曦斌",
    "en_name": "陈曦斌",
    "avatar_url": "https://..."
  }
}
```

---

## 📌 常见工作流程

### 流程 1：查看今日日程

```
1. feishu_get_user → 获取用户 open_id
2. feishu_calendar_calendar(action=primary) → 获取主日历 ID
3. feishu_calendar_event(action=instance_view) → 获取今日日程
```

### 流程 2：批量授权

```
1. 调用任意需要授权的 API（如 feishu_drive_file.list）
2. 返回 awaiting_authorization: true
3. feishu_oauth_batch_auth → 发送批量授权请求（50个权限）
4. 用户完成授权后，再次调用 feishu_oauth_batch_auth（14个权限）
5. 用户完成授权后，正常调用 API
```

### 流程 3：管理多维表格

```
1. feishu_bitable_app(action=list) → 列出所有多维表格
2. feishu_bitable_app_table(action=list) → 列出表格中的数据表
3. feishu_bitable_app_table_record(action=list) → 查询记录
4. feishu_bitable_app_table_record(action=create/update/delete) → 操作记录
```

---

## ⚠️ 注意事项

1. **授权有效期**：OAuth token 可能会过期，如果返回 `token_expired` 错误，需要用户重新授权
2. **权限范围**：批量授权后获得 64 个权限的访问权限，包括：
   - 日历读写权限
   - 云空间文件读写权限
   - 多维表格读写权限
   - 用户信息读取权限
3. **分页**：列表类 API 支持分页，使用 `page_token` 进行翻页
4. **时间格式**：所有时间必须使用 ISO 8601 格式（带时区）
5. **用户身份**：所有操作以用户身份执行，发送的消息和创建的内容会显示为用户本人