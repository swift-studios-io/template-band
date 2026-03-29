import type { CollectionConfig } from 'payload'
import { isLoggedIn, publicRead } from '../access/roles'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: publicRead,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
    readVersions: isLoggedIn,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'order', '_status'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'youtubeUrl', type: 'text', label: 'YouTube URL' },
    { name: 'videoFile', type: 'upload', relationTo: 'media', label: 'Video File (if self-hosted)' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
