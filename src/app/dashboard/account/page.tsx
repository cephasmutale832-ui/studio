import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountForm } from "./_components/account-form";


export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const { user } = session;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-headline">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account information.
        </p>
      </div>
      <div className="grid gap-6">
        <AccountForm user={user} />
      </div>
    </div>
  );
}
