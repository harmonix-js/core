import { Events } from 'discord.js'
import consola from 'consola'
import { colors } from 'consola/utils'
import { optionToArg, resolveArgument } from './utils'
import type {
  ArgsDef,
  Harmonix,
  HarmonixCommand,
  HarmonixContextMenu,
  HarmonixEvent,
  HarmonixPrecondition,
  ParsedArgs
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

export const registerMessageCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<false, ArgsDef>[]
) => {
  harmonix.client?.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return
    const prefix = harmonix.options.defaultPrefix
    const rawArgs = message.content.slice(prefix.length).trim().split(/ +/)
    const command = rawArgs.shift()?.toLowerCase()

    if (!command) return
    const cmd = commands.find((cmd) => cmd.options.name === command)

    if (!cmd || cmd.options.slash) return
    const args = await Object.keys(cmd.options.args || {}).reduce<
      Promise<ParsedArgs>
    >(async (acc, arg, index) => {
      const resolvedAcc = await acc
      const resolvedArg = await resolveArgument(
        message,
        cmd.options.args![arg].type,
        rawArgs[index]
      )

      return {
        ...resolvedAcc,
        [arg]: resolvedArg
      }
    }, Promise.resolve({}))

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
    cmd.execute(harmonix.client!, message, { slash: false, args })
  })
}

export const registerSlashCommands = (
  harmonix: Harmonix,
  commands: HarmonixCommand<true, ArgsDef>[]
) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = commands.find(
      (cmd) => cmd.options.name === interaction.commandName
    )

    if (!cmd || !cmd.options.slash) return
    const args = await interaction.options.data.reduce<Promise<ParsedArgs>>(
      async (acc, opt) => {
        const resolvedAcc = await acc
        const resolvedArg = await resolveArgument(
          interaction,
          optionToArg(opt.type),
          String(opt.value)
        )

        return {
          ...resolvedAcc,
          [opt.name]: resolvedArg
        }
      },
      Promise.resolve({})
    )

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
      args
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
