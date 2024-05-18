import { definePrecondition, useHarmonix } from '../../src'

export default definePrecondition(({ interaction }) => {
  const harmonix = useHarmonix()
  const authorId = interaction.member?.user.id

  if (authorId && !harmonix.options.ownerIds.includes(authorId)) {
    interaction?.reply('You are not the owner of this bot!')
    return false
  }
  return true
})
