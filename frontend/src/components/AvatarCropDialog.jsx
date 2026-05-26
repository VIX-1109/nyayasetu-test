"use client";

import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { blobToFile, getCroppedImageBlob } from '@/lib/cropImage';
import { ZoomIn } from 'lucide-react';
import { toast } from 'sonner';

const AvatarCropDialog = ({ open, imageSrc, onOpenChange, onConfirm, confirming = false }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = blobToFile(blob, 'avatar.jpg');
      await onConfirm(file);
    } catch (error) {
      toast.error(error.message || 'Could not crop image');
    }
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && !confirming) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 border-b border-slate-200 px-6 py-4 text-left">
          <DialogTitle className="serif text-xl text-[#0F172A]">Adjust profile photo</DialogTitle>
          <DialogDescription>
            Drag to reposition. Use the slider to zoom. Your photo will be saved as a square.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-72 w-full bg-slate-900 sm:h-80">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-[#B45309]"
              aria-label="Zoom"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 border-t border-slate-200 px-6 py-4 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={confirming}
            onClick={() => handleOpenChange(false)}
            className="h-10 rounded-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={confirming || !croppedAreaPixels}
            onClick={handleConfirm}
            className="h-10 rounded-sm bg-[#B45309] text-white hover:bg-[#B45309]/90"
          >
            {confirming ? 'Saving...' : 'Save photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarCropDialog;
