'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { type User } from '@/lib/types';
import { approveAgentAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ApproveButton() {
    const { pending } = useFormStatus();
    return (
        <Button size="sm" type="submit" disabled={pending}>
             {pending ? (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                </>
                ) : (
                'Approve'
            )}
        </Button>
    );
}

function AgentRow({ agent }: { agent: User }) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(approveAgentAction, null);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? 'Success' : 'Error',
                description: state.message,
                variant: state.success ? 'default' : 'destructive',
            });
        }
    }, [state, toast]);

    return (
         <TableRow key={agent.id}>
            <TableCell>
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-muted-foreground">{agent.email}</div>
            </TableCell>
            <TableCell>
                <Badge variant={agent.status === 'approved' ? 'default' : 'secondary'}>
                    {agent.status === 'approved' ? 'Approved' : 'Pending'}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                {agent.status === 'pending' ? (
                    <form action={formAction}>
                        <input type="hidden" name="agentId" value={agent.id} />
                        <ApproveButton />
                    </form>
                ) : (
                    <Button size="sm" variant="outline" disabled>
                        Approved
                    </Button>
                )}
            </TableCell>
        </TableRow>
    )
}

export function AgentsList({ agents }: { agents: User[] }) {
    if (agents.length === 0) {
        return <p className="text-muted-foreground text-center py-4">No agents have registered yet.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {agents.map((agent) => (
                   <AgentRow key={agent.id} agent={agent} />
                ))}
            </TableBody>
        </Table>
    );
}
