#!/usr/bin/env python3
"""
agentcc - Claude Code Chat Simulator
A command-line tool to interact with Claude API with context memory.
"""

import os
import sys
import json
import anthropic
from pathlib import Path

# Context file location
CONTEXT_FILE = Path.home() / ".agentcc_context.json"

def load_context():
    """Load conversation context from file."""
    if CONTEXT_FILE.exists():
        try:
            with open(CONTEXT_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_context(context):
    """Save conversation context to file."""
    with open(CONTEXT_FILE, 'w') as f:
        json.dump(context, f)

def clear_context():
    """Clear conversation context."""
    if CONTEXT_FILE.exists():
        CONTEXT_FILE.unlink()
    print("Context cleared.")

def send_message(prompt):
    """Send message to Claude and get response."""
    # Load conversation history
    context = load_context()
    
    # Add user message to context
    context.append({
        "role": "user",
        "content": prompt
    })
    
    # Get API key from environment
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)
    
    # Initialize Claude client
    client = anthropic.Anthropic(api_key=api_key)
    
    try:
        # Send message to Claude
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8096,
            messages=context
        )
        
        # Extract response text
        response_text = response.content[0].text
        
        # Add assistant response to context
        context.append({
            "role": "assistant",
            "content": response_text
        })
        
        # Save updated context
        save_context(context)
        
        # Print response
        print(response_text)
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: agentcc \"PROMPT_MSG\"")
        print("       agentcc \"/clear\"")
        sys.exit(1)
    
    prompt = sys.argv[1]
    
    # Handle special commands
    if prompt == "/clear":
        clear_context()
        return
    
    # Send normal message
    send_message(prompt)

if __name__ == "__main__":
    main()
