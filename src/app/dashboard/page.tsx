
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
import { cn } from "@/lib/utils";
import { AlertTriangle, Folder } from "lucide-react";
import { MaterialCard } from "./_components/material-card";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const isTrialExpired = session.isTrial && new Date(session.expires) < new Date();
  
  const allMaterials = [
    // Videos
    { id: '1', title: 'Introduction to Algebra', type: 'video' as const, subject: 'Mathematics', imageId: 'course-1', url: 'https://drive.google.com/file/d/1B-c1mZJgY2gqNqJ_1vjYkX_3a7bJ0oY/view?usp=sharing' },
    { id: '3', title: 'History of the World', type: 'video' as const, subject: 'History', imageId: 'course-3', url: 'https://drive.google.com/file/d/1_sZt-VIMzNss_C1aJgG_a3GgVq-pC_4w/view?usp=sharing'},
    { id: '5', title: 'Literature Studies: The Classics', type: 'video' as const, subject: 'Literature', imageId: 'course-5', url: 'https://drive.google.com/file/d/1_sZt-VIMzNss_C1aJgG_a3GgVq-pC_4w/view?usp=sharing' },
    { id: 'v-phys-1', title: 'Fundamentals of Physics', type: 'video' as const, subject: 'Physics', imageId: 'course-2', url: 'https://drive.google.com/file/d/1_sZt-VIMzNss_C1aJgG_a3GgVq-pC_4w/view?usp=sharing' },


    // Documents
    { id: '2', title: 'Advanced Physics Notes', type: 'document' as const, subject: 'Physics', imageId: 'course-2' },
    { id: '4', title: 'Chemistry 101 Notes', type: 'document' as const, subject: 'Chemistry', imageId: 'course-4' },
    { id: '6', title: 'Computer Science Basics', type: 'document' as const, subject: 'Computer Science', imageId: 'course-6' },
    { id: 'd-math-1', title: 'Algebra Practice Sheet', type: 'document' as const, subject: 'Mathematics', imageId: 'course-1' },

    // Quizzes
    { id: 'q1', title: 'Algebra Basics Quiz', type: 'quiz' as const, subject: 'Mathematics', imageId: 'quiz-1' },
    { id: 'q2', title: 'World History Challenge', type: 'quiz' as const, subject: 'History', imageId: 'quiz-2' },
    { id: 'q3', title: 'Chemistry Fundamentals Quiz', type: 'quiz' as const, subject: 'Chemistry', imageId: 'quiz-2' },
  ];

  const subjects = [...new Set(allMaterials.map(m => m.subject))].sort();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).reverse();

  const getImage = (id: string) => {
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
                      <p className="p-4 text-muted-foreground">Past papers for {subject} will be available here, sorted by year. This feature is coming soon!</p>
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
                    if (subjectMaterials.length === 0) return null;
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material) => {
                                    const image = getImage(material.imageId);
                                    return (
                                    <MaterialCard key={material.id} material={material} image={image} />
                                    )
                                })}
                                </div>
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
                    if (subjectMaterials.length === 0) return null;
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material) => {
                                    const image = getImage(material.imageId);
                                    return (
                                    <MaterialCard key={material.id} material={material} image={image} />
                                    )
                                })}
                                </div>
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
                    if (subjectMaterials.length === 0) return null;
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material) => {
                                    const image = getImage(material.imageId);
                                    return (
                                    <MaterialCard key={material.id} material={material} image={image} />
                                    )
                                })}
                                </div>
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
