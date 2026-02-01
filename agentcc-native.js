#!/usr/bin/env node
/**
 * agentcc-native - Native Claude Desktop Client
 * A command-line tool to interact with Claude using credentials from Claude Desktop app.
 * No API keys required - uses the Claude Desktop app configured on your system.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Context file location
const CONTEXT_FILE = path.join(os.homedir(), '.agentcc_native_context.json');

/**
 * Get Claude Desktop config path based on OS.
 */
function getClaudeConfigPath() {
    const platform = os.platform();
    
    if (platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'config.json');
    } else if (platform === 'win32') {
        return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Claude', 'config.json');
    } else if (platform === 'linux') {
        return path.join(os.homedir(), '.config', 'Claude', 'config.json');
    }
    
    return null;
}

/**
 * Try to read API key from Claude Desktop configuration.
 */
function getClaudeApiKey() {
    // First, check if there's a Claude Desktop config file
    const configPath = getClaudeConfigPath();
    
    if (configPath && fs.existsSync(configPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.apiKey) {
                return config.apiKey;
            }
        } catch (err) {
            // Ignore parsing errors
        }
    }
    
    // Check environment variable as fallback (but we prefer not to require this)
    if (process.env.ANTHROPIC_API_KEY) {
        return process.env.ANTHROPIC_API_KEY;
    }
    
    // Check Claude CLI config
    const claudeCliConfig = path.join(os.homedir(), '.claude', 'config.json');
    if (fs.existsSync(claudeCliConfig)) {
        try {
            const config = JSON.parse(fs.readFileSync(claudeCliConfig, 'utf8'));
            if (config.apiKey || config.api_key) {
                return config.apiKey || config.api_key;
            }
        } catch (err) {
            // Ignore parsing errors
        }
    }
    
    return null;
}

/**
 * Load conversation context from file.
 */
function loadContext() {
    if (fs.existsSync(CONTEXT_FILE)) {
        try {
            const data = fs.readFileSync(CONTEXT_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Warning: Could not load context file: ${err.message}`);
            return [];
        }
    }
    return [];
}

/**
 * Save conversation context to file.
 */
function saveContext(context) {
    try {
        fs.writeFileSync(CONTEXT_FILE, JSON.stringify(context, null, 2));
    } catch (err) {
        console.error(`Error: Could not save context file: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Clear conversation context.
 */
function clearContext() {
    if (fs.existsSync(CONTEXT_FILE)) {
        fs.unlinkSync(CONTEXT_FILE);
    }
    console.log('Context cleared.');
}

/**
 * Send message to Claude using native credentials.
 */
async function sendMessage(prompt) {
    // Load conversation history
    const context = loadContext();
    
    // Add user message to context
    context.push({
        role: 'user',
        content: prompt
    });
    
    // Get API key from Claude Desktop or system config
    const apiKey = getClaudeApiKey();
    if (!apiKey) {
        console.error('Error: Could not find Claude API credentials.');
        console.error('');
        console.error('Please ensure one of the following:');
        console.error('1. Claude Desktop is installed and configured');
        console.error('2. API key is set in ~/.claude/config.json');
        console.error('3. ANTHROPIC_API_KEY environment variable is set (as fallback)');
        console.error('');
        console.error('This tool is designed to use existing Claude credentials without requiring manual setup.');
        process.exit(1);
    }
    
    // Initialize Claude client with the found API key
    const client = new Anthropic({ 
        apiKey
    });
    
    try {
        // Send message to Claude without any confirmation prompts
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 8096,
            messages: context
        });
        
        // Extract response text
        const responseText = response.content[0].text;
        
        // Add assistant response to context
        context.push({
            role: 'assistant',
            content: responseText
        });
        
        // Save updated context
        saveContext(context);
        
        // Print response
        console.log(responseText);
        
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

/**
 * Main entry point.
 */
async function main() {
    if (process.argv.length < 3) {
        console.log('Usage: agentcc-native "PROMPT_MSG"');
        console.log('       agentcc-native "/clear"');
        console.log('');
        console.log('This tool uses credentials from:');
        console.log('1. Claude Desktop app configuration (if installed)');
        console.log('2. ~/.claude/config.json (if exists)');
        console.log('3. ANTHROPIC_API_KEY environment variable (fallback)');
        console.log('');
        console.log('No manual API key setup required!');
        process.exit(1);
    }
    
    const prompt = process.argv[2];
    
    // Handle special commands
    if (prompt === '/clear') {
        clearContext();
        return;
    }
    
    // Send normal message
    await sendMessage(prompt);
}

// Run main function
main().catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});

