import { defineContextMenu } from '../../src'

export default defineContextMenu(
  {
    preconditions: ['ownerOnly']
  },
  (interaction) => {
    interaction.reply('Context menu opened!')
  }
)
