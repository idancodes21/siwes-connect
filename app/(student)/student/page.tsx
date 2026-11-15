
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}

async function StudentDashboardContent() {
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
      matricNumber: true,
      level: true,
      department: {
        select: {
          name: true,
          institution: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student profile not found.");
  }

  const now = new Date();

  const [
    totalApplications,
    underReview,
    shortlisted,
    activePlacements,
    recentApplications,
    recommendedInternships,
  ] = await Promise.all([
    prisma.application.count({
      where: {
        studentId: student.id,
      },
    }),

    prisma.application.count({
      where: {
        studentId: student.id,
        status: {
          in: ["PENDING", "REVIEWING"],
        },
      },
    }),

    prisma.application.count({
      where: {
        studentId: student.id,
        status: "SHORTLISTED",
      },
    }),

    prisma.placement.count({
      where: {
        studentId: student.id,
        status: "ACTIVE",
      },
    }),

    prisma.application.findMany({
      where: {
        studentId: student.id,
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        listing: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
      take: 4,
    }),

    prisma.internshipListing.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { deadline: null },
          { deadline: { gte: now } },
        ],
        applications: {
          none: {
            studentId: student.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        location: true,
        isRemote: true,
        durationMonths: true,
        deadline: true,
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
  ]);

  const stats = [
    {
      title: "Applications",
      value: totalApplications,
      description: "Your submitted applications",
      icon: FileText,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Under review",
      value: underReview,
      description: "Pending or being reviewed",
      icon: Clock3,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      description: "Applications you've been shortlisted for",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      title: "Active placements",
      value: activePlacements,
      description: "Your current SIWES placements",
      icon: BriefcaseBusiness,
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    },
  ];

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    REVIEWING: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    SHORTLISTED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    ACCEPTED: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    WITHDRAWN: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-primary">
          STUDENT DASHBOARD
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your SIWES applications and track your internship journey.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {student.department.name} · {student.department.institution.name}
        </p>
      </div>

      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap size={26} />
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Your SIWES journey starts here.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/80">
            Discover internship opportunities, connect with employers,
            and take the next step towards your professional career.
          </p>

          <Link
            href="/student/internships"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Explore internships
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border-[35px] border-white/10" />
      </section>

      {/* Activity statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your internship progress.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className={`flex size-11 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={21} />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {item.value}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent applications and opportunities */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">
                Recent applications
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Track your latest submissions.
              </p>
            </div>

            <Link
              href="/student/applications"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <Link
                  key={application.id}
                  href={`/student/applications/${application.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {application.listing.title}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 size={13} />
                      <span className="truncate">
                        {application.listing.company.name}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied {formatDate(application.appliedAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      statusStyles[application.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {application.status.replaceAll("_", " ")}
                  </span>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                <FileText className="mx-auto size-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No applications yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your submitted applications will appear here.
                </p>
                <Link
                  href="/student/internships"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Find internships <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended internships */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">
                Recommended internships
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent opportunities you haven't applied for.
              </p>
            </div>

            <Link
              href="/student/internships"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Browse all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recommendedInternships.length > 0 ? (
              recommendedInternships.map((internship) => (
                <Link
                  key={internship.id}
                  href={`/student/internships/${internship.id}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {internship.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 size={13} />
                        {internship.company.name}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {internship.isRemote
                        ? "Remote"
                        : internship.location || "Location not specified"}
                    </span>

                    {internship.durationMonths && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {internship.durationMonths} months
                      </span>
                    )}
                  </div>

                  {internship.deadline && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Deadline: {formatDate(internship.deadline)}
                    </p>
                  )}
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                <BriefcaseBusiness className="mx-auto size-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  No opportunities available
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  New published internships will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
