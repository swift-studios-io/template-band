import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: { req: { user: Record<string, unknown> | null } }) => {
  return user?.role === 'admin'
}

const isAdminOrSelf = ({ req: { user } }: { req: { user: Record<string, unknown> | null } }) => {
  if (user?.role === 'admin') return true
  return { id: { equals: user?.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: isAdmin,
      },
      admin: {
        description: 'Admins have full access. Editors can manage content but cannot access user management or site settings.',
      },
    },
  ],
}
