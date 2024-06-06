import { defineCommand, useHarmonix } from '../../../src'

export default defineCommand(
  {
    description: 'Pong!'
  },
  (interaction) => {
    const { client } = useHarmonix()

    interaction.reply(`Pong ${client.ws.ping}ms!`)
  }
)
