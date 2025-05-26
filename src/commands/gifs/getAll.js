const { MessageFlags} = require("discord.js");
const { getLocalMedia } = require('../../api/firebase/app/setMediaCache');

module.exports = {

    name: "get-all",
    description: "get all and maybe modify or delete them",
    deleted: false,

    callback: async (client, interaction) => {

        const mediaList = getLocalMedia();

        for (let i = 0; i < mediaList.length; i++) {
            const media = mediaList[i];

            if (media.mediaUrl) {

                if(i === 0){
                    await interaction.reply({
                        content: media.mediaUrl
                    });
                }else{
                    await interaction.channel.send({
                        content: media.mediaUrl})
                }


            }
        }
    }
}