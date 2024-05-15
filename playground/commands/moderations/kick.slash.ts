import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Kick a user from the server',
    args: {
      user: {
        type: 'User',
        description: 'The user to ban'
      },
      reason: {
        type: 'String',
        description: 'The reason for the ban'
      }
    }
  },
  (_, interaction, context) => {
    const { user, reason } = context.args

    interaction.reply(`Kicked user ${user} for ${reason}`)
  }
)
