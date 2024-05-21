import { defineCommand, getSelectMenu, useActionRow } from '../../../src'

export default defineCommand(
  {
    description: 'NOOP!',
    dm: true
  },
  (_, interaction) => {
    const selectMenu = getSelectMenu('choose')
    const row = useActionRow(selectMenu!)

    interaction.reply({ content: 'Noop', components: [row] })
  }
)
