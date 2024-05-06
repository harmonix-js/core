import { defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Ban a user from the server',
    args: [
      {
        name: 'user',
        description: 'The user to kick',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'The reason for banning the user',
        type: 3,
        required: false
      }
    ]
  },
  (_, message) => {
    message.reply('Banned user')
  }
)
