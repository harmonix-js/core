import type { ModalSubmitInteraction, TextInputStyle } from 'discord.js'

type ModalCallback = (interaction: ModalSubmitInteraction) => void

interface TextInput {
  id: string
  label: string
  style: keyof typeof TextInputStyle
  maxLength?: number
  minLength?: number
  placeholder?: string
  value?: string
  required?: boolean
}

export interface ModalConfig {
  id?: string
  title: string
  textInputs?: TextInput[]
}

export type DefineModal = (
  config: ModalConfig,
  callback: ModalCallback
) => HarmonixModal

export type HarmonixModalInput = string | HarmonixModal

export interface HarmonixModal {
  config: ModalConfig
  callback: ModalCallback
}
