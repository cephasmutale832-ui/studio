
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/users";
import { UsersList } from "./_components/users-list";
import { type User } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function UsersPage() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const users = await getUsers();

    return (
        <div className="mx-auto grid w-full max-w-4xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">User Management</h1>
                <p className="text-muted-foreground">
                View, approve, and manage all user accounts.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all registered administrators, agents, and students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersList users={users} />
                </CardContent>
            </Card>
        </div>
    );
}
