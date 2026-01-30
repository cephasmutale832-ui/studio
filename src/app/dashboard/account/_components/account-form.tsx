'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

import { updateProfile } from '@/app/actions';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
      )}
    </Button>
  );
}

export function AccountForm({ user }: { user: User }) {
    const { toast } = useToast();
    const [state, formAction] = useFormState(updateProfile, null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        return names.map(n => n[0]).join('').toUpperCase();
    }

    useEffect(() => {
        if (state?.success) {
            toast({
                title: 'Success!',
                description: state.message,
            });
        } else if (state?.success === false && state.message) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setAvatarPreview(null);
        }
    };

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                    This is your public display name and email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarPreview ?? user.avatar} alt={`@${user.name}`} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1.5">
                            <Label htmlFor="picture">Profile Picture</Label>
                            <Input id="picture" name="picture" type="file" className="max-w-xs" accept="image/*" onChange={handleFileChange} />
                            <p className="text-xs text-muted-foreground">Upload your facial ID or a profile picture.</p>
                            {state?.errors?.picture && <p className="text-sm font-medium text-destructive">{state.errors.picture[0]}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={user.name} required />
                        {state?.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
