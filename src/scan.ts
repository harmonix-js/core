import { globby } from 'globby'
import { join, relative } from 'pathe'
import { Harmony } from './harmony'

const GLOB_SCAN_PATTERN = '**/*.{js,ts}'

export const scanCommands = async (harmony: Harmony) => {
  const files = await scanFiles(harmony, 'commands')

  return files.map((f) => f.fullPath)
}

export const scanEvents = async (harmony: Harmony) => {
  const files = await scanFiles(harmony, 'events')

  return files.map((f) => f.fullPath)
}

const scanFiles = async (harmony: Harmony, name: string) => {
  const files = await Promise.all(
    harmony.options.scanDirs!.map((dir) => scanDir(harmony, dir, name))
  ).then((r) => r.flat())

  return files
}

const scanDir = async (harmony: Harmony, dir: string, name: string) => {
  const fileNames = await globby(join(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: harmony.options.ignore,
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
