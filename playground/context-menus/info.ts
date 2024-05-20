import { defineContextMenu } from '../../src'

export default defineContextMenu(
  {
    name: 'Get message author',
    preconditions: ['ownerOnly']
  },
  (interaction) => {
    interaction.reply(
      `This message has been sent by ${interaction.targetMessage.author}`
    )
  }
)
