
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Home,
  User,
  CreditCard,
  Upload,
  ShieldCheck,
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
                    href="/dashboard/agents"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span className="sr-only">Manage Agents</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Manage Agents</TooltipContent>
              </Tooltip>
            )}
             {isAdmin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard/students"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Users className="h-5 w-5" />
                    <span className="sr-only">Manage Students</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Manage Students</TooltipContent>
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
                      href="/dashboard/agents"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      Agents
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/dashboard/students"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users className="h-5 w-5" />
                      Students
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
        <Chatbot />
      </div>
    </TooltipProvider>
  );
}
