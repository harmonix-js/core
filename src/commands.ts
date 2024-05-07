import createJiti from 'jiti'
import { filename } from 'pathe/utils'
import type { CommandExecute, CommandResult } from '../types'
import { dirname } from 'pathe'

const jiti = createJiti(undefined as unknown as string, {
  interopDefault: true,
  requireCache: false,
  esmResolve: true,
  extensions: ['.ts', '.js']
})

interface CommandContext {
  name: string
  category: string
  slash: boolean
  execute: CommandExecute<boolean>
}

interface CommandOptions {
  name?: string
  description?: string
  category?: string
  arguments?: any[]
  nsfw?: boolean
  slash?: boolean
  ownerOnly?: boolean
  guildOnly?: boolean
  userPermissions?: any[]
  botPermissions?: any[]
  cooldown?: number
}

export class Command {
  public name: string
  public description: string
  public category: string
  public arguments: any[]
  public nsfw: boolean
  public slash: boolean
  public ownerOnly: boolean
  public guildOnly: boolean
  public userPermissions: any[]
  public botPermissions: any[]
  public cooldown: number

  public execute: CommandExecute<boolean>

  constructor(context: CommandContext, options: CommandOptions = {}) {
    this.name = options.name ?? context.name
    this.description = options.description ?? ''
    this.category = options.category ?? context.category
    this.arguments = options.arguments ?? []
    this.nsfw = options.nsfw ?? false
    this.slash = options.slash || context.slash
    this.ownerOnly = options.ownerOnly ?? false
    this.guildOnly = options.guildOnly ?? false
    this.userPermissions = options.userPermissions ?? []
    this.botPermissions = options.botPermissions ?? []
    this.cooldown = options.cooldown ?? 0

    this.execute = context.execute
  }
}

export const getCommand = (path: string) => {
  const command = jiti(path) as CommandResult<boolean>
  const context: CommandContext = {
    name: filename(path).split('.')[0],
    category: filename(dirname(path)),
    slash: filename(path).endsWith('.slash'),
    execute: command.execute
  }

  return new Command(context, command.options)
}

export const defineCommand = <Slash extends boolean>(
  options: CommandOptions & { slash?: Slash },
  execute: CommandExecute<Slash>
): CommandResult<Slash> => {
  return {
    options,
    execute
  }
}
