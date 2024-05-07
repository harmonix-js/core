import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import type {
  CommandExecute,
  CommandOptions,
  HarmonyCommand,
  HarmonyCommandInput
} from '../types'
import { Harmony } from './harmony'

export const resolveHarmonyCommand = (
  cmd: HarmonyCommandInput,
  harmonyOptions: Harmony['options']
): HarmonyCommand<boolean> => {
  if (typeof cmd === 'string') {
    const _jiti = jiti(harmonyOptions.rootDir, {
      interopDefault: true
    })
    const _cmdPath = _jiti.resolve(cmd)
    const command = _jiti(_cmdPath) as HarmonyCommand<boolean>
    const options: CommandOptions = {
      name: filename(_cmdPath).split('.')[0],
      category: filename(dirname(_cmdPath)),
      slash: command.options.slash || filename(_cmdPath).endsWith('.slash'),
      ...command.options
    }

    return { options, execute: command.execute }
  } else {
    return cmd
  }
}

export const defineCommand = <Slash extends boolean>(
  options: CommandOptions & { slash?: Slash },
  execute: CommandExecute<Slash>
): HarmonyCommand<Slash> => {
  return {
    options,
    execute
  }
}
