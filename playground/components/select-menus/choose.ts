import { defineSelectMenu, useEmbed } from '../../../src'

export default defineSelectMenu(
  {
    type: 'User',
    placeholder: 'Choose a user'
  },
  async (interaction, selected) => {
    const member = await interaction.guild?.members.fetch(selected[0])
    const embed = useEmbed({
      color: 0x2c2d31,
      description: `You selected ${member?.user}!`
    })

    interaction.reply({ embeds: [embed] })
  }
)
