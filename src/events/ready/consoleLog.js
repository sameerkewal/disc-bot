const {ActivityType} = require('discord.js');
const {logServer, logChannel} = require("../../../config.json")


const {clearChannel} = require("../../api/discord/clearLogChannel")

const dotenv = require('dotenv');
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = async (client, interaction) => {
    console.log(`${client.user.tag} is online!`);

    client.user.setPresence({
        status: 'online',
        activities: [{
            name: process.env.ENVIRONMENT,
            type: ActivityType.Listening,
        }],
    });
    // await clearChannel({logServer, logChannel, client})
}
