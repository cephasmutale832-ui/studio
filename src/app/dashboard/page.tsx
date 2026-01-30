
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { MaterialCard } from "./_components/material-card";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const isTrialExpired = session.isTrial && new Date(session.expires) < new Date();
  
  const materials = [
    { id: '1', title: 'Introduction to Algebra', type: 'video' as const, imageId: 'course-1', url: 'https://drive.google.com/file/d/1B-c1mZJgY2gqNqJ_1vjYkX_3a7bJ0oY/view?usp=sharing' },
    { id: '2', title: 'Advanced Physics Past Paper', type: 'document' as const, imageId: 'course-2' },
    { id: '3', title: 'History of the World', type: 'video' as const, imageId: 'course-3', url: 'https://drive.google.com/file/d/1_sZt-VIMzNss_C1aJgG_a3GgVq-pC_4w/view?usp=sharing'},
    { id: '4', title: 'Chemistry 101 Notes', type: 'document' as const, imageId: 'course-4' },
    { id: '5', title: 'Literature Studies: The Classics', type: 'video' as const, imageId: 'course-5' },
    { id: '6', title: 'Computer Science Basics', type: 'document' as const, imageId: 'course-6' },
  ];

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

      <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", isTrialExpired && "opacity-50 pointer-events-none")}>
        {materials.map((material) => {
          const image = getImage(material.imageId);
          return (
            <MaterialCard key={material.id} material={material} image={image} />
          )
        })}
      </div>
    </div>
  );
}
