
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Clock3,
  Eye,
  CheckCircle2,
  XCircle,
  FileClock,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  Inbox,
} from "lucide-react";

type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "SHORTLISTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

type Application = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter: string | null;
  reviewNote: string | null;
  student: {
    matricNumber: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  listing: {
    id: string;
    title: string;
  };
};

type ApplicationStats = {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
};

type Props = {
  applications: Application[];
  stats: ApplicationStats;
};

const filters = [
  { label: "All Applications", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewing", value: "REVIEWING" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
] as const;

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  REVIEWING: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  SHORTLISTED: "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  WITHDRAWN: "bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20",
};

const statCards = [
  {
    label: "Total Applications",
    key: "total",
    description: "Applications received",
    icon: Users,
    iconStyle: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    label: "Pending",
    key: "pending",
    description: "Awaiting review",
    icon: Clock3,
    iconStyle: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    label: "Reviewing",
    key: "reviewing",
    description: "Currently under review",
    icon: Eye,
    iconStyle: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    label: "Shortlisted",
    key: "shortlisted",
    description: "Selected for consideration",
    icon: FileClock,
    iconStyle: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    label: "Accepted",
    key: "accepted",
    description: "Successful applications",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    label: "Rejected",
    key: "rejected",
    description: "Unsuccessful applications",
    icon: XCircle,
    iconStyle: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
] as const;

export default function ApplicationList({
  applications,
  stats,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.student.user.name?.toLowerCase().includes(query) ||
        application.student.user.email.toLowerCase().includes(query) ||
        application.student.matricNumber.toLowerCase().includes(query) ||
        application.listing.title.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === "ALL" ||
        application.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, activeFilter]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Applications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review and manage applications submitted to your internship listings.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <BriefcaseBusiness className="size-4" />
          <span>
            {stats.total} {stats.total === 1 ? "Application" : "Applications"}
          </span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.key}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    {stats[stat.key]}
                  </p>
                </div>

                <div className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Applications */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="space-y-5 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Received Applications
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse applicants and review their submissions.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, matric number or internship..."
              className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Status filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {filter.label}
                {filter.value === "ALL" && (
                  <span className="ml-1.5 opacity-75">
                    {stats.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Application cards */}
        <div className="divide-y">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const name =
                application.student.user.name || "Unnamed Student";

              const initials = name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={application.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {application.student.user.image ? (
                      <img
                        src={application.student.user.image}
                        alt={name}
                        className="size-12 shrink-0 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials || "ST"}
                      </div>
                    )}

                    <div className="min-w-0 space-y-2">
                      <div>
                        <h3 className="truncate font-semibold text-foreground">
                          {name}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {application.student.user.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="size-3.5" />
                          {application.student.matricNumber}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BriefcaseBusiness className="size-3.5" />
                          {application.listing.title}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          {formatDate(application.appliedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${statusStyles[application.status]}`}
                    >
                      {application.status.replace("_", " ")}
                    </span>

                    <Link
                      href={`/employer/applications/${application.id}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                    >
                      Review
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <Inbox className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                {applications.length === 0
                  ? "No applications yet"
                  : "No matching applications"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {applications.length === 0
                  ? "Applications submitted by students to your internship listings will appear here."
                  : "Try adjusting your search or selecting a different status filter."}
              </p>

              {(search || activeFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("ALL");
                  }}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {filteredApplications.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
