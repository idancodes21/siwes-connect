import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import StudentDashboardShell from "@/components/student-dashboard-shell";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<StudentLayoutLoading />}>
      <StudentLayoutContent>{children}</StudentLayoutContent>
    </Suspense>
  );
}

async function StudentLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/unauthorized");
  }

  return (
    <StudentDashboardShell user={session.user}>
      {children}
    </StudentDashboardShell>
  );
}

function StudentLayoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}