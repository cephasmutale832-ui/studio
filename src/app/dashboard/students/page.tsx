
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/users";
import { StudentsList } from "./_components/students-list";
import { type User } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function StudentsPage() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const users = await getUsers();
    const students = users.filter(u => u.role === 'student') as User[];

    return (
        <div className="mx-auto grid w-full max-w-4xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Student Management</h1>
                <p className="text-muted-foreground">
                View and manage all registered students.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>A list of all registered student accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentsList students={students} />
                </CardContent>
            </Card>
        </div>
    );
}
