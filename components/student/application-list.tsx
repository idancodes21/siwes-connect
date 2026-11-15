"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  Laptop,
} from "lucide-react";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

type ApplicationItem = {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  reviewedAt: Date | null;
  listing: {
    id: string;
    title: string;
    location: string | null;
    isRemote: boolean;
    deadline: Date | null;
    company: {
      name: string;
      industry: string | null;
      city: string | null;
      state: string | null;
    };
  };
};

type ApplicationListProps = {
  applications: ApplicationItem[];
};

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  REVIEWING: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

const filters = [
  { label: "All Applications", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "REVIEWING" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
] as const;

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationList({
  applications,
}: ApplicationListProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const stats = useMemo(
    () => [
      {
        label: "Total Applications",
        value: applications.length,
        icon: FileText,
        iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      },
      {
        label: "Pending",
        value: applications.filter((app) => app.status === "PENDING").length,
        icon: Clock3,
        iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      },
      {
        label: "Under Review",
        value: applications.filter((app) => app.status === "REVIEWING").length,
        icon: BriefcaseBusiness,
        iconClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      },
      {
        label: "Shortlisted",
        value: applications.filter((app) => app.status === "SHORTLISTED").length,
        icon: CheckCircle2,
        iconClass: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      },
      {
        label: "Accepted",
        value: applications.filter((app) => app.status === "ACCEPTED").length,
        icon: CheckCircle2,
        iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      },
    ],
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.listing.title.toLowerCase().includes(query) ||
        application.listing.company.name.toLowerCase().includes(query) ||
        (application.listing.company.industry ?? "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        activeFilter === "ALL" || application.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, activeFilter]);

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Applications
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track your internship applications and stay updated on their progress.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="size-5" />
                </div>
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {stat.value}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by internship or company..."
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter.label}
                {filter.value === "ALL" && (
                  <span className="ml-2 opacity-75">
                    {applications.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Application list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {activeFilter === "ALL"
              ? "All Applications"
              : `${filters.find((filter) => filter.value === activeFilter)?.label} Applications`}
          </h2>

          <span className="text-xs text-muted-foreground">
            {filteredApplications.length}{" "}
            {filteredApplications.length === 1 ? "result" : "results"}
          </span>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              {applications.length === 0
                ? "No applications yet"
                : "No applications found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {applications.length === 0
                ? "You haven't applied for any internships yet. Explore available opportunities and submit your first application."
                : "Try changing your search or selecting a different status filter."}
            </p>

            {applications.length === 0 && (
              <Link
                href="/student/internships"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Explore Internships
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((application) => {
              const status = statusConfig[application.status];
              const company = application.listing.company;

              const location =
                [company.city, company.state].filter(Boolean).join(", ") ||
                application.listing.location;

              return (
                <div
                  key={application.id}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30 sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        {application.listing.isRemote && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <Laptop className="size-3.5" />
                            Remote
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-base font-semibold text-foreground sm:text-lg">
                        {application.listing.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-muted-foreground">
                        {company.name}
                        {company.industry && ` · ${company.industry}`}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        {location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5" />
                            {location}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          Applied {formatDate(application.appliedAt)}
                        </span>

                        {application.reviewedAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5" />
                            Reviewed {formatDate(application.reviewedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/student/applications/${application.id}`}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                      View Details
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}