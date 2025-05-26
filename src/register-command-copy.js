require('dotenv').config();
const { REST, Routes } = require('discord.js');
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const commands = [
    {
        name: "spam-all",
        description: "???",
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
               "877949843740426301"
            ),
            { body: commands }
        );

        console.log('Slash commands were registered successfully!');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();