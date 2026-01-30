
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { validatePaymentCodeAction } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Validating...
        </>
      ) : (
        'Validate Code'
      )}
    </Button>
  );
}

export default function PaymentPage() {
  const [state, formAction] = useActionState(validatePaymentCodeAction, null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Payment Validated!",
        description: "Your access has been restored. Redirecting to dashboard...",
        variant: 'default',
      });
      const timer = setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router, toast]);

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-headline">Renew Your Access</h1>
        <p className="text-muted-foreground">
          Validate your payment to continue learning.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Validation</CardTitle>
          <CardDescription>
            Enter the unique code sent to your WhatsApp to validate your payment and get full access.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="validation-code">Validation Code</Label>
              <Input
                id="validation-code"
                name="validationCode"
                placeholder="e.g., MANGO123ABC"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <SubmitButton />
             {state?.message && (
              <Alert variant={state.success ? 'default' : 'destructive'}>
                {state.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {state.success ? 'Validation Successful' : 'Validation Failed'}
                </AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
