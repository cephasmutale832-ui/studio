
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

interface MaterialCardProps {
  material: Material;
  image?: ImagePlaceholder;
}

export function MaterialCard({ material, image }: MaterialCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  const handleActionClick = () => {
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
