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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">写真一覧</h1>
        <Link href="/camera">
          <Button size="lg">
            <Camera className="mr-2 h-5 w-5" />
            写真を撮る
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">まだ写真がありません。新しい写真を撮影してください。</p>
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </div>
  );
}