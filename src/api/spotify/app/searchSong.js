const {getLocalSpotifyTokensCache} = require ("../../firebase/app/setSpotifyTokensCache.js");
const {SpotifyTokenNotConfiguredError, SpotifyPermissionsMissing} = require ("../../../errors/errors");
const {refreshAccessToken} = require("../app/getAccountToken.js")
const {handleTokenExpiry} = require("./getAccountToken");
const {devs} = require('../../../../config.json')

const getLocalSpotifyUserAccessTokens = require("../utils/getLocalSpotifyUserAccessTokens.js")


async function searchSong(userId, params) {

    try {
        // if user not configured and no dev id configured just throw error
        if (!(await getLocalSpotifyUserAccessTokens(userId, true))) {
            throw new SpotifyTokenNotConfiguredError();
        }


        const url = "https://api.spotify.com/v1/search?" + new URLSearchParams({
            q: buildSearchQuery(params),
            type: params.type,
        })

        // function to make the actual fetch call
        const fetchSearch = async (accessToken) => {
            return await fetch(url, {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
        };
        let response = await fetchSearch(await getLocalSpotifyUserAccessTokens(userId, true));


        //returns boolean but also puts new tokens in local cache IF expired
        const expired = await handleTokenExpiry(response, userId)
        //retry
        if (expired) response = await fetchSearch(await getLocalSpotifyUserAccessTokens(userId, true));

        const data = await response.json()

        if(data?.error?.status === 401 && data?.error?.message === 'Permissions missing') {
            throw new SpotifyPermissionsMissing();
        }

        const items = data[params.jsonReturnKey].items;

        let parsedSearchResult =   handleTracks(items)

        switch(params.jsonReturnKey){
            case 'tracks':
               parsedSearchResult =   handleTracks(items)
                break;

            default:
                console.warn(`Received unhandled type: ${params.type}`);
                throw new Error(`Type ${params.type} can not be handled yet!` )
        }

        return parsedSearchResult;


    } catch (e) {
        console.log(e)
        throw e;
    }


}


// implement more than one song or nah? i mean just search specifically
function handleTracks(items){

    const trackInfo = [];

    trackInfo.push({
        songId      : items[0].id,
        songUrl     : items[0].external_urls.spotify,
        thumbnail   : items[0].album.images[0],
        trackName   : items[0].name,
        albumName   : items[0].album.name,
        artistName  : items[0].artists.map(artist => artist.name).join(", ")
    })
    return trackInfo
}

function buildSearchQuery(params){
    const filters = [];

    if(params.artist){
        filters.push(`artist:${params.artist}`);
    }

    return `${params.searchValue} ${filters.join(' ').trim()}`
}



module.exports = {search: searchSong}

