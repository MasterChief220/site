import config from '@/theme.config'
import type { ResolvedTag } from '@/types'
import { getPosts } from '@/util/posts'
import { getProjects } from '@/util/projects'

export const sortTags = (t1: ResolvedTag, t2: ResolvedTag) =>
  t1.tag.localeCompare(t2.tag)

const normalize = (t?: string) => (t ?? '').trim().toLowerCase()

/** Normalize first, then dedupe */
export const resolveTags = (rawTags: string[] = []): ResolvedTag[] => {
  const normalized = rawTags
    .map(normalize)
    .filter(Boolean)

  const unique = Array.from(new Set(normalized))

  const resolved = unique.map((tag) => ({
    tag,
    icon: config.tagIcons[tag] || 'tabler--tag',
  }))

  return resolved.sort(sortTags)
}

export const generateTags = async (): Promise<ResolvedTag[]> => {
  const posts = await getPosts()
  const projects = await getProjects()

  const allTags = [...posts, ...projects]
    .flatMap((p) => p?.data?.tags ?? [])

  return resolveTags(allTags)
}

export const getTagUsage = async (tag: string): Promise<number> =>
  (await getPosts(tag)).length + (await getProjects(tag)).length
