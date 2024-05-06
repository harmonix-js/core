import createJiti from 'jiti'
import { filename } from 'pathe/utils'
import { getAllFiles } from './utils'
import type { CommandExecute, CommandOptions, CommandResult } from '../types'

const jiti = createJiti(undefined as unknown as string, {
  interopDefault: true,
  requireCache: false,
  esmResolve: true,
  extensions: ['.ts', '.js']
})

const commandsPath = getAllFiles('./playground/commands')

const parseFileName = (fileName: string) => {
  const parts = fileName.split('.')
  const name = parts[0]
  const hasSlash = parts[parts.length - 1] === 'slash'

  return [name, hasSlash]
}

export const loadCommands = () => {
  const commands = Object.fromEntries(
    commandsPath.map((path) => {
      const [name, hasSlash] = parseFileName(filename(path))!

      return [name, () => ({ slash: hasSlash, ...jiti(path) })]
    })
  ) as Record<string, () => { slash: boolean } & CommandResult>

  return commands
}

export const defineCommand = (
  options: CommandOptions,
  execute: CommandExecute
): CommandResult => {
  return {
    data: options,
    execute
  }
}
