
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type Material } from "@/lib/types";
import { subjects } from "@/lib/subjects";
import { getMaterials } from "@/lib/materials";
import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { EditMaterialForm } from "./_components/edit-form";

async function getMaterial(id: string): Promise<Material | undefined> {
    try {
        const allMaterials = await getMaterials();
        return allMaterials.find(m => m.id === id);
    } catch (error) {
        console.error('Could not read materials file:', error);
        return undefined;
    }
}


export default async function EditMaterialPage({ params }: { params: { id: string } }) {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const material = await getMaterial(params.id);

    if (!material) {
        return (
            <div className="mx-auto grid w-full max-w-2xl gap-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Material Not Found</AlertTitle>
                    <AlertDescription>
                        The material you are trying to edit does not exist or the data file could not be read.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto grid w-full max-w-2xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Edit Material</h1>
                <p className="text-muted-foreground">
                    Update the details for this learning resource.
                </p>
            </div>
            <EditMaterialForm subjects={subjects} material={material} />
        </div>
    );
}
