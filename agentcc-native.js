#!/usr/bin/env node
/**
 * agentcc-native - Native Claude Desktop Client
 * A command-line tool to interact with local Claude Desktop app via MCP.
 * No API keys required - uses the Claude Desktop app configured on your system.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Context file location
const CONTEXT_FILE = path.join(os.homedir(), '.agentcc_native_context.json');

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
 * Get the Claude CLI path based on the operating system.
 */
function getClaudePath() {
    const platform = os.platform();
    
    if (platform === 'darwin') {
        // macOS
        return '/Applications/Claude.app/Contents/MacOS/Claude';
    } else if (platform === 'win32') {
        // Windows
        const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
        return path.join(localAppData, 'Claude', 'Claude.exe');
    } else if (platform === 'linux') {
        // Linux
        return '/usr/bin/claude';
    }
    
    throw new Error(`Unsupported platform: ${platform}`);
}

/**
 * Format messages for Claude.
 */
function formatMessages(context) {
    let prompt = '';
    for (const msg of context) {
        if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n\n`;
        } else if (msg.role === 'assistant') {
            prompt += `Assistant: ${msg.content}\n\n`;
        }
    }
    return prompt;
}

/**
 * Send message to Claude via native client.
 */
async function sendMessage(prompt) {
    // Load conversation history
    const context = loadContext();
    
    // Add user message to context
    context.push({
        role: 'user',
        content: prompt
    });
    
    // Format the full conversation
    const fullPrompt = formatMessages(context);
    
    try {
        // Try to use claude command if available
        let claudeCommand = 'claude';
        
        // Check if claude command exists in PATH
        const checkClaude = spawn('which', ['claude'], { stdio: 'pipe' });
        
        await new Promise((resolve, reject) => {
            let found = false;
            checkClaude.stdout.on('data', () => { found = true; });
            checkClaude.on('close', (code) => {
                if (found && code === 0) {
                    resolve();
                } else {
                    // Try to find Claude Desktop app
                    try {
                        claudeCommand = getClaudePath();
                        if (!fs.existsSync(claudeCommand)) {
                            reject(new Error('Claude Desktop app not found. Please install Claude Desktop or ensure claude CLI is in PATH.'));
                        }
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        });
        
        // Execute Claude command with the prompt
        const claude = spawn(claudeCommand, ['--no-confirm', '--prompt', fullPrompt], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        let response = '';
        let errorOutput = '';
        
        claude.stdout.on('data', (data) => {
            response += data.toString();
        });
        
        claude.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        await new Promise((resolve, reject) => {
            claude.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Claude command failed with code ${code}: ${errorOutput}`));
                } else {
                    resolve();
                }
            });
            
            claude.on('error', (err) => {
                reject(new Error(`Failed to start Claude: ${err.message}`));
            });
        });
        
        // Parse and extract the response
        const responseText = response.trim();
        
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
        console.error('\nNote: This tool requires Claude Desktop app or claude CLI to be installed.');
        console.error('For macOS: Install from https://claude.ai/download');
        console.error('For other platforms: Ensure claude CLI is available in your PATH');
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
        console.log('This tool uses your local Claude Desktop app (no API key required).');
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
