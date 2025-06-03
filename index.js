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
        
        let notificationMessage = `🚨 **监控通知**\n`;
        notificationMessage += `⏰ 时间: ${timestamp}\n`;
        notificationMessage += `📢 频道: ${message.channel.name}\n`;
        notificationMessage += `👤 用户: ${message.author.username} (${message.author.id})\n`;
        notificationMessage += `💬 消息: ${message.content}\n`;
        
        if (message.attachments.size > 0) {
            notificationMessage += `📎 附件: ${Array.from(message.attachments.values()).map(att => att.url).join(', ')}\n`;
        }
        
        notificationMessage += `🔗 跳转: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
        
        await user.send(notificationMessage);
        console.log(`✅ 已发送通知给用户 ${user.username}`);
    } catch (error) {
        console.error(`❌ 发送通知失败:`, error.message);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`✅ Discord机器人已启动！登录为 ${client.user.tag}`);
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
        const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        console.log(`[${timestamp}] 📢 频道: ${message.channel.name} | 用户: ${message.author.username} (ID: ${message.author.id}) | 消息: ${message.content}`);
        
        if (message.attachments.size > 0) {
            console.log(`📎 附件: ${Array.from(message.attachments.values()).map(att => att.url).join(', ')}`);
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
    console.error('Discord客户端出错:', error);
});

process.on('unhandledRejection', error => {
    console.error('未处理的Promise拒绝:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);