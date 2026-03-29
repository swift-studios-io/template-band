import type { CollectionConfig } from 'payload'
import { isLoggedIn, publicRead } from '../access/roles'
import { optimizeImage } from '../hooks/optimizeImage'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: publicRead,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: {
    afterChange: [optimizeImage],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Albums', value: 'albums' },
        { label: 'Gallery', value: 'gallery' },
        { label: 'Hero', value: 'hero' },
        { label: 'Logos', value: 'logos' },
        { label: 'Members', value: 'members' },
        { label: 'Video Thumbs', value: 'video-thumbs' },
        { label: 'General', value: 'general' },
      ],
      defaultValue: 'general',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: true,
}
