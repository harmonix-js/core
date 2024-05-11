import { defineCommand } from '../../../src'

export default defineCommand(
  {
    slash: false,
    description: 'Pong!'
  },
  (client, message) => {
    message.reply(`Pong ${client.ws.ping}ms!`)
  }
)
