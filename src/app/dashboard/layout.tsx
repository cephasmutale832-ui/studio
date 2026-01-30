
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Home,
  User,
  CreditCard,
  Upload,
  Users,
  PanelLeft,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserNav } from "@/components/user-nav";
import { Logo } from "../logo";
import { Chatbot } from "@/components/chatbot";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const { user } = session;
  const isAdmin = user.role === 'admin';
  const isStudent = user.role === 'student';
  const canUpload = user.role === 'admin' || user.role === 'agent';

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              href="/dashboard"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <div className="h-5 w-5 transition-all group-hover:scale-110">
                <Logo />
              </div>
              <span className="sr-only">Mango SmartLearning</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/payment"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="sr-only">Payment</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Payment</TooltipContent>
            </Tooltip>
            {canUpload && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/upload"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="sr-only">Upload</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Upload Materials</TooltipContent>
              </Tooltip>
            )}
             {isAdmin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/users"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Users className="h-5 w-5" />
                    <span className="sr-only">Manage Users</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Manage Users</TooltipContent>
              </Tooltip>
            )}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/account"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Account</TooltipContent>
            </Tooltip>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/dashboard"
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <div className="h-6 w-6 transition-all group-hover:scale-110">
                      <Logo />
                    </div>
                    <span className="sr-only">Mango SmartLearning</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/payment"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </Link>
                  {canUpload && (
                     <Link
                        href="/dashboard/upload"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <Upload className="h-5 w-5" />
                        Upload
                      </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/dashboard/users"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users className="h-5 w-5" />
                      Users
                    </Link>
                  )}
                  <Link
                    href="/dashboard/account"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-headline text-primary">Mango SmartLearning</h1>
            <div className="relative ml-auto flex-1 md:grow-0">
            </div>
            <UserNav user={session.user} />
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
        {isStudent && (
          <a
            href="https://wa.me/260774177403"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50 flex items-center justify-center text-white"
            aria-label="Contact on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.89-5.464 0-9.888 4.418-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.254 4.575 4.644-1.216z"/>
            </svg>
          </a>
        )}
        <Chatbot />
      </div>
    </TooltipProvider>
  );
}
