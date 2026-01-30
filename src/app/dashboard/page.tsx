
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { type ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { AlertTriangle, Folder } from "lucide-react";
import { MaterialCard } from "./_components/material-card";
import { subjects } from "@/lib/subjects";

interface Material {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'past-paper';
  imageId: string;
  url?: string;
  subject?: string;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const isTrialExpired = session.isTrial && new Date(session.expires) < new Date();
  
  const allMaterials: Material[] = [
    // Data will be added dynamically later
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).reverse();

  const getImage = (id: string): ImagePlaceholder | undefined => {
    return PlaceHolderImages.find(img => img.id === id);
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}. Here are your learning materials.
        </p>
      </div>

      {isTrialExpired && (
        <Alert variant="destructive" className="mb-6 bg-amber-100 border-amber-300 text-amber-800 [&>svg]:text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Trial Expired</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            Your 7-day trial has ended. Please validate your payment to regain access.
            <Button asChild variant="destructive" size="sm">
              <Link href="/dashboard/payment">Validate Payment</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className={cn(isTrialExpired && "opacity-50 pointer-events-none")}>
        <Tabs defaultValue="past-papers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="past-papers">Past Papers</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="past-papers" className="mt-6">
             <Accordion type="single" collapsible className="w-full">
                {subjects.map(subject => (
                  <AccordionItem value={subject} key={subject}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-3">
                        <Folder className="h-6 w-6 text-accent" />
                        {subject}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="p-4 text-muted-foreground">Past papers for {subject} will be available here, sorted by year.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4 pl-6">
                        {years.map(year => (
                          <Button key={year} variant="outline" className="justify-start" disabled>
                            {year}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
             </Accordion>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
                {subjects.map(subject => {
                    const subjectMaterials = allMaterials.filter(m => m.type === 'video' && m.subject === subject);
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {subjectMaterials.length > 0 ? (
                                    <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                    {subjectMaterials.map((material) => {
                                        const image = getImage(material.imageId);
                                        return (
                                        <MaterialCard key={material.id} material={material} image={image} />
                                        )
                                    })}
                                    </div>
                                ) : (
                                    <p className="p-4 text-muted-foreground">No videos available for {subject} yet.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
             <Accordion type="single" collapsible className="w-full">
                {subjects.map(subject => {
                    const subjectMaterials = allMaterials.filter(m => m.type === 'document' && m.subject === subject);
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {subjectMaterials.length > 0 ? (
                                    <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                    {subjectMaterials.map((material) => {
                                        const image = getImage(material.imageId);
                                        return (
                                        <MaterialCard key={material.id} material={material} image={image} />
                                        )
                                    })}
                                    </div>
                                ) : (
                                     <p className="p-4 text-muted-foreground">No documents available for {subject} yet.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
             <Accordion type="single" collapsible className="w-full">
                {subjects.map(subject => {
                    const subjectMaterials = allMaterials.filter(m => m.type === 'quiz' && m.subject === subject);
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {subjectMaterials.length > 0 ? (
                                    <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                    {subjectMaterials.map((material) => {
                                        const image = getImage(material.imageId);
                                        return (
                                        <MaterialCard key={material.id} material={material} image={image} />
                                        )
                                    })}
                                    </div>
                                ) : (
                                    <p className="p-4 text-muted-foreground">No quizzes available for {subject} yet.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
