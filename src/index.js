const {Client, IntentsBitField} = require ('discord.js')
const dotenv = require('dotenv');
const path = require('path');
const eventHandler = require('./handlers/eventHandler');
const keepAlive = require("./server");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const discordToken = process.env.DISCORD_TOKEN;

const client = new Client(
    {
        intents: [
                IntentsBitField.Flags.Guilds
            ,   IntentsBitField.Flags.GuildMembers
            ,   IntentsBitField.Flags.GuildMessages
            ,   IntentsBitField.Flags.MessageContent
            ,   IntentsBitField.Flags.GuildMessageTyping
            ,   IntentsBitField.Flags.GuildPresences
        ]
    }
)
client.login(discordToken).then(r=> null);


eventHandler(client)
keepAlive();
