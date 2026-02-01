# Usage Examples for agentcc

## Setup

First, set your API key:
```bash
export ANTHROPIC_API_KEY='your-api-key-here'
```

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

### Basic conversation
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

### Multi-turn conversation
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

1. **Context Memory**: The tool remembers all previous messages in the conversation until you use `/clear`
2. **Long Conversations**: For very long conversations, you might want to clear context periodically to stay within token limits
3. **Error Handling**: If you get an API error, check that your ANTHROPIC_API_KEY is set correctly
4. **Global Installation**: Use the setup scripts to install globally so you can use `agentcc` from anywhere

## Troubleshooting

### "ANTHROPIC_API_KEY environment variable not set"
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
