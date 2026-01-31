
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

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
import { AlertTriangle, Folder, FileText, Video, File, HelpCircle } from "lucide-react";
import { MaterialCard } from "./_components/material-card";
import { subjects } from "@/lib/subjects";
import { type Material } from "@/lib/types";
import { physicsTopics } from "@/lib/topics";
import { biologyTopics } from "@/lib/biology-topics";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { user } = session;
  const isTrialExpired = session.isTrial && new Date(session.expires) < new Date();
  const isRegistered = user.role === 'admin' || user.role === 'agent' || user.status === 'registered';
  
  const materialsFilePath = path.join(process.cwd(), 'src', 'lib', 'materials.json');
  let allMaterials: Material[] = [];
  try {
      const fileContents = await fs.readFile(materialsFilePath, 'utf8');
      const data = JSON.parse(fileContents);
      allMaterials = data.materials || [];
  } catch (error) {
      console.log('Could not read materials file, starting with empty list.');
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).reverse();

  // Create a consolidated list for the grouped tabs
  const consolidatedSubjects = [...new Set(subjects.map(s => s.split(' P')[0]))];

  const getImage = (id: string): ImagePlaceholder | undefined => {
    return PlaceHolderImages.find(img => img.id === id);
  }

  const getMaterialsByTypeAndSubject = (type: Material['type'], subject: string) => {
    return allMaterials.filter(m => m.type === type && m.subject.startsWith(subject));
  };

  const getMaterialsByExactSubject = (type: Material['type'], subject: string) => {
    return allMaterials.filter(m => m.type === type && m.subject === subject);
  }

  const getPastPapersBySubject = (subject: string) => {
    return allMaterials.filter(m => m.type === 'past-paper' && m.subject === subject);
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4 bg-transparent p-0 h-auto">
            <TabsTrigger value="past-papers" className="h-28 flex-col gap-2 p-4 rounded-lg bg-card text-muted-foreground font-semibold shadow-sm hover:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-8 w-8" />
              Past Papers
            </TabsTrigger>
            <TabsTrigger value="videos" className="h-28 flex-col gap-2 p-4 rounded-lg bg-card text-muted-foreground font-semibold shadow-sm hover:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Video className="h-8 w-8" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="documents" className="h-28 flex-col gap-2 p-4 rounded-lg bg-card text-muted-foreground font-semibold shadow-sm hover:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <File className="h-8 w-8" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="h-28 flex-col gap-2 p-4 rounded-lg bg-card text-muted-foreground font-semibold shadow-sm hover:shadow-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <HelpCircle className="h-8 w-8" />
              Quizzes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="past-papers" className="mt-6">
             <Accordion type="single" collapsible className="w-full">
                {subjects.map(subject => {
                  const subjectMaterials = getPastPapersBySubject(subject);
                  if (subjectMaterials.length === 0) {
                    return null;
                  }
                  return (
                    <AccordionItem value={subject} key={subject}>
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-3">
                          <Folder className="h-6 w-6 text-accent" />
                          {subject}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                            {subjectMaterials.map((material) => {
                                const image = getImage(material.imageId);
                                return (
                                <div key={material.id}>
                                  <MaterialCard material={material} image={image} userRole={user.role} isRegistered={isRegistered} />
                                  <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                </div>
                                )
                            })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
             </Accordion>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <Accordion type="single" collapsible className="w-full">
                {consolidatedSubjects.map(subject => {
                    if (subject === 'SCIENCE') {
                        const physicsMaterials = getMaterialsByExactSubject('video', 'SCIENCE P1');
                        const chemistryMaterials = getMaterialsByExactSubject('video', 'SCIENCE P2');

                        if (physicsMaterials.length === 0 && chemistryMaterials.length === 0) {
                            return null;
                        }

                        const generalPhysicsMaterials = physicsMaterials.filter(m => !m.topic || m.topic === 'general' || m.topic === '');
                        const topicPhysicsMaterialsExist = physicsMaterials.some(m => m.topic && m.topic !== 'general' && m.topic !== '');

                        return (
                            <AccordionItem value="SCIENCE" key="SCIENCE">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <div className="flex items-center gap-3">
                                        <Folder className="h-6 w-6 text-accent" />
                                        SCIENCE
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pt-4 pl-6 space-y-8">
                                        <div>
                                            <h3 className="text-md font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                                                <Folder className="h-5 w-5" />
                                                PHYSICS (SCIENCE P1)
                                            </h3>
                                            {physicsMaterials.length > 0 ? (
                                                <div className="pl-4">
                                                    {generalPhysicsMaterials.length > 0 && (
                                                        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 mb-6">
                                                            {generalPhysicsMaterials.map((material, index) => {
                                                                const image = getImage(material.imageId);
                                                                const isLocked = !isRegistered && index >= 3;
                                                                const previousMaterialId = index > 0 ? generalPhysicsMaterials[index - 1].id : undefined;
                                                                return (
                                                                  <div key={material.id}>
                                                                    <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                                                    <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                                                  </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {topicPhysicsMaterialsExist && (
                                                        <Accordion type="single" collapsible className="w-full">
                                                            {physicsTopics.map(topic => {
                                                                const topicMaterials = physicsMaterials.filter(m => m.topic === topic);
                                                                if (topicMaterials.length === 0) return null;

                                                                return (
                                                                    <AccordionItem value={topic} key={topic}>
                                                                        <AccordionTrigger className="text-base font-medium">
                                                                            <div className="flex items-center gap-3">
                                                                                <Folder className="h-5 w-5 text-accent" />
                                                                                {topic}
                                                                            </div>
                                                                        </AccordionTrigger>
                                                                        <AccordionContent>
                                                                            <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                                                                {topicMaterials.map((material, index) => {
                                                                                    const image = getImage(material.imageId);
                                                                                    const isLocked = !isRegistered && index >= 3;
                                                                                    const previousMaterialId = index > 0 ? topicMaterials[index - 1].id : undefined;
                                                                                    return (
                                                                                      <div key={material.id}>
                                                                                        <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                                                                        <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                                                                      </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                );
                                                            })}
                                                        </Accordion>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground pl-4">No Physics videos available for this section yet.</p>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-md font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                                                <Folder className="h-5 w-5" />
                                                CHEMISTRY (SCIENCE P2)
                                            </h3>
                                            {chemistryMaterials.length > 0 ? (
                                                <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                                    {chemistryMaterials.map((material, index) => {
                                                        const image = getImage(material.imageId);
                                                        const isLocked = !isRegistered && index >= 3;
                                                        const previousMaterialId = index > 0 ? chemistryMaterials[index - 1].id : undefined;
                                                        return (
                                                          <div key={material.id}>
                                                            <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                                            <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                                          </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground pt-4 pl-6">No Chemistry videos available for this section yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    } else if (subject === 'BIOLOGY') {
                        const biologyP1Materials = getMaterialsByExactSubject('video', 'BIOLOGY P1');
                        const biologyP2Materials = getMaterialsByExactSubject('video', 'BIOLOGY P2');
                        const allBiologyMaterials = [...biologyP1Materials, ...biologyP2Materials];

                        if (allBiologyMaterials.length === 0) {
                            return null;
                        }

                        const generalBiologyMaterials = allBiologyMaterials.filter(m => !m.topic || m.topic === 'general' || m.topic === '');
                        const topicBiologyMaterialsExist = allBiologyMaterials.some(m => m.topic && m.topic !== 'general' && m.topic !== '');

                        return (
                            <AccordionItem value="BIOLOGY" key="BIOLOGY">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <div className="flex items-center gap-3">
                                        <Folder className="h-6 w-6 text-accent" />
                                        BIOLOGY
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="pt-4 pl-6 space-y-4">
                                        {allBiologyMaterials.length > 0 ? (
                                            <>
                                                {generalBiologyMaterials.length > 0 && (
                                                    <div className="mb-8">
                                                        <h3 className="text-md font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                                                            <Folder className="h-5 w-5" />
                                                            General Biology
                                                        </h3>
                                                        <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                                                            {generalBiologyMaterials.map((material, index) => {
                                                                const image = getImage(material.imageId);
                                                                const isLocked = !isRegistered && index >= 3;
                                                                const previousMaterialId = index > 0 ? generalBiologyMaterials[index - 1].id : undefined;
                                                                return (
                                                                  <div key={material.id}>
                                                                    <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                                                    <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                                                  </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {topicBiologyMaterialsExist && (
                                                    <Accordion type="single" collapsible className="w-full">
                                                        {biologyTopics.map(topic => {
                                                            const topicMaterials = allBiologyMaterials.filter(m => m.topic === topic);
                                                            if (topicMaterials.length === 0) return null;

                                                            return (
                                                                <AccordionItem value={topic} key={topic}>
                                                                    <AccordionTrigger className="text-base font-medium">
                                                                        <div className="flex items-center gap-3">
                                                                            <Folder className="h-5 w-5 text-accent" />
                                                                            {topic}
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                                                            {topicMaterials.map((material, index) => {
                                                                                const image = getImage(material.imageId);
                                                                                const isLocked = !isRegistered && index >= 3;
                                                                                const previousMaterialId = index > 0 ? topicMaterials[index - 1].id : undefined;
                                                                                return (
                                                                                  <div key={material.id}>
                                                                                    <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                                                                    <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                                                                  </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            );
                                                        })}
                                                    </Accordion>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground pl-4">No Biology videos available for this section yet.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    }


                    const subjectMaterials = getMaterialsByTypeAndSubject('video', subject);
                    if (subjectMaterials.length === 0) {
                      return null;
                    }

                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material, index) => {
                                    const image = getImage(material.imageId);
                                    const isLocked = !isRegistered && index >= 3;
                                    const previousMaterialId = index > 0 ? subjectMaterials[index - 1].id : undefined;
                                    return (
                                      <div key={material.id}>
                                        <MaterialCard material={material} image={image} userRole={user.role} isLocked={isLocked} previousMaterialId={previousMaterialId} isRegistered={isRegistered} />
                                        <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                      </div>
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
                {consolidatedSubjects.map(subject => {
                    const subjectMaterials = getMaterialsByTypeAndSubject('document', subject);
                    if (subjectMaterials.length === 0) {
                      return null;
                    }
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material) => {
                                    const image = getImage(material.imageId);
                                    return (
                                      <div key={material.id}>
                                        <MaterialCard material={material} image={image} userRole={user.role} isRegistered={isRegistered}/>
                                        <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                      </div>
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
                {consolidatedSubjects.map(subject => {
                    const subjectMaterials = getMaterialsByTypeAndSubject('quiz', subject);
                    if (subjectMaterials.length === 0) {
                      return null;
                    }
                    return (
                        <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="text-lg font-semibold">
                                <div className="flex items-center gap-3">
                                <Folder className="h-6 w-6 text-accent" />
                                {subject}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-x-6 gap-y-8 pt-4 pl-6 md:grid-cols-2 lg:grid-cols-3">
                                {subjectMaterials.map((material) => {
                                    const image = getImage(material.imageId);
                                    return (
                                      <div key={material.id}>
                                        <MaterialCard material={material} image={image} userRole={user.role} isRegistered={isRegistered}/>
                                        <h3 className="mt-2 font-semibold text-sm leading-tight truncate">{material.title}</h3>
                                      </div>
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
