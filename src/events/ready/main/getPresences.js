const {mainServer, mainMembers} = require("../../../../config.json");
const {registerPresence, getActivity, getSpotifyActivity, findAnotherActiveSpotifyUser}  = require ("../../presenceUpdate/helpers/presenceUtils")
const {startCheckingOfflineSpotifyActivity}  = require ("../../presenceUpdate/helpers/offlineSpotifyPoller")





module.exports = async (client, interaction) => {

    const mainGuild =  await client.guilds.fetch(mainServer);

    const guildMembers = await mainGuild.members.fetch()
    const mainUsers = mainMembers.map(member => member.userId);

    for (const member of guildMembers.values()) {
        if (!mainUsers.includes(member.user.id)) continue;

        const newSpotifyActivity = getSpotifyActivity(member?.presence?.activities) || {};

        const presenceObject = {
            userId: member.user.id,
            username: member.user.username,
            newStatus: member?.presence?.status || "unknown",
            newActivityName: member?.presence?.activities[0]?.name ?? "unknown",
            newSpotifyActivity
        };

        await registerPresence(presenceObject, client);
    }

    // meaning no one is listening to spotify at this moment, so start checking offline activities
    if(!findAnotherActiveSpotifyUser())await startCheckingOfflineSpotifyActivity(null, client);

    // console.log(presenceHandler.getActivity())
}
