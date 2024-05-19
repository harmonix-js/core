import { defineCommand, getModal } from '../../../src'

export default defineCommand(
  {
    description: 'Test the bot',
    preconditions: ['ownerOnly']
  },
  async (_, interaction) => {
    const modal = getModal('form')

    await interaction.showModal(modal!)
  }
)
