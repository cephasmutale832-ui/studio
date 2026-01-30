
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Video } from "lucide-react";
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { VideoPlayer } from './video-player';

interface Material {
  id: string;
  title: string;
  type: 'video' | 'document';
  imageId: string;
  url?: string;
}

interface MaterialCardProps {
  material: Material;
  image?: ImagePlaceholder;
}

export function MaterialCard({ material, image }: MaterialCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);

  const handleActionClick = () => {
    if (material.type === 'video' && material.url) {
      setPlayerOpen(true);
    } else if (material.type === 'document' && material.url) {
      window.open(material.url, '_blank');
    } else if (material.type === 'document') {
      // Placeholder for documents without a URL
      alert("This document is not yet available.");
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
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
            <Badge variant="secondary" className="absolute top-3 right-3">
              {material.type === 'video' ? <Video className="mr-1 h-3 w-3" /> : <FileText className="mr-1 h-3 w-3" />}
              {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline">{material.title}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full" variant="outline" style={{color: 'hsl(var(--accent))', borderColor: 'hsl(var(--accent))'}} onClick={handleActionClick} disabled={!material.url}>
            {material.type === 'video' ? 'Watch Now' : 'Read Document'}
          </Button>
        </CardFooter>
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
