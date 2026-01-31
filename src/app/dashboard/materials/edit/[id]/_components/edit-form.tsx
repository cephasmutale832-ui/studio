
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

import { updateMaterialAction } from '@/app/dashboard/materials/actions';
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
import { type Material } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { physicsTopics } from '@/lib/topics';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  );
}

export function EditMaterialForm({ subjects, material }: { subjects: string[], material: Material }) {
  const [state, formAction] = useActionState(updateMaterialAction, { success: null, message: '', errors: {} });
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [materialType, setMaterialType] = useState(material.type);
  const [subject, setSubject] = useState(material.subject);
  
  useEffect(() => {
    if (state.success === false && state.message) {
      toast({
        title: 'Update Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
    // Success is handled by redirect
  }, [state, toast, router]);

  const getSubjectLabel = (subject: string) => {
    if (subject === 'SCIENCE P1') return 'PHYSICS (SCIENCE P1)';
    if (subject === 'SCIENCE P2') return 'CHEMISTRY (SCIENCE P2)';
    return subject;
  }

  return (
      <Card>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="id" value={material.id} />
          <CardHeader>
            <CardTitle>Material Details</CardTitle>
            <CardDescription>
              Update the information for this learning resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Introduction to Calculus" defaultValue={material.title} required />
                    {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Subject / Section</Label>
                    <Select name="subject" required defaultValue={material.subject} onValueChange={setSubject}>
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
                  <Select name="topic" defaultValue={material.topic || 'general'}>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A brief summary of what this material covers."
                className="min-h-[100px]"
                defaultValue={material.description}
              />
               {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="materialType">Material Type</Label>
                    <Select name="materialType" required defaultValue={material.type} onValueChange={(value) => setMaterialType(value as Material['type'])}>
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
                    <Input id="url" name="url" type="url" placeholder="https://..." defaultValue={material.url} required />
                    {state.errors?.url && <p className="text-sm font-medium text-destructive">{state.errors.url[0]}</p>}
                    <p className="text-xs text-muted-foreground">Paste a link to the video, document, or past paper.</p>
                  </div>
                ) : null}
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <SubmitButton />
            <Button variant="outline" type="button" onClick={() => router.push('/dashboard')}>Cancel</Button>
          </CardFooter>
        </form>
      </Card>
  );
}
