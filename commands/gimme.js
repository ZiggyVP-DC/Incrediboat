const fetch = require('node-fetch');

module.exports = {
    name: 'gimme',
    description: 'Gets some memes for you degenerates...',
    async execute(message) {
        try {
            // Fetch via the API
            const response = await fetch('https://meme-api.com/gimme');
            const data = await response.json();

            // 
            if (!data || !data.url) {
                return message.channel.send('Could not fetch a meme at this time. Please try again later.');
            }

            // Create embed
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

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching meme:', error);
            message.channel.send('An error occurred while fetching a meme. Please try again later.');
        }
    },
};
