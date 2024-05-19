import { defineSelectMenu } from '../../src'

export default defineSelectMenu(
  {
    type: 'User',
    placeholder: 'Choose a user'
  },
  (interaction) => {
    interaction.reply(`You selected an user!`)
  }
)
