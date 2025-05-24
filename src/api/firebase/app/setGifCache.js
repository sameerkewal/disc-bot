const { getAllDocs } = require('./loadGifsFromFb');


let gifCache  = [];

async function setLocalGifs(){
    gifCache = await getAllDocs();
}

function getLocalGifs(){
    return gifCache;
}

module.exports = {
    setLocalGifs,
    getLocalGifs,
};