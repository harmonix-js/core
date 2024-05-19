import { defineModal } from '../../src'

export default defineModal(
  {
    title: 'Form',
    textInputs: [
      {
        id: 'color',
        label: 'Favorite color',
        placeholder: 'Enter your favorite color',
        style: 'Short'
      },
      {
        id: 'hobbies',
        label: 'Hobbies',
        placeholder: 'Enter your hobbies',
        style: 'Paragraph'
      }
    ]
  },
  (interaction) => {
    const color = interaction.fields.getTextInputValue('color')

    interaction.reply(`Submitted color: ${color}`)
  }
)
