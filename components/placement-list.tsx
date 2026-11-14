"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  ArrowUpRight,
  Inbox,
  UserRound,
  Building2,
} from "lucide-react";

type PlacementStatus = "ACTIVE" | "COMPLETED" | "TERMINATED";

type Placement = {
  id: string;
  status: PlacementStatus;
  startDate: string | null;
  endDate: string | null;
  supervisorName: string | null;
  supervisorEmail: string | null;
  supervisorPhone: string | null;
  createdAt: string;
  student: {
    matricNumber: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  };
  application: {
    id: string;
    listing: {
      id: string;
      title: string;
    };
  };
};

type PlacementStats = {
  total: number;
  active: number;
  completed: number;
  terminated: number;
};

type Props = {
  placements: Placement[];
  stats: PlacementStats;
};

const filters = [
  { label: "All Placements", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Terminated", value: "TERMINATED" },
] as const;

const statusStyles: Record<PlacementStatus, string> = {
  ACTIVE:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  COMPLETED:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  TERMINATED:
    "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
};

const statCards = [
  {
    label: "Total Placements",
    key: "total",
    description: "All student placements",
    icon: Users,
    iconStyle:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    label: "Active Placements",
    key: "active",
    description: "Students currently on SIWES",
    icon: Clock3,
    iconStyle:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    label: "Completed",
    key: "completed",
    description: "Successfully completed",
    icon: CheckCircle2,
    iconStyle:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    label: "Terminated",
    key: "terminated",
    description: "Ended before completion",
    icon: XCircle,
    iconStyle:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
] as const;

export default function PlacementList({
  placements,
  stats,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredPlacements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return placements.filter((placement) => {
      const matchesSearch =
        !query ||
        placement.student.user.name?.toLowerCase().includes(query) ||
        placement.student.user.email.toLowerCase().includes(query) ||
        placement.student.matricNumber.toLowerCase().includes(query) ||
        placement.application.listing.title.toLowerCase().includes(query) ||
        placement.supervisorName?.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === "ALL" ||
        placement.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [placements, search, activeFilter]);

  const formatDate = (date: string | null) => {
    if (!date) return "Not specified";

    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Placements
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track students placed at your company and monitor their SIWES progress.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
          <BriefcaseBusiness className="size-4" />
          <span>
            {stats.total} {stats.total === 1 ? "Placement" : "Placements"}
          </span>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
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

      {/* Placements list */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="space-y-5 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Student Placements
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and monitor students currently or previously placed at your company.
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

        {/* Placement cards */}
        <div className="divide-y">
          {filteredPlacements.length > 0 ? (
            filteredPlacements.map((placement) => {
              const name =
                placement.student.user.name || "Unnamed Student";

              const initials = name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={placement.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-muted/20"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    {/* Student information */}
                    <div className="flex min-w-0 items-start gap-3">
                      {placement.student.user.image ? (
                        <img
                          src={placement.student.user.image}
                          alt={name}
                          className="size-12 shrink-0 rounded-full border object-cover"
                        />
                      ) : (
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {initials || "ST"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-foreground">
                          {name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {placement.student.user.email}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="size-3.5" />
                            {placement.student.matricNumber}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <BriefcaseBusiness className="size-3.5" />
                            {placement.application.listing.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status and details link */}
                    <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${statusStyles[placement.status]}`}
                      >
                        {placement.status}
                      </span>

                      <Link
                        href={`/employer/placements/${placement.id}`}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                      >
                        View Details
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Placement information */}
                  <div className="grid gap-4 rounded-xl bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Start Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(placement.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          End Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(placement.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Company Supervisor
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {placement.supervisorName || "Not assigned"}
                        </p>
                      </div>
                    </div>
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
                {placements.length === 0
                  ? "No placements yet"
                  : "No matching placements"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {placements.length === 0
                  ? "Students accepted into your internship opportunities will appear here once their placements are created."
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

        {filteredPlacements.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {filteredPlacements.length} of {placements.length} placements
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
