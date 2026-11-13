import Link from "next/link";
import {
  Users,
  FileClock,
  BriefcaseBusiness,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Students",
    value: "—",
    description: "Registered in your department",
    icon: Users,
  },
  {
    label: "Pending Applications",
    value: "—",
    description: "Applications awaiting review",
    icon: FileClock,
  },
  {
    label: "Active Placements",
    value: "—",
    description: "Students currently on SIWES",
    icon: BriefcaseBusiness,
  },
  {
    label: "Completed Placements",
    value: "—",
    description: "Students who completed SIWES",
    icon: GraduationCap,
  },
];

export default function HodDashboardPage() {
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

          <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center">
            <FileClock className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No application activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New applications from your department will appear here.
            </p>
          </div>
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