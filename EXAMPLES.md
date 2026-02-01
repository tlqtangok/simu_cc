# Usage Examples for agentcc

## Setup

### For API-based versions (agentcc.py, agentcc.js)
First, set your API key:
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

### For Native version (agentcc-native.js)
No setup needed! Just ensure Claude Desktop is installed or API credentials are available in one of these locations:
- Claude Desktop app configuration
- `~/.claude/config.json`
- `ANTHROPIC_API_KEY` environment variable (fallback)

## Python Examples

### Basic conversation
```bash
# Install dependencies
pip3 install -r requirements.txt

# Start a conversation
./agentcc.py "Hello! Can you help me with Python?"

# Continue the conversation (context is remembered)
./agentcc.py "Can you show me a simple function example?"

# Ask follow-up questions
./agentcc.py "How do I add type hints to that function?"

# Clear context when done
./agentcc.py "/clear"
```

## Node.js Examples

### Native version (No API key required!)
```bash
# Install Node.js dependencies
npm install

# Start a conversation using your local Claude Desktop
./agentcc-native.js "Hello! Can you help me with JavaScript?"

# Continue the conversation (context is remembered)
./agentcc-native.js "Can you show me an async/await example?"

# Ask follow-up questions
./agentcc-native.js "How do I handle errors in async functions?"

# Clear context when done
./agentcc-native.js "/clear"
```

### API-based version (Requires API key)
```bash
# Install dependencies
npm install

# Start a conversation
./agentcc.js "Hello! Can you help me with JavaScript?"

# Continue the conversation (context is remembered)
./agentcc.js "Can you show me an async/await example?"

# Ask follow-up questions
./agentcc.js "How do I handle errors in async functions?"

# Clear context when done
./agentcc.js "/clear"
```

## Advanced Usage

### Multi-turn conversation with native version
```bash
# Start discussing a topic (no API key needed!)
agentcc-native "I want to build a REST API. What should I consider?"

# Get specific details
agentcc-native "What about authentication?"

# Continue building on the conversation
agentcc-native "Can you give me an example of JWT implementation?"

# When you want to switch topics, clear context
agentcc-native "/clear"

# Start a new conversation
agentcc-native "Now I want to learn about databases"
```

### Multi-turn conversation with API version
```bash
# Start discussing a topic
agentcc "I want to build a REST API. What should I consider?"

# Get specific details
agentcc "What about authentication?"

# Continue building on the conversation
agentcc "Can you give me an example of JWT implementation?"

# When you want to switch topics, clear context
agentcc "/clear"

# Start a new conversation
agentcc "Now I want to learn about databases"
```

### Using with pipes (for scripting)
```bash
# Store response in a variable
RESPONSE=$(agentcc "What is the capital of France?")
echo "$RESPONSE"

# Chain with other commands
agentcc "List 5 programming tips" | tee tips.txt
```

## Tips

1. **Native vs API**: Use `agentcc-native` for no-API-key access via Claude Desktop, or `agentcc` for API-based access
2. **Context Memory**: Both versions remember all previous messages in the conversation until you use `/clear`
3. **Separate Contexts**: Native and API versions maintain separate context files
4. **Long Conversations**: For very long conversations, you might want to clear context periodically to stay within token limits
5. **Error Handling**: 
   - API version: Check that your ANTHROPIC_API_KEY is set correctly
   - Native version: Ensure Claude Desktop or claude CLI is installed
6. **Global Installation**: Use the setup scripts to install globally so you can use `agentcc` and `agentcc-native` from anywhere

## Troubleshooting

### Native version (agentcc-native)

#### "Could not find Claude API credentials"
The native version looks for credentials in multiple places. Make sure one of these is set up:
- **Claude Desktop**: Install from https://claude.ai/download
- **Config file**: Create ~/.claude/config.json with: `{"apiKey": "your-key"}`
- **Environment**: Set ANTHROPIC_API_KEY (fallback)

The tool will automatically use whichever it finds first.

#### Permission issues
Make sure the script is executable:
```bash
chmod +x agentcc-native.js
```

### API-based versions (agentcc, agentcc.py)

#### "ANTHROPIC_API_KEY environment variable not set"
Make sure you've exported your API key:
```bash
export ANTHROPIC_API_KEY='your-key-here'
```

### "ModuleNotFoundError: No module named 'anthropic'" (Python)
Install dependencies:
```bash
pip3 install -r requirements.txt
```

### "Cannot find module '@anthropic-ai/sdk'" (Node.js)
Install dependencies:
```bash
npm install
```

### Permission Denied
Make sure the scripts are executable:
```bash
chmod +x agentcc.py agentcc.js
```
