const { getLyricsTokens, setLyricsTokens } = require('./spotifyTokens');


let spotifyLyricsTokens;

async function uploadSpotifyLyricsTokensCache(tokens){
    await setLyricsTokens(tokens);
    spotifyLyricsTokens = await getLyricsTokens();
}


async function setLocalSpotifyTokensCache(){
    spotifyLyricsTokens = await getLyricsTokens();
}

async function getLocalSpotifyTokensCache() {
    if (!spotifyLyricsTokens){
        await setLocalSpotifyTokensCache();
    }
    return spotifyLyricsTokens;
}

module.exports = {
        uploadSpotifyLyricsTokensCache: uploadSpotifyLyricsTokensCache
    ,   setLocalSpotifyTokensCache
    ,   getLocalSpotifyTokensCache
};