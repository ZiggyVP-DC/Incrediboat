const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client(process.env.API_TOKEN);

const outcomeMessages = [
    "You won **{amount}** coins! What a lucky day!",
    "You hit the jackpot and gained **{amount}** coins! Amazing!",
    "You doubled your bet and now have **{amount}** coins! Great job!",
    "You won big with **{amount}** coins! Keep it up!",
    "You were lucky and earned **{amount}** coins! Fantastic!",
    "You guessed right and received **{amount}** coins! Well done!",
    "You played smart and gained **{amount}** coins! Awesome!",
    "You won **{amount}** coins! Your luck is on fire!",
    "You came out on top with **{amount}** coins! What a win!",
    "You struck gold and now have **{amount}** coins! Incredible!"
];

const loseMessages = [
    "You lost **{amount}** coins! Better luck next time!",
    "You gambled and lost **{amount}** coins! Don't give up!",
    "You took a risk and lost **{amount}** coins! Try again!",
    "You wagered and lost **{amount}** coins! Keep your chin up!",
    "You played and lost **{amount}** coins! It's all part of the game!",
    "You guessed wrong and lost **{amount}** coins! Learn from it!",
    "You lost **{amount}** coins! The odds weren't in your favor!",
    "You took a chance and lost **{amount}** coins! Better luck next time!",
    "You gambled and lost **{amount}** coins! Don't lose hope!",
    "You wagered and lost **{amount}** coins! The next round is yours!"
];

module.exports = {
    name: 'wager',
    description: 'Wager coins for a chance to win big!',
    async execute(message) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        try {
            const balanceData = await client.getUser Balance(guildId, userId);
            const currentBalance = balanceData.cash || 0;
            const maxWager = Math.floor(currentBalance * 0.5);

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('wager_10')
                        .setLabel('Wager 10%')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('wager_25')
                        .setLabel('Wager 25%')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('wager_50')
                        .setLabel('Wager 50%')
                        .setStyle('PRIMARY')
                );

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Wager Your Coins!')
                .setDescription(`Your current balance is **${currentBalance}** coins. How much would you like to wager? (Max: **${maxWager}** coins)`)
                .setFooter('Disclaimer: Gambling can be addictive. Please wager responsibly.');

            await message.channel.send({
                embeds: [embed],
                components: [row]
            });

            const filter = i => i.customId.startsWith('wager_') && i.user.id === userId;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                const wagerPercentage = parseInt(i.customId.split('_')[1]);
                const wagerAmount = Math.floor(currentBalance * (wagerPercentage / 100));

                const win = Math.random() < 0.5; // 50% chance to win
                const finalAmount = win ? wagerAmount : -wagerAmount;

                await client.setUser Balance(guildId, userId, { cash: currentBalance + finalAmount });
                const responseMessage = win 
                    ? outcomeMessages[Math.floor(Math.random() * outcomeMessages.length)].replace('{amount}', wagerAmount)
                    : loseMessages[Math.floor(Math.random() * loseMessages.length)].replace('{amount}', wagerAmount);

                await i.reply({ content: responseMessage, ephemeral: true });
                collector.stop();
            });

            collector.on('end , collected => {
                if (collected.size === 0) {
                    message.channel.send('You did not make a selection in time.');
                }
            });
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error processing your wager.');
        }
    },
};
