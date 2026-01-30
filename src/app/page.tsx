
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { validateAccessCode, login } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/app/logo';

function AccessCodeSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Verifying...' : 'Start Learning'}
    </Button>
  );
}

function LoginSubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
}

export default function HomePage() {
  const [accessCodeState, accessCodeFormAction] = useFormState(validateAccessCode, null);
  const [loginState, loginFormAction] = useFormState(login, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
         <CardHeader className="text-center">
           <div className="mx-auto mb-4 h-12 w-12 text-primary">
            <Logo />
          </div>
          <p className="text-sm font-medium text-muted-foreground">ELEVATION ONLINE TUITIONS</p>
          <CardTitle className="text-2xl font-headline">Mango SmartLearning</CardTitle>
          <CardDescription>Your partner in modern education.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="student">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="pt-4">
                     <form action={accessCodeFormAction} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="code">7-Day Trial Access Code</Label>
                        <Input id="code" name="code" placeholder="TRIAL123" required />
                        {accessCodeState?.errors?.code && <p className="text-sm font-medium text-destructive">{accessCodeState.errors.code[0]}</p>}
                        <p className="text-xs text-muted-foreground">Hint: Use the code <code className="font-mono p-1 bg-muted rounded">TRIAL123</code> to start a trial.</p>
                        </div>
                        <AccessCodeSubmitButton />
                    </form>
                </TabsContent>
                <TabsContent value="staff" className="pt-4">
                    <CardDescription className="text-center mb-4">
                        Admin and Agent login.
                    </CardDescription>
                    <form action={loginFormAction} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        {loginState?.errors?.email && <p className="text-sm font-medium text-destructive">{loginState.errors.email[0]}</p>}
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                        {loginState?.errors?.password && <p className="text-sm font-medium text-destructive">{loginState.errors.password[0]}</p>}
                        </div>
                        <LoginSubmitButton />
                        <p className="text-xs text-muted-foreground text-center pt-2">Hint: Use <code className="font-mono p-1 bg-muted rounded">cephasmutale832@gmail.com</code> and <code className="font-mono p-1 bg-muted rounded">Cep12345TY</code> for admin.</p>
                    </form>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
