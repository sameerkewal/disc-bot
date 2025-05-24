const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js')

module.exports = {

    name: "ban",
    description: "bans a member!!!!",
    // devOnly: true,
    // testOnly: true,
    deleted: false,
    options: [
        {
            name: 'target-user',
            description: 'user to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'reason to ban',
            required: false,
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: (client, interaction) =>{
        interaction.reply(`ban!`)
    }
}
