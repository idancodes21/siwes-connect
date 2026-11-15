import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Building2,
  Laptop,
  MessageSquareText,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

const statusConfig = {
  PENDING: {
    label: "Pending",
    description: "Your application has been submitted and is awaiting review.",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  REVIEWING: {
    label: "Under Review",
    description: "The employer is currently reviewing your application.",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    description: "Congratulations! You have been shortlisted for this opportunity.",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
  ACCEPTED: {
    label: "Accepted",
    description: "Your application has been accepted by the employer.",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    description: "Unfortunately, your application was not successful.",
    className:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    description: "You withdrew this application.",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
} as const;

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ApplicationsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-muted" />
      <div className="h-48 rounded-2xl bg-muted" />
      <div className="h-64 rounded-2xl bg-muted" />
    </div>
  );
}

export default function ApplicationDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationDetailsContent params={params} />
    </Suspense>
  );
}

async function ApplicationDetailsContent({ params }: PageProps) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/unauthorized");
  }

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    redirect("/unauthorized");
  }

  const application = await prisma.application.findFirst({
    where: {
      id,
      studentId: student.id,
    },
    select: {
      id: true,
      status: true,
      coverLetter: true,
      appliedAt: true,
      reviewedAt: true,
      reviewNote: true,
      listing: {
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          responsibilities: true,
          location: true,
          isRemote: true,
          durationMonths: true,
          deadline: true,
          company: {
            select: {
              name: true,
              industry: true,
              city: true,
              state: true,
              country: true,
              website: true,
              description: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const status = statusConfig[application.status];
  const company = application.listing.company;

  const location =
    [application.listing.location, company.city, company.state, company.country]
      .filter(Boolean)
      .join(", ") || "Location not specified";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back navigation */}
      <Link
        href="/student/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to Applications
      </Link>

      {/* Application heading */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <FileText className="size-3.5" />
              Application Details
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {application.listing.title}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="size-4" />
              {company.name}
              {company.industry && ` · ${company.industry}`}
            </p>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {application.listing.isRemote ? (
              <Laptop className="mt-0.5 size-4 text-muted-foreground" />
            ) : (
              <BriefcaseBusiness className="mt-0.5 size-4 text-muted-foreground" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Work Arrangement</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {application.listing.isRemote ? "Remote" : "On-site"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {application.listing.durationMonths
                  ? `${application.listing.durationMonths} months`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Date Applied</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDate(application.appliedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Application Deadline</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {application.listing.deadline
                  ? formatDate(application.listing.deadline)
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application status */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Application Status
            </h2>
            <p className="text-sm text-muted-foreground">
              Track the progress of your application.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-muted/50 p-5">
          <p className="font-semibold text-foreground">{status.label}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {status.description}
          </p>

          {application.reviewedAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last reviewed on {formatDate(application.reviewedAt)}
            </p>
          )}
        </div>
      </section>

      {/* Employer feedback */}
      {application.reviewNote && (
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <MessageSquareText className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Employer Feedback
              </h2>
              <p className="text-sm text-muted-foreground">
                Feedback shared about your application.
              </p>
            </div>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {application.reviewNote}
          </p>
        </section>
      )}

      {/* Submitted cover letter */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Your Cover Letter
            </h2>
            <p className="text-sm text-muted-foreground">
              The cover letter you submitted with this application.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-muted/50 p-5">
          {application.coverLetter ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {application.coverLetter}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No cover letter was submitted with this application.
            </p>
          )}
        </div>
      </section>

      {/* Internship information */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-semibold text-foreground">
          About This Internship
        </h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {application.listing.description}
        </p>

        {application.listing.responsibilities && (
          <div className="mt-7">
            <h3 className="font-semibold text-foreground">
              Responsibilities
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {application.listing.responsibilities}
            </p>
          </div>
        )}

        {application.listing.requirements && (
          <div className="mt-7">
            <h3 className="font-semibold text-foreground">Requirements</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {application.listing.requirements}
            </p>
          </div>
        )}
      </section>

      {/* Company information */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-semibold text-foreground">About the Company</h2>

        {company.description ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {company.description}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No company description is available.
          </p>
        )}

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Visit company website
          </a>
        )}
      </section>
    </div>
  );
}