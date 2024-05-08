import type { CommandInteractionOption } from 'discord.js'
import { defineCommand, defineArgument, useArguments } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Ban a user from the server',
    args: [
      defineArgument({
        type: 'User',
        name: 'user',
        description: 'The user to ban'
      })
    ]
  },
  (_, interaction, options) => {
    const { get } = useArguments(options)

    interaction.reply(
      `Banned user ${get<CommandInteractionOption>('user').user?.username}`
    )
  }
)
