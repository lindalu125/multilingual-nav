import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadToR2, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/r2-utils';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
  label?: string;
  description?: string;
}

const ImageUploader: FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  defaultImage = '', 
  label = 'Image',
  description = 'Upload an image for your blog post'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(defaultImage);
  const [progress, setProgress] = useState(0);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setError(null);
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      }
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate progress (since direct upload doesn't provide progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload to R2
      const imageUrl = await uploadToR2(file);
      
      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call the callback with the uploaded image URL
      onImageUploaded(imageUrl);
      
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
      setPreview('');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Select Image</Label>
            <Input 
              id="image" 
              type="file" 
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Allowed file types: {ALLOWED_FILE_TYPES.map(type => type.replace('image/', '')).join(', ')}. 
              Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </p>
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
              <p className="text-xs text-center mt-1">Uploading: {progress}%</p>
            </div>
          )}
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
          
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="relative w-full h-48 border rounded-md overflow-hidden">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill 
                  style={{ objectFit: 'contain' }} 
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
