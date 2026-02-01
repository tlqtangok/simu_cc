#!/bin/bash
# Setup script for Node.js version of agentcc

echo "Setting up agentcc (Node.js version)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Make script executable
chmod +x agentcc.js

# Create symlink to make it available as 'agentcc' command
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYMLINK_PATH="/usr/local/bin/agentcc"

if [ -w "/usr/local/bin" ]; then
    ln -sf "$SCRIPT_DIR/agentcc.js" "$SYMLINK_PATH"
    echo "Created symlink: $SYMLINK_PATH -> $SCRIPT_DIR/agentcc.js"
else
    echo ""
    echo "To make 'agentcc' available globally, run:"
    echo "  sudo ln -sf $SCRIPT_DIR/agentcc.js /usr/local/bin/agentcc"
    echo ""
    echo "Or use npm global install:"
    echo "  npm install -g ."
fi

echo ""
echo "Setup complete!"
echo ""
echo "Before using agentcc, set your API key:"
echo "  export ANTHROPIC_API_KEY='your-api-key-here'"
echo ""
echo "Usage:"
echo "  agentcc \"Your prompt here\""
echo "  agentcc \"/clear\"  # Clear conversation context"
