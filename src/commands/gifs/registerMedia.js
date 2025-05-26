const {ApplicationCommandOptionType, MessageFlags} = require("discord.js");
const {uploadMedia} = require("../../api/firebase/app/addMedia");
const { setLocalGifs } = require('../../api/firebase/app/setMediaCache');
module.exports = {

    name: "register-gif",
    description: "Register Gif",
    deleted: true,
    options: [
        {
            name: 'message',
            description: 'message to which respond to specified gif/picture with',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'media',
            description: 'url to media',
            required: true,
            type: ApplicationCommandOptionType.String
        }
        ],

    callback: async (client, interaction) => {
        const message = interaction.options.getString("message");
        const mediaUrl = interaction.options.getString("media");

       const reply = await interaction.reply({
            content: 'registering media!',
            flags: MessageFlags.Ephemeral,
        })

        try{
            await uploadMedia({message, mediaUrl})
            interaction.editReply('media registered successfully.');
            await setLocalGifs()
        }catch(err){
            interaction.editReply("Error while uploading media");
        }
    }
}