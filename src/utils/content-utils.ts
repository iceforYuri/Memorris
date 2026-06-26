import type { BlogPostData } from '@/types/config'
import { type CollectionEntry, getCollection } from 'astro:content'
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

async function getRawSortedPosts() {
  const allBlogPosts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })

  return allBlogPosts.sort((a, b) => {
    const dateA = new Date(a.data.published)
    const dateB = new Date(b.data.published)
    return dateA > dateB ? -1 : 1
  })
}

export async function getSortedPosts(): Promise<
  { body: string; data: BlogPostData; slug: string }[]
> {
  const sorted = await getRawSortedPosts()

  for (let i = 1; i < sorted.length; i++) {
    sorted[i].data.nextSlug = sorted[i - 1].slug
    sorted[i].data.nextTitle = sorted[i - 1].data.title
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].data.prevSlug = sorted[i + 1].slug
    sorted[i].data.prevTitle = sorted[i + 1].data.title
  }

  return sorted as unknown as { body: string; data: BlogPostData; slug: string }[]
}

export type PostForList = {
  slug: string
  data: CollectionEntry<'posts'>['data']
}

export async function getSortedPostsList(): Promise<PostForList[]> {
  const sorted = await getRawSortedPosts()
  return sorted.map((post) => ({
    slug: post.slug,
    data: post.data,
  }))
}

export type Tag = {
  name: string
  count: number
  urlSafeName: string
}

export async function getTagList(): Promise<Tag[]> {
  const allBlogPosts = await getCollection<'posts'>('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })

  const countMap: { [key: string]: number } = {}
  allBlogPosts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      if (!countMap[tag]) countMap[tag] = 0
      countMap[tag]++
    })
  })

  const keys = Object.keys(countMap).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  return keys.map((key) => ({
    name: key,
    count: countMap[key],
    urlSafeName: encodeURIComponent(key),
  }))
}

export type Category = {
  name: string
  count: number
  urlSafeName: string
}

export async function getCategoryList(): Promise<Category[]> {
  const allBlogPosts = await getCollection<'posts'>('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  const count: { [key: string]: number } = {}

  allBlogPosts.forEach((post) => {
    if (!post.data.category) {
      const ucKey = i18n(I18nKey.uncategorized)
      count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1
      return
    }

    const categoryName =
      typeof post.data.category === 'string'
        ? post.data.category.trim()
        : String(post.data.category).trim()

    count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1
  })

  const lst = Object.keys(count).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  return lst.map((category) => ({
    name: category,
    count: count[category],
    urlSafeName: encodeURIComponent(category),
  }))
}
