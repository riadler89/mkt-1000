import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const PATHS_FILE = join(__dirname, '../../test-data/paths.json')

const RAW_JSON_DATA = readFileSync(PATHS_FILE, 'utf-8')
const ALL_PATHS_DATA = JSON.parse(RAW_JSON_DATA)

/**
 * Returns a random PLP URL from the cached JSON data.
 * @returns A random PLP URL path string.
 */
export function getRandomPlpPath(): string {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * ALL_PATHS_DATA.length)
  return ALL_PATHS_DATA[randomIndex].plp
}

/**
 * Returns a random PDP URL from the cached JSON data.
 * @returns A random PDP URL path string.
 */
export function getRandomPdpPath(): string {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * ALL_PATHS_DATA.length)
  return ALL_PATHS_DATA[randomIndex].pdp
}
