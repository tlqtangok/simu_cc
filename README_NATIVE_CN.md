# agentcc-native 使用说明

## 概述

`agentcc-native` 是一个新的 Node.js 实现，可以在不需要手动设置 API 密钥的情况下调用 Claude。

## 主要特点

1. **无需手动配置 API 密钥**：工具会自动从以下位置查找凭据：
   - Claude Desktop 应用配置（如果已安装）
   - `~/.claude/config.json` 文件
   - `ANTHROPIC_API_KEY` 环境变量（作为后备选项）

2. **与原版功能相同**：
   - 发送消息给 Claude
   - 维护对话上下文
   - 使用 `/clear` 命令清除上下文

3. **跨平台支持**：
   - macOS
   - Windows
   - Linux

4. **独立的上下文文件**：使用 `~/.agentcc_native_context.json` 存储对话历史，与 API 版本的上下文分开。

## 安装和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置凭据（可选）

如果您已经安装了 Claude Desktop 或设置了环境变量，可以跳过此步骤。

否则，运行设置脚本：

```bash
./setup_native.sh
```

### 3. 使用工具

```bash
# 发送消息
./agentcc-native.js "你的问题"

# 清除对话历史
./agentcc-native.js "/clear"
```

### 4. 全局安装（可选）

```bash
npm install -g .

# 然后可以在任何地方使用
agentcc-native "你的问题"
```

## 示例

```bash
# 开始对话
agentcc-native "你好，请解释一下什么是 Python 装饰器"

# 继续对话（保持上下文）
agentcc-native "能给我一个例子吗？"

# 再问一个问题（仍在同一上下文中）
agentcc-native "有哪些常见的使用场景？"

# 清除上下文，开始新对话
agentcc-native "/clear"

# 开始新对话
agentcc-native "告诉我关于 Node.js async/await 的知识"
```

## 凭据优先级

工具按以下顺序查找凭据：

1. **Claude Desktop 配置**（优先级最高）
   - macOS: `~/Library/Application Support/Claude/config.json`
   - Windows: `%APPDATA%/Claude/config.json`
   - Linux: `~/.config/Claude/config.json`

2. **Claude CLI 配置**
   - `~/.claude/config.json`

3. **环境变量**（后备选项）
   - `ANTHROPIC_API_KEY`

## 与 API 版本的区别

| 特性 | agentcc (API版本) | agentcc-native |
|------|-------------------|----------------|
| API 密钥设置 | 需要手动设置环境变量 | 自动查找凭据 |
| 上下文文件 | `~/.agentcc_context.json` | `~/.agentcc_native_context.json` |
| 配置复杂度 | 需要导出环境变量 | 零配置或简单配置 |

## 故障排除

### "Could not find Claude API credentials"

确保以下之一已配置：
- 已安装 Claude Desktop 应用
- 已创建 `~/.claude/config.json` 文件，内容为：`{"apiKey": "your-key"}`
- 已设置 `ANTHROPIC_API_KEY` 环境变量

### 权限问题

确保脚本可执行：
```bash
chmod +x agentcc-native.js
```

## 技术实现

该工具使用 Anthropic SDK，但不需要用户手动提供 API 密钥。它会自动从系统中已配置的 Claude 应用或配置文件中读取凭据，实现了"用本地的系统里的 Claude 中配置的就可以"的需求。
