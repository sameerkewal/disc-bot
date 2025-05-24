const { setLocalGifs } = require('../../api/firebase/app/setGifCache');

// let gifCache = [];

module.exports = async (client, interaction) =>{
    try{
        await setLocalGifs()
    }   catch(error){
        console.log(error);
    }
}
