const { getTokens, setTokens } = require('./spotifyTokens');


let spotifyTokens;

async function uploadSpotifyTokensCache(tokens){
    await setTokens(tokens);
    spotifyTokens = await getTokens();
}


async function setLocalSpotifyTokensCache(){
    spotifyTokens = await getTokens();
}

async function getLocalSpotifyTokensCache() {
    if (!spotifyTokens){
        await setLocalSpotifyTokensCache();
    }
    return spotifyTokens;
}

module.exports = {
        uploadSpotifyTokensCache
    ,   setLocalSpotifyTokensCache
    ,   getLocalSpotifyTokensCache
};