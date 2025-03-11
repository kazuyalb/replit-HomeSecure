import { useMemo } from 'react';
import { format } from 'date-fns';
import { type Photo } from '@shared/schema';
import { DateGroup } from './date-group';

interface PhotoGridProps {
  photos: Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  const groupedPhotos = useMemo(() => {
    const groups = new Map<string, Photo[]>();
    
    photos.forEach(photo => {
      const date = format(photo.createdAt, 'yyyy-MM-dd');
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(photo);
    });
    
    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, photos]) => ({
        date: new Date(date),
        photos: photos.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        )
      }));
  }, [photos]);

  return (
    <div className="space-y-8">
      {groupedPhotos.map(group => (
        <DateGroup
          key={group.date.toISOString()}
          date={group.date}
          photos={group.photos}
        />
      ))}
    </div>
  );
}
