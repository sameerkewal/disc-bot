const {Client, IntentsBitField} = require ('discord.js')
const dotenv = require('dotenv');
const path = require('path');
const eventHandler = require('./handlers/eventHandler');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const discordToken = process.env.DISCORD_TOKEN;

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


eventHandler(client)
