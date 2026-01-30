
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
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
  const [state, formAction] = useFormState(uploadMaterialAction, { success: null, message: '' });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [materialType, setMaterialType] = useState('video');
  
  useEffect(() => {
    if (state.success === true) {
      toast({
        title: 'Upload Successful!',
        description: state.message,
      });
      formRef.current?.reset();
      setMaterialType('video');
    } else if (state.success === false && state.message) {
      toast({
        title: 'Upload Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

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
                    <Select name="subject" required>
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {subjects.map(subject => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state.errors?.subject && <p className="text-sm font-medium text-destructive">{state.errors.subject[0]}</p>}
                </div>
            </div>

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
                    <Select name="materialType" required defaultValue="video" onValueChange={(value) => setMaterialType(value)}>
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
                
                {materialType === 'video' ? (
                  <div className="space-y-2">
                    <Label htmlFor="gdrive-link">Google Drive Link</Label>
                    <Input id="gdrive-link" name="gdrive-link" type="url" placeholder="https://drive.google.com/file/d/..." required />
                    {state.errors?.['gdrive-link'] && <p className="text-sm font-medium text-destructive">{state.errors['gdrive-link'][0]}</p>}
                    <p className="text-xs text-muted-foreground">Paste a shareable Google Drive link.</p>
                  </div>
                ) : null}

                {materialType === 'document' || materialType === 'past-paper' ? (
                  <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input id="file" name="file" type="file" required />
                      {state.errors?.file && <p className="text-sm font-medium text-destructive">{state.errors.file[0]}</p>}
                      <p className="text-xs text-muted-foreground">Upload any file from your device.</p>
                  </div>
                ) : null}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
  );
}
