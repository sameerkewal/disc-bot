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

const {getLyrics} = require ('../../api/spotify/app/getLyrics')


async function displayLyrics(interaction, songName, songId) {

    if (!songName && !songId) {
        await interaction.reply({
            content: "Either song name or song id must be filled!",
        })
        return;
    }
    await interaction.deferReply()

    try {
        const lyrics = await getLyrics(songId);

        if (!lyrics) {
            await interaction.editReply({
                content: "Something went wrong!",
            })
            return;
        }

        const joinedLyrics = lyrics.join("\n");
        const maxLengthPerMessage = 4000;
        const textComponents = [];

        for (let i = 0; i < joinedLyrics.length; i += maxLengthPerMessage) {
            const chunk = joinedLyrics.substring(i, i + maxLengthPerMessage);
            const textComponent = new TextDisplayBuilder().setContent(chunk);
            textComponents.push(textComponent);
        }

        for (let i = 0; i < textComponents.length; i++) {
            if (i === 0) {
                await interaction.editReply({
                    flags: MessageFlags.IsComponentsV2,
                    components: [textComponents[i]]
                })
            } else {
                await interaction.followUp({
                    flags: MessageFlags.IsComponentsV2,
                    components: [textComponents[i]]
                })
            }


        }

    }catch(error){
        interaction.editReply("Something went wrong, please try again!")
        console.error(error);

    }
}

module.exports = {

    name: "display-lyrics",
    description: "Get lyrics for specified song",
    deleted: true,
    testOnly: false,
    options: [
        {
            name: 'song-name',
            description: 'Name of song to get lyrics for',
            required: false,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'song-id',
            description: 'id of song to get lyrics for',
            required: false,
            type: ApplicationCommandOptionType.String
        },
    ],

    callback: async (client, interaction) => {

        const songName = interaction.options.getString("song-name");
        const songId = interaction.options.getString("song-id");

        await displayLyrics(interaction, songName, songId)

    },
    displayLyrics
}
