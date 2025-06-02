const {mainServer, mainMembers} = require("../../../config.json");
const presenceHandler = require('../presenceUpdate/presenceHandler');



module.exports = async (client, interaction) => {


   const mainGuild =  await client.guilds.fetch(mainServer);

   const guildMembers = await mainGuild.members.fetch()

    guildMembers.forEach((member) => {
        if(!mainMembers.includes(member.user.id))return ;


        const presenceObject = {
            userId: member.user.id,
            username: member.user.username,
            newStatus: member?.presence?.status || "unknown",
            newActivityName: member?.presence?.activities[0]?.name ?? "unknown",

        }
        presenceHandler.registerPresence(presenceObject);
    })
}
