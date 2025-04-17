const { Client } = require('unb-api');
const client = new Client('API_TOKEN');

const userPoints = new Map(); 

const awardCoinsToUser  = (guildId) => {
    const leaderboard = [];

    
    userPoints.forEach((points, key) => {
        const [server, userId] = key.split('-');
        if (server === guildId) {
            leaderboard.push({ userId, points });
        }
    });

    // Sort
    leaderboard.sort((a, b) => b.points - a.points);

    // Fetch Nr1
    if (leaderboard.length > 0) {
        const User  = leaderboard[0];
        const userId = User .userId;

        // Award coins to the top user
        client.editUser Balance(guildId, userId, { cash: 0, bank: 100 }) // Adjust the amount as needed
            .then(() => {
                console.log(`Awarded 100 coins to user ${userId} in guild ${guildId}`);
            })
            .catch(err => {
                console.error(`Failed to award coins to user ${userId}:`, err);
            });
    }
};

// Award coins to the 1st user
const awardUser CoinsCommand = (message) => {
    const guildId = message.guild.id;
    awardCoinsToUser (guildId);
};

// Event listener 
client.on('messageCreate', (message) => {
    if (message.content === '!awardtop') {
        awardUser CoinsCommand(message);
    }
});

setInterval(() => {
    client.guilds.cache.forEach(guild => {
        awardCoinsToUser (guild.id);
    });
}, 604800000); 
