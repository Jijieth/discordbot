require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, () => {
    console.log(`✅ Discord机器人已启动！登录为 ${client.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    
    const targetChannelId = process.env.TARGET_CHANNEL_ID;
    
    if (targetChannelId && message.channel.id !== targetChannelId) {
        return;
    }
    
    console.log(`📢 频道: ${message.channel.name} | 用户: ${message.author.username} | 消息: ${message.content}`);
    
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