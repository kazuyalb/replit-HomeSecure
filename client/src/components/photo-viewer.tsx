import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { type Photo } from "@shared/schema";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoViewerProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
}

export function PhotoViewer({ photo, photos, onClose }: PhotoViewerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (photo && photos) {
      const index = photos.findIndex(p => p.id === photo.id);
      setSelectedIndex(index);
      emblaApi?.scrollTo(index);
    }
  }, [photo, photos, emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!photo || !photos.length) return null;

  return (
    <Dialog open={!!photo} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {photos.map((p) => (
              <div key={p.id} className="flex-[0_0_100%] min-w-0">
                <div className="relative group cursor-pointer h-[90vh]">
                  <img
                    src={p.imageData}
                    alt={format(p.createdAt, "yyyy-MM-dd HH:mm")}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm">
                      {format(p.createdAt, "yyyy年MM月dd日 HH:mm")}
                    </p>
                    <p className="text-xs opacity-75">
                      削除予定: {format(p.expiresAt, "yyyy年MM月dd日 HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={scrollNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}