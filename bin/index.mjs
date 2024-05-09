#!/usr/bin/env node

import { createHarmonix } from '../dist/index.mjs'
import 'dotenv/config'

const initHarmonix = async () => {
  await createHarmonix({ rootDir: './playground' }, { cwd: './playground' })
}

initHarmonix()
