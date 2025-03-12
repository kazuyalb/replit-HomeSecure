import { useState } from 'react';
import { format } from 'date-fns';
import { type Photo } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { PhotoViewer } from './photo-viewer';
import { deletePhoto } from '@/lib/db';

interface DateGroupProps {
  date: Date;
  photos: Photo[];
  onPhotoDeleted?: () => void;
}

export function DateGroup({ date, photos, onPhotoDeleted }: DateGroupProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      onPhotoDeleted?.();
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  return (
    <div className="animate-in fade-in-50">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
        {format(date, 'yyyy年MM月dd日')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <Card 
            key={photo.id} 
            className="overflow-hidden group hover:scale-105 transition-transform duration-200 cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-square">
              <img
                src={photo.imageData}
                alt={format(photo.createdAt, 'HH:mm')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-sm font-medium">
                    {format(photo.createdAt, 'HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedPhoto && (
        <PhotoViewer 
          photo={selectedPhoto}
          photos={photos}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}