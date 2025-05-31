const   {     TextDisplayBuilder
    ,   SectionBuilder
    ,   MessageFlags: {IsComponentsV2}
    ,   ActionRowBuilder
    ,   ButtonBuilder
    ,   ContainerBuilderButtonBuilder
    ,   ButtonStyle
    ,   ComponentType
    ,   ApplicationCommandOptionType
    ,   ContainerBuilder, ThumbnailBuilder, MediaGalleryBuilder
} = require('discord.js')

const dotenv = require('dotenv');
const path = require('path');

const {search} = require("../../api/spotify/app/searchSong")
const {displayLyrics} = require("../spot/displayLyrics")
const {SpotifyTokenNotConfiguredError} = require("../../errors/errors");

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const choicesWithAttributes = [
    // { name: 'album', value: 'album' , jsonReturnKey: "albums"}
    // ,   { name: 'artist', value: 'artist' , jsonReturnKey: "artists"}
      { name: 'track', value: 'track' , jsonReturnKey: "tracks"}
    // ,   { name: 'playlist', value: 'playlist' , jsonReturnKey: "playlists"}
]


module.exports = {

    name: "search-item",
    description: "search item",
    deleted: false,
    testOnly: false,
    options: [
        {
            name: 'search-value',
            description: 'value to search',
            required: true,
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'artist',
            description: 'artist to which song belongs',
            type: ApplicationCommandOptionType.String
        },
        {
            name: 'type',
            description: 'Type of search',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: choicesWithAttributes
        }
    ],

    callback: async (client, interaction) => {

        try {
            const userId = interaction.user.id

            const type = (interaction.options.getString("type") || "track");
            const searchValue = interaction.options.getString("search-value");
            const artist = interaction.options.getString("artist");


            // used in return value when using search api, eg track becomes tracks, playlist becomes playlists etc etc
            const jsonReturnKey = choicesWithAttributes.find(choice => choice.value === type).jsonReturnKey

            await interaction.deferReply();
            console.log("searching")
            const parsedSearchResults = await search(userId, {type, artist, searchValue, jsonReturnKey})

            const trackArtistNameComponent = new TextDisplayBuilder().setContent(`## ${parsedSearchResults[0].trackName} - ${parsedSearchResults[0].artistName}`);
            const albumNameComponent = new TextDisplayBuilder().setContent(`### ${parsedSearchResults[0].albumName}`);


            const actionRowComponent = new ActionRowBuilder().addComponents([
                new ButtonBuilder().setLabel(`Lyrics`).setStyle(ButtonStyle.Primary).setCustomId(`lyrics:${parsedSearchResults[0].songId}`)
                , new ButtonBuilder().setLabel(`open in Spotify!`).setStyle(ButtonStyle.Link).setURL(parsedSearchResults[0].songUrl)
            ])


            const mediaComponent = new MediaGalleryBuilder().addItems([{
                media: {
                    url: parsedSearchResults[0].thumbnail.url
                }
            }])

            const containerBuilder = new ContainerBuilder().addMediaGalleryComponents(mediaComponent).addTextDisplayComponents(trackArtistNameComponent, albumNameComponent).addActionRowComponents(actionRowComponent)

            const reply = await interaction.editReply({
                flags: IsComponentsV2,
                components: [containerBuilder],
                // content: parsedSearchResults[0].songUrl
            })

            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (i) => i.customId.split(":")[0] === "lyrics",
                // time:
            })

            collector.on("collect", async (i) => {
                const songId = i.customId.split(":")[1]
                await displayLyrics(i, null, songId)
            })
        } catch (e) {
            if (e instanceof SpotifyTokenNotConfiguredError) {
                interaction.editReply("Not configured!")
            }else{
                console.log(e)
            }
        }
    },

}



