
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/users";
import { AgentsList } from "./_components/agents-list";
import { type User } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function AgentsPage() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const users = await getUsers();
    const agents = users.filter(u => u.role === 'agent') as User[];

    return (
        <div className="mx-auto grid w-full max-w-4xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Agent Management</h1>
                <p className="text-muted-foreground">
                View, approve, and manage trusted agents.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Agents</CardTitle>
                    <CardDescription>A list of all registered agents, including those pending approval.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AgentsList agents={agents} />
                </CardContent>
            </Card>
        </div>
    );
}
