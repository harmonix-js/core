#!/usr/bin/env node

import { createHarmony } from '../dist/index.mjs'
import 'dotenv/config'

const initHarmony = async () => {
  await createHarmony({ rootDir: './playground' }, { cwd: './playground' })
}

initHarmony()
