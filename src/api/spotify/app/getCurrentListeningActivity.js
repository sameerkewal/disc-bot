const getLocalSpotifyUserAccessTokens = require("../utils/getLocalSpotifyUserAccessTokens");
const {SpotifyTokenNotConfiguredError, SpotifyPermissionsMissing} = require("../../../errors/errors");
const {handleTokenExpiry} = require("./getAccountToken");


async function getCurrentListeningActivity(userId){
    try{
        // get access_token locally
        if (!(await getLocalSpotifyUserAccessTokens(userId, false))) {
            throw new SpotifyTokenNotConfiguredError();
        }


        const url = "https://api.spotify.com/v1/me/player/currently-playing"


        // function to make the actual fetch call
        const fetchSearch = async (accessToken) => {
            return await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
        };

        let response = await fetchSearch(await getLocalSpotifyUserAccessTokens(userId, false));

        //returns boolean but also puts new tokens in local cache IF expired
        const expired = await handleTokenExpiry(response, userId)
        //retry
        if (expired) response = await fetchSearch(await getLocalSpotifyUserAccessTokens(userId, false));

        // user not listening to anything right now
        if(response.status === 204 && response.statusText === 'No Content'){
            return null
        }

        const data = await response.json()

        if(data?.error?.status === 401 && data?.error?.message === 'Permissions missing') {
            throw new SpotifyPermissionsMissing();
        }

        return {
            progressMs  : data.progress_ms,
            totalMs     : data.item.duration_ms,
            songId      : data.item.id,
            songUrl     : data.item.external_urls.spotify,
            trackName   : data.item.name,
            albumName   : data.item.album.name,
            artistName  : data.item.artists.map(artist => artist.name).join(", "),
            isPlaying   : data.is_playing
        }

    }catch (e) {
        console.error(e)
        throw e;
    }
}

module.exports = {getCurrentListeningActivity};

