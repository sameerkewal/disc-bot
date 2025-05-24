module.exports = {

    name: "ping",
    description: "pong!",
    deleted: true,
    // devOnly: true,
    // testOnly: true
    // options:

    callback: async (client, interaction) => {
        await interaction.reply(`pong! ${client.ws.ping}`)
        await interaction.followUp('Pong again!');
        await interaction.followUp('Pong again!');
        await interaction.followUp('Pong again!');
        await interaction.followUp('Pong again!');

    }
}
