import type { CollectionConfig } from 'payload'
import { isAdmin, publicRead } from '../access/roles'

export const Members: CollectionConfig = {
  slug: 'members',
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    readVersions: isAdmin,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order', '_status'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full legal name',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Name shown on site (if different from name)',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Vocals, Guitar, Bass, Drums',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower = first)',
      },
    },
  ],
}
