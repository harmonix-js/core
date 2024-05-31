import { defineCommand } from '../../src'

export default defineCommand(
  {
    description: 'Get information about a user or the server',
    options: {
      user: {
        type: 'SubCommand',
        description: 'Get information about a user'
      },
      server: {
        type: 'SubCommand',
        description: 'Get information about the server',
        options: {
          role: {
            type: 'Role',
            description: 'The role to get information about'
          },
          caca: {
            type: 'String',
            description: 'caca'
          }
        }
      }
    }
  },
  (_, interaction, ctx) => {
    const { user, server } = ctx.options

    if (user) {
      return interaction.reply('User info')
    } else if (server) {
      return interaction.reply('Server info')
    }
  }
)
