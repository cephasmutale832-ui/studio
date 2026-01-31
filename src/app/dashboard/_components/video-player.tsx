
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, XCircle, LoaderCircle } from 'lucide-react';
import { QuizDialog } from './quiz-dialog';
import { generateQuiz } from './quiz-actions';
import { type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { useToast } from '@/hooks/use-toast';
import { type Material } from '@/lib/types';
import { useMaterialProgress } from '@/hooks/use-material-progress';


interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material;
}

export function VideoPlayer({ isOpen, onClose, material }: VideoPlayerProps) {
  const { progress, updateProgress } = useMaterialProgress(material.id);
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizTriggered, setIsQuizTriggered] = useState(false);
  const { toast } = useToast();

  const { title, description, url, referenceText, subject, topic } = material;

  const getFileId = (url: string): string | null => {
    if (!url) return null;
    const fileIdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const fileId = getFileId(url || '');
  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : '';
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : '#';

  // Effect to fetch quiz data
  useEffect(() => {
    if (isOpen) {
      setIsQuizLoading(true);
      setIsQuizTriggered(false);
      setQuiz(null); // Reset previous quiz

      generateQuiz({ title, description: description || '', referenceText, subject, topic })
        .then((generatedQuiz) => {
          if (generatedQuiz && generatedQuiz.questions.length > 0) {
            setQuiz(generatedQuiz);
          } else {
            setQuiz(null);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch quiz:', error);
          toast({
            title: 'Quiz Generation Failed',
            description: 'Could not generate a quiz for this video.',
            variant: 'destructive',
          });
          setQuiz(null);
        })
        .finally(() => {
          setIsQuizLoading(false);
        });
    }
  }, [isOpen, title, description, referenceText, subject, topic, toast]);

  // Effect for video progress simulation
  useEffect(() => {
    if (!isOpen || progress >= 100) {
      return;
    }

    const DURATION_IN_SECONDS = 15 * 60; // 15 mins
    const UPDATE_INTERVAL_IN_MS = 1000;
    const progressIncrement = 100 / DURATION_IN_SECONDS;

    const progressInterval = setInterval(() => {
      updateProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + progressIncrement;
      });
    }, UPDATE_INTERVAL_IN_MS);

    return () => clearInterval(progressInterval);
  }, [isOpen, progress, updateProgress]);

  // Effect to trigger quiz based on progress
  useEffect(() => {
    if (isOpen && progress >= 80 && !isQuizTriggered && quiz && quiz.questions.length > 0) {
      setIsQuizOpen(true);
      setIsQuizTriggered(true);
    }
  }, [progress, isOpen, isQuizTriggered, quiz]);
  
  // Effect to reset state when dialog is closed
  useEffect(() => {
      if (!isOpen) {
          setIsQuizOpen(false);
          setIsQuizTriggered(false);
          setQuiz(null);
      }
  }, [isOpen]);

  const handleQuizClose = () => {
      setIsQuizOpen(false);
      // Mark video as complete after quiz
      if (progress < 100) {
        updateProgress(100);
      }
  }

  return (
    <>
      <Dialog open={isOpen && !isQuizOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-auto p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Watch the video below. Your progress is being tracked automatically while this window is open.
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
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" disabled={!fileId}>
                <a href={downloadUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Video
                </a>
              </Button>
              {isQuizLoading && (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Preparing quiz...
                </span>
              )}
            </div>
            <Button onClick={onClose} variant="secondary">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {quiz && quiz.questions.length > 0 && (
        <QuizDialog 
          isOpen={isQuizOpen}
          onClose={handleQuizClose}
          questions={quiz.questions}
          videoTitle={title}
        />
      )}
    </>
  );
}
