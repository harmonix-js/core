import { defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Ban a user from the server'
  },
  (_, interaction) => {
    interaction.reply('Banned user')
  }
)
