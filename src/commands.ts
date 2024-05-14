import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js'
import {
  CommandArgType,
  type HarmonixCommandArgType,
  type CommandExecute,
  type CommandOptions,
  type Harmonix,
  type HarmonixCommand,
  type HarmonixCommandInput,
  type CommandArg,
  HarmonixContextMenu
} from './types'

export const resolveHarmonixCommand = (
  cmd: HarmonixCommandInput,
  harmonixOptions: Harmonix['options']
): HarmonixCommand<boolean, CommandArg[]> => {
  if (typeof cmd === 'string') {
    const _jiti = jiti(harmonixOptions.rootDir, {
      interopDefault: true
    })
    const _cmdPath = _jiti.resolve(cmd)
    const command = _jiti(_cmdPath) as HarmonixCommand<boolean, CommandArg[]>
    const options: CommandOptions = {
      name: command.options.name || filename(_cmdPath).split('.')[0],
      category: command.options.category || filename(dirname(_cmdPath)),
      slash: command.options.slash || filename(_cmdPath).endsWith('.slash'),
      ...command.options
    }

    return { options, execute: command.execute }
  } else {
    return cmd
  }
}

export const defineCommand = <Slash extends boolean, Args extends CommandArg[]>(
  options: CommandOptions & { slash?: Slash; args?: Args },
  execute: CommandExecute<Slash, Args>
): HarmonixCommand<Slash, Args> => {
  return { options, execute }
}

export const slashToJSON = (cmd: HarmonixCommand<true, CommandArg[]>) => {
  const builder = new SlashCommandBuilder()
    .setName(cmd.options.name!)
    .setDescription(cmd.options.description || 'No description provided')
    .setDefaultMemberPermissions(
      cmd.options.userPermissions?.reduce(
        (acc, perm) => acc | PermissionFlagsBits[perm],
        0n
      )
    )
    .setNSFW(cmd.options.nsfw || false)

  if (cmd.options.args) {
    for (const arg of cmd.options.args) {
      switch (arg.type) {
        case CommandArgType.String:
          builder.addStringOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Integer:
          builder.addIntegerOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Boolean:
          builder.addBooleanOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.User:
          builder.addUserOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Channel:
          builder.addChannelOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Role:
          builder.addRoleOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
        case CommandArgType.Number:
          builder.addNumberOption((opt) =>
            opt
              .setName(arg.name)
              .setDescription(arg.description)
              .setRequired(arg.required!)
          )
          break
      }
    }
  }

  return builder.toJSON()
}

export const contextMenuToJSON = (ctm: HarmonixContextMenu) => {
  const builder = new ContextMenuCommandBuilder()
    .setName(ctm.options.name!)
    .setType(
      ctm.options.type === 'message'
        ? ApplicationCommandType.Message
        : ctm.options.type === 'user'
          ? ApplicationCommandType.User
          : ApplicationCommandType.Message
    )

  return builder.toJSON()
}

export const defineArgument = <
  Type extends keyof HarmonixCommandArgType
>(options: {
  type: Type
  name: string
  description: string
  required?: boolean
}) => {
  return {
    type: options.type,
    name: options.name,
    description: options.description,
    required: options.required ?? true
  } as CommandArg
}
