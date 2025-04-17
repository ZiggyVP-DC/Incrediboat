const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands.',
    async execute(message) {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
        const commands = [];

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands.push(command);
        }

        const commandsPerPage = 5;
        const totalPages = Math.ceil(commands.length / commandsPerPage);
        let currentPage = 0;

        const createEmbed = (page) => {
            const start = page * commandsPerPage;
            const end = start + commandsPerPage;
            const currentCommands = commands.slice(start, end);

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Available Commands')
                .setDescription(currentCommands.map(cmd => `**${cmd.name}**: ${cmd.description}`).join('\n'))
                .setFooter(`Page ${page + 1} of ${totalPages}`);

            return embed;
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle('PRIMARY')
                    .setDisabled(currentPage === 0),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle('PRIMARY')
                    .setDisabled(currentPage === totalPages - 1)
            );

        const helpMessage = await message.channel.send({
            embeds: [createEmbed(currentPage)],
            components: [row]
        });

        const filter = i => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'prev') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }

            await i.update({
                embeds: [createEmbed(currentPage)],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('prev')
                                .setLabel('Previous')
                                .setStyle('PRIMARY')
                                .setDisabled(currentPage === 0),
                            new MessageButton()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle('PRIMARY')
                                .setDisabled(currentPage === totalPages - 1)
                        )
                ]
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                helpMessage.edit({ components: [] }); // Timeout
            }
        });
    },
};
