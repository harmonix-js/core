import { ChannelType } from 'discord.js'
import { definePrecondition } from '../../src'

export default definePrecondition((_, { type, message }) => {
  if (
    type === 'message' &&
    message.channel.type === ChannelType.GuildText &&
    !message.channel.nsfw
  ) {
    message.reply('This command can only be used in NSFW channels!')
    return false
  }
  return true
})
