import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { type Photo } from "@shared/schema";

interface PhotoViewerProps {
  photo: Photo | null;
  onClose: () => void;
}

export function PhotoViewer({ photo, onClose }: PhotoViewerProps) {
  if (!photo) return null;

  return (
    <Dialog open={!!photo} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-none">
        <div className="relative group cursor-pointer" onClick={onClose}>
          <img
            src={photo.imageData}
            alt={format(photo.createdAt, "yyyy-MM-dd HH:mm")}
            className="w-full h-full object-contain rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm">
              {format(photo.createdAt, "yyyy年MM月dd日 HH:mm")}
            </p>
            <p className="text-xs opacity-75">
              削除予定: {format(photo.expiresAt, "yyyy年MM月dd日 HH:mm")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
