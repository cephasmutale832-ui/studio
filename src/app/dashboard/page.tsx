import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileText, Video } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const isTrialExpired = session.isTrial && new Date(session.expires) < new Date();
  
  const materials = [
    { id: '1', title: 'Introduction to Algebra', type: 'video', imageId: 'course-1' },
    { id: '2', title: 'Advanced Physics Past Paper', type: 'document', imageId: 'course-2' },
    { id: '3', title: 'History of the World', type: 'video', imageId: 'course-3' },
    { id: '4', title: 'Chemistry 101 Notes', type: 'document', imageId: 'course-4' },
    { id: '5', title: 'Literature Studies: The Classics', type: 'video', imageId: 'course-5' },
    { id: '6', title: 'Computer Science Basics', type: 'document', imageId: 'course-6' },
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
            <Card key={material.id} className="overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  {image && (
                     <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge variant="secondary" className="absolute top-3 right-3">
                    {material.type === 'video' ? <Video className="mr-1 h-3 w-3" /> : <FileText className="mr-1 h-3 w-3" />}
                    {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-headline">{material.title}</CardTitle>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <Button className="w-full" variant="outline" style={{color: 'hsl(var(--accent))', borderColor: 'hsl(var(--accent))'}}>
                  {material.type === 'video' ? 'Watch Now' : 'Read Document'}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
