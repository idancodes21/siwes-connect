import Link from "next/link";
import {
  BriefcaseBusiness,
  FileClock,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Building2,
  FileText,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import { Suspense } from "react";

export default function EmployerDashboardPage() {
  return (
    <Suspense fallback={<EmployerDashboardLoading />}>
      <EmployerDashboardContent />
    </Suspense>
  );
}

async function EmployerDashboardContent() {
  const { companyId } = await getEmployerContext();

  const [
    totalListings,
    publishedListings,
    applicationsReceived,
    activePlacements,
    recentApplications,
  ] = await Promise.all([
    prisma.internshipListing.count({
      where: {
        companyId,
      },
    }),

    prisma.internshipListing.count({
      where: {
        companyId,
        status: "PUBLISHED",
      },
    }),

    prisma.application.count({
      where: {
        listing: {
          companyId,
        },
      },
    }),

    prisma.placement.count({
      where: {
        companyId,
        status: "ACTIVE",
      },
    }),

    prisma.application.findMany({
      where: {
        listing: {
          companyId,
        },
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        listing: {
          select: {
            title: true,
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
      label: "Total Listings",
      value: totalListings,
      description: "All internship opportunities",
      icon: BriefcaseBusiness,
    },
    {
      label: "Published Listings",
      value: publishedListings,
      description: "Currently accepting applications",
      icon: CheckCircle2,
    },
    {
      label: "Applications Received",
      value: applicationsReceived,
      description: "Applications from students",
      icon: FileClock,
    },
    {
      label: "Active Placements",
      value: activePlacements,
      description: "Students currently on SIWES",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Employer Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to your Employer Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage your internship opportunities, review student applications,
            and keep track of your SIWES placements.
          </p>
        </div>

        <Link
          href="/employer/internships/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Post an Internship
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
                {stat.value}
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
                Keep up with students applying to your opportunities.
              </p>
            </div>

            <Link
              href="/employer/applications"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
              <FileClock className="mb-3 h-8 w-8 text-muted-foreground/50" />

              <p className="text-sm font-medium">No applications yet</p>

              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Applications submitted by students for your internship listings
                will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {application.student.user.name || "Unnamed Student"}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {application.student.user.email}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied for: {application.listing.title}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                      {application.status.toLowerCase().replace("_", " ")}
                    </span>

                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                      }).format(application.appliedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold">Quick Actions</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your recruitment activities.
          </p>

          <div className="mt-5 space-y-2">
            <QuickLink
              href="/employer/internships/create"
              icon={<Plus className="h-5 w-5" />}
              label="Post Internship"
              description="Create a new opportunity"
            />

            <QuickLink
              href="/employer/internships"
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              label="Manage Listings"
              description="View and manage opportunities"
            />

            <QuickLink
              href="/employer/applications"
              icon={<FileText className="h-5 w-5" />}
              label="Review Applications"
              description="Review student applications"
            />

            <QuickLink
              href="/employer/company"
              icon={<Building2 className="h-5 w-5" />}
              label="Company Profile"
              description="Update your company information"
            />
          </div>
        </div>
      </section>
    </div>
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
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function EmployerDashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
      <section className="space-y-3">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-8 w-80 max-w-full rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-2xl border bg-card" />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl border bg-card lg:col-span-2" />
        <div className="h-80 rounded-2xl border bg-card" />
      </section>
    </div>
  );
}
