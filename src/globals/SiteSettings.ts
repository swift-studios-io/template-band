import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'artistName',
      type: 'text',
      required: true,
      defaultValue: 'The Voltage',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'heroText',
      type: 'textarea',
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Artist/band biography displayed on the site',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
        { name: 'twitter', type: 'text', label: 'Twitter/X URL' },
        { name: 'spotify', type: 'text', label: 'Spotify URL' },
        { name: 'tiktok', type: 'text', label: 'TikTok URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
      ],
    },
    {
      name: 'streamingPlatforms',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon name or SVG string',
          },
        },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: {
        description: 'Public contact email displayed on the site',
      },
    },
    {
      name: 'newsletterEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Newsletter Signup',
    },
  ],
}
