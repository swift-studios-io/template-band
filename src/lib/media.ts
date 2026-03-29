import { getPayload } from 'payload'
import config from '@payload-config'

type PayloadMedia = {
  id: number
  alt: string
  url?: string | null
  filename?: string | null
  category?: string | null
}

export function getMediaUrl(media: PayloadMedia | { url?: string | null } | string | number | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'number') return ''
  return media.url || ''
}

export async function getMediaByCategory(category: string): Promise<PayloadMedia[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    where: { category: { equals: category } },
    limit: 200,
  })
  return result.docs as unknown as PayloadMedia[]
}

export async function getMediaByFilename(filename: string): Promise<PayloadMedia | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  return (result.docs[0] as unknown as PayloadMedia) || null
}
