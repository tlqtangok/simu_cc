#!/bin/bash
# Setup script for Python version of agentcc

echo "Setting up agentcc (Python version)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Install dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

# Make script executable
chmod +x agentcc.py

# Create symlink to make it available as 'agentcc' command
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYMLINK_PATH="/usr/local/bin/agentcc"

if [ -w "/usr/local/bin" ]; then
    ln -sf "$SCRIPT_DIR/agentcc.py" "$SYMLINK_PATH"
    echo "Created symlink: $SYMLINK_PATH -> $SCRIPT_DIR/agentcc.py"
else
    echo ""
    echo "To make 'agentcc' available globally, run:"
    echo "  sudo ln -sf $SCRIPT_DIR/agentcc.py /usr/local/bin/agentcc"
    echo ""
    echo "Or add this to your shell profile:"
    echo "  alias agentcc='$SCRIPT_DIR/agentcc.py'"
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
