
const { Client } = require('unb-api');
const client = new Client(process.env.API_TOKEN);

const messages = [
    "You begged and received **{amount}** coins! Keep it up!",
    "You begged and got **{amount}** coins! Nice job!",
    "You asked for coins and received **{amount}** coins! Lucky you!",
    "You begged and earned **{amount}** coins! What a day!",
    "You pleaded and got **{amount}** coins! Good for you!",
    "You begged and found **{amount}** coins! What a surprise!",
    "You asked nicely and received **{amount}** coins! Well done!",
    "You begged and were rewarded with **{amount}** coins! Awesome!",
    "You begged and got lucky with **{amount}** coins! Keep it going!",
    "You begged and received **{amount}** coins! Your charm worked!"
];

module.exports = {
    name: 'beg',
    description: 'You hope you get some help....!',
    async execute(message) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        try {
            const balanceData = await client.getUser Balance(guildId, userId);
            const currentBalance = balanceData.cash || 0;

            const amount = Math.floor(Math.random() * 362) + 1; // Random amount between 1 and 100
            const limit = currentBalance < 500000 ? Math.floor(currentBalance * 0.1) : Math.floor(currentBalance * 0.04);
            const finalAmount = Math.min(amount, limit);

            await client.setUser Balance(guildId, userId, { cash: finalAmount });
            const responseMessage = messages[Math.floor(Math.random() * messages.length)].replace('{amount}', finalAmount);
            message.channel.send(responseMessage);
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error processing your request.');
        }
    },
};
