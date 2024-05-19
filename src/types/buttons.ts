import type {
  ButtonInteraction,
  ButtonStyle,
  ComponentEmojiResolvable
} from 'discord.js'

type ButtonCallback = (interaction: ButtonInteraction) => void

export interface ButtonConfig {
  id?: string
  label: string
  style?: keyof typeof ButtonStyle
  emoji?: ComponentEmojiResolvable
  url?: string
  disabled?: boolean
}

export type DefineButton = (
  config: ButtonConfig,
  callback: ButtonCallback
) => HarmonixButton

export type HarmonixButtonInput = string | HarmonixButton

export interface HarmonixButton {
  config: ButtonConfig
  callback: ButtonCallback
}
