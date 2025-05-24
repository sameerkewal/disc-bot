const { setLocalGifs } = require('../../api/firebase/app/setMediaCache');

// let gifCache = [];

module.exports = async (client, interaction) =>{
    try{
        await setLocalGifs()
    }   catch(error){
        console.log(error);
    }
}
