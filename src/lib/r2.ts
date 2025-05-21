import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 is S3-compatible, so we can use the AWS S3 SDK
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

export const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'multilingual-nav';
