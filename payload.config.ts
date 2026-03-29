import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { TourDates } from './src/collections/TourDates'
import { Releases } from './src/collections/Releases'
import { NewsPosts } from './src/collections/NewsPosts'
import { Members } from './src/collections/Members'
import { GalleryItems } from './src/collections/GalleryItems'
import { Videos } from './src/collections/Videos'
import { FormSubmissions } from './src/collections/FormSubmissions'
import { Media } from './src/collections/Media'
import { Users } from './src/collections/Users'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, TourDates, Releases, NewsPosts, Members, GalleryItems, Videos, FormSubmissions],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: process.env.POSTGRES_URL
    ? postgresAdapter({
        pool: {
          connectionString: process.env.POSTGRES_URL,
        },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || 'file:./payload.db',
        },
      }),
  plugins: [
    ...(process.env.R2_BUCKET
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
                disablePayloadAccessControl: true,
                generateFileURL: ({ filename, prefix }) => {
                  const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''
                  const filePath = prefix ? `${prefix}/${filename}` : filename
                  return `${R2_PUBLIC_URL}/${filePath}`
                },
              },
            },
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
              },
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT || '',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
  sharp,
})
