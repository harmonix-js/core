import { Client, REST, Routes } from 'discord.js'
import consola from 'consola'
import type { Harmonix } from './types'
import 'dotenv/config'
import { createError, ctx } from './harmonix'
import { contextMenuToJSON, isHarmonixCommand, slashToJSON } from './utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client(harmonixOptions.clientOptions)

  client.login(process.env.HARMONIX_CLIENT_TOKEN)

  return client
}

export const refreshApplicationCommands = async (harmonix: Harmonix) => {
  const commands = [
    ...harmonix.commands.filter((cmd) => cmd.options.slash).map((cmd) => cmd),
    ...harmonix.contextMenus.map((cmd) => cmd)
  ]
  const rest = new REST().setToken(process.env.HARMONIX_CLIENT_TOKEN!)

  harmonix.client?.once('ready', async () => {
    try {
      consola.info('Started refreshing application commands.')
      await rest.put(
        Routes.applicationCommands(
          harmonix.options.clientId || harmonix.client?.user?.id || ''
        ),
        {
          body: commands.map((cmd) =>
            isHarmonixCommand(cmd) ? slashToJSON(cmd) : contextMenuToJSON(cmd)
          )
        }
      )
      consola.success('Successfully reloaded application commands.\n')
      const readyEvent = harmonix.events.get('ready')

      if (readyEvent) {
        ctx.call(harmonix, () => readyEvent.callback(harmonix.client as any))
      }
    } catch (error: any) {
      createError(error.message)
    }
  })
}
