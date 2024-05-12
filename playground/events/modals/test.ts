import { defineEvent } from '../../../src'

export default defineEvent((interaction) => {
  interaction.reply(interaction.fields.getTextInputValue('color'))
})
