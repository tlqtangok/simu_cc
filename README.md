# simu_cc

Simulator for Claude Code Chat - A command-line tool to interact with Claude API with context memory.

**NEW**: Now includes `agentcc-native` - a native implementation that uses your local Claude Desktop app without requiring API keys!

## Features

- Send messages to Claude API and get responses
- Maintains conversation context across multiple messages
- Clear context with `/clear` command
- Available in both Python and Node.js
- **NEW**: Native Claude Desktop client (`agentcc-native`) - no API key required!
- Simple command-line interface

## Requirements

### Python Version
- Python 3.7 or higher
- pip3

### Node.js Version
- Node.js 14 or higher
- npm

## Installation

### Python Version

```bash
# Install dependencies
pip3 install -r requirements.txt

# Make executable
chmod +x agentcc.py

# Optional: Run setup script to install globally
./setup_python.sh
```

### Node.js Version

```bash
# Install dependencies
npm install

# Make executable
chmod +x agentcc.js

# Optional: Run setup script to install globally
./setup_nodejs.sh
```

Or install globally using npm:
```bash
npm install -g .
```

## Configuration

### For API-based versions (agentcc.py and agentcc.js)

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

You can add this to your shell profile (~/.bashrc, ~/.zshrc, etc.) to make it permanent.

### For Native Claude Desktop version (agentcc-native.js)

**No configuration needed!** The native version uses your locally installed Claude Desktop app, which uses the credentials already configured in the app. This method:
- Does not require API keys or environment variables
- Uses the Claude Desktop app's existing configuration
- Operates with unlimited permissions (no confirmation prompts)

## Usage

### Basic Usage

Send a message to Claude:

```bash
# Using Python version (requires API key)
./agentcc.py "Your prompt here"

# Using Node.js version (requires API key)
./agentcc.js "Your prompt here"

# Using Native Claude Desktop version (NO API key needed!)
./agentcc-native.js "Your prompt here"

# If installed globally
agentcc "Your prompt here"           # API-based version
agentcc-native "Your prompt here"    # Native version
```

### Clear Context

Clear the conversation context:

```bash
# For API-based versions
agentcc "/clear"

# For native version
agentcc-native "/clear"
```

### Examples

```bash
# Using the native version (no API key required)
agentcc-native "Hello, can you explain what Python decorators are?"

# Continue the conversation (context is maintained)
agentcc-native "Can you give me an example?"

# Ask another question (still in same context)
agentcc-native "What are some common use cases?"

# Clear the context to start fresh
agentcc-native "/clear"

# Start a new conversation
agentcc-native "Tell me about Node.js async/await"

# Using API-based version (requires ANTHROPIC_API_KEY)
# Start a conversation
agentcc "Hello, can you explain what Python decorators are?"

# Continue the conversation (context is maintained)
agentcc "Can you give me an example?"

# Ask another question (still in same context)
agentcc "What are some common use cases?"

# Clear the context to start fresh
agentcc "/clear"

# Start a new conversation
agentcc "Tell me about Node.js async/await"
```

## How It Works

### API-based versions (agentcc.py, agentcc.js)
- Each message is stored in a context file (`~/.agentcc_context.json`)
- The context includes both user messages and Claude's responses
- Context is automatically loaded before each message and saved after
- Use `/clear` to reset the conversation and start fresh
- The tool uses Claude 3.5 Sonnet model with up to 8096 tokens for responses
- Requires ANTHROPIC_API_KEY environment variable

### Native version (agentcc-native.js)
- Each message is stored in a separate context file (`~/.agentcc_native_context.json`)
- Uses the Claude Desktop app or claude CLI installed on your system
- No API key required - uses the authentication configured in Claude Desktop
- Operates with unlimited permissions and no confirmation prompts
- Works on macOS, Windows, and Linux (where Claude Desktop or claude CLI is installed)

## Files

- `agentcc.py` - Python implementation (API-based)
- `agentcc.js` - Node.js implementation (API-based)
- `agentcc-native.js` - Node.js implementation using native Claude Desktop (no API key)
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `setup_python.sh` - Python setup script
- `setup_nodejs.sh` - Node.js setup script

## License

MIT  
