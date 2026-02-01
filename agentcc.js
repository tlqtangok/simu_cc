#!/usr/bin/env node
/**
 * agentcc - Claude Code Chat Simulator
 * A command-line tool to interact with Claude API with context memory.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Context file location
const CONTEXT_FILE = path.join(os.homedir(), '.agentcc_context.json');

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
 * Send message to Claude and get response.
 */
async function sendMessage(prompt) {
    // Load conversation history
    const context = loadContext();
    
    // Add user message to context
    context.push({
        role: 'user',
        content: prompt
    });
    
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error('Error: ANTHROPIC_API_KEY environment variable not set.');
        process.exit(1);
    }
    
    // Initialize Claude client
    const client = new Anthropic({ apiKey });
    
    try {
        // Send message to Claude
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
        console.log('Usage: agentcc "PROMPT_MSG"');
        console.log('       agentcc "/clear"');
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
