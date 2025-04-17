const { Client } = require('unb-api');
const client = new Client(process.env.API_TOKEN);

const messages = [
    "Some old fool believed you and gave you **{amount}** coins! STOP SCAMMING YOU JERK!",
    "You told her you worked at paypal and got **{amount}** coins! Go to hell..... "
];

module.exports = {
    name: 'scam',
    description: 'WHY WOULD YOU EVEN DO THIS?!!!',
    async execute(message) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        try {
            const balanceData = await client.getUser Balance(guildId, userId);
            const currentBalance = balanceData.cash || 0;

            const amount = Math.floor(Math.random() * 9215) + 1; // Random amount between 1 and 100
            const limit = currentBalance < 500000 ? Math.floor(currentBalance * 0.5) : Math.floor(currentBalance * 0.04);
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
