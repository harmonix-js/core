import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Kick a user from the server'
  },
  (_, message) => {
    message.reply('Kicked user')
  }
)
