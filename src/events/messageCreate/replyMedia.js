const { getLocalMedia } = require('../../api/firebase/app/setMediaCache');

module.exports=async(client, message)=>{

    if(message.author.bot) return;

    console.log(message.guild.id)

    const gifCache =   getLocalMedia();

    const matchedGifObjects = gifCache.filter((gifObject) => gifObject.message.toUpperCase() === message.content.toUpperCase())

    if (matchedGifObjects.length > 0) {
        // Pick random index
        const randomIndex = Math.floor(Math.random() * matchedGifObjects.length);
        const randomGif = matchedGifObjects[randomIndex];

        // Send the media_url of the random matched gif
        message.channel.send(randomGif.mediaUrl);
    }


}