
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
import { FileText, Video, ClipboardCheck } from "lucide-react";
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
    if (material.type === 'video') {
      if (material.url) {
        setPlayerOpen(true);
      } else {
        alert("This video is not yet available.");
      }
    } else if (material.type === 'document' || material.type === 'past-paper') {
      if (material.url) {
        // Since file storage isn't implemented, we'll show an alert for this mock.
        alert(`In a real application, this would open the document: ${material.url}`);
      } else {
        alert("This document is not yet available.");
      }
    } else if (material.type === 'quiz') {
      alert("This quiz is not yet available.");
    }
  };

  const getIcon = () => {
    switch (material.type) {
      case 'video':
        return <Video className="mr-1 h-3 w-3" />;
      case 'document':
      case 'past-paper':
        return <FileText className="mr-1 h-3 w-3" />;
      case 'quiz':
        return <ClipboardCheck className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (material.type) {
      case 'video':
        return 'Watch Now';
      case 'document':
        return 'Read Document';
      case 'past-paper':
        return 'View Paper';
      case 'quiz':
        return 'Start Quiz';
      default:
        return 'View';
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
              {getIcon()}
              {material.type === 'past-paper' ? 'Past Paper' : material.type.charAt(0).toUpperCase() + material.type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline">{material.title}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button className="w-full border-accent text-accent" variant="outline" onClick={handleActionClick}>
            {getButtonText()}
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
