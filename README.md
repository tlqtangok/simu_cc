# simu_cc

Simulator for Claude Code Chat - A command-line tool to interact with Claude API with context memory.

## Features

- Send messages to Claude API and get responses
- Maintains conversation context across multiple messages
- Clear context with `/clear` command
- Available in both Python and Node.js
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

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

You can add this to your shell profile (~/.bashrc, ~/.zshrc, etc.) to make it permanent.

## Usage

### Basic Usage

Send a message to Claude:

```bash
# Using Python version
./agentcc.py "Your prompt here"

# Using Node.js version
./agentcc.js "Your prompt here"

# If installed globally
agentcc "Your prompt here"
```

### Clear Context

Clear the conversation context:

```bash
agentcc "/clear"
```

### Examples

```bash
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

- Each message is stored in a context file (`~/.agentcc_context.json`)
- The context includes both user messages and Claude's responses
- Context is automatically loaded before each message and saved after
- Use `/clear` to reset the conversation and start fresh
- The tool uses Claude 3.5 Sonnet model with up to 8096 tokens for responses

## Files

- `agentcc.py` - Python implementation
- `agentcc.js` - Node.js implementation
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `setup_python.sh` - Python setup script
- `setup_nodejs.sh` - Node.js setup script

## License

MIT  
