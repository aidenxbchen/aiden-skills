# feishu-full-access 技能

飞书完整权限技能，让 AI 能够像你一样操作飞书日历、云文档和多维表格。

## 安装

将 `feishu-full-access` 文件夹复制到 OpenClaw 的 skills 目录：

```bash
cp -r ~/.openclaw/workspace/skills/feishu-full-access ~/.openclaw/extensions/feishu-openclaw-plugin/skills/
```

或使用 ClawHub：

```bash
clawhub install feishu-full-access
```

## 功能

| 功能 | 说明 |
|------|------|
| 📅 日程管理 | 创建、查询、修改、删除日程 |
| 📆 日历管理 | 获取用户主日历 ID |
| ⏰ 忙闲查询 | 查询用户忙碌/空闲状态 |
| 📁 云文档 | 列出、上传、下载、删除文件 |
| 📊 多维表格 | 列出表格、增删改查记录 |
| 🔍 文档搜索 | 搜索云文档和知识库 |
| 👤 用户信息 | 获取当前用户信息 |

## 快速开始

### 1. 首次授权

首次使用需要用户完成 OAuth 授权：

```
你：帮我查看今天的日程
AI：已发送授权请求，请完成授权后告诉我
你：我已完成授权
AI：（正常查询并返回日程）
```

### 2. 查看日程

```
你：查看我的日程
AI：调用 feishu_get_user → feishu_calendar_calendar → feishu_calendar_event
    返回今日日程列表
```

### 3. 操作云文档

```
你：列出我的云文档
AI：调用 feishu_drive_file(action=list)
    返回文件列表
```

### 4. 操作多维表格

```
你：查看候选人申请表
AI：调用 feishu_bitable_app(action=list) → feishu_bitable_app_table(action=list)
    → feishu_bitable_app_table_record(action=list)
    返回表格数据
```

## 授权流程详解

### 方式一：按需授权

1. 调用任意需要授权的 API
2. 返回 `awaiting_authorization: true`
3. 用户点击授权链接完成授权
4. 再次调用 API 即可

### 方式二：批量授权（推荐首次使用）

1. 调用 `feishu_oauth_batch_auth`
2. 用户完成 50 个权限的授权
3. 再次调用 `feishu_oauth_batch_auth`
4. 用户完成剩余 14 个权限的授权
5. 完成！

### 授权包含的权限

共 64 个权限，涵盖：
- 日历读写（Calendars、Events）
- 云空间文件管理（Drive、Files）
- 多维表格操作（Bitable）
- 用户信息读取（Contact、Users）
- 文档搜索（Search）

## 常用命令示例

### 日程操作

```python
# 查看今日日程
feishu_calendar_event(action="instance_view", start_time="2026-03-09T00:00:00+08:00", end_time="2026-03-09T23:59:59+08:00", calendar_id="feishu.cn_xxx")

# 创建日程
feishu_calendar_event(action="create", summary="会议", start_time="2026-03-09T14:00:00+08:00", end_time="2026-03-09T15:00:00+08:00", user_open_id="ou_xxx")

# 查询忙闲
feishu_calendar_freebusy(action="list", time_min="2026-03-09T09:00:00+08:00", time_max="2026-03-09T18:00:00+08:00", user_ids=["ou_xxx"])
```

### 云文档操作

```python
# 列出文件
feishu_drive_file(action="list")

# 下载文件
feishu_drive_file(action="download", file_token="xxx", output_path="/tmp/file.pdf")

# 上传文件
feishu_drive_file(action="upload", file_path="/tmp/example.pdf")
```

### 多维表格操作

```python
# 列出多维表格
feishu_bitable_app(action="list")

# 查询记录
feishu_bitable_app_table_record(action="list", app_token="xxx", table_id="xxx")

# 创建记录
feishu_bitable_app_table_record(action="create", app_token="xxx", table_id="xxx", fields={"姓名": "张三"})

# 筛选记录
feishu_bitable_app_table_record(action="list", app_token="xxx", table_id="xxx", filter={"conjunction": "and", "conditions": [{"field_name": "姓名", "operator": "contains", "value": ["陈"]}]})
```

## 注意事项

1. **时间格式**：必须使用 ISO 8601 格式，如 `2026-03-09T14:00:00+08:00`
2. **用户身份**：所有操作以用户身份执行
3. **token 过期**：如果返回 `token_expired`，需要用户重新授权
4. **分页**：列表 API 支持 `page_token` 分页

## 相关技能

- [feishu-calendar](./feishu-calendar) - 日历与日程管理
- [feishu-bitable](./feishu-bitable) - 多维表格操作
- [feishu-im-read](./feishu-im-read) - 消息读取
- [feishu-task](./feishu-task) - 任务管理
- [feishu-create-doc](./feishu-create-doc) - 创建文档
- [feishu-fetch-doc](./feishu-fetch-doc) - 获取文档
- [feishu-update-doc](./feishu-update-doc) - 更新文档