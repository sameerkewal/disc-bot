const {
            Client
        ,   GatewayIntentBits
        ,   MessageFlags
        ,   TextDisplayBuilder
        ,   SeparatorBuilder
        ,   SeparatorSpacingSize
        ,   AttachmentBuilder
        ,   FileBuilder
        ,   SectionBuilder
        ,   ThumbnailBuilder
        ,   ButtonBuilder
        ,   ButtonStyle
        ,   MediaGalleryBuilder
        ,   ChannelSelectMenuBuilder
        ,   ActionRowBuilder
        ,   ContainerBuilder
    } = require('discord.js')

    const   path = require ('path');
    const   fs = require ('fs').promises;

module.exports = {

    name: "containers",
    description: "container!",
    deleted: false,
    // devOnly: true,
    // testOnly: true
    // options:

    callback: async (client, interaction) => {

        const textComponent = new TextDisplayBuilder().setContent("# This is Heading 1");
        const headingTwo = new TextDisplayBuilder().setContent("## This is Heading 2");
        const seperatorComponent = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);

        const filePath = path.join(__dirname, '..', '..', 'assets', 'example.txt');

        const fileContent = await fs.readFile(filePath, 'utf-8');

        const attachment = new AttachmentBuilder(Buffer.from(fileContent), {
            name: 'sample.txt'
        })

        const fileComponent = new FileBuilder().setURL('attachment://sample.txt');


        const buttonComponent = new ButtonBuilder()
            .setCustomId('random-button-id')
            .setLabel("click me!")
            .setStyle(ButtonStyle.Primary)

        const buttonComponent2 = new ButtonBuilder()
            .setCustomId('random-button-id2')
            .setLabel("click me!")
            .setStyle(ButtonStyle.Primary);

        const thumbnailComponent = new ThumbnailBuilder({
            media: {
                url: "https://cdn.discordapp.com/embed/avatars/1.png"
            }
        })

        const mediaGalleryComponent = new MediaGalleryBuilder()
            .addItems([
                {
                    media : {
                        url: "https://cdn.discordapp.com/embed/avatars/1.png"
                    }
                },
                {
                    media : {
                        url: "https://cdn.discordapp.com/embed/avatars/2.png"
                    }
                }
            ])

        const channelSelectMenuComponent = new ChannelSelectMenuBuilder()
            .setCustomId('random-channel-id')
            .setPlaceholder("select a channel")
            .setMinValues(1)
            .setMaxValues(10)

        const channelSelectMenuComponent2 = new ChannelSelectMenuBuilder()
            .setCustomId('random-channel-id-2')
            .setPlaceholder("select a channel")
            .setMinValues(1)
            .setMaxValues(10)

        const channelActionRowComponent = new ActionRowBuilder().addComponents(channelSelectMenuComponent);
        const channelActionRowComponent2 = new ActionRowBuilder().addComponents(channelSelectMenuComponent2);

        const containerComponent = new ContainerBuilder()
            .addTextDisplayComponents(textComponent, headingTwo)
            .addActionRowComponents(channelActionRowComponent)

        const containerComponent2 = new ContainerBuilder()
            .addTextDisplayComponents(textComponent, headingTwo)
            .addActionRowComponents(channelActionRowComponent2)

        const sectionComponent = new SectionBuilder()
            .addTextDisplayComponents(textComponent, headingTwo)
            .setButtonAccessory(buttonComponent)

        const sectionComponent2 = new SectionBuilder()
            .addTextDisplayComponents(textComponent, headingTwo)
            .setThumbnailAccessory(thumbnailComponent)

        interaction.reply({
            flags: MessageFlags.IsComponentsV2,
            // components: [textComponent, seperatorComponent, headingTwo, fileComponent],
            components: [textComponent, seperatorComponent, fileComponent, headingTwo, seperatorComponent, headingTwo],
            components: [containerComponent, seperatorComponent,containerComponent2],
            files: [attachment]
        })

    }
}
