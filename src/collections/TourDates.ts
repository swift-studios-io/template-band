import type { CollectionConfig } from 'payload'
import { isLoggedIn, publicRead } from '../access/roles'

export const TourDates: CollectionConfig = {
  slug: 'tour-dates',
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
    useAsTitle: 'venue',
    defaultColumns: ['date', 'venue', 'city', '_status'],
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Select the date of the show. Time is set in the Show Time field below.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) {
              const d = new Date(value)
              d.setUTCHours(12, 0, 0, 0)
              return d.toISOString()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'showTime',
      type: 'text',
      admin: {
        description: 'e.g. "3pm - 6pm" or "Doors 7pm, Show 8pm"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'ticketLink',
      type: 'text',
    },
    {
      name: 'linkType',
      type: 'select',
      defaultValue: 'more-info',
      options: [
        { label: 'More Info', value: 'more-info' },
        { label: 'Tickets', value: 'tickets' },
      ],
      admin: {
        description: 'Button text: "Tickets" for paid events, "More Info" for free/public events',
      },
    },
  ],
}
