const {testServer, logServer, logChannel, mainServer} = require("../../../config.json")



const activity = [];


/**
 * Tracks and updates user presence status, logging changes and preventing redundant updates.
 *
 * @async
 * @function registerPresence
 * @param {Object} params - The presence details of the user.
 * @param {string} params.userId - The unique Discord user ID.
 * @param {string} params.username - The Discord username.
 * @param {string} params.newStatus - The new presence status (e.g., 'online', 'offline', 'idle', 'dnd').
 * @param {string} [params.activityName="none"] - The name of the user's current activity (e.g., game or app name).
 * @param {number} [params.timeStamp=Date.now()] - The timestamp of the presence update.
 *
 * @returns {Promise<{
 *     changed: boolean
 *     reason: string || null
 * }>} - A structured object indicating what changed (if anything) in the user's presence.
 * or nothing if the status has not changed.
 *
 * // Will log status update if changed, or ignore if the status remains the same.
 */
async function registerPresence({
    userId,
    username,
    newStatus,
    newActivityName = "unknown",
    timeStamp = Date.now()
}){
    const newPresenceObject = {
        userId,
        username,
        newStatus,
        timeStamp,
        newActivityName
    };
    const userActivity =  activity.find(activity => activity.userId === userId)

    // New user
    if (!userActivity) {
        activity.push({
            ...newPresenceObject,
            oldStatus: "unknown",
            oldActivityName: "unknown"
        });
        return {
            changed: true,
            reason: `user ${username} is now registered`,
            timeStamp
        };
    }


    const statusUnchanged = userActivity.newStatus === newStatus;

    // prevents presenceUpdate from firing twice
    if (statusUnchanged) {
        console.log("returning as status has not changed");
        return {
            changed: false,
            reason: null
        };
    }

    const previousStatus = userActivity.newStatus;
    const previousActivity = userActivity.newActivityName;

    // Update tracking object
    userActivity.oldStatus = previousStatus;
    userActivity.oldActivityName = previousActivity;
    userActivity.newStatus = newStatus;
    userActivity.newActivityName = newActivityName;
    userActivity.timeStamp = timeStamp;

    const reasonParts = [];
    if (!statusUnchanged) {
        reasonParts.push(`status went from ${previousStatus} to ${newStatus}`);
    }
    return {
        changed: true,
        reason: `user ${username} ${reasonParts.join(" and ")}`,
        timeStamp
    };
}

async function getActivity(){
    return activity;
}

const presenceHandler = async (oldPresence, newPresence) => {
    if (newPresence?.guild?.id !== mainServer || newPresence?.member?.user.bot) return;

    const presenceObject = {
        userId      : newPresence.member.user.id,
        username    : newPresence.member.user.username,
        newStatus   : newPresence?.member?.presence.status,
        timeStamp   : Date.now(),
        newActivityName    : newPresence.member.presence.activities[0]?.name ?? "unknown"
    }

    // sth has changed
    const registerPresenceResults = await registerPresence(presenceObject)

    if(registerPresenceResults.changed){
      const guild = await newPresence.client.guilds.fetch(logServer)
      const logChannelToSend = await  guild.channels.fetch(logChannel);

        await logChannelToSend.send(
            `Timestamp: ${new Date(registerPresenceResults.timeStamp).toLocaleTimeString('en-US', { hour12: false })}: ${registerPresenceResults.reason}`
        );    }
};

presenceHandler.registerPresence = registerPresence;
presenceHandler.getActivity = getActivity;


module.exports = presenceHandler;
