import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { type Photo } from "@shared/schema";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface PhotoViewerProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onDelete?: (photoId: string) => void;
}

export function PhotoViewer({ photo, photos, onClose, onDelete }: PhotoViewerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const y = useMotionValue(0);
  const scale = useTransform(y, [0, 200], [1, 0.9]);
  const opacity = useTransform(y, [0, 100, 200], [1, 1, 0]);
  const backgroundColor = useTransform(
    y,
    [0, 200],
    ["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0)"]
  );

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

  const handleDragEnd = useCallback(
    (event: any, info: { offset: { y: number }; velocity: { y: number } }) => {
      const shouldClose =
        info.offset.y > 100 || (info.velocity.y > 50 && info.offset.y > 50);
      if (shouldClose) {
        onClose();
      } else {
        y.set(0);
      }
    },
    [y, onClose]
  );

  const handleDelete = useCallback(() => {
    if (!photo || !onDelete) return;

    onDelete(photo.id);
    setShowDeleteDialog(false);
    toast({
      title: "写真を削除しました",
    });
    onClose();
  }, [photo, onDelete, onClose, toast]);

  if (!photo || !photos.length) return null;

  return (
    <>
      <Dialog open={!!photo} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ scale, opacity }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={handleDragEnd}
              dragElastic={0.4}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            >
              <div className="relative overflow-hidden h-full" ref={emblaRef}>
                <div className="flex touch-pan-x h-full">
                  {photos.map((p) => (
                    <div key={p.id} className="flex-[0_0_100%] min-w-0 h-full">
                      <div className="relative group h-full flex items-center justify-center">
                        <img
                          src={p.imageData}
                          alt={format(p.createdAt, "yyyy-MM-dd HH:mm")}
                          className="max-h-full max-w-full object-contain"
                          draggable={false}
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

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>写真を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除する
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}