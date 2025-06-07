const {setPresence} = require("../../presenceUpdate//helpers/presenceUtils");
const {logServer, logChannel} = require("../../../../config.json")
const {clearChannel} = require("../../../api/discord/clearLogChannel")



const dotenv = require('dotenv');
const path = require("path");


dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = async (client, interaction) => {
    console.log(`${client.user.tag} is online!`);

    await setPresence(client)
    // await clearChannel({logServer, logChannel, client})
}
