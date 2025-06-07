const   {     MessageFlags
} = require('discord.js')
module.exports = {

    name: "clear-console",
    description: "clears console. for devs only!",
    testOnly: false,
    devsOnly: false,
    deleted: false,

    callback: async (client, interaction) => {

        console.clear()

        await interaction.reply({
            content: "Console Cleared!",
            flags: MessageFlags.Ephemeral
        })

    }
}
