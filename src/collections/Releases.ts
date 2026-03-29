import type { CollectionConfig } from 'payload'
import { isLoggedIn, publicRead } from '../access/roles'

export const Releases: CollectionConfig = {
  slug: 'releases',
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
    defaultColumns: ['title', 'type', '_status'],
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
        { label: 'Single', value: 'single' },
        { label: 'Album', value: 'album' },
        { label: 'EP', value: 'ep' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'streamingLinks',
      type: 'group',
      fields: [
        {
          name: 'spotify',
          type: 'text',
          label: 'Spotify URL',
        },
        {
          name: 'appleMusic',
          type: 'text',
          label: 'Apple Music URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
        },
        {
          name: 'amazonMusic',
          type: 'text',
          label: 'Amazon Music URL',
        },
      ],
    },
  ],
}
