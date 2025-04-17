require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Map();
const cooldowns = new Map(); 

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
        // Check cooldown
        const now = Date.now();
        const cooldownAmount = Math.floor(Math.random() * (40000 - 20000 + 1)) + 20000; 

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Map());
        }

        const timestamps = cooldowns.get(command.name);
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000; 
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command again.`);
            }
        }
        client.on('guildCreate', async (guild) => {
        const guildCreateHandler = require('./guildCreate'); // Adjust the path as necessary
        await guildCreateHandler.execute(guild);
});
            }
        }

        // Set the cooldown
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 

        
        command.execute(message, args);
    }
});

// The token used to log in. KEEP THIS PRIVATE AND ONLY SHOW IT IN YOUR LOCAL .ENV, PREFERABLY LOCKED TO ONLY THE CREATOR AND TEAM.
client.login(process.env.DISCORD_TOKEN);
