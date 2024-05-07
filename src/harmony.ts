import { HarmonyConfig } from '../types'
import { getCommand, type Command } from './commands'
import { getEvent, type Event } from './events'
import { type LoadHarmonyConfigOptions, loadHarmonyConfig } from './config'
import { getAllFiles } from './utils'
import { resolve } from 'path'
import { Client } from 'discord.js'

type DeepRequired<T> = {
  [P in keyof T]: Required<DeepRequired<T[P]>>
}

export class Harmony {
  private _config: Required<DeepRequired<HarmonyConfig>> | null = null
  private _commands: Map<string, Command> = new Map()
  private _events: Map<string, Event> = new Map()
  private _cwd: string | null = null
  private _client: Client | null = null

  public get config() {
    return this._config
  }

  public get commands() {
    return this._commands
  }

  public get events() {
    return this._events
  }

  constructor() {}

  public static async create(opts: LoadHarmonyConfigOptions) {
    const harmony = new Harmony()

    await harmony._initConfig(opts)
    harmony._initCommands()
    harmony._initEvents()

    return harmony
  }

  private async _initConfig(opts: LoadHarmonyConfigOptions) {
    this._cwd = opts.cwd ?? '.'
    this._config = await loadHarmonyConfig(opts)
  }

  private _initCommands() {
    if (!this._config || !this._cwd) {
      throw new Error('Configuration not initialized')
    }
    const filesPath = getAllFiles(resolve(this._cwd, this._config.dir.commands))

    for (const path of filesPath) {
      const command = getCommand(resolve(this._cwd, path))

      this._commands.set(command.name, command)
    }
  }

  private _initEvents() {
    if (!this._config || !this._cwd) {
      throw new Error('Configuration not initialized')
    }
    const filesPath = getAllFiles(resolve(this._cwd, this._config.dir.events))

    for (const path of filesPath) {
      const event = getEvent(resolve(this._cwd, path))

      this._events.set(event.name, event)
    }
  }

  private _refreshSlashCommands() {
    if (!this._client) {
      return
    }

    for (const [, command] of this._commands) {
      if (!command.slash) {
        continue
      }

      this._client.application?.commands.create({
        name: command.name,
        description: command.description,
        options: command.arguments,
        nsfw: command.nsfw
      })
    }
  }

  public initClient() {
    this._client = new Client({
      intents: ['Guilds', 'GuildMessages', 'MessageContent']
    })

    this._refreshSlashCommands()

    for (const [, event] of this._events) {
      if (event.once) {
        this._client.once(event.name, event.callback)
      } else {
        this._client.on(event.name, event.callback)
      }
    }

    this._client.on('messageCreate', (message) => {
      if (!this._config || message.author.bot) {
        return
      }
      if (!message.content.startsWith(this._config.defaultPrefix)) {
        return
      }
      const [commandName] = message.content
        .slice(this._config.defaultPrefix.length)
        .split(' ')
      const command = this._commands.get(commandName)

      if (!command || command.slash) {
        return
      }
      command.execute(this._client!, message)
    })

    this._client.on('interactionCreate', (interaction) => {
      if (!this._config || !interaction.isChatInputCommand()) {
        return
      }
      const command = this._commands.get(interaction.commandName)

      if (!command || !command.slash) {
        return
      }
      command.execute(this._client!, interaction)
    })

    this._client.login(process.env.CLIENT_TOKEN)
  }
}
