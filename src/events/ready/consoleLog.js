const {ActivityType} = require('discord.js');

module.exports = (client, interaction) =>{
    client.user.setActivity('   ', { type: ActivityType.Watching });
    console.log(`${client.user.tag} is online!`);

    client.user.setPresence({
        status: 'online',
        activities: [{
            name: 'Slurs!',
            type: ActivityType.Listening ,
        }],
    });
}
