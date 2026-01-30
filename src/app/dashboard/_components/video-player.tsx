
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, XCircle } from 'lucide-react';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  gdriveLink: string;
}

export function VideoPlayer({ isOpen, onClose, title, gdriveLink }: VideoPlayerProps) {

  const getFileId = (url: string): string | null => {
    if (!url) return null;
    const fileIdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const fileId = getFileId(gdriveLink);
  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : '';
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : '#';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Watch the video below. You can also download it for offline viewing.
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full">
            {embedUrl ? (
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    allow="autoplay; fullscreen"
                    className="border-0"
                ></iframe>
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-muted rounded-md text-destructive">
                    <XCircle className="w-16 h-16 mb-4" />
                    <p className="text-lg font-semibold">Invalid Video Link</p>
                    <p className="text-sm">Could not load video from the provided link.</p>
                </div>
            )}
        </div>
        <DialogFooter className="p-6 pt-2 sm:justify-between">
          <Button asChild variant="outline" disabled={!fileId}>
            <a href={downloadUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </a>
          </Button>
          <Button onClick={onClose} variant="secondary">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
