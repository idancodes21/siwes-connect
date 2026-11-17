import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  FileClock,
  BriefcaseBusiness,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

export default function HodDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <HodDashboardContent />
    </Suspense>
  );
}

async function HodDashboardContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "HOD") {
    redirect("/unauthorized");
  }

  const hod = await prisma.hodProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      departmentId: true,
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

  if (!hod) {
    redirect("/unauthorized");
  }

  const departmentId = hod.departmentId;

  const [
    totalStudents,
    pendingApplications,
    activePlacements,
    completedPlacements,
    recentApplications,
  ] = await Promise.all([
    prisma.studentProfile.count({
      where: { departmentId },
    }),

    prisma.application.count({
      where: {
        student: { departmentId },
        status: "PENDING",
      },
    }),

    prisma.placement.count({
      where: {
        student: { departmentId },
        status: "ACTIVE",
      },
    }),

    prisma.placement.count({
      where: {
        student: { departmentId },
        status: "COMPLETED",
      },
    }),

    prisma.application.findMany({
      where: {
        student: { departmentId },
      },
      select: {
        id: true,
        status: true,
        appliedAt: true,
        student: {
          select: {
            matricNumber: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        listing: {
          select: {
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
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      description: "Registered in your department",
      icon: Users,
    },
    {
      label: "Pending Applications",
      value: pendingApplications,
      description: "Applications awaiting review",
      icon: FileClock,
    },
    {
      label: "Active Placements",
      value: activePlacements,
      description: "Students currently on SIWES",
      icon: BriefcaseBusiness,
    },
    {
      label: "Completed Placements",
      value: completedPlacements,
      description: "Students who completed SIWES",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Department Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {hod.department.name} · {hod.department.institution.name}
          </p>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor your students, track internship applications, and oversee
            SIWES placements across your department.
          </p>
        </div>

        <Link
          href="/hod/students"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          View Students
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-5 text-2xl font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </p>

              <p className="mt-1 text-sm font-semibold">{stat.label}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Main dashboard content */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Recent Applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent internship applications from your students.
              </p>
            </div>

            <Link
              href="/hod/applications"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
              <FileClock className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">
                No application activity yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New applications from your department will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 divide-y">
              {recentApplications.map((application) => (
                <Link
                  key={application.id}
                  href={`/hod/applications/${application.id}`}
                  className="flex flex-col gap-3 py-4 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:px-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {application.student.user.name
                        ?.charAt(0)
                        .toUpperCase() ?? "S"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {application.student.user.name ?? "Unnamed Student"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {application.student.matricNumber}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {application.listing.title} ·{" "}
                        {application.listing.company.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <ApplicationStatus status={application.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(application.appliedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Quick Access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your department efficiently.
          </p>

          <div className="mt-5 space-y-2">
            <QuickLink
              href="/hod/students"
              icon={<Users className="h-5 w-5" />}
              label="Manage Students"
              description="View your department's students"
            />

            <QuickLink
              href="/hod/applications"
              icon={<FileClock className="h-5 w-5" />}
              label="Track Applications"
              description="Monitor internship applications"
            />

            <QuickLink
              href="/hod/placements"
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label="View Placements"
              description="Track student placements"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplicationStatus({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600",
    REVIEWING: "bg-blue-500/10 text-blue-600",
    SHORTLISTED: "bg-purple-500/10 text-purple-600",
    ACCEPTED: "bg-green-500/10 text-green-600",
    REJECTED: "bg-red-500/10 text-red-600",
    WITHDRAWN: "bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function QuickLink({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-primary/40 hover:bg-muted/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-2xl border bg-card" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl border bg-card lg:col-span-2" />
        <div className="h-80 rounded-2xl border bg-card" />
      </div>
    </div>
  );
}
