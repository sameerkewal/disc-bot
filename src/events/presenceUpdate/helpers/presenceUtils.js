const {setSpotifyPresence} = require("./presenceService")
const {startCheckingOfflineSpotifyActivity, stopCheckingOfflineSpotifyActivity} = require("./offlineSpotifyPoller");


//constants
const activityMap = new Map(); // userId -> presence object

const spotifyPresenceState = {
    presence: null,
    userId: null
};

// functions
function getActivity(){
    return activityMap;
}

const isBotStartup = true;


/**
 * Tracks and updates a Discord user's presence status, logs changes, and prevents redundant updates.
 *
 * @async
 * @function registerPresence
 * @param {Object} params - The presence update details.
 * @param {string} params.userId - The unique Discord user ID.
 * @param {string} params.username - The Discord username.
 * @param {string} params.newStatus - The new presence status (e.g., 'online', 'offline', 'idle', 'dnd').
 * @param {string} [params.newActivityName="unknown"] - The name of the user's current activity (e.g., game or app name).
 * @param {Object} [params.newSpotifyActivity={}] - An object containing current Spotify activity data (if any).
 * @param {number} [params.timeStamp=Date.now()] - The timestamp of the presence update.
 * @param {Object} client - The Discord client instance.
 *
 * @returns {{
 *     changed: boolean,
 *     changeType: 'spotify' | 'status' | null
 *     reason: string | null,
 *     timeStamp: Date
 * } | undefined} - A structured object indicating what changed (if anything), or undefined if no change.
 *
 * @description
 * This function compares the new presence info with previously stored presence for the user.
 * If a change is detected (status or relevant activity), it logs the change and returns a reason.
 * Otherwise, it returns nothing to avoid unnecessary updates or logs.
 */
async function registerPresence({
                                    userId,
                                    username,
                                    newStatus,
                                    newActivityName = "unknown",
                                    newSpotifyActivity = {},
                                    timeStamp = Date.now()
                                }, client) {
    const newPresenceObject = {
        userId,
        username,
        newStatus,
        timeStamp,
        newActivityName,
        newSpotifyActivity
    };
    const userActivity = activityMap.get(userId);

    // Variable which we will return
    // Doing it like this as we don't want to short circuit so we can set bot presence
    let returnValue = null;


    // New user
    if (!userActivity) {
        activityMap.set(userId, {
            ...newPresenceObject,
            oldStatus: "unknown",
            oldActivityName: "unknown",
            oldSpotifyActivity: {}
        });
        returnValue =  {
            changed: true,
            reason: `user ${username} is now registered`,
            changeType: "register",
            timeStamp: new Date(timeStamp)
        };
    }

    //
    const statusUnchanged = userActivity == null || userActivity.newStatus === newStatus;
    //
    const spotifyUnchanged = (JSON.stringify(userActivity?.newSpotifyActivity ?? {} ) === JSON.stringify(newSpotifyActivity ?? {} ));



    const isIncomingActive = Object.keys(newSpotifyActivity).length > 0;

    // Set spotify presence
    // 1. Presence for bot hasn't been set yet or user to whom's the bot presence was set, changed song
    // 2. User to whom's the bot presence was set stopped playing music, so attempting to find a fallback user for setting the bot's presence
    if (!spotifyUnchanged) {
        if (isIncomingActive && (!spotifyPresenceState.presence || spotifyPresenceState.userId === userId)) {


            const wasPreviouslyInactive = !spotifyPresenceState.presence;

            // switch offline mode off
            if (wasPreviouslyInactive) stopCheckingOfflineSpotifyActivity();


            if(!spotifyPresenceState.presence || spotifyPresenceState.presence.details !== newSpotifyActivity.details) {
                await setSpotifyPresence(client, newSpotifyActivity);
                spotifyPresenceState.presence = newSpotifyActivity;
                spotifyPresenceState.userId = userId;
            }

            console.log(wasPreviouslyInactive
                ? `[Discord Bot Presence] Set presence to user ${username} - started playing music`
                :  `[Discord Bot Presence] Updated presence to user ${username} - changed song`
            );

        } else if (!isIncomingActive && spotifyPresenceState.presence && spotifyPresenceState.userId === userId) {
            const fallback = findAnotherActiveSpotifyUser(userId);

            if (fallback) {
                await setSpotifyPresence(client, fallback.newSpotifyActivity);
                spotifyPresenceState.presence = fallback.newSpotifyActivity;
                spotifyPresenceState.userId = fallback.userId;
                console.log(`[Discord Bot Presence] Fallback presence set to user ${fallback.username}`);
            } else {
                // await setSpotifyPresence(client, null); --> off due to checkSpotifyActivityOffline()
                spotifyPresenceState.presence = null;
                spotifyPresenceState.userId = null;
                console.log("[Discord Bot Presence] Cleared presence - no one playing music");
                await startCheckingOfflineSpotifyActivity(userId, client)
            }
        }
    }



    // prevents presenceUpdate from firing twice
    if (statusUnchanged && spotifyUnchanged && userActivity) {
        console.log("returning as status has not changed");
        returnValue =  {
            changed: false,
            reason: null,
            changeType: null
        };
    }


    // Update tracking object only if the object already existed
    if(userActivity){
        //
        const previousStatus = userActivity.newStatus;
        const previousActivity = userActivity.newActivityName;
        const previousSpotifyActivity = userActivity.newSpotifyActivity;
        //
        userActivity.oldStatus = previousStatus;
        userActivity.oldActivityName = previousActivity;
        userActivity.oldSpotifyActivity = previousSpotifyActivity;
        //
        userActivity.newStatus = newStatus;
        userActivity.newActivityName = newActivityName;
        userActivity.newSpotifyActivity = newSpotifyActivity;
        //
        userActivity.timeStamp = timeStamp;

        if (!statusUnchanged) {
            returnValue =   {
                changed: true,
                reason: `user ${username} status changed from ${previousStatus} to ${newStatus}`,
                changeType: "status",
                timeStamp
            };
        }
        // check for !returnValue as we want to give the status change priority over this change
        if (!spotifyUnchanged && !returnValue) {
            // If previousSpotifyActivity is empty → started playing music
            // If newSpotifyActivity is null or empty → stopped playing music
            // Otherwise → changed song from old to new
            returnValue =   {
                changed: true,
                reason: Object.keys(previousSpotifyActivity).length === 0
                    ? `user ${username} started playing music!(${newSpotifyActivity.details})`
                    : (!newSpotifyActivity || Object.keys(newSpotifyActivity).length === 0)
                        ? `user ${username} stopped playing music!(${previousSpotifyActivity.details})`
                        : `user ${username} changed song from ${previousSpotifyActivity.details} to ${newSpotifyActivity.details}`,
                changeType: "spotify",
                timeStamp
            }
        }

    }
    return returnValue;
}





function findAnotherActiveSpotifyUser(excludeUserId){
    for(const [userId, activity] of getActivity().entries()){

        if (
            userId !== excludeUserId    &&
            activity.newSpotifyActivity &&
            Object.keys(activity.newSpotifyActivity).length > 0
        ){
            return {
                newSpotifyActivity: activity.newSpotifyActivity,
                userId: activity.userId,
                username: activity.username,
            }
        }
    }
    return null;
}

function getSpotifyActivity(activities){

    if(!activities)return{}

    const spotifyActivity = activities.find((activity => activity.name.toLowerCase() === "spotify"))

    if(spotifyActivity){
        return  {
            name        : spotifyActivity.name,
            details     : spotifyActivity.details,
            timestamps  : spotifyActivity.timestamps,
            id          : spotifyActivity.syncId,
            artists     : spotifyActivity.state
        }

    }else{
        return  {}    }

}


module.exports = {getActivity, registerPresence, getSpotifyActivity, findAnotherActiveSpotifyUser}