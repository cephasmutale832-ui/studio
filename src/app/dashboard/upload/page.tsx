
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import UploadForm from "./_components/upload-form";
import { subjects } from "@/lib/subjects";

export default async function UploadPage() {
    const session = await getSession();

    // Although the link is hidden, a user could still navigate here.
    // This server-side check prevents unauthorized access.
    if (!session) {
        redirect('/');
    }

    const { user } = session;
    const canUpload = user.role === 'admin' || user.role === 'agent';

    if (!canUpload) {
        return (
             <div className="mx-auto grid w-full max-w-2xl gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-headline">Upload New Material</h1>
                    <p className="text-muted-foreground">
                        Add a new video or document for students.
                    </p>
                </div>
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Unauthorized Access</AlertTitle>
                    <AlertDescription>
                        You do not have permission to view this page.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="mx-auto grid w-full max-w-2xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Upload New Material</h1>
                <p className="text-muted-foreground">
                    Add a new video or document for students.
                </p>
            </div>
            <UploadForm subjects={subjects} />
        </div>
    );
}
