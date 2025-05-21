import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, BUCKET_NAME } from './r2';

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/**
 * Upload a file to Cloudflare R2
 * @param file The file to upload
 * @param path The path to store the file at (e.g., 'blog/images/')
 * @returns The URL of the uploaded file
 */
export async function uploadToR2(file: File, path: string = 'blog/images/'): Promise<string> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${path}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // Return the URL
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`;
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw error;
  }
}

/**
 * Generate a presigned URL for uploading a file directly to R2
 * @param filename The filename to use
 * @param contentType The content type of the file
 * @param path The path to store the file at (e.g., 'blog/images/')
 * @returns The presigned URL and the final URL of the file
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  path: string = 'blog/images/'
): Promise<{ uploadUrl: string; fileUrl: string }> {
  try {
    // Validate content type
    if (!ALLOWED_FILE_TYPES.includes(contentType)) {
      throw new Error(`File type ${contentType} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }

    // Generate a unique filename
    const fileExtension = filename.split('.').pop();
    const uniqueFilename = `${path}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Create the command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    // Generate the presigned URL
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });

    // Return both the upload URL and the final URL
    return {
      uploadUrl,
      fileUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

/**
 * Get a presigned URL for downloading a file from R2
 * @param key The key of the file in R2
 * @returns The presigned URL
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw error;
  }
}

/**
 * Delete a file from R2
 * @param key The key of the file in R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    throw error;
  }
}

/**
 * List files in a directory in R2
 * @param prefix The prefix to list files under (e.g., 'blog/images/')
 * @returns Array of file keys
 */
export async function listFilesInR2(prefix: string = 'blog/images/'): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await r2Client.send(command);
    return (response.Contents || []).map(item => item.Key || '');
  } catch (error) {
    console.error('Error listing files in R2:', error);
    throw error;
  }
}
