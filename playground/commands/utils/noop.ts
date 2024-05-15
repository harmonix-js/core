import { defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: false,
    description: 'NOOP!'
  },
  (_, message) => {
    message.reply('NOOP')
  }
)
