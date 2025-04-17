const { Client } = require('unb-api');
const client = new Client(process.env.API_TOKEN);

const messages = [
    "You dug and found **{amount}** coins! What a treasure!",
    "You dug up **{amount}** coins! Nice work!",
    "You struck gold and found **{amount}** coins! Lucky day!",
    "You dug deep and uncovered **{amount}** coins! Great job!",
    "You found **{amount}** coins while digging! Keep it up!",
    "You hit the jackpot and got **{amount}** coins! Amazing!",
    "You dug and discovered **{amount}** coins! What a find!",
    "You unearthed **{amount}** coins! Well done!",
    "You dug and found a stash of **{amount}** coins! Awesome!",
    "You dug and were rewarded with **{amount}** coins! Fantastic!"
];

module.exports = {
    name: 'dig',
    description: 'Digging, dig, dig dig. Dig a bit deeper and see.',
    async execute(message) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        try {
            const balanceData = await client.getUser Balance(guildId, userId);
            const currentBalance = balanceData.cash || 0;

            const amount = Math.floor(Math.random() * 500) + 1; // Random amount between 1 and 200
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
