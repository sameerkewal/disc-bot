const { setLocalGifs } = require('../../../api/firebase/app/setMediaCache');
const { setLocalSpotifyTokensCache } = require('../../../api/firebase/app/setSpotifyTokensCache');


module.exports = async (client, interaction) =>{
    try{
        await setLocalGifs()
        await setLocalSpotifyTokensCache()
    }   catch(error){
        console.log(error);
    }
}
