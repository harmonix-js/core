import { globby } from 'globby'
import { join, relative } from 'pathe'
import { Harmonix } from './types'

const GLOB_SCAN_PATTERN = '**/*.{js,ts}'

export const scanCommands = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, 'commands')

  return files.map((f) => f.fullPath)
}

export const scanEvents = async (harmonix: Harmonix) => {
  const files = await Promise.all([
    scanFiles(harmonix, 'events'),
    scanFiles(harmonix, 'listeners')
  ]).then((r) => r.flat())

  return files.map((f) => f.fullPath)
}

export const scanContextMenus = async (harmonix: Harmonix) => {
  const files = await Promise.all([
    scanFiles(harmonix, 'context-menus'),
    scanFiles(harmonix, 'contextMenus')
  ]).then((r) => r.flat())

  return files.map((f) => f.fullPath)
}

export const scanPreconditions = async (harmonix: Harmonix) => {
  const files = await scanFiles(harmonix, 'preconditions')

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
