const {uploadSpotifyTokensCache, getLocalSpotifyTokensCache} = require ("../../firebase/app/setSpotifyTokensCache.js");

const getSpotifyLyricTokens = require ("./getLyricTokens");


async function buildHeaders(tokens) {
    return {
        'accept': 'application/json',
        'accept-language': 'en',
        'app-platform': 'WebPlayer',
        'authorization': `${tokens.bearerToken}`,
        'client-token': `${tokens.clientToken}`,
        'referer': 'https://open.spotify.com/'
    };
}

async function fetchLyrics(songId, tokens) {
    const url = `https://spclient.wg.spotify.com/color-lyrics/v2/track/${songId}/image/https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273286e3cb9b87b48c070e5ff7c?format=json&vocalRemoval=false&market=from_token`;
    const headers = await buildHeaders(tokens);

    return await fetch(url, {
        method: 'GET',
        headers: headers,
    });
}

async function getLyrics(songId){

    const lyrics = []

    const localSpotifyTokens = await getLocalSpotifyTokensCache();
    let response = await fetchLyrics(songId, localSpotifyTokens);

    if (response.ok) {
        const data = await response.json();
        for(const lyric of data.lyrics.lines){
            lyrics.push(lyric.words);
        }
        return lyrics;
    }

    if (response.status === 401) {
        console.warn('🔁 Token expired, refreshing...');
        const newTokens = await getSpotifyLyricTokens();

        // Optionally upload to Firebase cache
        await uploadSpotifyTokensCache(newTokens);

        response = await fetchLyrics(songId, newTokens);

        if (response.ok) {
            const data = await response.json();
            for(const lyric of data.lyrics.lines){
                lyrics.push(lyric.words);
            }
            return lyrics
        } else {
            console.error('❌ Retry failed:', response.status);
        }
    } else {
        console.error(`❌ Unexpected error: HTTP ${response.status}`);
    }

    return null;
}




module.exports = {getLyrics}