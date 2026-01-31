
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

import { uploadMaterialAction } from '../actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { physicsTopics } from '@/lib/topics';
import { biologyTopics } from '@/lib/biology-topics';
import { type Material } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        'Upload Material'
      )}
    </Button>
  );
}

export default function UploadForm({ subjects }: { subjects: string[] }) {
  const [state, formAction] = useActionState(uploadMaterialAction, { success: null, message: '', errors: {} });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [materialType, setMaterialType] = useState<Material['type']>('video');
  const [subject, setSubject] = useState('');
  
  useEffect(() => {
    if (state.success === true) {
      toast({
        title: 'Upload Successful!',
        description: state.message,
      });
      formRef.current?.reset();
      setMaterialType('video');
      setSubject('');
    } else if (state.success === false && state.message) {
      toast({
        title: 'Upload Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const getSubjectLabel = (subject: string) => {
    if (subject === 'SCIENCE P1') return 'PHYSICS (SCIENCE P1)';
    if (subject === 'SCIENCE P2') return 'CHEMISTRY (SCIENCE P2)';
    return subject;
  }

  return (
      <Card>
        <form action={formAction} ref={formRef}>
          <CardHeader>
            <CardTitle>Material Details</CardTitle>
            <CardDescription>
              Fill in the information below to add a new learning resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Introduction to Calculus" required />
                    {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Subject / Section</Label>
                    <Select name="subject" required onValueChange={setSubject}>
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {subjects.map(subject => (
                                <SelectItem key={subject} value={subject}>{getSubjectLabel(subject)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.subject && <p className="text-sm font-medium text-destructive">{state.errors.subject[0]}</p>}
                </div>
            </div>

            {subject === 'SCIENCE P1' && materialType === 'video' && (
              <div className="space-y-2">
                  <Label htmlFor="topic">Physics Topic</Label>
                  <Select name="topic" defaultValue="general">
                      <SelectTrigger id="topic">
                          <SelectValue placeholder="Select a topic for the Physics video (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="general">General Physics</SelectItem>
                          {physicsTopics.map(topic => (
                              <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {state.errors?.topic && <p className="text-sm font-medium text-destructive">{state.errors.topic[0]}</p>}
              </div>
            )}

            {(subject === 'BIOLOGY P1' || subject === 'BIOLOGY P2') && materialType === 'video' && (
              <div className="space-y-2">
                  <Label htmlFor="topic">Biology Topic</Label>
                  <Select name="topic" defaultValue="general">
                      <SelectTrigger id="topic">
                          <SelectValue placeholder="Select a topic for the Biology video (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="general">General Biology</SelectItem>
                          {biologyTopics.map(topic => (
                              <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {state.errors?.topic && <p className="text-sm font-medium text-destructive">{state.errors.topic[0]}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief summary of what this material covers."
                className="min-h-[100px]"
              />
               {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="materialType">Material Type</Label>
                    <Select name="materialType" required defaultValue="video" onValueChange={(value) => setMaterialType(value as Material['type'])}>
                        <SelectTrigger id="materialType">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="past-paper">Past Paper</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                    </Select>
                     {state.errors?.materialType && <p className="text-sm font-medium text-destructive">{state.errors.materialType[0]}</p>}
                </div>
                
                {materialType === 'video' || materialType === 'document' || materialType === 'past-paper' ? (
                  <div className="space-y-2">
                    <Label htmlFor="url">Content URL</Label>
                    <Input id="url" name="url" type="url" placeholder="https://..." required />
                    {state.errors?.url && <p className="text-sm font-medium text-destructive">{state.errors.url[0]}</p>}
                    <p className="text-xs text-muted-foreground">Paste a link to the video, document, or past paper.</p>
                  </div>
                ) : null}
            </div>
             {materialType === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="referenceText">Quiz Reference Text (Optional)</Label>
                <Textarea
                  id="referenceText"
                  name="referenceText"
                  placeholder="Paste or type the reference text for the quiz here."
                  className="min-h-[150px]"
                />
                {state.errors?.referenceText && <p className="text-sm font-medium text-destructive">{state.errors.referenceText[0]}</p>}
                <p className="text-xs text-muted-foreground">Provide text to be used as a reference for generating a more accurate quiz.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
  );
}
