import { Events } from 'discord.js'
import consola from 'consola'
import { colors } from 'consola/utils'
import { optionToArg, resolveArgument } from './utils'
import type {
  CommandArg,
  Harmonix,
  HarmonixCommand,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixPrecondition
} from './types'

export const registerEvents = (harmonix: Harmonix, events: HarmonixEvent[]) => {
  for (const event of events.filter((evt) => !evt.options.type)) {
    if (event.options.once) {
      harmonix.client?.once(event.options.name!, event.callback)
    } else {
      harmonix.client?.on(event.options.name!, event.callback)
    }
  }

  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isModalSubmit()) return
    const event = events
      .filter((evt) => evt.options.type === 'modal')
      .find((evt) => evt.options.name === interaction.customId)

    if (!event) return
    event.callback(interaction)
  })
}

export const registerCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<false, CommandArg[]>[]
) => {
  harmonix.client?.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    const prefix = harmonix.options.defaultPrefix
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command = args.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.find((cmd) => cmd.options.name === command)

    if (!cmd || cmd.options.slash) return
    const resolvedArgs = await Promise.all(
      (cmd?.options.args || []).map(async (arg, i) => [
        arg.name,
        await resolveArgument(message, arg.type, args[i])
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    if (cmd.options.preconditions) {
      for (const prc of cmd.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'message',
          message
        })

        if (!result) return
      }
    }
    cmd.execute(harmonix.client!, message, { slash: false, args: fullArgs })
  })
}

export const registerSlashCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<true, CommandArg[]>[]
) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.find(
      (cmd) => cmd.options.name === interaction.commandName
    )

    if (!cmd || !cmd.options.slash) return
    const resolvedArgs = await Promise.all(
      interaction.options.data.map(async (opt) => [
        opt.name,
        await resolveArgument(
          interaction,
          optionToArg(opt.type),
          String(opt.value)
        )
      ])
    )
    const fullArgs = Object.fromEntries(resolvedArgs)

    if (cmd.options.preconditions) {
      for (const prc of cmd.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'slash',
          interaction
        })

        if (!result) return
      }
    }
    cmd.execute(harmonix.client!, interaction, {
      slash: false,
      args: fullArgs
    })
  })
}

export const registerContextMenu = (
  harmonix: Harmonix,
  contextMenus: HarmonixContextMenu[]
) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isContextMenuCommand()) return
    const ctm = contextMenus.find(
      (ctm) => ctm.options.name === interaction.commandName
    )

    if (!ctm) return
    if (ctm.options.preconditions) {
      for (const prc of ctm.options.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = precondition.callback(harmonix.options, {
          type: 'context-menu',
          interaction
        })

        if (!result) return
      }
    }
    ctm.callback(interaction)
  })
}

export const registerPreconditions = (
  harmonix: Harmonix,
  preconditions: HarmonixPrecondition[]
) => {
  for (const prc of preconditions) {
    harmonix.preconditions.set(prc.options.name!, prc)
  }
}
