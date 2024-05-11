import { defineArgument, defineCommand } from '../../../src'

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
  (_, interaction, options) => {
    const { user, reason } = options.args

    interaction.reply(`Kicked user ${user} for ${reason}`)
  }
)
