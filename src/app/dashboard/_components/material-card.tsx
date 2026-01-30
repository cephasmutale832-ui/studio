'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { VideoPlayer } from './video-player';
import { type Material } from '@/lib/types';
import { useMaterialProgress } from '@/hooks/use-material-progress';
import { ProgressCircle } from './progress-circle';

interface MaterialCardProps {
  material: Material;
  image?: ImagePlaceholder;
}

export function MaterialCard({ material, image }: MaterialCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const { progress, updateProgress } = useMaterialProgress(material.id);

  const handleActionClick = () => {
    // Mark as complete on interaction.
    // In a real app, this would be more sophisticated, e.g., based on video watch time.
    if (progress < 100) {
        updateProgress(100);
    }

    if (material.type === 'quiz') {
      alert("This quiz is not yet available.");
      return;
    }

    if (!material.url) {
      alert(`This ${material.type} is not yet available.`);
      return;
    }

    // Use built-in player for Google Drive videos, otherwise open in new tab.
    if (material.type === 'video' && material.url.includes('drive.google.com')) {
      setPlayerOpen(true);
    } else {
      window.open(material.url, '_blank');
    }
  };

  return (
    <>
      <Card 
        onClick={handleActionClick}
        className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video">
            {image && (
                <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 right-2 z-10">
              <ProgressCircle progress={progress} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {material.type === 'video' && material.url && (
        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setPlayerOpen(false)}
          title={material.title}
          gdriveLink={material.url}
        />
      )}
    </>
  );
}
