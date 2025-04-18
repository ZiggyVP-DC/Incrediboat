 const { EmbedBuilder } = require('discord.js'); 
const { Client: IncrediboatClient } = require('unb-api'); 
const client = new IncrediboatClient(process.env.API_TOKEN); 

module.exports = { 
    name: 'balance', 
    description: 'Check your or someone else\'s balance', 
    async execute(message, args) {
        const guildId = message.guild.id;
        const userId = args[0] ? args[0].replace(/[<@!>]/g, '') : message.author.id;

	try {
        // Fetch balance from UNB API
        const balanceData = await client.getUserBalance(guildId, userId);

        const cash = balanceData.cash ?? 'No Data';
        const bank = balanceData.bank ?? 'No Data';
        const total = balanceData.total ?? 'No Data';

        const member = message.guild.members.cache.get(userId);
        const userTag = member ? member.user.tag : 'User  not found';

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${userTag}'s Balance`)
            .addFields(
                { name: 'Cash', value: `${cash} coins`, inline: true },
                { name: 'Bank', value: `${bank} coins`, inline: true },
                { name: 'Total', value: `${total} coins`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Made by Ziggy, works with the Unbelievaboat APP.' });

        message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error fetching the balance. Please try again later.');
    	}
    },
}
