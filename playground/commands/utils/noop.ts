import { defineCommand, defineEmbed } from '../../../src'

export default defineCommand(
  {
    description: 'NOOP!',
    options: {
      noop: {
        type: 'User',
        description: 'Noop user',
        required: false
      }
    }
  },
  (_, interaction, context) => {
    const { noop } = context.options

    const embed = defineEmbed({
      color: 0x0099ff,
      title: 'Noop title',
      description: `Noop description here ${noop}`,
      thumbnail:
        'https://tr.rbxcdn.com/dd80ef8b8f6ecc3ffd54b4bffbb91af4/420/420/Image/Png',
      timestamp: new Date()
    })

    interaction.reply({ embeds: [embed] })
  }
)
