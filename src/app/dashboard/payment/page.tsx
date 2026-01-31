
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { validatePaymentCodeAction, validateTransactionDetailsAction } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

function CodeSubmitButton() {
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

function AISubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Submitting for AI Validation...
        </>
      ) : (
        'Validate with AI'
      )}
    </Button>
  );
}


export default function PaymentPage() {
  const [codeState, codeFormAction] = useActionState(validatePaymentCodeAction, null);
  const [aiState, aiFormAction] = useActionState(validateTransactionDetailsAction, null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const successfulState = codeState?.success ? codeState : aiState?.success ? aiState : null;
    if (successfulState) {
       toast({
        title: "Payment Validated!",
        description: successfulState.message || "Your access has been restored. Redirecting to dashboard...",
        variant: 'default',
      });
      const timer = setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [codeState, aiState, router, toast]);

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
            Choose a validation method below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Use Validation Code</TabsTrigger>
              <TabsTrigger value="ai">Use AI Validator</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="pt-6">
                <form action={codeFormAction} className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Enter the unique code sent to your WhatsApp to validate your payment and get full access.
                    </p>
                    <div className="grid gap-2">
                        <Label htmlFor="validation-code">Validation Code</Label>
                        <Input
                            id="validation-code"
                            name="validationCode"
                            placeholder="e.g., MANGO123ABC"
                            required
                        />
                    </div>
                    <CodeSubmitButton />
                    {codeState?.message && !codeState.success && (
                        <Alert variant='destructive'>
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Validation Failed</AlertTitle>
                            <AlertDescription>{codeState.message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </TabsContent>
            <TabsContent value="ai" className="pt-6">
              <form action={aiFormAction} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Paste your transaction details from Airtel Money, MTN Money, or another service below. Our AI will analyze it to confirm your payment.
                </p>
                <div className="grid gap-2">
                    <Label htmlFor="transaction-details">Transaction Details</Label>
                    <Textarea
                        id="transaction-details"
                        name="transactionDetails"
                        placeholder="e.g., Money sent to Cephas Mutale, Amount: ZMW 70..."
                        required
                        className="min-h-[150px]"
                    />
                </div>
                <AISubmitButton />
                {aiState?.message && (
                    <Alert variant={aiState.success ? 'default' : 'destructive'}>
                    {aiState.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                        {aiState.success ? 'Validation Result' : 'Validation Failed'}
                    </AlertTitle>
                    <AlertDescription>{aiState.message}</AlertDescription>
                    </Alert>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
