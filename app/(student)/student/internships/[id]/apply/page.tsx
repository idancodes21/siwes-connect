
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicationForm from "@/components/student/application-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ApplyPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ApplicationPageLoading />}>
      <ApplyPageContent params={params} />
    </Suspense>
  );
}

async function ApplyPageContent({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "STUDENT") redirect("/unauthorized");

  const { id } = await params;

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!student) {
    throw new Error("Student profile not found.");
  }

  const internship = await prisma.internshipListing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      status: true,
      deadline: true,
      durationMonths: true,
      location: true,
      isRemote: true,
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!internship || internship.status !== "PUBLISHED") {
    notFound();
  }

  const alreadyApplied = await prisma.application.findUnique({
    where: {
      studentId_listingId: {
        studentId: student.id,
        listingId: internship.id,
      },
    },
    select: { id: true },
  });

  if (alreadyApplied) {
    redirect(`/student/applications/${alreadyApplied.id}`);
  }

  if (internship.deadline && internship.deadline < new Date()) {
    redirect(`/student/internships/${internship.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/student/internships/${internship.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={17} />
        Back to internship
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Apply for internship
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the internship details and submit your application.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 size={24} />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-foreground">
              {internship.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {internship.company.name}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {internship.location && <span>{internship.location}</span>}
              <span>{internship.isRemote ? "Remote" : "On-site"}</span>
              {internship.durationMonths && (
                <span>{internship.durationMonths} months</span>
              )}
            </div>

            {internship.deadline && (
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays size={15} />
                Deadline:{" "}
                {internship.deadline.toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </section>

      <ApplicationForm listingId={internship.id} />
    </div>
  );
}

function ApplicationPageLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="h-5 w-36 rounded bg-muted" />
      <div className="h-12 w-64 rounded bg-muted" />
      <div className="h-32 rounded-2xl bg-muted" />
      <div className="h-72 rounded-2xl bg-muted" />
    </div>
  );
}
