import { defineCommand } from '../../../src'

export default defineCommand<false>(
  {
    description: 'NOOP!',
    preconditions: ['nsfw']
  },
  (_, message) => {
    message.reply('NOOP')
  }
)
