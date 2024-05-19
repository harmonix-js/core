import { defineCommand, getSelectMenu, useActionRow } from '../../../src'

export default defineCommand(
  {
    description: 'NOOP!'
  },
  (_, interaction) => {
    const selectMenu = getSelectMenu('choose')
    const row = useActionRow(selectMenu!)

    interaction.reply({ content: 'Say hello:', components: [row] })
  }
)
