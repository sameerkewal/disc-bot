const { REST  , Routes , ApplicationCommandOptionType } = require('discord.js')
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const guildId = process.env.GUILD_ID;
const botId = process.env.CLIENT_ID;
const discordToken = process.env.DISCORD_TOKEN;


const commands = [
    {
        name: "hey",
        description: "replies with hey"
    },
    {name: "add", description: "adds two numbers", options: [
            {
                name: "first-number",
                description: "first number",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: "one",
                        value: 1
                    },
                    {
                        name: "two",
                        value: 2
                    },
                    {
                        name: "three",
                        value: 3
                    }
                ]
                // required: true
            }
            ,
            {
                name: "second-number",
                description: "second number",
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: "ten",
                        value: 10
                    },
                    {
                        name: "twenty",
                        value: 20
                    },
                    {
                        name: "thirty",
                        value: 30
                    }
                ]
                // required: true
            }
        ]}
]

const rest = new REST({ version: '10' }).setToken(discordToken);

(async () =>{
    try {
        console.log('registering slash commands')
        await rest.put(Routes.applicationGuildCommands(botId, guildId), { body: commands })

        console.log('slash commands registered successfully')
    }catch(error){
        console.log('error', error);
    }
})()