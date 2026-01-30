'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { type ImagePlaceholder } from '@/lib/placeholder-images';
import { VideoPlayer } from './video-player';
import { type Material, type User } from '@/lib/types';
import { useMaterialProgress } from '@/hooks/use-material-progress';
import { ProgressCircle } from './progress-circle';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { DeleteMaterialDialog } from './delete-material-dialog';


interface MaterialCardProps {
  material: Material;
  image?: ImagePlaceholder;
  userRole?: User['role'];
}

export function MaterialCard({ material, image, userRole }: MaterialCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { progress, updateProgress } = useMaterialProgress(material.id);

  const handleActionClick = () => {
    // For quizzes, alert and mark as complete.
    if (material.type === 'quiz') {
      alert("This quiz is not yet available.");
      if (progress < 100) {
        updateProgress(100);
      }
      return;
    }

    if (!material.url) {
      alert(`This ${material.type} is not yet available.`);
       if (progress < 100) {
        updateProgress(100);
      }
      return;
    }

    // Use built-in player for Google Drive videos, which handles its own progress.
    if (material.type === 'video' && material.url.includes('drive.google.com')) {
      setPlayerOpen(true);
    } else {
      // For all other materials (documents, external videos), mark as complete and open in a new tab.
      if (progress < 100) {
        updateProgress(100);
      }
      window.open(material.url, '_blank');
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer group"
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video" onClick={handleActionClick}>
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
             {userRole === 'admin' && (
                <div className="absolute top-2 left-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button asChild size="icon" variant="secondary" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/dashboard/materials/edit/${material.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {material.type === 'video' && material.url && (
        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setPlayerOpen(false)}
          title={material.title}
          gdriveLink={material.url}
          updateProgress={updateProgress}
        />
      )}
      <DeleteMaterialDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        materialId={material.id}
        materialTitle={material.title}
      />
    </>
  );
}
