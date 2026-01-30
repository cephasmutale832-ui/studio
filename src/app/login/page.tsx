'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/app/logo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4 h-12 w-12 text-primary">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account. <br /> Hint: Use <code className="font-mono p-1 bg-muted rounded">cephasmutale832@gmail.com</code> and <code className="font-mono p-1 bg-muted rounded">password123</code>.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required defaultValue="cephasmutale832@gmail.com" />
               {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required defaultValue="password123" />
               {state?.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
            </div>
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Need a trial?{' '}
            <Link href="/" className="underline">
              Use Access Code
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
