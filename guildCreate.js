const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch'); 

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        const firstChannel = guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
        
        if (firstChannel) {
            const embed = new MessageEmbed()
                .setColor('#0099ff') 
                .setTitle('Greetings, humanlings.')
                .setDescription('I am Incrediboat, a fanmade extension to the <@292953664492929025> bot. To make your server compatible with this extension you should link it here (requires Admin) https://unbelievaboat.com/applications/authorize?app_id=1362335908229156300 . 
                .setFooter(`Thanks for having me! - Ziggy (Founder)`, guild.iconURL())
                .setTimestamp();

            await firstChannel.send({ embeds: [embed] });
        }

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMzYyMzM1OTA4MjI5MTU2MzAwIiwiaWF0IjoxNzQ0ODc2NTkxfQ.AyMtqMboxz3D5x-LaCz7bFJLqqi0o55cYJ0ST1-lrIM'
            },
            body: JSON.stringify({
                name: 'Token',
                price: 50000,
                description: 'A usable Incrediboat token.',
                is_inventory: true,
                is_usable: false,
                is_sellable: true,
                stock_remaining: 200,
                unlimited_stock: true
            })
        };

        
        const guildId = guild.id; 
        fetch(`https://unbelievaboat.com/api/v1/guilds/${guildId}/items`, options)
            .then(res => res.json())
            .then(res => console.log('Item created:', res))
            .catch(err => console.error('Error creating item:', err));
    },
};
