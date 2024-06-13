import { defineButton } from '../../../src'

export default defineButton(
  {
    label: 'Say hello!',
    style: 'Primary'
  },
  (interaction) => {
    interaction.reply('Hello!')
  }
)
