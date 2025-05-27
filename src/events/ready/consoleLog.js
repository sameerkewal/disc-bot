const {ActivityType} = require('discord.js');

module.exports = (client, interaction) =>{
    client.user.setActivity('   ', { type: ActivityType.Watching });
    console.log(`${client.user.tag} is online!`);

    client.user.setPresence({
        status: 'online',
        activities: [{
            name: 'Slurs!',
            type: ActivityType.Listening ,
            url: "http://youtube.com",
            buttons: ["BUTTON1", "BUTTON2"],
            state: '...',
            details: 'chilling with users 😎',
            assets: {
                large_image: '3a5f37665b88c9ea08c69630a16b2365',  // must match uploaded image key in dev portal
                large_text: 'This is the large image tooltip',
                small_image: 'your_small_image_key',
                small_text: 'This is the small image tooltip',
            },
        }],
    });
}
