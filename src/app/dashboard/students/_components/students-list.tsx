'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { type User } from '@/lib/types';
import { deleteStudentAction } from '../actions';
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

function StudentRow({ student }: { student: User }) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(deleteStudentAction, null);
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    useEffect(() => {
        if (state?.success === true) {
            toast({
                title: 'Success',
                description: state.message,
            });
            setIsAlertOpen(false); // Close dialog on success
        } else if (state?.success === false && state.message) {
             toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
         <TableRow key={student.id}>
            <TableCell>
                <div className="font-medium">{student.name}</div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
            </TableCell>
            <TableCell className="text-right">
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <form action={formAction}>
                        <input type="hidden" name="studentId" value={student.id} />
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the account for <span className="font-semibold">{student.name}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DeleteButton />
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    )
}

export function StudentsList({ students }: { students: User[] }) {
    if (students.length === 0) {
        return <p className="text-muted-foreground text-center py-4">No students have registered yet.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right w-[100px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                   <StudentRow key={student.id} student={student} />
                ))}
            </TableBody>
        </Table>
    );
}
