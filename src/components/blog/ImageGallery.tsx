import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteFromR2 } from '@/lib/r2-utils';
import Image from 'next/image';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    key: string;
    name?: string;
  }>;
  onImageDeleted: (key: string) => void;
  onImageSelected?: (url: string) => void;
  selectable?: boolean;
}

const ImageGallery: FC<ImageGalleryProps> = ({ 
  images, 
  onImageDeleted, 
  onImageSelected,
  selectable = false
}) => {
  const t = useTranslations('admin');
  
  const handleDelete = async (key: string) => {
    try {
      await deleteFromR2(key);
      onImageDeleted(key);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };
  
  const handleSelect = (url: string) => {
    if (selectable && onImageSelected) {
      onImageSelected(url);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
        <CardDescription>Manage your uploaded images</CardDescription>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.key} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-md border">
                  <Image
                    src={image.url}
                    alt={image.name || 'Image'}
                    fill
                    className={`object-cover transition-all duration-300 ${selectable ? 'cursor-pointer hover:opacity-90' : ''}`}
                    onClick={() => handleSelect(image.url)}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-50 p-2 rounded-md">
                    {selectable && onImageSelected && (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="mr-2"
                        onClick={() => handleSelect(image.url)}
                      >
                        Select
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(image.key)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {image.name && (
                  <p className="text-xs truncate mt-1">{image.name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGallery;
