import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Kick a user from the server',
    args: [
      {
        name: 'user',
        description: 'The user to kick',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: 'The reason for kicking the user',
        type: 3,
        required: false
      }
    ]
  },
  (_, message) => {
    message.reply('Kicked user')
  }
)
