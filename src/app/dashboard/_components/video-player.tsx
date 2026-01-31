
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


interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string; // Add description
  gdriveLink: string;
  updateProgress: (newProgress: number | ((prevProgress: number) => number)) => void;
}

export function VideoPlayer({ isOpen, onClose, title, description, gdriveLink, updateProgress }: VideoPlayerProps) {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizTriggered, setIsQuizTriggered] = useState(false);

  const getFileId = (url: string): string | null => {
    if (!url) return null;
    const fileIdMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  };

  const fileId = getFileId(gdriveLink);
  const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : '';
  const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : '#';

  // Fetch quiz when video player opens
  useEffect(() => {
    if (isOpen && !quiz && !isQuizLoading) {
      const fetchQuiz = async () => {
        setIsQuizLoading(true);
        setIsQuizTriggered(false);
        const generatedQuiz = await generateQuiz({ title, description: description || '' });
        setQuiz(generatedQuiz);
        setIsQuizLoading(false);
      };
      fetchQuiz();
    }
    if (!isOpen) {
      // Reset on close
      setQuiz(null);
      setIsQuizOpen(false);
      setIsQuizTriggered(false);
    }
  }, [isOpen, title, description, quiz, isQuizLoading]);


  useEffect(() => {
    if (!isOpen) return;

    // Simulate video playback progress.
    const DURATION_IN_SECONDS = 15 * 60;
    const UPDATE_INTERVAL_IN_MS = 1000;
    const progressIncrement = 100 / DURATION_IN_SECONDS;

    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      updateProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        currentProgress = prevProgress + progressIncrement;

        // Trigger quiz at 80%
        if (currentProgress >= 80 && !isQuizTriggered && quiz && quiz.questions.length > 0) {
            setIsQuizOpen(true);
            setIsQuizTriggered(true); // Ensure it only triggers once
        }
        
        return currentProgress;
      });
    }, UPDATE_INTERVAL_IN_MS);

    // Cleanup on close
    return () => {
      clearInterval(progressInterval);
    };
  }, [isOpen, updateProgress, isQuizTriggered, quiz]);

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
          onClose={() => setIsQuizOpen(false)}
          questions={quiz.questions}
          videoTitle={title}
        />
      )}
    </>
  );
}
