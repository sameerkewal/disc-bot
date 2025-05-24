const {PermissionFlagsBits,RoleSelectMenuBuilder, ActionRowBuilder, ComponentType} = require('discord.js')

module.exports = {

    name: "show-roles",
    description: "show-roles",
    // devOnly: true,
    // testOnly: true,
    deleted: true,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {


        const roleMenu = new RoleSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("make a selection")
            .setMinValues(0)
            .setMaxValues(2)

        const roleMenu2 = new RoleSelectMenuBuilder()
            .setCustomId("est")
            .setPlaceholder("make a selection")
            .setMinValues(0)
            .setMaxValues(2)

        const actionRow = new ActionRowBuilder().addComponents(roleMenu);
        const reply = await interaction.reply({
            components: [actionRow],
            // ephemeral: true,
        })
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
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


