import { format } from 'date-fns';
import { type Photo } from '@shared/schema';
import { Card } from '@/components/ui/card';

interface DateGroupProps {
  date: Date;
  photos: Photo[];
}

export function DateGroup({ date, photos }: DateGroupProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {format(date, 'MMMM d, yyyy')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map(photo => (
          <Card key={photo.id} className="overflow-hidden">
            <img
              src={photo.imageData}
              alt={format(photo.createdAt, 'HH:mm')}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-sm text-gray-600">
              {format(photo.createdAt, 'HH:mm')}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
