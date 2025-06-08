const {ActivityType} = require("discord.js");
const {environmentVariables} = require("../../../../config.json")





async function setSpotifyPresence(client, newSpotifyActivity) {

    //set default presence and then return
    if(!newSpotifyActivity ||  Object.keys(newSpotifyActivity).length === 0) {
        await setPresence(client)
        return;
    }

    client.user.setPresence({
        status: "online",
        activities: [
            {
                name: `${newSpotifyActivity.details} - ${newSpotifyActivity?.artists?.replace(/;/g, ', ')}`  ,
                type: ActivityType.Listening,
            }
        ],
    });
}


async function setPresence(client, activities) {
    const defaultPresence = [
        {
            name: "default",
            status: 'online',
            activities: [{
                name: environmentVariables[process.env.ENVIRONMENT].activityName,
                type: ActivityType.Listening,
            }]
        }
    ]
    if(!activities){
        const presenceObject = defaultPresence.find((presence) => presence.name === "default");

        client.user.setPresence({
            status: presenceObject.name,
            activities: presenceObject.activities,
        });
        return;
    }
    client.user.setPresence({
        status: activities.status,
        activities: activities.activities,
    });
}

module.exports = { setSpotifyPresence, setPresence };
