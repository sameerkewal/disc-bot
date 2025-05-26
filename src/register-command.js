module.exports = async (client, guildId) => {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
        const fetchedGuild = await client.guilds.fetch(guild.id);

        console.log(fetchedGuild.id)
        try {
            const commands = await client.application.commands.fetch({ guildId: guild.id });
            console.log(commands)
            // for (const command of commands.values()) {
            //     console.log(`- ${command.name}`);
            // }
        } catch (err) {
            console.error(`Error fetching commands for guild ${guild.id}:`, err);
        }
    }
};
