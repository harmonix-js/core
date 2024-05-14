import jiti from 'jiti'
import { filename } from 'pathe/utils'
import type {
  DefinePrecondition,
  Harmonix,
  HarmonixPrecondition,
  HarmonixPreconditionInput,
  PreconditionCallback,
  PreconditionOptions
} from './types'

export const resolveHarmonixPrecondition = (
  prc: HarmonixPreconditionInput,
  harmonixOptions: Harmonix['options']
) => {
  if (typeof prc === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _prcPath = _jiti.resolve(prc)
    const precondition = _jiti(_prcPath) as HarmonixPrecondition
    const options: PreconditionOptions = {
      name: precondition.options.name || filename(_prcPath).split('.')[0]
    }

    return { options, callback: precondition.callback }
  } else {
    return prc
  }
}

export const definePrecondition: DefinePrecondition = (
  callback: PreconditionCallback
) => {
  return { options: {}, callback }
}
