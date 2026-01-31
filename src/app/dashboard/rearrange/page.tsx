
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { type Material } from "@/lib/types";
import { RearrangeList } from "./_components/rearrange-list";
import { subjects } from "@/lib/subjects";
import { getMaterials } from "@/lib/materials";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function RearrangePage() {
    const session = await getSession();

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    let allMaterials: Material[] = [];
    try {
        allMaterials = await getMaterials();
    } catch (error) {
        console.error("Failed to load materials for rearrange page:", error);
        // We can render the page with an empty list, the component will show a message.
    }
    
    const getSubjectLabel = (subject: string) => {
        if (subject === 'SCIENCE P1') return 'PHYSICS (SCIENCE P1)';
        if (subject === 'SCIENCE P2') return 'CHEMISTRY (SCIENCE P2)';
        return subject;
    }


    return (
        <div className="mx-auto grid w-full max-w-4xl gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-headline">Rearrange Materials</h1>
                <p className="text-muted-foreground">
                    Click the arrows to reorder materials within each subject. The new order will be reflected on the dashboard for all users.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Material Order</CardTitle>
                    <CardDescription>Change the display order of materials for each subject. You can only reorder materials within the same subject.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="multiple" className="w-full">
                        {subjects.map(subject => {
                            const subjectMaterials = allMaterials.filter(m => m.subject === subject);
                            if (subjectMaterials.length === 0) return null;
                            
                            return (
                                <AccordionItem value={subject} key={subject}>
                                    <AccordionTrigger className="text-lg font-semibold">{getSubjectLabel(subject)}</AccordionTrigger>
                                    <AccordionContent>
                                        <RearrangeList subject={subject} allMaterials={allMaterials} />
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                     </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
