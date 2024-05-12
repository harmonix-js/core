import {
  ModalBuilder,
  TextInputBuilder,
  ModalActionRowComponentBuilder,
  ActionRowBuilder
} from 'discord.js'
import type { ModalOptions } from './types/modals'

export const defineModal = (options: ModalOptions): ModalBuilder => {
  const builder = new ModalBuilder()
    .setCustomId(options.id)
    .setTitle(options.title)

  if (options.textInputs) {
    for (const input of options.textInputs) {
      const inputBuilder = new TextInputBuilder()
        .setCustomId(input.id)
        .setLabel(input.label)
        .setStyle(input.style)

      if (input.maxLength) {
        inputBuilder.setMaxLength(input.maxLength)
      }
      if (input.minLength) {
        inputBuilder.setMinLength(input.minLength)
      }
      if (input.placeholder) {
        inputBuilder.setPlaceholder(input.placeholder)
      }
      if (input.value) {
        inputBuilder.setValue(input.value)
      }
      if (input.required) {
        inputBuilder.setRequired(input.required)
      }
      const row =
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
          inputBuilder
        )

      builder.addComponents(row)
    }
  }

  return builder
}
