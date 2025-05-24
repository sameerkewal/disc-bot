const { testServer } = require ('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands')
const getApplicationCommands = require('../../utils/getApplicationCommands')
const areCommandsDifferent = require('../../utils/areCommandsDifferent')

module.exports = async (client) => {

  try {
    const localCommands = getLocalCommands()
    const applicationCommands = await getApplicationCommands(client, testServer)


    for (const localCommand of localCommands) {
      const {name, description, options} = localCommand;

      const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name)

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`deleted ${name}`)
          continue;
        }
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options
          });
          console.log('updated command ', name)
        }
      } else {
        if (localCommand.deleted) {
          console.log(`skipping registering command ${name} as it is deleted`)
          continue;
        }
        await applicationCommands.create({
          name,
          description,
          options
        })
        console.log(`registered command ${name}`)
      }
      }

  } catch (error) {
    console.log(error)
  }
}
