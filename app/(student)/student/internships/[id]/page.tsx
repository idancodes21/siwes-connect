import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Wifi,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function InternshipDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<InternshipDetailsLoading />}>
      <InternshipDetailsContent params={params} />
    </Suspense>
  );
}

async function InternshipDetailsContent({ params }: PageProps) {
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
      description: true,
      requirements: true,
      responsibilities: true,
      location: true,
      isRemote: true,
      durationMonths: true,
      positions: true,
      deadline: true,
      status: true,
      createdAt: true,
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
      applications: {
        where: { studentId: student.id },
        select: {
          id: true,
          status: true,
          appliedAt: true,
        },
        take: 1,
      },
    },
  });

  if (
    !internship ||
    !["PUBLISHED", "CLOSED"].includes(internship.status)
  ) {
    notFound();
  }

  const application = internship.applications[0] ?? null;
  const isExpired = internship.deadline
    ? internship.deadline < new Date()
    : false;

  const canApply =
    internship.status === "PUBLISHED" &&
    !isExpired &&
    !application;

  const location = [
    internship.location,
    internship.company.city,
    internship.company.state,
    internship.company.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/student/internships"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft size={17} />
        Back to internships
      </Link>

      {/* Internship heading */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 size={27} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {internship.title}
              </h1>
              <p className="mt-2 font-medium text-foreground">
                {internship.company.name}
              </p>
              {internship.company.industry && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {internship.company.industry}
                </p>
              )}
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              internship.status === "CLOSED" || isExpired
                ? "bg-muted text-muted-foreground"
                : "bg-green-500/10 text-green-600"
            }`}
          >
            {internship.status === "CLOSED"
              ? "Closed"
              : isExpired
                ? "Deadline passed"
                : "Open"}
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin size={17} />
            {location || "Location not specified"}
          </span>

          <span className="flex items-center gap-2">
            <Clock3 size={17} />
            {internship.durationMonths
              ? `${internship.durationMonths} months`
              : "Duration not specified"}
          </span>

          <span className="flex items-center gap-2">
            <Users size={17} />
            {internship.positions}{" "}
            {internship.positions === 1 ? "position" : "positions"}
          </span>

          <span className="flex items-center gap-2">
            {internship.isRemote ? (
              <Wifi size={17} />
            ) : (
              <BriefcaseBusiness size={17} />
            )}
            {internship.isRemote ? "Remote" : "On-site"}
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main details */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              About this internship
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {internship.description}
            </p>
          </section>

          {internship.responsibilities && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Responsibilities
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {internship.responsibilities}
              </p>
            </section>
          )}

          {internship.requirements && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Requirements
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {internship.requirements}
              </p>
            </section>
          )}

          {internship.company.description && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                About the company
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {internship.company.description}
              </p>

              {internship.company.website && (
                <a
                  href={internship.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Visit company website
                </a>
              )}
            </section>
          )}
        </div>

        {/* Application panel */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">
            Application details
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Application deadline</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays size={16} />
                {internship.deadline
                  ? internship.deadline.toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "No deadline specified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Positions available</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {internship.positions}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            {application ? (
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Application submitted
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Current status: {application.status.replace("_", " ")}
                </p>
                <Link
                  href={`/student/applications/${application.id}`}
                  className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  View application
                </Link>
              </div>
            ) : canApply ? (
              <Link
                href={`/student/internships/${internship.id}/apply`}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply for this internship
              </Link>
            ) : (
              <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                Applications are currently unavailable for this internship.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function InternshipDetailsLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
      <div className="h-5 w-36 rounded bg-muted" />
      <div className="h-48 rounded-2xl bg-muted" />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="h-56 rounded-2xl bg-muted" />
          <div className="h-40 rounded-2xl bg-muted" />
        </div>
        <div className="h-64 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
