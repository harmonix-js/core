import { globby } from 'globby'
import { join, relative } from 'pathe'
import type { Harmonix } from './types'

const GLOB_SCAN_PATTERN = '**/*.{js,ts}'

export const scanEvents = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.events)

  return files.map((f) => f.fullPath)
}

export const scanCommands = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.commands)

  return files.map((f) => f.fullPath)
}

export const scanContextMenus = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.contextMenus)

  return files.map((f) => f.fullPath)
}

export const scanButtons = async (harmonix: Harmonix) => {
  const buttonsDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.buttons
  )
  const files = await scanFiles(harmonix, buttonsDir)

  return files.map((f) => f.fullPath)
}

export const scanModals = async (harmonix: Harmonix) => {
  const modalsDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.modals
  )
  const files = await scanFiles(harmonix, modalsDir)

  return files.map((f) => f.fullPath)
}

export const scanSelectMenus = async (harmonix: Harmonix) => {
  const selectMenusDir = join(
    harmonix.options.dirs.components.dir,
    harmonix.options.dirs.components.selectMenus
  )
  const files = await scanFiles(harmonix, selectMenusDir)

  return files.map((f) => f.fullPath)
}

export const scanPreconditions = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, harmonix.options.dirs.preconditions)

  return files.map((f) => f.fullPath)
}

const scanFiles = async (harmonix: Harmonix, name: string) => {
  const files = await Promise.all(
    harmonix.options.scanDirs!.map((dir) => scanDir(harmonix, dir, name))
  ).then((r) => r.flat())

  return files
}

const scanDir = async (harmonix: Harmonix, dir: string, name: string) => {
  const fileNames = await globby(join(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: harmonix.options.ignore,
    absolute: true
  })

  return fileNames
    .map((fullPath) => {
      return {
        fullPath,
        path: relative(join(dir, name), fullPath)
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}
