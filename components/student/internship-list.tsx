"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";

type Internship = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  isRemote: boolean;
  durationMonths: number | null;
  positions: number;
  deadline: string | null;
  createdAt: string;
  hasApplied: boolean;
  company: {
    name: string;
    industry: string | null;
    city: string | null;
    state: string | null;
  };
};

type Props = {
  internships: Internship[];
};

export default function InternshipList({ internships }: Props) {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [applicationFilter, setApplicationFilter] = useState("ALL");

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        internships
          .map((internship) =>
            [internship.company.city, internship.company.state]
              .filter(Boolean)
              .join(", ")
          )
          .filter(Boolean)
      )
    ).sort();
  }, [internships]);

  const filteredInternships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return internships.filter((internship) => {
      const matchesSearch =
        !query ||
        internship.title.toLowerCase().includes(query) ||
        internship.company.name.toLowerCase().includes(query) ||
        (internship.company.industry ?? "").toLowerCase().includes(query);

      const location = [
        internship.company.city,
        internship.company.state,
      ]
        .filter(Boolean)
        .join(", ");

      const matchesLocation =
        locationFilter === "ALL" || location === locationFilter;

      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "REMOTE" && internship.isRemote) ||
        (typeFilter === "ONSITE" && !internship.isRemote);

      const matchesApplication =
        applicationFilter === "ALL" ||
        (applicationFilter === "APPLIED" && internship.hasApplied) ||
        (applicationFilter === "NOT_APPLIED" && !internship.hasApplied);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesApplication
      );
    });
  }, [internships, search, locationFilter, typeFilter, applicationFilter]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("ALL");
    setTypeFilter("ALL");
    setApplicationFilter("ALL");
  };

  const hasActiveFilters =
    search !== "" ||
    locationFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    applicationFilter !== "ALL";

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div>
        <p className="text-sm font-medium text-primary">
          CAREER OPPORTUNITIES
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Find Internships
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore internship opportunities, discover companies, and find
          the right place to begin your professional journey.
        </p>
      </div>

      {/* Search and filters */}
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by internship title, company or industry..."
            className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Filters
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label
              htmlFor="location-filter"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Location
            </label>
            <select
              id="location-filter"
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="ALL">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="type-filter"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Work arrangement
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="ALL">All arrangements</option>
              <option value="ONSITE">On-site</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="application-filter"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Application status
            </label>
            <select
              id="application-filter"
              value={applicationFilter}
              onChange={(event) =>
                setApplicationFilter(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="ALL">All opportunities</option>
              <option value="NOT_APPLIED">Not applied</option>
              <option value="APPLIED">Already applied</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results heading */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Available opportunities
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredInternships.length} of {internships.length}{" "}
              opportunities
            </p>
          </div>
        </div>

        {filteredInternships.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredInternships.map((internship) => (
              <article
                key={internship.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BriefcaseBusiness size={23} />
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    {internship.isRemote && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                        <Wifi size={13} />
                        Remote
                      </span>
                    )}

                    {internship.hasApplied && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {internship.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 size={15} />
                    {internship.company.name}
                  </p>

                  {internship.company.industry && (
                    <span className="mt-3 inline-block rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {internship.company.industry}
                    </span>
                  )}
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {internship.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                        {internship.isRemote
                          ? "Remote"
                          : internship.location ||
                            [internship.company.city, internship.company.state]
                              .filter(Boolean)
                              .join(", ") ||
                            "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {internship.durationMonths
                          ? `${internship.durationMonths} months`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Available positions
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {internship.positions}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Application deadline
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {internship.deadline
                          ? formatDate(internship.deadline)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <Link
                    href={`/student/internships/${internship.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {internship.hasApplied
                      ? "View application opportunity"
                      : "View internship details"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              No internships found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {internships.length === 0
                ? "There are no published internship opportunities available right now. Please check back later."
                : "Try adjusting your search or filters to find more opportunities."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 text-sm font-semibold text-primary hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
