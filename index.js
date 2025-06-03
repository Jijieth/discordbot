require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function sendNotification(userId, message, timestamp) {
    try {
        const user = await client.users.fetch(userId);
        
        let notificationMessage = `🚨 **Monitor Alert**\n`;
        notificationMessage += `⏰ Time: ${timestamp}\n`;
        notificationMessage += `📢 Channel: ${message.channel.name}\n`;
        notificationMessage += `👤 User: ${message.author.username} (${message.author.id})\n`;
        notificationMessage += `💬 Message: ${message.content}\n`;
        
        if (message.attachments.size > 0) {
            notificationMessage += `📎 Attachments: ${Array.from(message.attachments.values()).map(att => att.url).join(', ')}\n`;
        }
        
        notificationMessage += `🔗 Jump to message: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
        
        await user.send(notificationMessage);
        console.log(`✅ Notification sent to user ${user.username}`);
    } catch (error) {
        console.error(`❌ Failed to send notification:`, error.message);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`✅ Discord bot started! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    
    const targetChannelId = process.env.TARGET_CHANNEL_ID;
    const targetUserId = process.env.TARGET_USER_ID;
    const targetUsername = process.env.TARGET_USERNAME;
    
    if (targetChannelId && message.channel.id !== targetChannelId) {
        return;
    }
    
    let shouldLog = true;
    
    if (targetUserId || targetUsername) {
        shouldLog = false;
        
        if (targetUserId && message.author.id === targetUserId) {
            shouldLog = true;
        }
        
        if (targetUsername && message.author.username.toLowerCase() === targetUsername.toLowerCase()) {
            shouldLog = true;
        }
    }
    
    if (shouldLog) {
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
        console.log(`[${timestamp}] 📢 Channel: ${message.channel.name} | User: ${message.author.username} (ID: ${message.author.id}) | Message: ${message.content}`);
        
        if (message.attachments.size > 0) {
            console.log(`📎 Attachments: ${Array.from(message.attachments.values()).map(att => att.url).join(', ')}`);
        }
        
        // Send DM notification if configured
        const notifyUserId = process.env.NOTIFY_USER_ID;
        if (notifyUserId) {
            sendNotification(notifyUserId, message, timestamp);
        }
    }
    
    if (message.content === '!ping') {
        message.reply('Pong! 🏓');
    }
});

client.on(Events.Error, error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);