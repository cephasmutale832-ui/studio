
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Edit, Trash2, Lock } from 'lucide-react';
import { DeleteMaterialDialog } from './delete-material-dialog';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';


interface MaterialCardProps {
  material: Material;
  image?: ImagePlaceholder;
  userRole?: User['role'];
  isLocked?: boolean; // This is the trial lock
  previousMaterialId?: string; // For sequential locking
  isRegistered: boolean; // To apply sequential lock only for registered users
}

export function MaterialCard({ material, image, userRole, isLocked, previousMaterialId, isRegistered }: MaterialCardProps) {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { progress, updateProgress } = useMaterialProgress(material.id);
  const { progress: prevProgress } = useMaterialProgress(previousMaterialId || '');
  const { toast } = useToast();
  const router = useRouter();

  // A video is sequentially locked if the user is a registered student, it's a video,
  // it has a preceding video, and that video is not 100% complete.
  const isSequentiallyLocked = isRegistered && userRole === 'student' && material.type === 'video' && !!previousMaterialId && prevProgress < 100;

  const finalIsLocked = isLocked || isSequentiallyLocked;

  const handleActionClick = () => {
    if (finalIsLocked) {
      if (isSequentiallyLocked) {
        toast({
          title: 'Content Locked',
          description: 'Please complete the previous video to unlock this one.',
          variant: 'destructive',
        });
      } else { // This must be the trial lock
        toast({
          title: 'Content Locked',
          description: 'Please validate your payment to access all learning materials.',
          variant: 'destructive',
          action: <ToastAction altText="Validate Payment" onClick={() => router.push('/dashboard/payment')}>Validate Payment</ToastAction>
        });
      }
      return;
    }

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
        className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg group"
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video cursor-pointer" onClick={handleActionClick}>
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
            
            {finalIsLocked ? (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
                  <Lock className="h-10 w-10" />
                  <p className="font-semibold mt-2 text-sm">Locked</p>
              </div>
            ) : (
              <div className="absolute top-2 right-2 z-10">
                <ProgressCircle progress={progress} />
              </div>
            )}
            
             {userRole === 'admin' && (
                <div className="absolute top-2 left-2 z-20 flex gap-2">
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

      {!finalIsLocked && material.type === 'video' && material.url && (
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
