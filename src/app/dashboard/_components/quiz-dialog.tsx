'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questions: GenerateQuizOutput['questions'];
  videoTitle: string;
}

export function QuizDialog({ isOpen, onClose, questions, videoTitle }: QuizDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [showResult, setShowResult] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  React.useEffect(() => {
    // Reset state when dialog is opened or questions change
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
    }
  }, [isOpen, questions]);

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };
  
  const handleFinish = () => {
      onClose();
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (questions.length === 0) {
      return (
          <Dialog open={isOpen} onOpenChange={onClose}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Quiz for {videoTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-center text-muted-foreground">
                      <p>Could not load the quiz for this video.</p>
                  </div>
                  <DialogFooter>
                      <Button onClick={onClose}>Close</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Quiz: {videoTitle}</DialogTitle>
          <DialogDescription>
            Question {currentQuestionIndex + 1} of {questions.length}
          </DialogDescription>
        </DialogHeader>

        {currentQuestionIndex < questions.length ? (
            <div className="space-y-6 py-4">
                <p className="font-semibold text-lg">{currentQuestion.question}</p>
                <RadioGroup
                    value={selectedAnswer ?? ''}
                    onValueChange={setSelectedAnswer}
                    disabled={showResult}
                >
                    {currentQuestion.options.map((option, index) => {
                        const isTheCorrectAnswer = option === currentQuestion.correctAnswer;
                        const isTheSelectedAnswer = option === selectedAnswer;
                        return (
                            <Label
                                key={index}
                                htmlFor={`option-${index}`}
                                className={cn(
                                    "flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-muted/50",
                                    showResult && isTheCorrectAnswer && "border-green-500 bg-green-500/10",
                                    showResult && isTheSelectedAnswer && !isTheCorrectAnswer && "border-red-500 bg-red-500/10"
                                )}
                            >
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <span>{option}</span>
                                {showResult && isTheCorrectAnswer && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />}
                                {showResult && isTheSelectedAnswer && !isTheCorrectAnswer && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                            </Label>
                        )
                    })}
                </RadioGroup>
            </div>
        ) : (
             <div className="py-8 text-center space-y-4">
                <h2 className="text-2xl font-bold">Quiz Complete!</h2>
                <p className="text-lg text-muted-foreground">You scored {score} out of {questions.length}.</p>
            </div>
        )}
        
        <DialogFooter>
            {currentQuestionIndex < questions.length ? (
                <>
                    {showResult ? (
                        isLastQuestion ? (
                            <Button onClick={handleNext}>Show Results</Button>
                        ) : (
                            <Button onClick={handleNext}>Next Question</Button>
                        )
                    ) : (
                        <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>Check Answer</Button>
                    )}
                </>
            ) : (
                <Button onClick={handleFinish}>Finish</Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
