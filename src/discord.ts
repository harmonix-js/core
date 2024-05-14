import { Client, REST, Routes } from 'discord.js'
import consola from 'consola'
import {
  type CommandArg,
  type Harmonix,
  type HarmonixCommand,
  type HarmonixContextMenu
} from './types'
import 'dotenv/config'
import { createError } from './harmonix'
import { contextMenuToJSON, isHarmonixCommand, slashToJSON } from './utils'

export const initCient = (harmonixOptions: Harmonix['options']) => {
  const client = new Client({ intents: harmonixOptions.intents })

  client.login(process.env.HARMONIX_CLIENT_TOKEN)

  return client
}

export const refreshApplicationCommands = async (
  harmonix: Harmonix,
  commands: (HarmonixCommand<true, CommandArg[]> | HarmonixContextMenu)[]
) => {
  const rest = new REST().setToken(process.env.HARMONIX_CLIENT_TOKEN!)

  try {
    consola.info('Started refreshing application commands.')
    await rest.put(
      Routes.applicationCommands(
        harmonix.options.clientId || process.env.HARMONIX_CLIENT_ID || ''
      ),
      {
        body: commands.map((cmd) =>
          isHarmonixCommand(cmd) ? slashToJSON(cmd) : contextMenuToJSON(cmd)
        )
      }
    )
    consola.success('Successfully reloaded application commands.\n')
  } catch {
    createError('Failed to reload application commands.\n')
  }
}
