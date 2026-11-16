"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Laptop,
  MapPin,
  Phone,
  Mail,
  UserRound,
} from "lucide-react";

type PlacementStatus = "ACTIVE" | "COMPLETED" | "TERMINATED";

type PlacementItem = {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  status: PlacementStatus;
  supervisorName: string | null;
  supervisorEmail: string | null;
  supervisorPhone: string | null;
  company: {
    name: string;
    industry: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string;
    website: string | null;
  };
  application: {
    id: string;
    listing: {
      id: string;
      title: string;
      location: string | null;
      isRemote: boolean;
      durationMonths: number | null;
    };
  };
};

type PlacementListProps = {
  placements: PlacementItem[];
};

const statusConfig: Record<
  PlacementStatus,
  { label: string; description: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    description: "Your SIWES placement is currently ongoing.",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  COMPLETED: {
    label: "Completed",
    description: "You have completed this SIWES placement.",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  TERMINATED: {
    label: "Terminated",
    description: "This placement has been terminated.",
    className:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
};

function formatDate(date: Date | null) {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PlacementList({
  placements,
}: PlacementListProps) {
  const stats = useMemo(
    () => [
      {
        label: "Total Placements",
        value: placements.length,
        icon: BriefcaseBusiness,
        iconClass:
          "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      },
      {
        label: "Active",
        value: placements.filter((item) => item.status === "ACTIVE").length,
        icon: Clock3,
        iconClass:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      },
      {
        label: "Completed",
        value: placements.filter((item) => item.status === "COMPLETED").length,
        icon: CheckCircle2,
        iconClass:
          "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
      },
      {
        label: "Terminated",
        value: placements.filter((item) => item.status === "TERMINATED").length,
        icon: FileText,
        iconClass:
          "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
      },
    ],
    [placements],
  );

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Placement
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View your SIWES placement details, track your progress and access
          your supervisor&apos;s contact information.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Placements */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Placement Records
          </h2>

          <span className="text-xs text-muted-foreground">
            {placements.length}{" "}
            {placements.length === 1 ? "placement" : "placements"}
          </span>
        </div>

        {placements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <BriefcaseBusiness className="size-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              No placement yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              You don&apos;t have an active SIWES placement record yet. Keep
              exploring opportunities and tracking your applications.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/student/internships"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Explore Internships
                <ExternalLink className="size-4" />
              </Link>

              <Link
                href="/student/applications"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                My Applications
                <FileText className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            {placements.map((placement) => {
              const status = statusConfig[placement.status];
              const company = placement.company;
              const internship = placement.application.listing;

              const location = [
                company.city,
                company.state,
                company.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <article
                  key={placement.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  {/* Placement header */}
                  <div className="border-b border-border p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Building2 className="size-6" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground sm:text-lg">
                            {company.name}
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {company.industry || "Industry not specified"}
                          </p>

                          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {location || "Location not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {status.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Placement details */}
                  <div className="grid gap-5 border-b border-border p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <BriefcaseBusiness className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Internship Position
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {internship.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      {internship.isRemote ? (
                        <Laptop className="mt-0.5 size-4 text-muted-foreground" />
                      ) : (
                        <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Work Arrangement
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {internship.isRemote ? "Remote" : "On-site"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {internship.durationMonths
                            ? `${internship.durationMonths} months`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Start Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(placement.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Expected End Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(placement.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supervisor information */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">
                        Workplace Supervisor
                      </h4>
                    </div>

                    {placement.supervisorName ||
                    placement.supervisorEmail ||
                    placement.supervisorPhone ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {placement.supervisorName && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Supervisor Name
                            </p>
                            <p className="mt-1 text-sm font-medium text-foreground">
                              {placement.supervisorName}
                            </p>
                          </div>
                        )}

                        {placement.supervisorEmail && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Email Address
                            </p>
                            <a
                              href={`mailto:${placement.supervisorEmail}`}
                              className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                              <Mail className="size-3.5" />
                              {placement.supervisorEmail}
                            </a>
                          </div>
                        )}

                        {placement.supervisorPhone && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Phone Number
                            </p>
                            <a
                              href={`tel:${placement.supervisorPhone}`}
                              className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                              <Phone className="size-3.5" />
                              {placement.supervisorPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Supervisor information has not been provided yet.
                      </p>
                    )}

                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        Visit company website
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}

                    <div className="mt-5 border-t border-border pt-4">
                      <Link
                        href={`/student/applications/${placement.application.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
                      >
                        View original application
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}