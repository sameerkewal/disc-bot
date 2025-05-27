const   {     TextDisplayBuilder
    ,   SectionBuilder
    ,   MessageFlags
    ,   ActionRowBuilder
    ,   ContainerBuilderButtonBuilder
    ,   ButtonStyle
    ,   ComponentType
    ,   ApplicationCommandOptionType
    ,   ContainerBuilder
} = require('discord.js')

const dotenv = require('dotenv');
const path = require('path');

const {getAuthorizationRequestUrl} = require("../../api/spotify/app/getAccountToken")

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {

    name: "register-user",
    description: "register-user",
    deleted: false,
    testOnly: false,

    callback: async (client, interaction) => {

        console.log(interaction.guild.id);
        console.log(interaction.channel.id);



        await interaction.reply({
            content: `Click the link to authenticate with Spotify:\n${getAuthorizationRequestUrl()}`
        });
    }
}

