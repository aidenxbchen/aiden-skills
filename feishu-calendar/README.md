# Feishu Calendar Skill

## 功能
- 在用户个人日历中创建日程事件
- 支持自定义标题、描述、时间、时区
- 生成飞书日历链接供快速访问

## 使用方法

### 1. 环境变量配置
```bash
export APP_ID="your_feishu_app_id"
export APP_SECRET="your_feishu_app_secret"  
export USER_ACCESS_TOKEN="your_user_access_token"
export SUMMARY="会议标题"
export START_TIME="1773536400"  # Unix timestamp (秒)
export END_TIME="1773543600"    # Unix timestamp (秒)
export DESCRIPTION="会议描述"    # 可选
export TIMEZONE="Asia/Shanghai" # 可选，默认为 Asia/Shanghai
```

### 2. 安装依赖
```bash
npm install
```

### 3. 执行创建
```bash
npm run create
```

## 获取 User Access Token

User Access Token 需要通过飞书 OAuth 2.0 授权流程获取：
1. 用户访问授权URL
2. 用户同意授权
3. 应用接收授权码
4. 应用使用授权码换取 access_token

## 权限要求

应用需要在飞书开发者后台配置以下权限：
- `calendar:calendar.event:create` (user scope)
- `calendar:calendar:readonly` (user scope)

## 错误处理

常见错误代码：
- `191002`: 日历访问权限不足 - 确保使用 user_access_token
- `99991668`: 无效的访问令牌 - 检查 token 是否过期
- `10014`: 应用ID不存在 - 检查 APP_ID 配置

## 示例

创建一个测试日程：
```bash
export USER_ACCESS_TOKEN="your_user_access_token_here"
export SUMMARY="OpenClaw 测试会议"
export START_TIME="1773536400"
export END_TIME="1773543600"
export DESCRIPTION="测试飞书日历集成"
npm run create
```

## 贡献

此技能基于实际项目经验总结，欢迎提交 Issue 和 PR。