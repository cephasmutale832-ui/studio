'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { validateAccessCode } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/app/logo';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Verifying...' : 'Start Learning'}
    </Button>
  );
}

export default function HomePage() {
  const [state, formAction] = useFormState(validateAccessCode, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-primary">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">AccessGate Pro</CardTitle>
          <CardDescription>Enter your 7-day trial access code to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Access Code</Label>
              <Input id="code" name="code" placeholder="TRIAL123" required />
              {state?.errors?.code && <p className="text-sm font-medium text-destructive">{state.errors.code[0]}</p>}
              <p className="text-xs text-muted-foreground">Hint: Use the code <code className="font-mono p-1 bg-muted rounded">TRIAL123</code> to start a trial.</p>
            </div>
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
