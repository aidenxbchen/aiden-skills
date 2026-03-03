# Feishu Calendar Skill

## 概述
本技能提供飞书日历事件的创建、管理功能，支持在用户个人日历中创建事件并邀请参会人。

## 🚨 智能体使用提醒
**在使用此技能前，必须向用户提供以下信息：**
1. **USER_ACCESS_TOKEN** - 用户访问令牌（通过OAuth授权获得）
2. **USER_ID** - 用户的飞书OpenID  
3. **CALENDAR_ID** - 用户的主日历ID（可选，如未提供则自动获取）

**注意：这些是用户的敏感个人信息，智能体不得在公共文档或代码中硬编码！**

## 关键概念

### Token 类型区别
- **tenant_access_token**: 应用级令牌，只能管理应用自己的日历
- **user_access_token**: 用户级令牌，可以管理指定用户的个人日历

### 权限要求
- 必须使用 **user_access_token** 才能在用户个人日历中创建事件
- 用户必须已授权应用访问其日历权限
- 应用需要 `calendar:calendar.event:create` (user scope) 权限

## 使用流程

### 1. 获取 user_access_token
用户必须通过 OAuth 2.0 授权流程获取 user_access_token，或者从已有授权中获取。

### 2. 获取用户主日历ID
```bash
GET /calendar/v4/calendars/primary?user_id_type=open_id
Authorization: Bearer ${USER_ACCESS_TOKEN}
```

### 3. 在用户日历中创建事件
```bash
POST /calendar/v4/calendars/${CALENDAR_ID}/events?user_id_type=open_id
Authorization: Bearer ${USER_ACCESS_TOKEN}
Content-Type: application/json

{
  "summary": "事件标题",
  "description": "事件描述",
  "start_time": {
    "timestamp": "开始时间戳",
    "timezone": "Asia/Shanghai"
  },
  "end_time": {
    "timestamp": "结束时间戳", 
    "timezone": "Asia/Shanghai"
  }
}
```

## 常见问题排查

### 权限错误 (code: 191002)
- **原因**: 使用了 tenant_access_token 而非 user_access_token
- **解决方案**: 确保使用正确的 user_access_token

### 无法邀请参会人
- **原因**: 在应用日历中创建事件无法向其他用户发送邀请
- **解决方案**: 在目标用户的个人日历中创建事件，用户作为组织者

### 日历角色检查
- 使用 `/calendar/v4/calendars?user_id=${USER_ID}` 检查用户日历权限
- 确保返回的 `role` 字段为 `owner` 或 `writer`

## 最佳实践

1. **始终使用 user_access_token** 进行用户日历操作
2. **先获取主日历ID** 再创建事件，避免硬编码日历ID
3. **验证时间戳格式**：使用秒级 Unix 时间戳
4. **设置正确的时区**：推荐使用 "Asia/Shanghai"
5. **处理 API 错误**：检查返回的 code 字段，code=0 表示成功

## 环境变量配置
```bash
APP_ID=your_app_id
APP_SECRET=your_app_secret  
USER_ACCESS_TOKEN=your_user_access_token
```

## 参考实现
完整的 Node.js 实现参考：[飞书日历操作脚本](https://open.feishu.cn/document/server-docs/calendar-v4/overview)