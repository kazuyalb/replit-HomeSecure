export async function capturePhoto(): Promise<string> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  
  const video = document.createElement('video');
  video.srcObject = stream;
  await new Promise(resolve => video.onloadedmetadata = resolve);
  video.play();

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(video, 0, 0);
  
  stream.getTracks().forEach(track => track.stop());
  
  return canvas.toDataURL('image/jpeg');
}
