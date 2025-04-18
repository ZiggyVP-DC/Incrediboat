require('dotenv').config({ path: './config.env' });
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Guild create event listener
client.on('guildCreate', async (guild) => {
    const guildCreateHandler = require('./guildCreate'); 
    await guildCreateHandler.execute(guild);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
        command.execute(message, args);
});

// The token used to log in. KEEP THIS PRIVATE AND ONLY SHOW IT IN YOUR LOCAL .ENV, PREFERABLY LOCKED TO ONLY THE CREATOR AND TEAM.
client.login(process.env.DISCORD_TOKEN);
