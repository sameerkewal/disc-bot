const { getLocalGifs } = require('../../api/firebase/app/setGifCache');

module.exports=async(client, message)=>{

    if(message.author.bot) return;

    const gifCache =   getLocalGifs();

    const matchedGifObjects = gifCache.filter((gifObject) => gifObject.message.toUpperCase() === message.content.toUpperCase())

    if (matchedGifObjects.length > 0) {
        // Pick random index
        const randomIndex = Math.floor(Math.random() * matchedGifObjects.length);
        const randomGif = matchedGifObjects[randomIndex];

        // Send the media_url of the random matched gif
        message.channel.send(randomGif.media_url);
    }


}