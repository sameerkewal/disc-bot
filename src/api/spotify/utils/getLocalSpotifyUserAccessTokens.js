const {devs} = require('../../../../config.json')
const {getLocalSpotifyTokensCache} = require("../../firebase/app/setSpotifyTokensCache");


module.exports = async (userId, fallbackToDevId = false) => {
    const allTokens = await getLocalSpotifyTokensCache("userAccessTokens");

    let match = allTokens.find(
        tokenInfo => userId === tokenInfo.userInfo.userId
    )

    if (!match && devs?.[0] && fallbackToDevId) {
        match = allTokens.find(
            tokenInfo => devs[0] === tokenInfo.userInfo.userId
        )
    }

    return match?.tokenInfo?.access_token || null
}