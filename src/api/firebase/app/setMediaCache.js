const { getAllDocs } = require('./loadMediaFromFb');


let mediaCache  = [];

async function setLocalMedia(){
    mediaCache = await getAllDocs();
}

function getLocalMedia(){
    return mediaCache;
}

module.exports = {
    setLocalGifs: setLocalMedia,
    getLocalMedia: getLocalMedia,
};