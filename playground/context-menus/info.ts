import { defineContextMenu } from '../../src'

export default defineContextMenu(
  {
    name: 'Get message author',
    type: 'Message',
    preconditions: ['ownerOnly']
  },
  async (interaction, target) => {
    await interaction.reply(`This message has been sent by ${target.author}`)
  }
)
