import { defineCommand } from '../../../src'

export default defineCommand(
  {
    description: 'Pong!'
  },
  (client, interaction) => {
    interaction.reply(`Pong ${client.ws.ping}ms!`)
  }
)
