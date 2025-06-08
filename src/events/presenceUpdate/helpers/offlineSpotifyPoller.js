const { mainMembers, defaultIntervalActivityCheck}  = require("../../../../config.json")
const {getCurrentListeningActivity} = require("../../../api/spotify/app/getCurrentListeningActivity")
const getLocalSpotifyUserAccessTokens = require("../../../api/spotify/utils/getLocalSpotifyUserAccessTokens.js")
const {setSpotifyPresence} = require("./presenceService")
const {use} = require("express/lib/application");

let checkingOfflineSpotifyActivity;

// track current activity
let currentPresence = {};
let offlineCheckInterval;


function setCurrentPresence(allSongInfo, userId) {

    if(!allSongInfo && !userId) {
        currentPresence = {}
        return;
    }

    //calculate next interval
    const now = Date.now();
    const { progressMs, totalMs } = allSongInfo;
    const remainingMS = totalMs - progressMs;
    const nextCheckAt = new Date(now + remainingMS);

    currentPresence = {
        ...allSongInfo
        , userId: userId
        , nextCheckAt: nextCheckAt
        , capturedAt: now
    }

    console.log(currentPresence);
}

async function checkSpotifyActivityOffline(userId, client) {

    // first check if user has access token configured
   const accessTokenUser =  await getLocalSpotifyUserAccessTokens(userId, false);
   let  currentListeningActivity;
   let accessTokens;

   // user who stopped playing music not configured try ALL OTHER USERS
    if(!accessTokenUser) {
        console.log("user is not configured, trying all other main members")
        accessTokens = await getMainMembersAccessTokens();
        currentListeningActivity = await findFirstActiveListeningActivity(accessTokens)


    // user is configured so see if they have any listening activity
    }else{
        console.log("user is configured, checking listening activity")
        currentListeningActivity =  await getActiveListeningActivity(userId)

        // console.log("found current listening activity for userId: ", currentListeningActivity);

        // they do not have any listening activity
        // so try the other members
        if(!currentListeningActivity) {
            console.log("user is configured, but not listening to anything, checking all other main members")
            accessTokens = await getMainMembersAccessTokens();
            currentListeningActivity = await findFirstActiveListeningActivity(accessTokens)

        }

    }
        if(currentListeningActivity){
            console.log("found target")
            await setSpotifyPresence(client, currentListeningActivity.discordPresence)
            setCurrentPresence(currentListeningActivity.allSongInfo, currentListeningActivity.userId)
        }else{
            await setSpotifyPresence(client, null)
            setCurrentPresence(null, null)  // technically not needed but eh just to be sure
            console.log("No listening activity found...")
        }
}


async function startAutoCheckLoop(userId, client){
    if(!checkingOfflineSpotifyActivity)return;


    const loop = async (userId, client) => {
        try{
            await checkSpotifyActivityOffline(userId, client);
        }catch(err){
            console.error(err);
        }


        if (checkingOfflineSpotifyActivity) {
            const now = Date.now();


            // if no currentPresence fallback to configured amount of minutes
            const delay = currentPresence.nextCheckAt ?  Math.max(currentPresence.nextCheckAt - now, 1000) : defaultIntervalActivityCheck; // at least 1s delay


            offlineCheckInterval = setTimeout(() => {

                // If currentPresence.userId exists then use that.
                // If not, fall back to the original userId.
                loop(currentPresence.userId ? currentPresence.userId : userId, client)

            }, delay);
            console.log(`Next check scheduled in ${delay} ms (${new Date(delay + now).toLocaleString()})`);
        }
    }

    await loop(userId, client)

}

function stopAutoCheckLoop(){
    if(offlineCheckInterval){
        clearTimeout(offlineCheckInterval);
        offlineCheckInterval = null;
        console.log("auto check stopped")
    }
}

async function getActiveListeningActivity(userId){
    const currentActiveListeningActivity =  await getCurrentListeningActivity(userId, false);

    if(currentActiveListeningActivity?.isPlaying === true){

        const now = Date.now()
        const startTimestamp = new Date(now - currentActiveListeningActivity.progressMs);
        const endTimestamp = new Date(now + (currentActiveListeningActivity.totalMs - currentActiveListeningActivity.progressMs));

            return {
                userId: userId,
                discordPresence: {
                    name: "Spotify",
                    details: currentActiveListeningActivity.trackName,
                    timestamps: {
                        start: startTimestamp,
                        end: endTimestamp
                    },
                    id: currentActiveListeningActivity.songId,
                    artists: currentActiveListeningActivity.artistName
                },
                allSongInfo:
                    currentActiveListeningActivity
            };
        }
        return null;
}


async function getMainMembersAccessTokens(){

        return (await Promise.all(
            mainMembers.map(async (member) => {
                const token = await getLocalSpotifyUserAccessTokens(member.userId, false)

                return token != null ? {userId: member.userId, token}
                    : null
            }))).filter((entry) => entry != null);

}


async function findFirstActiveListeningActivity(accessTokens) {

    for(const entry of accessTokens){
        const activity =  await getActiveListeningActivity(entry.userId)

        if(activity){
            return activity
        }
    }

       return null;
}




function isCheckingOfflineSpotifyActivity(){
    return checkingOfflineSpotifyActivity;
}



async function startCheckingOfflineSpotifyActivity(userId, client) {
    if (checkingOfflineSpotifyActivity) return; // already running
    checkingOfflineSpotifyActivity = true;
    await startAutoCheckLoop(userId, client);  // start the repeating loop here
}

function stopCheckingOfflineSpotifyActivity() {
    checkingOfflineSpotifyActivity = false;
    stopAutoCheckLoop()
    setCurrentPresence(null, null)  // technically not needed but eh just to be sure

}


module.exports = {isCheckingOfflineSpotifyActivity, startCheckingOfflineSpotifyActivity , stopCheckingOfflineSpotifyActivity};


// checkSpotifyActivityOffline("165464938012344320")