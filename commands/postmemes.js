const fetch = require('node-fetch'); 
const cron = require('node-cron'); 

let scheduledTask;

module.exports = {
    name: 'postmemes',
    description: 'Posts memes to a specified channel at a given interval.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('You do not have permission to use this command.');
        }

        const channelName = args[0];
        const interval = args[1];
      
        const intervalInMinutes = parseInt(interval);
        if (isNaN(intervalInMinutes) || intervalInMinutes < 30) {
            return message.channel.send('Please provide a valid interval (minimum 30 minutes).');
        }

        // Find the channel
        const channel = message.guild.channels.cache.find(ch => ch.name === channelName);
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return message.channel.send('Channel not found or invalid channel type.');
        }

 
        if (scheduledTask) {
            scheduledTask.stop();
        }

 
        scheduledTask = cron.schedule(`*/${intervalInMinutes} * * * *`, async () => {
            try {
                const response = await fetch('https://meme-api.com/gimme');
                const data = await response.json();

                if (!data || !data.url) {
                    console.error('Failed to fetch meme:', data);
                    return;
                }

                const embed = {
                    color: 0x0099ff,
                    title: data.title,
                    image: {
                        url: data.url,
                    },
                    footer: {
                        text: `From subreddit: r/${data.subreddit}`,
                    },
                };

                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error fetching meme:', error);
            }
        });

        // Start the scheduled task
        scheduledTask.start();
        message.channel.send(`Memes will be posted in #${channelName} every ${intervalInMinutes} minutes.`);
    },
};
