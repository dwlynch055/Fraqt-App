import { members } from './members'
import { passes } from './passes'
import { analytics } from './analytics'

export const api = {
  members,
  passes,
  analytics
} as const

export type Api = typeof api