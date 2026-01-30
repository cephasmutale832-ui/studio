'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { type User } from '@/lib/types';
import { approveAgentAction, deleteUserAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Trash2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="destructive" type="submit" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : 'Delete'}
        </Button>
    );
}

function UserRow({ user }: { user: User }) {
    const { toast } = useToast();
    const [approveState, approveFormAction] = useActionState(approveAgentAction, null);
    const [deleteState, deleteFormAction] = useActionState(deleteUserAction, null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const state = approveState || deleteState;

    useEffect(() => {
        if (state?.message) {
            toast({
                title: state.success ? 'Success' : 'Error',
                description: state.message,
                variant: state.success ? 'default' : 'destructive',
            });
            if (state.success) {
                setIsAlertOpen(false);
            }
        }
    }, [state, toast]);
    
    const getStatus = (user: User) => {
        if (user.role === 'agent') {
            return <Badge variant={user.status === 'approved' ? 'default' : 'secondary'}>{user.status}</Badge>
        }
        if (user.role === 'student') {
             return <Badge variant="outline">Active</Badge>
        }
        if (user.role === 'admin') {
             return <Badge>Admin</Badge>
        }
        return null;
    }

    return (
         <TableRow key={user.id}>
            <TableCell>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
            </TableCell>
             <TableCell>
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
            </TableCell>
            <TableCell>
                {getStatus(user)}
            </TableCell>
            <TableCell className="text-right">
                {user.role === 'agent' && user.status === 'pending' && (
                    <form action={approveFormAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <ApproveButton />
                    </form>
                )}
                {user.role !== 'admin' && (
                     <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <form action={deleteFormAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the account for <span className="font-semibold">{user.name}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <DeleteButton />
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </TableCell>
        </TableRow>
    )
}

export function UsersList({ users }: { users: User[] }) {
    if (users.length === 0) {
        return <p className="text-muted-foreground text-center py-4">No users found.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                   <UserRow key={user.id} user={user} />
                ))}
            </TableBody>
        </Table>
    );
}
