import { defineModal } from '../../src'

export default defineModal(
  {
    title: 'Form',
    inputs: {
      color: {
        label: 'Favorite color',
        style: 'Short',
        placeholder: 'Enter your favorite color'
      },
      hobbies: {
        label: 'Hobbies',
        style: 'Paragraph',
        placeholder: 'Enter your hobbies'
      }
    }
  },
  (interaction, context) => {
    const { color } = context.inputs

    interaction.reply(`Submitted color: ${color}`)
  }
)
