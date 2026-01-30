'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { agentSignup, studentSignup, studentLogin, login } from '@/app/actions';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { CheckCircle } from 'lucide-react';

function SignUpSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Signing Up...' : 'Sign Up for 7-Day Trial'}
    </Button>
  );
}

function StudentLoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

function StaffLoginSubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
}

function AgentSignupSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending} disabled={pending}>
      {pending ? 'Submitting...' : 'Sign Up for Approval'}
    </Button>
  );
}


export default function HomePage() {
  const [signupState, signupFormAction] = useActionState(studentSignup, null);
  const [studentLoginState, studentLoginFormAction] = useActionState(studentLogin, null);
  const [staffLoginState, staffLoginFormAction] = useActionState(login, null);
  const [agentSignupState, agentSignupAction] = useActionState(agentSignup, null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
         <CardHeader className="text-center">
           <div className="mx-auto mb-4 h-12 w-12 text-primary">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">Mango SmartLearning</CardTitle>
          <p className="text-sm font-medium text-muted-foreground">ELEVATION ONLINE TUITIONS</p>
          <CardDescription>Your partner in modern education.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="student">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="pt-4">
                  <Tabs defaultValue="signup">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signup">New Student</TabsTrigger>
                      <TabsTrigger value="signin">Existing Student</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup" className="pt-4">
                      <form action={signupFormAction} className="space-y-4">
                        <CardDescription className="text-center">
                            Sign up to start your 7-day free trial.
                        </CardDescription>
                         <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" placeholder="John Doe" required />
                          {signupState?.errors?.name && <p className="text-sm font-medium text-destructive">{signupState.errors.name[0]}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input id="signup-email" name="email" type="email" placeholder="student@example.com" required />
                          {signupState?.errors?.email && <p className="text-sm font-medium text-destructive">{signupState.errors.email[0]}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input id="signup-password" name="password" type="password" required />
                           {signupState?.errors?.password && <p className="text-sm font-medium text-destructive">{signupState.errors.password[0]}</p>}
                        </div>
                        <SignUpSubmitButton />
                      </form>
                    </TabsContent>
                    <TabsContent value="signin" className="pt-4">
                      <form action={studentLoginFormAction} className="space-y-4">
                        <CardDescription className="text-center">
                            Sign in to your account.
                        </CardDescription>
                        <div className="space-y-2">
                          <Label htmlFor="student-email">Email</Label>
                          <Input id="student-email" name="email" type="email" placeholder="student@example.com" required />
                           {studentLoginState?.errors?.email && <p className="text-sm font-medium text-destructive">{studentLoginState.errors.email[0]}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-password">Password</Label>
                          <Input id="student-password" name="password" type="password" required />
                           {studentLoginState?.errors?.password && <p className="text-sm font-medium text-destructive">{studentLoginState.errors.password[0]}</p>}
                        </div>
                        <StudentLoginSubmitButton />
                         <p className="text-xs text-muted-foreground text-center pt-2">Hint: Use <code className="font-mono p-1 bg-muted rounded">student@example.com</code> and <code className="font-mono p-1 bg-muted rounded">password123</code> for existing student.</p>
                      </form>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                <TabsContent value="staff" className="pt-4">
                    <Tabs defaultValue="admin">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                            <TabsTrigger value="agent">Agent</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin" className="pt-4">
                            <form action={staffLoginFormAction} className="space-y-4">
                                <CardDescription className="text-center">
                                    Sign in as an administrator.
                                </CardDescription>
                                <div className="space-y-2">
                                <Label htmlFor="admin-email">Email</Label>
                                <Input id="admin-email" name="email" type="email" placeholder="admin@example.com" required />
                                {staffLoginState?.errors?.email && <p className="text-sm font-medium text-destructive">{staffLoginState.errors.email[0]}</p>}
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="admin-password">Password</Label>
                                <Input id="admin-password" name="password" type="password" required />
                                {staffLoginState?.errors?.password && <p className="text-sm font-medium text-destructive">{staffLoginState.errors.password[0]}</p>}
                                </div>
                                <StaffLoginSubmitButton />
                                <p className="text-xs text-muted-foreground text-center pt-2">Hint: Use <code className="font-mono p-1 bg-muted rounded">admin@example.com</code> and <code className="font-mono p-1 bg-muted rounded">password</code> for admin.</p>
                            </form>
                        </TabsContent>
                        <TabsContent value="agent" className="pt-4">
                           <Tabs defaultValue="signin">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                </TabsList>
                                <TabsContent value="signin" className="pt-4">
                                     <form action={staffLoginFormAction} className="space-y-4">
                                        <CardDescription className="text-center">
                                            Sign in as a trusted agent.
                                        </CardDescription>
                                        <div className="space-y-2">
                                        <Label htmlFor="agent-email">Email</Label>
                                        <Input id="agent-email" name="email" type="email" placeholder="agent@example.com" required />
                                        {staffLoginState?.errors?.email && <p className="text-sm font-medium text-destructive">{staffLoginState.errors.email[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="agent-password">Password</Label>
                                        <Input id="agent-password" name="password" type="password" required />
                                        {staffLoginState?.errors?.password && <p className="text-sm font-medium text-destructive">{staffLoginState.errors.password[0]}</p>}
                                        </div>
                                        <StaffLoginSubmitButton />
                                        <p className="text-xs text-muted-foreground text-center pt-2">Hint: Use <code className="font-mono p-1 bg-muted rounded">agent1@example.com</code> and <code className="font-mono p-1 bg-muted rounded">password123</code> for an approved agent.</p>
                                    </form>
                                </TabsContent>
                                <TabsContent value="signup" className="pt-4">
                                     <form action={agentSignupAction} className="space-y-4">
                                        <CardDescription className="text-center">
                                            Register as a new agent to await approval.
                                        </CardDescription>
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-signup-name">Full Name</Label>
                                            <Input id="agent-signup-name" name="name" placeholder="Jane Doe" required />
                                            {agentSignupState?.errors?.name && <p className="text-sm font-medium text-destructive">{agentSignupState.errors.name[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-signup-email">Email</Label>
                                            <Input id="agent-signup-email" name="email" type="email" placeholder="agent@example.com" required />
                                            {agentSignupState?.errors?.email && <p className="text-sm font-medium text-destructive">{agentSignupState.errors.email[0]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="agent-signup-password">Password</Label>
                                            <Input id="agent-signup-password" name="password" type="password" required />
                                            {agentSignupState?.errors?.password && <p className="text-sm font-medium text-destructive">{agentSignupState.errors.password[0]}</p>}
                                        </div>
                                        <AgentSignupSubmitButton />
                                        {agentSignupState?.success && (
                                            <Alert>
                                                <CheckCircle className="h-4 w-4" />
                                                <AlertTitle>Success!</AlertTitle>
                                                <AlertDescription>
                                                    {agentSignupState.message}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </form>
                                </TabsContent>
                           </Tabs>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
