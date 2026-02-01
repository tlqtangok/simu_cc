#!/bin/bash
# Setup script for agentcc-native
# This script helps configure the native Claude client

echo "=== agentcc-native Setup ==="
echo ""
echo "This script will help you set up agentcc-native."
echo "The native version can use credentials from multiple sources:"
echo "  1. Claude Desktop app (if installed)"
echo "  2. ~/.claude/config.json"
echo "  3. ANTHROPIC_API_KEY environment variable"
echo ""

# Check if Claude Desktop is installed
CLAUDE_DESKTOP_FOUND=false
if [ "$(uname)" == "Darwin" ]; then
    if [ -d "/Applications/Claude.app" ]; then
        echo "✓ Claude Desktop app found on macOS"
        CLAUDE_DESKTOP_FOUND=true
    fi
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    if [ -d "$HOME/.config/Claude" ]; then
        echo "✓ Claude Desktop config found on Linux"
        CLAUDE_DESKTOP_FOUND=true
    fi
fi

# Check if ~/.claude/config.json exists
if [ -f "$HOME/.claude/config.json" ]; then
    echo "✓ Found ~/.claude/config.json"
    CONFIG_FOUND=true
else
    CONFIG_FOUND=false
fi

# Check if ANTHROPIC_API_KEY is set
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "✓ ANTHROPIC_API_KEY environment variable is set"
    ENV_FOUND=true
else
    ENV_FOUND=false
fi

echo ""

# If no credentials found, offer to create config file
if [ "$CLAUDE_DESKTOP_FOUND" = false ] && [ "$CONFIG_FOUND" = false ] && [ "$ENV_FOUND" = false ]; then
    echo "No credentials found. Would you like to set up ~/.claude/config.json? (y/n)"
    read -r response
    
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        echo ""
        echo "Please enter your Anthropic API key:"
        read -r api_key
        
        # Create .claude directory if it doesn't exist
        mkdir -p "$HOME/.claude"
        
        # Create config.json
        echo "{\"apiKey\": \"$api_key\"}" > "$HOME/.claude/config.json"
        chmod 600 "$HOME/.claude/config.json"
        
        echo ""
        echo "✓ Created ~/.claude/config.json"
        echo "  The file has been created with secure permissions (600)"
    fi
else
    echo "✓ Credentials are already configured. No setup needed!"
fi

echo ""
echo "=== Setup complete! ==="
echo ""
echo "You can now use agentcc-native:"
echo "  ./agentcc-native.js \"Your message here\""
echo ""
echo "Or install globally:"
echo "  npm install -g ."
echo "  agentcc-native \"Your message here\""
echo ""
