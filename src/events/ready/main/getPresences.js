const {mainServer, mainMembers} = require("../../../../config.json");
const {registerPresence, getActivity, getSpotifyActivity}  = require ("../../presenceUpdate/helpers/presenceUtils")




module.exports = async (client, interaction) => {

    const mainGuild =  await client.guilds.fetch(mainServer);

    const guildMembers = await mainGuild.members.fetch()
    const mainUsers = mainMembers.map(member => member.userId);

    guildMembers.forEach((member) => {

        if(!mainUsers.includes(member.user.id))return ;

        let newSpotifyActivity = (getSpotifyActivity(member?.presence?.activities) || {} );

        const presenceObject = {
            userId: member.user.id,
            username: member.user.username,
            newStatus: member?.presence?.status || "unknown",
            newActivityName: member?.presence?.activities[0]?.name ?? "unknown",
            newSpotifyActivity

        }
        registerPresence(presenceObject, client);
    })

    // console.log(presenceHandler.getActivity())
}
