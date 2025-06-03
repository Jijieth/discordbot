# Discord Chat Listener Bot

A simple Discord bot that monitors and logs chat messages from specific channels and/or users.

## Features

- **Channel Monitoring**: Listen to messages from specific Discord channels
- **User Monitoring**: Track messages from specific users by ID or username
- **Message Logging**: Console output with timestamps, user info, and message content
- **Attachment Detection**: Logs file attachments and images
- **DM Notifications**: Send private message alerts when monitored users post
- **Basic Commands**: Includes a simple ping-pong command for testing

## Setup

### Prerequisites

- Node.js (v16 or higher)
- A Discord bot token
- Discord Developer Mode enabled (for copying IDs)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your bot token and monitoring targets:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   TARGET_CHANNEL_ID=channel_id_to_monitor
   TARGET_USER_ID=user_id_to_monitor
   TARGET_USERNAME=username_to_monitor
   NOTIFY_USER_ID=your_user_id_for_notifications
   ```

### Getting Discord IDs

1. Enable Discord Developer Mode:
   - Go to User Settings → Advanced → Enable Developer Mode

2. Get Channel ID:
   - Right-click on a channel → Copy Channel ID

3. Get User ID:
   - Right-click on a user's profile → Copy User ID

## Configuration Options

| Environment Variable | Description | Required |
|---------------------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Your Discord bot token | Yes |
| `TARGET_CHANNEL_ID` | Specific channel to monitor | No |
| `TARGET_USER_ID` | Specific user ID to monitor | No |
| `TARGET_USERNAME` | Specific username to monitor (case-insensitive) | No |
| `NOTIFY_USER_ID` | Your user ID to receive DM notifications | No |

### Monitoring Modes

- **All Messages**: Don't set any target variables
- **Specific Channel**: Set only `TARGET_CHANNEL_ID`
- **Specific User**: Set `TARGET_USER_ID` or `TARGET_USERNAME`
- **Combined**: Set both channel and user variables for precise monitoring

## Running the Bot

Start the bot:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

## Bot Permissions

Your bot needs the following permissions:
- Read Messages
- Send Messages
- Read Message History

Add these permissions when inviting your bot to a server.

## Commands

- `!ping` - Bot responds with "Pong! 🏓" (for testing)

## Output Format

The bot logs messages in the following format:
```
[2024-01-15 14:30:25] 📢 Channel: general | User: username (ID: 123456789) | Message: Hello world!
📎 Attachments: https://cdn.discordapp.com/attachments/...
```

### DM Notification Format

When `NOTIFY_USER_ID` is configured, you'll receive private messages like:
```
🚨 **监控通知**
⏰ 时间: 2024-01-15 14:30:25
📢 频道: general
👤 用户: username (123456789)
💬 消息: Hello world!
📎 附件: https://cdn.discordapp.com/attachments/...
🔗 跳转: https://discord.com/channels/guild_id/channel_id/message_id
```

## Creating a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token and add it to your `.env` file
5. Generate an invite link with proper permissions and add the bot to your server

## Troubleshooting

- Ensure your bot token is correct and the bot is added to the server
- Check that the bot has proper permissions in the channels you want to monitor
- Verify channel and user IDs are correct
- Make sure Developer Mode is enabled to copy Discord IDs

## License

ISC