import { ChannelType } from 'discord.js'
import { defineArgument, defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'NOOP!',
    args: [
      defineArgument({
        name: 'noop',
        type: 'Integer',
        description: 'NOOP!',
        metadata: {
          choices: [
            {
              name: '1',
              value: 1
            },
            {
              name: '2',
              value: 2
            }
          ]
        }
      })
    ],
    preconditions: ['nsfw']
  },
  (_, message) => {
    message.reply('NOOP')
  }
)
