import { ClientEvents, Events } from 'discord.js'
import consola from 'consola'
import { colors } from 'consola/utils'
import { resolveOption } from './utils'
import { ctx } from './harmonix'
import type { Harmonix, ParsedInputs, ParsedOptions } from './types'

export const registerEvents = (harmonix: Harmonix) => {
  for (const [, event] of harmonix.events.filter((evt) => !evt.options.type)) {
    if (event.options.name === 'ready') continue
    if (event.options.once) {
      harmonix.client?.once(event.options.name!, (...args) => {
        ctx.call(harmonix, () => {
          event.callback(...(args as ClientEvents[keyof ClientEvents]))
        })
      })
    } else {
      harmonix.client?.on(event.options.name!, (...args) => {
        ctx.call(harmonix, () => {
          event.callback(...(args as ClientEvents[keyof ClientEvents]))
        })
      })
    }
  }
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
      const resolvedOption = resolveOption(interaction, opt.type, opt.name)

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

export const registerButtons = (harmonix: Harmonix) => {
  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isButton()) return
    const btn = harmonix.buttons.find(
      (btn) => btn.config.id === interaction.customId
    )

    if (!btn) return
    btn.callback(interaction)
  })
}

export const registerModals = (harmonix: Harmonix) => {
  harmonix.client?.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isModalSubmit()) return
    const mdl = harmonix.modals.find(
      (mdl) => mdl.config.id === interaction.customId
    )

    if (!mdl) return
    const inputs = Object.keys(mdl.config.inputs ?? {}).reduce<ParsedInputs>(
      (acc, input) => ({
        ...acc,
        [input]: interaction.fields.getTextInputValue(input)
      }),
      {}
    )

    mdl.callback(interaction, { inputs })
  })
}

export const registerSelectMenus = (harmonix: Harmonix) => {
  harmonix.client?.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isAnySelectMenu()) return
    const slm = harmonix.selectMenus.find(
      (slm) => slm.config.id === interaction.customId
    )

    if (!slm) return
    slm.callback(interaction)
  })
}
