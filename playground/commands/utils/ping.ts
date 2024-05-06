import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Pong!'
  },
  (client, message) => {
    message.reply('Pong ' + client.ws.ping + 'ms!')
  }
)
