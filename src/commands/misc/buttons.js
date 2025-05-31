const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType} = require('discord.js')

module.exports = {

    name: "button",
    description: "returns a button!",
    deleted: true,
    testOnly: false,
    // options:

    callback: async (client, interaction) => {

        const firstButton = new ButtonBuilder()
            .setLabel("First Button")
            .setStyle(ButtonStyle.Primary)
            .setCustomId('first-button')

        const secondButton = new ButtonBuilder()
            .setLabel("Second Button")
            .setStyle(ButtonStyle.Danger)
            .setCustomId('second-button')

        const buttonRow = new ActionRowBuilder().addComponents(firstButton, secondButton);

        const reply = await interaction.reply({
            content: 'choose a button!',
            components: [buttonRow],
        })


        const filter = (i) => i.user.id === interaction.user.id

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: 10_000

        })

        collector.on("collect", (interaction) => {
            if(interaction.customId === 'first-button') {
                interaction.reply('You clicked on the first button!')
                return;
            }
            if(interaction.customId === 'second-button') {
                interaction.reply('You clicked on the second button!')
                return;
            }
        })

        collector.on("end", (interaction) => {
            firstButton.setDisabled(true);
            secondButton.setDisabled(true);
            reply.edit({
                components: [buttonRow],
            })
        })

    }
}
