#!/usr/bin/env node
import * as process from 'node:process'
import sade from 'sade'
import * as vite from 'vite'
import { Mode, run } from '../core/index.js'

const p = sade('z4')

p
    .command('dev', 'Start the dev server', {
        default: true
    })
    .action(() => run(Mode.Development))

p
    .command('build', 'Build the application')
    .action(() => run(Mode.Production))

p.parse(process.argv)
