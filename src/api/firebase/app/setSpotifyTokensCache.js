const { getLyricsTokens, setLyricsTokens, setUserAccessTokens, getAllUserAccessTokens} = require('./spotifyTokens');


let spotifyLyricsTokens;
let spotifyUserAccessTokens;

// lyrics
async function uploadSpotifyLyricsTokensCache(tokens){
    await setLyricsTokens(tokens);
    spotifyLyricsTokens = await getLyricsTokens();
}

//account token
async function uploadUserAccessTokensCache(tokens){
    await setUserAccessTokens(tokens);
    spotifyUserAccessTokens = await getAllUserAccessTokens()
}


//lyrics + user account token
async function setLocalSpotifyTokensCache(){
    spotifyLyricsTokens     = await getLyricsTokens();
    spotifyUserAccessTokens = await getAllUserAccessTokens();
}

//lyrics + user account token
async function getLocalSpotifyTokensCache(type) {

    if (!type) throw new Error("Type is required");


    if(type === 'lyrics'){
        if (!spotifyLyricsTokens){
            await setLocalSpotifyTokensCache();
        }
        return spotifyLyricsTokens;
    }
    if(type === 'userAccessTokens'){
        if (!spotifyUserAccessTokens){
            await setLocalSpotifyTokensCache();
        }
        return spotifyUserAccessTokens;
    }
}

module.exports = {
        uploadSpotifyLyricsTokensCache
    ,   setLocalSpotifyTokensCache
    ,   getLocalSpotifyTokensCache
    ,   uploadUserAccessTokensCache
};