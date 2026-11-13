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

const stats = [
  {
    label: "Total Listings",
    value: "—",
    description: "All internship opportunities",
    icon: BriefcaseBusiness,
  },
  {
    label: "Published Listings",
    value: "—",
    description: "Currently accepting applications",
    icon: CheckCircle2,
  },
  {
    label: "Applications Received",
    value: "—",
    description: "Applications from students",
    icon: FileClock,
  },
  {
    label: "Active Placements",
    value: "—",
    description: "Students currently on SIWES",
    icon: Users,
  },
];

export default function EmployerDashboardPage() {
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

          <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
            <FileClock className="mb-3 h-8 w-8 text-muted-foreground/50" />

            <p className="text-sm font-medium">No applications yet</p>

            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Applications submitted by students for your internship listings
              will appear here.
            </p>
          </div>
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
        <p className="mt-0.5 text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}