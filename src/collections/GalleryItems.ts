import type { CollectionConfig } from 'payload'
import { isLoggedIn, publicRead } from '../access/roles'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
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
    defaultColumns: ['title', 'type', 'order', '_status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.type === 'image',
        description: 'Upload image (for image type only)',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'video',
        description: 'YouTube/Vimeo embed URL (for video type only)',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
