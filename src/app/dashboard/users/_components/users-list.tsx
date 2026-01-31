'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { type User } from '@/lib/types';
import { approveUserAction, deleteUserAction, sendPaymentCodeAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Trash2, Edit } from 'lucide-react';
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
import { ToastAction } from '@/components/ui/toast';
import Link from 'next/link';

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

function SendCodeButton({ isResend }: { isResend?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button size="sm" type="submit" disabled={pending} variant="outline">
             {pending ? (
                <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {isResend ? 'Resending...' : 'Sending...'}
                </>
             ) : (
                isResend ? 'Resend Code' : 'Send Code'
            )}
        </Button>
    );
}

function UserRow({ user }: { user: User }) {
    const { toast } = useToast();
    const [approveState, approveFormAction] = useActionState(approveUserAction, null);
    const [deleteState, deleteFormAction] = useActionState(deleteUserAction, null);
    const [sendCodeState, sendCodeFormAction] = useActionState(sendPaymentCodeAction, null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    useEffect(() => {
        if (approveState?.message) {
            toast({
                title: approveState.success ? 'Success' : 'Error',
                description: approveState.message,
                variant: approveState.success ? 'default' : 'destructive',
            });
        }
    }, [approveState, toast]);

    useEffect(() => {
        if (deleteState?.message) {
            toast({
                title: deleteState.success ? 'Success' : 'Error',
                description: deleteState.message,
                variant: deleteState.success ? 'default' : 'destructive',
            });
            if (deleteState.success) {
                setIsAlertOpen(false);
            }
        }
    }, [deleteState, toast]);

     useEffect(() => {
        if (sendCodeState?.success && sendCodeState.whatsAppLink) {
            toast({
                title: 'Code Generated!',
                description: sendCodeState.message,
                action: (
                    <ToastAction altText="Send" onClick={() => window.open(sendCodeState.whatsAppLink, '_blank')}>
                        Send via WhatsApp
                    </ToastAction>
                ),
            });
        } else if (sendCodeState?.success === false) {
            toast({
                title: 'Error',
                description: sendCodeState.message,
                variant: 'destructive',
            });
        }
    }, [sendCodeState, toast]);
    
    const getStatus = (user: User) => {
        if (user.role === 'admin') {
            return <Badge>Admin</Badge>;
        }
        if (user.status) {
            return (
                <Badge variant={user.status === 'approved' ? 'default' : 'secondary'} className="capitalize">
                    {user.status}
                </Badge>
            );
        }
        // Fallback for older data that might not have a status
        if (user.role === 'student') {
            return <Badge variant="outline">Active</Badge>;
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
                <div className="flex items-center justify-end gap-2">
                    {(user.role === 'agent' || user.role === 'student') && user.status === 'pending' && (
                        <form action={approveFormAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <ApproveButton />
                        </form>
                    )}
                    
                    {user.role === 'student' && (
                        <form action={sendCodeFormAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <SendCodeButton isResend={user.paymentCodeSent} />
                        </form>
                    )}

                    {user.role !== 'admin' && (
                        <>
                            <Button asChild size="icon" variant="ghost">
                                <Link href={`/dashboard/users/edit/${user.id}`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
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
                        </>
                    )}
                </div>
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
