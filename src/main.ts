
import * as inquirer from 'inquirer'
import { arena } from './arena'

import ceneoProducer from './producers/ceneoProducer'
import ceneoWorker from './workers/ceneoWorker'

const entityChoicesToHandlers = {
  "Ceneo Producer": async () => {
    let { urls } = await inquirer.prompt([{
      type: 'input', name: "urls", message: "Enter JSON-valid array of URLs:",
      validate(input) {
        try {
          JSON.parse(input)
        } catch (e) {
          return false
        }
        return true
      }
    }])
    urls = JSON.parse(urls)
    ceneoProducer(urls)
  },
  "Ceneo Worker": ceneoWorker
}

const main = async () => {
  const { entityType } = await inquirer.prompt([{ type: 'list', name: "entityType", message: "What would you like to run?", choices: Object.keys(entityChoicesToHandlers) }])
  await entityChoicesToHandlers[entityType]();
}

const argv = require('optimist').argv

if (argv.i) {
  main()
}
else if (argv.s) {
  const urls = JSON.parse(argv.s)
  ceneoProducer(urls)
}
else if (argv.w) {
  ceneoWorker()
}
else if (argv.a) {
  arena()
}
else
  main()
