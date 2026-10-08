import { cp, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const webDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectDir = resolve(webDir, '..')
const publicDir = resolve(webDir, 'public')

await mkdir(resolve(publicDir, 'data'), { recursive: true })
await mkdir(resolve(publicDir, 'images'), { recursive: true })

await cp(resolve(projectDir, 'images'), resolve(publicDir, 'images'), { recursive: true })
await writeFile(resolve(publicDir, '.asset-copy-stamp'), new Date().toISOString())
