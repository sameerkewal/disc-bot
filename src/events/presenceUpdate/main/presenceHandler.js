const {logServer, logChannel, mainServer, mainMembers} = require("../../../../config.json")
const {registerPresence, getSpotifyActivity}  = require ("../helpers/presenceUtils")

const dotenv = require('dotenv');
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, '../.env') });





//main function
module.exports = async (oldPresence, newPresence) => {
    if (newPresence?.guild?.id !== mainServer || newPresence?.member?.user.bot) return;

    const presenceObject = {
        userId      : newPresence.member.user.id,
        username    : newPresence.member.user.username,
        newStatus   : newPresence?.member?.presence.status,
        timeStamp   : Date.now(),
        newActivityName    : newPresence.member.presence.activities[0]?.name ?? "unknown",
        newSpotifyActivity:  (getSpotifyActivity(newPresence.member?.presence?.activities) || {} )
    }

    // sth has changed
    const registerPresenceResults = await registerPresence(presenceObject, newPresence.client)

    if(registerPresenceResults.changed){
        const guild = await newPresence.client.guilds.fetch(logServer)
        const logChannelToSend = await  guild.channels.fetch(logChannel);

        const targetMember = mainMembers.find(member => member.userId === newPresence.member.user.id);

        if (targetMember && targetMember.notifications === registerPresenceResults.changeType) {
            await logChannelToSend.send(
                `Timestamp: ${new Date(registerPresenceResults.timeStamp).toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Paramaribo' })}: ${registerPresenceResults.reason}`
            );
        }
    }
};













