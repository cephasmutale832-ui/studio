import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

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

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }


  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-headline">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account information.
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              This is your public display name and email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={`@${user.name}`} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input id="picture" type="file" className="max-w-xs" />
                    <p className="text-xs text-muted-foreground">Upload your facial ID or a profile picture.</p>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
