import { defineCommand, defineArgument } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Ban a user from the server',
    args: [
      defineArgument({
        type: 'User',
        name: 'user',
        description: 'The user to ban'
      }),
      defineArgument({
        type: 'String',
        name: 'reason',
        description: 'The reason for the ban'
      })
    ]
  },
  (_, interaction, options) => {
    const { user, reason } = options.args

    interaction.reply(`Banned user ${user} for ${reason}`)
  }
)
