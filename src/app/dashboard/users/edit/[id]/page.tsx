
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/users";
import { type User } from "@/lib/types";
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { EditUserForm } from "./_components/edit-user-form";

async function getUser(id: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find(u => u.id === id);
}


export default async function EditUserPage({ params }: { params: { id: string } }) {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }
    
    if (session.user.id === params.id) {
        // Admins should edit their own profile on the account page
        redirect('/dashboard/account');
    }

    const user = await getUser(params.id);

    if (!user || user.role === 'admin') {
        return (
            <div className="mx-auto grid w-full max-w-2xl gap-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>User Not Found or Not Editable</AlertTitle>
                    <AlertDescription>
                        The user you are trying to edit does not exist or is an administrator.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto grid w-full max-w-2xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Edit User</h1>
                <p className="text-muted-foreground">
                    Update the details for {user.name}.
                </p>
            </div>
            <EditUserForm user={user} />
        </div>
    );
}
