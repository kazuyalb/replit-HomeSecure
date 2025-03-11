import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { capturePhoto } from '@/lib/photos';
import { savePhoto } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function CameraPage() {
  const [capturing, setCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Failed to access camera:', error);
        toast({
          title: "カメラへのアクセスに失敗しました",
          description: "カメラの使用許可を確認してください",
          variant: "destructive"
        });
        navigate('/');
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate, toast]);

  async function handleCapture() {
    if (capturing || !stream) return;

    setCapturing(true);
    try {
      const imageData = await capturePhoto();
      await savePhoto(imageData);
      toast({
        title: "写真を保存しました",
        description: "続けて撮影できます。2日後に自動的に削除されます"
      });
    } catch (error) {
      console.error('Failed to capture photo:', error);
      toast({
        title: "写真の撮影に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive"
      });
    } finally {
      setCapturing(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            navigate('/');
          }}
        >
          <X className="h-6 w-6 text-white" />
        </Button>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button
          size="lg"
          className="rounded-full h-16 w-16"
          onClick={handleCapture}
          disabled={capturing || !stream}
        >
          <Camera className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
}