import type { TextInputStyle } from 'discord.js'

interface TextInput {
  id: string
  label: string
  style: TextInputStyle
  maxLength?: number
  minLength?: number
  placeholder?: string
  value?: string
  required?: boolean
}

export interface ModalOptions {
  id: string
  title: string
  textInputs?: TextInput[]
}
