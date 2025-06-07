const {logServer, logChannel} = require("../../../config.json")



async function clearChannel({
    logServer,
    logChannel,
    client
}){
    const guild = await client.guilds.fetch(logServer)
    const logChannelToClear = await  guild.channels.fetch(logChannel);

    while(true){
        const fetched = await logChannelToClear.messages.fetch({limit: 100});
        if(!fetched)break;

        if (!fetched.size) {
            console.log("No messages to delete.");
            return;
        }

        await logChannelToClear.bulkDelete(fetched, false); // 'true' skips messages older than 14 days
        console.log(`Deleted ${fetched.size} messages from log channel.`);
    }




}


//usage

module.exports = {clearChannel}


