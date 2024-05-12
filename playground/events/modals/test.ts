import { defineEvent } from '../../../src'

export default defineEvent<'modal'>((interaction) => {
  interaction.reply(interaction.fields.getTextInputValue('color'))
})
