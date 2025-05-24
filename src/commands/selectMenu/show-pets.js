const {PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType} = require('discord.js')

module.exports = {

    name: "select-menu",
    description: "select-menu",
    // devOnly: true,
    // testOnly: true,
    deleted: true,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {


        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("make a selection")
            .setMinValues(0)
            .setMaxValues(pets.length)
            .addOptions(
                ...pets.map((pet) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(pet.label)
                        .setValue(pet.value)
                        .setDescription(pet.Description)
                        .setEmoji(pet.emoji)
                )
            );

        const actionRow = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({
            components: [actionRow],
            // ephemeral: true,
        })
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
            time: 60_000
        })

        collector.on('collect', (interaction) => {
            if(!interaction.values.length){
                interaction.reply({content: "you didn't select anything", ephemeral: true})
                return;
            }
            interaction.reply({content: `you selected ${interaction.values.join(', ')}`, ephemeral: true})
        })
    }
}


const pets = [
    {
        label: "dog",
        Description: "doggo",
        value: "dog",
        emoji : "🐕"
    }
    ,{
        label: "cat",
        Description: "cat",
        value: "cat",
        emoji : "🐈"
    }
]