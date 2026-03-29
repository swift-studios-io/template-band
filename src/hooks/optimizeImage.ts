import sharp from 'sharp'
import type { CollectionAfterChangeHook } from 'payload'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

const MAX_WIDTH = 2000
const JPEG_QUALITY = 80
const PNG_COMPRESSION = 9
const MIN_SIZE_BYTES = 500 * 1024

/**
 * After a media item is uploaded, optimize the image in R2:
 * - Resize to max 2000px wide (preserving aspect ratio)
 * - Compress JPEG to 80% quality, PNG with max compression
 * - Overwrite the original in R2
 * - Update the filesize in the database
 */
export const optimizeImage: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create') return doc

  const { filename, mimeType, filesize } = doc
  if (!filename || !mimeType) return doc

  const isImage = mimeType.startsWith('image/')
  const isOptimizable = ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)
  if (!isImage || !isOptimizable) return doc

  if (filesize && filesize < MIN_SIZE_BYTES) {
    req.payload.logger.info(`[optimizeImage] Skipping ${filename} (${Math.round(filesize / 1024)}KB — under threshold)`)
    return doc
  }

  // Skip if R2 is not configured
  if (!process.env.R2_ENDPOINT || !process.env.R2_BUCKET) return doc

  try {
    const s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })

    const bucket = process.env.R2_BUCKET!
    const key = `media/${filename}`

    const getResult = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    const originalBuffer = Buffer.from(await getResult.Body!.transformToByteArray())
    const originalSize = originalBuffer.length

    let pipeline = sharp(originalBuffer).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
    })

    if (mimeType === 'image/jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true })
    } else if (mimeType === 'image/png') {
      pipeline = pipeline.png({ compressionLevel: PNG_COMPRESSION })
    } else if (mimeType === 'image/webp') {
      pipeline = pipeline.webp({ quality: JPEG_QUALITY })
    }

    const optimizedBuffer = await pipeline.toBuffer()
    const newSize = optimizedBuffer.length

    if (newSize >= originalSize) {
      req.payload.logger.info(`[optimizeImage] Skipping ${filename} — optimization didn't reduce size (${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB)`)
      return doc
    }

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimizedBuffer,
      ContentType: mimeType,
    }))

    const metadata = await sharp(optimizedBuffer).metadata()

    await req.payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        filesize: newSize,
        ...(metadata.width && { width: metadata.width }),
        ...(metadata.height && { height: metadata.height }),
      },
      overrideAccess: true,
    })

    const savings = Math.round((1 - newSize / originalSize) * 100)
    req.payload.logger.info(
      `[optimizeImage] ${filename}: ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB (${savings}% saved)`
    )
  } catch (error) {
    req.payload.logger.error(`[optimizeImage] Failed to optimize ${filename}: ${String(error)}`)
  }

  return doc
}
