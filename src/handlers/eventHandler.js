const path = require('path')
const getAllFiles = require('../utils/getAllFiles')
const {MissingMainHandlerFolderError} = require("../errors/errors");
const {existsSync} = require("node:fs");

module.exports = (client) => {

    const eventFolders = getAllFiles(path.join(__dirname, '..','events'), true)

    for(const eventFolder of eventFolders){

        const fullMainFolderPath = path.join(eventFolder, 'main');

        if (!existsSync(fullMainFolderPath)) {
            throw new MissingMainHandlerFolderError(eventFolder);
        }

        const eventFiles = getAllFiles(fullMainFolderPath)
        eventFiles.sort((a, b) => a > b)

        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop()

        client.on(eventName, async(arg) =>{
            for(const eventFile of eventFiles){
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }
        })
    }
}