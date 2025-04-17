const { MessageEmbed } = require('discord.js');
const activeLurks = new Map(); // To keep track of active lurks

module.exports = {
    name: 'lurk',
    description: 'Indicates that a user is lurking.',
    async execute(message) {
        const userId = message.author.id;

        // Check lurk
        if (activeLurks.has(userId)) {
            return message.channel.send(`${message.author}, you are already lurking!`);
        }

        // Set the XYZ as lurking
        activeLurks.set(userId, message.author.username);

        const embed = new MessageEmbed()
            .setColor('#ffcc00')
            .setDescription(`${message.author.username} is now lurking! 👀`)
            .setFooter('You will be un-lurked when you send a message or go offline.');

        await message.channel.send({ embeds: [embed] });

        const messageListener = (msg) => {
            if (msg.author.id === userId) {
                activeLurks.delete(userId);
                msg.channel.send(`${msg.author.username}, you are no longer lurking!`);
                msg.client.off('messageCreate', messageListener);
            }
        };

        message.client.on('messageCreate', messageListener);

        message.client.on('presenceUpdate', (oldPresence, newPresence) => {
            if (newPresence.userId === userId && newPresence.status === 'offline') {
                activeLurks.delete(userId);
                message.channel.send(`${message.author.username} has gone offline and is no longer lurking.`);
            }
        });
    },
};
