
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type User } from '@/lib/types';
import { updateUserAction } from '@/app/dashboard/users/actions';

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
    <Button type="submit" disabled={pending}>
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

export function EditUserForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateUserAction, { success: null, message: '' });
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (state.success === false && state.message) {
      toast({
        title: 'Update Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
    // Success is handled by redirect in the action
  }, [state, toast]);

  return (
      <Card>
        <form action={formAction}>
          <input type="hidden" name="userId" value={user.id} />
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              Update user information. Email address cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
                {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
            </div>

            {user.role === 'student' && (
                 <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" name="whatsappNumber" defaultValue={user.whatsappNumber} />
                    {state.errors?.whatsappNumber && <p className="text-sm font-medium text-destructive">{state.errors.whatsappNumber[0]}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required defaultValue={user.role}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                    </Select>
                    {state.errors?.role && <p className="text-sm font-medium text-destructive">{state.errors.role[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" required defaultValue={user.status}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                    </Select>
                     {state.errors?.status && <p className="text-sm font-medium text-destructive">{state.errors.status[0]}</p>}
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col md:flex-row md:justify-start gap-2 pt-6">
            <SubmitButton />
            <Button variant="outline" type="button" onClick={() => router.push('/dashboard/users')}>Cancel</Button>
          </CardFooter>
        </form>
      </Card>
  );
}
