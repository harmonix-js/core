import { definePrecondition, useHarmonix } from '../../src'

export default definePrecondition(({ type, message, interaction }) => {
  const harmonix = useHarmonix()
  const entity = type === 'message' ? message : interaction
  const authorId = entity.member?.user.id

  if (authorId && !harmonix.options.ownerId.includes(authorId)) {
    entity?.reply('You are not the owner of this bot!')
    return false
  }
  return true
})
