import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Test the bot'
  },
  () => {
    console.log('Tested the bot')
  }
)
