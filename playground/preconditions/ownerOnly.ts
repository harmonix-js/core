import { definePrecondition, useRuntimeEnv } from '../../src'

export default definePrecondition((interaction) => {
  const env = useRuntimeEnv()
  const authorId = interaction.member?.user.id

  if (authorId && authorId !== env.ownerId) {
    interaction?.reply('You are not the owner of this bot!')
    return false
  }
  return true
})
