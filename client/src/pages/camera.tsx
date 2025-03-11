import { useState } from 'react';
import { useLocation } from 'wouter';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { capturePhoto } from '@/lib/photos';
import { savePhoto } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function CameraPage() {
  const [capturing, setCapturing] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  async function handleCapture() {
    if (capturing) return;
    
    setCapturing(true);
    try {
      const imageData = await capturePhoto();
      await savePhoto(imageData);
      toast({
        title: "Photo captured",
        description: "Photo will be automatically deleted after 2 days"
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to capture photo:', error);
      toast({
        title: "Failed to capture photo",
        description: "Please check camera permissions and try again",
        variant: "destructive"
      });
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <X className="h-6 w-6 text-white" />
        </Button>
      </div>
      
      <video
        id="camera"
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button
          size="lg"
          className="rounded-full h-16 w-16"
          onClick={handleCapture}
          disabled={capturing}
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}
