import { defineSelectMenu, useEmbed } from '../../src'

export default defineSelectMenu(
  {
    type: 'User',
    placeholder: 'Choose a user'
  },
  (interaction) => {
    const embed = useEmbed({
      color: 0x2c2d31,
      description: `You selected ${interaction.users.first()}!`
    })
    interaction.reply({ embeds: [embed] })
  }
)
