const {uploadUserAccessTokensCache, getLocalSpotifyTokensCache} = require("../../firebase/app/setSpotifyTokensCache");
const {getRefreshToken} = require("../../firebase/app/spotifyTokens")

let state =[];


function upsertState(userInfo){
    const newState = generateRandomString(16);
    const now = Date.now();

    const index  = state.findIndex((state) => state.userId === userInfo.userId );
    if(index === -1){
        state.push({...userInfo, state: newState, timestamp: now})
    }else{
        state[index].state = newState;
        state[index].timestamp = now;
    }
}

function getUserInfo(requestState, userId){


    const stateObject =  state.find((entry) =>{
        if(requestState !== null){
            return entry.state === requestState;
        }
        if(userId !== null){
            return entry.userId = userId
        }
    }) ;

    return {
        userId: stateObject.userId,
        username: stateObject.username
    };
}

function getAuthorizationRequestUrl(userInfo){
    const scope = 'user-read-private user-read-email user-top-read';

    upsertState(userInfo)

    return 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state.find(entry => entry.userId === userInfo.userId).state,
    }).toString();
}


async function requestAccessToken(requestState, code) {
    if (!requestState) {
        throw Error('Unauthorized');
    }

   const userInfo =  getUserInfo(requestState, null);

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const body = new URLSearchParams({
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
    })

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: body.toString()
    })

    const tokenInfo = await response.json();

    if(!response.ok){
        console.error('Error from Spotify:', data);
        throw new Error('Failed to get access token');
    }
    const data = {userInfo, tokenInfo}
    await uploadUserAccessTokensCache(data)
    return tokenInfo;
}

async function refreshAccessToken(userId){

    const refreshToken = await getRefreshToken(userId)
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;


    // gets retrieved locally
    const userInfo =  (await getLocalSpotifyTokensCache("userAccessTokens")).find(token => token.userInfo.userId === userId).userInfo;


    try {
        const response = await fetch("https://accounts.spotify.com/api/token/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }).toString()
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Error from Spotify:', errorBody);
            throw new Error('Failed to get access token');
        }

        const tokenInfo = await response.json();
        const data = {userInfo, tokenInfo}
        await uploadUserAccessTokensCache(data)

    }catch(error){
        console.log("error when fetching refresh token", error)
    }

}


async function handleTokenExpiry(response, userId){
    if(response.status === 401){
        const authHeader = response.headers.get("www-authenticate");

        if(authHeader && authHeader.includes(`error="invalid_token"`) && authHeader.includes('error_description="The access token expired"')){
            console.log("token expired, retrying!")
            await refreshAccessToken(userId)
            return true;
        }
    }
    return false;
}

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = {handleTokenExpiry, getAuthorizationRequestUrl, requestAccessToken, refreshAccessToken};


