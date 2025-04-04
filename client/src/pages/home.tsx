import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllPhotos } from '@/lib/db';
import { PhotoGrid } from '@/components/photo-grid';
import { type Photo } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const photos = await getAllPhotos();
      setPhotos(photos.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      ));
    } catch (error) {
      console.error('Failed to load photos:', error);
      toast({
        title: "写真の読み込みに失敗しました",
        description: "ページを再読み込みしてください",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handlePhotoDeleted = () => {
    loadPhotos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
            写真一覧
          </h1>
          <Link href="/camera">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Camera className="mr-2 h-5 w-5" />
              写真を撮る
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600 mb-2">
              まだ写真がありません
            </p>
            <p className="text-gray-500">
              新しい写真を撮影してください
            </p>
          </div>
        ) : (
          <PhotoGrid photos={photos} onPhotoDeleted={handlePhotoDeleted} />
        )}
      </div>
    </div>
  );
}