
const state = generateRandomString(16);

function getAuthorizationRequestUrl(){
    const scope = 'user-read-private user-read-email';


    return 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state
    }).toString();
}


async function requestAccessToken(state, code) {
    if (!state) {
        throw Error('Unauthorized');
    }

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

    const data = await response.json();

    if(!response.ok){
        console.error('Error from Spotify:', data);
        throw new Error('Failed to get access token');
    }

    console.log(data); // access_token, refresh_token, etc.
    return data;

}

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = {getAuthorizationRequestUrl, requestAccessToken};
