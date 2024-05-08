import { defineArgument, defineCommand } from '../../../src'
import { CommandArgType } from '../../../src/types'

export default defineCommand(
  {
    description: 'Kick a user from the server',
    args: [
      defineArgument({
        type: 'User',
        name: 'user',
        description: 'The user to kick'
      }),
      defineArgument({
        type: 'String',
        name: 'reason',
        description: 'The reason for the kick'
      })
    ]
  },
  (_, message) => {
    message.reply('Kicked user')
  }
)
