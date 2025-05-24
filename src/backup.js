const {Client, IntentsBitField} = require ('discord.js')
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const discordToken = process.env.DISCORD_TOKEN;

console.log(discordToken);

const client = new Client(
    {
        intents: [
            IntentsBitField.Flags.Guilds
            ,    IntentsBitField.Flags.GuildMembers
            ,   IntentsBitField.Flags.GuildMessages
            ,   IntentsBitField.Flags.MessageContent
        ]
    }
)
client.login( discordToken )

client.on("messageCreate", (m) => {
    if(m.author.bot) return;

    if(m.content === "hello"){
        m.reply("world")
    }
})

client.on("ready", (c) => {
    console.log(`ready ${c.user.tag}`)

})


client.on("interactionCreate", (interaction) => {


    if (!interaction.isChatInputCommand()) return;


    if (interaction.commandName === "hey") {
        interaction.reply("hey")
    }

    if (interaction.commandName === "add") {
        const num1 = interaction.options.getNumber("first-number")
        const num2 = interaction.options.getNumber("second-number")

        interaction.reply(`sum is ${num1 + num2}`)

    }
})