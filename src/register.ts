import { Events } from 'discord.js'
import consola from 'consola'
import { colors } from 'consola/utils'
import { toOption, resolveOption } from './utils'
import { ctx } from './harmonix'
import type { Harmonix, HarmonixEvents, ParsedOptions } from './types'

export const registerEvents = (harmonix: Harmonix) => {
  for (const [, event] of harmonix.events.filter((evt) => !evt.options.type)) {
    if (event.options.name === 'ready') continue
    if (event.options.once) {
      harmonix.client?.once(event.options.name!, (...args) => {
        ctx.call(harmonix, () => {
          event.callback(...(args as HarmonixEvents[keyof HarmonixEvents]))
        })
      })
    } else {
      harmonix.client?.once(event.options.name!, (...args) => {
        ctx.call(harmonix, () => {
          event.callback(...(args as HarmonixEvents[keyof HarmonixEvents]))
        })
      })
    }
  }

  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isModalSubmit()) return
    const event = harmonix.events
      .filter((evt) => evt.options.type === 'modal')
      .find((evt) => evt.options.name === interaction.customId)

    if (!event) return
    ctx.call(harmonix, () => {
      event.callback(interaction)
    })
  })
  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isButton()) return
    const event = harmonix.events
      .filter((evt) => evt.options.type === 'button')
      .find((evt) => evt.options.name === interaction.customId)

    if (!event) return
    ctx.call(harmonix, () => {
      event.callback(interaction)
    })
  })
}

export const registerCommands = (harmonix: Harmonix) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const cmd = harmonix.commands.find(
      (cmd) => cmd.config.name === interaction.commandName
    )

    if (!cmd) return
    const options = await interaction.options.data.reduce<
      Promise<ParsedOptions>
    >(async (acc, opt) => {
      const resolvedAcc = await acc
      const resolvedOption = await resolveOption(
        interaction,
        toOption(opt.type),
        String(opt.value)
      )

      return {
        ...resolvedAcc,
        [opt.name]: resolvedOption
      }
    }, Promise.resolve({}))

    if (cmd.config.preconditions) {
      for (const prc of cmd.config.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = ctx.call(harmonix, () => {
          return precondition.callback({
            type: 'slash',
            interaction
          })
        })

        if (!result) return
      }
    }
    ctx.call(harmonix, () => {
      cmd.execute(harmonix.client!, interaction, {
        options
      })
    })
  })
}

export const registerContextMenu = (harmonix: Harmonix) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isContextMenuCommand()) return
    const ctm = harmonix.contextMenus.find(
      (ctm) => ctm.config.name === interaction.commandName
    )

    if (!ctm) return
    if (ctm.config.preconditions) {
      for (const prc of ctm.config.preconditions) {
        const precondition = harmonix.preconditions.get(prc)

        if (!precondition) {
          consola.warn(`Precondition ${colors.cyan(prc)} not found.`)
          continue
        }
        const result = ctx.call(harmonix, () => {
          return precondition.callback({
            type: 'context-menu',
            interaction
          })
        })

        if (!result) return
      }
    }
    ctm.callback(interaction)
  })
}
