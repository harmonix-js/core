import jiti from 'jiti'
import { dirname } from 'pathe'
import { filename } from 'pathe/utils'
import {
  CommandArgType,
  type HarmonyCommandArgType,
  type CommandExecute,
  type CommandOptions,
  type Harmony,
  type HarmonyCommand,
  type HarmonyCommandInput,
  type CommandArg,
  type CommandExecuteOptions,
  ArgumentResolver
} from './types'
import { SlashCommandBuilder } from 'discord.js'

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

export const defineCommand = <Slash extends boolean>(
  options: CommandOptions & { slash?: Slash },
  execute: CommandExecute<Slash>
): HarmonyCommand<Slash> => {
  return { options, execute }
}

export const toJSON = (cmd: HarmonyCommand<true>) => {
  const builder = new SlashCommandBuilder()
    .setName(cmd.options.name!)
    .setDescription(cmd.options.description || 'No description provided')

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
        case CommandArgType.Mentionable:
          builder.addMentionableOption((opt) =>
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
        case CommandArgType.Attachment:
          builder.addAttachmentOption((opt) =>
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

export const defineArgument = <
  Type extends keyof HarmonyCommandArgType
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

export const useArguments = (
  options: CommandExecuteOptions
): ArgumentResolver => {
  if (options.slash) {
    return {
      get: (name: string) => {
        return options.params.get(name)
      }
    }
  } else {
    return {
      get: (name: string) => {
        return options.params[name] || undefined
      }
    }
  }
}
