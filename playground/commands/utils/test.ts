import { TextInputStyle } from 'discord.js'
import { defineCommand, defineModal } from '../../../src'

export default defineCommand(
  {
    slash: true,
    description: 'Test the bot',
    preconditions: ['ownerOnly']
  },
  async (_, interaction) => {
    const modal = defineModal({
      id: 'test',
      title: 'Test',
      textInputs: [
        {
          id: 'color',
          label: 'Color',
          style: TextInputStyle.Short,
          placeholder: 'Enter a color'
        },
        {
          id: 'hobbies',
          label: 'Hobbies',
          style: TextInputStyle.Paragraph,
          placeholder: 'Enter your hobbies'
        }
      ]
    })

    await interaction.showModal(modal)
  }
)
