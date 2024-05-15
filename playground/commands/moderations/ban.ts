import { defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Ban a user from the server',
    args: {
      user: {
        type: 'User',
        description: 'The user to ban'
      },
      reason: {
        type: 'String',
        description: 'The reason for the ban'
      }
    },
    userPermissions: ['Administrator']
  },
  (_, interaction, context) => {
    const { user, reason } = context.args

    interaction.reply(`Banned user ${user} for ${reason}`)
  }
)
