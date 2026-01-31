
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


interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material;
  updateProgress: (newProgress: number | ((prevProgress: number) => number)) => void;
}

export function VideoPlayer({ isOpen, onClose, material, updateProgress }: VideoPlayerProps) {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizTriggered, setIsQuizTriggered] = useState(false);
  const { toast } = useToast();

  const { title, description, url, referenceText } = material;

  const getFileId = (url: string): string | null => {
    if (!url) return null;
    const fileIdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const fileId = getFileId(url || '');
  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : '';
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : '#';

  // Fetch quiz when video player opens
  useEffect(() => {
    if (isOpen && !quiz && !isQuizLoading) {
      const fetchQuiz = async () => {
        setIsQuizLoading(true);
        setIsQuizTriggered(false);
        try {
            const generatedQuiz = await generateQuiz({ title, description: description || '', referenceText });
            if (generatedQuiz && generatedQuiz.questions.length > 0) {
                setQuiz(generatedQuiz);
            } else {
                console.log("Quiz generation resulted in 0 questions. The quiz will not be shown.");
                setQuiz(null);
            }
        } catch (error) {
            console.error('Failed to fetch quiz:', error);
            toast({
                title: 'Quiz Generation Failed',
                description: 'Could not generate a quiz for this video. Please try again later.',
                variant: 'destructive',
            });
            setQuiz(null);
        } finally {
            setIsQuizLoading(false);
        }
      };
      fetchQuiz();
    }
    
    if (!isOpen) {
      // Reset on close
      setQuiz(null);
      setIsQuizOpen(false);
      setIsQuizTriggered(false);
    }
  }, [isOpen, title, description, referenceText, quiz, isQuizLoading, toast]);


  useEffect(() => {
    if (!isOpen) return;

    // Simulate video playback progress.
    const DURATION_IN_SECONDS = 15 * 60; // 15 mins simulation
    const UPDATE_INTERVAL_IN_MS = 1000;
    const progressIncrement = 100 / DURATION_IN_SECONDS;

    let progressInterval: NodeJS.Timeout | null = null;
    
    const startProgressSimulation = () => {
      progressInterval = setInterval(() => {
        let shouldStop = false;
        updateProgress(prevProgress => {
          if (prevProgress >= 100) {
            shouldStop = true;
            return 100;
          }
          const currentProgress = prevProgress + progressIncrement;

          // Trigger quiz at 80%
          if (currentProgress >= 80 && !isQuizTriggered && quiz && quiz.questions.length > 0) {
              setIsQuizOpen(true);
              setIsQuizTriggered(true); // Ensure it only triggers once
          }
          
          return currentProgress;
        });

        if (shouldStop && progressInterval) {
            clearInterval(progressInterval);
        }

      }, UPDATE_INTERVAL_IN_MS);
    }
    
    startProgressSimulation();

    // Cleanup on close
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isOpen, updateProgress, isQuizTriggered, quiz]);
  
  const handleQuizClose = () => {
      setIsQuizOpen(false);
      // Optional: uncomment to mark video as complete after quiz
      // updateProgress(100);
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
      
      {quiz && (
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
