#!/usr/bin/env node

import { createDevHarmonix, createHarmonix } from '../dist/index.mjs'
import 'dotenv/config'

const initHarmonix = async () => {
  await createDevHarmonix({ rootDir: './playground' }, { cwd: './playground' })
}

initHarmonix()
