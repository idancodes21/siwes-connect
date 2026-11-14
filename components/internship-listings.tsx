"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  MapPin,
  Clock3,
  Users,
  CalendarDays,
  FileText,
  CheckCircle2,
  FileClock,
  Archive,
  Trash2,
  XCircle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import {
  publishInternship,
  closeInternship,
  archiveInternship,
  deleteInternship,
  type InternshipActionState,
} from "@/app/(employer)/employer/internships/actions";

type ListingStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";

type InternshipListing = {
  id: string;
  title: string;
  location: string | null;
  isRemote: boolean;
  durationMonths: number | null;
  positions: number;
  deadline: string | null;
  status: ListingStatus;
  createdAt: string;
  applicationsCount: number;
};

type Props = {
  listings: InternshipListing[];
};

const filters = [
  { label: "All Listings", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
] as const;

export default function InternshipListings({ listings }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: listings.length,
      published: listings.filter((item) => item.status === "PUBLISHED").length,
      drafts: listings.filter((item) => item.status === "DRAFT").length,
      closed: listings.filter((item) => item.status === "CLOSED").length,
    }),
    [listings],
  );

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "ALL" || listing.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [listings, search, activeFilter]);

  function runAction(
    action: (id: string) => Promise<InternshipActionState>,
    listingId: string,
    confirmation?: string,
  ) {
    if (confirmation && !window.confirm(confirmation)) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await action(listingId);

        setFeedback(result);

        if (result.success) {
          router.refresh();
        }
      } catch {
        setFeedback({
          success: false,
          message: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Employer Workspace
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Internship Listings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create, publish, and manage your company's internship opportunities.
          </p>
        </div>

        <Link
          href="/employer/internships/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Internship
        </Link>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Listings"
          value={counts.all}
          description="All internship opportunities"
          icon={BriefcaseBusiness}
        />

        <StatCard
          label="Published Listings"
          value={counts.published}
          description="Currently accepting applications"
          icon={CheckCircle2}
        />

        <StatCard
          label="Draft Listings"
          value={counts.drafts}
          description="Saved but not published"
          icon={FileClock}
        />

        <StatCard
          label="Closed Listings"
          value={counts.closed}
          description="No longer accepting applications"
          icon={XCircle}
        />
      </section>

      {/* Feedback */}
      {feedback && (
        <div
          role="status"
          className={`rounded-xl border p-4 text-sm ${
            feedback.success
              ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Listings */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="space-y-5 border-b p-5">
          <div>
            <h2 className="font-semibold">Your Opportunities</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage all internship opportunities created by your
              company.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search internship listings..."
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    activeFilter === filter.value
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>

            <h3 className="font-semibold">
              {listings.length === 0
                ? "No internship listings yet"
                : "No matching listings found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {listings.length === 0
                ? "Create your first internship opportunity to start receiving student applications."
                : "Try changing your search or selecting a different status filter."}
            </p>

            {listings.length === 0 && (
              <Link
                href="/employer/internships/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Internship
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredListings.map((listing) => (
              <InternshipCard
                key={listing.id}
                listing={listing}
                isPending={isPending}
                onPublish={() => runAction(publishInternship, listing.id)}
                onClose={() =>
                  runAction(
                    closeInternship,
                    listing.id,
                    "Are you sure you want to close this internship? Students will no longer be able to apply.",
                  )
                }
                onArchive={() =>
                  runAction(
                    archiveInternship,
                    listing.id,
                    "Are you sure you want to archive this internship?",
                  )
                }
                onDelete={() =>
                  runAction(
                    deleteInternship,
                    listing.id,
                    "Are you sure you want to delete this internship? This action cannot be undone.",
                  )
                }
              />
            ))}
          </div>
        )}

        {filteredListings.length > 0 && (
          <div className="border-t bg-muted/20 px-5 py-4">
            <p className="text-xs text-muted-foreground">
              Showing {filteredListings.length} of {listings.length} internship
              listings
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-5 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function InternshipCard({
  listing,
  isPending,
  onPublish,
  onClose,
  onArchive,
  onDelete,
}: {
  listing: InternshipListing;
  isPending: boolean;
  onPublish: () => void;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const statusStyles: Record<ListingStatus, string> = {
    PUBLISHED: "bg-green-500/10 text-green-700 dark:text-green-400",
    DRAFT: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    CLOSED: "bg-muted text-muted-foreground",
    ARCHIVED: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  };

  return (
    <article className="p-5 transition hover:bg-muted/20">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-semibold">{listing.title}</h3>

            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusStyles[listing.status]}`}
            >
              {listing.status.toLowerCase()}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {listing.isRemote
                ? "Remote"
                : listing.location || "Location not specified"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {listing.durationMonths
                ? `${listing.durationMonths} months`
                : "Duration not specified"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {listing.positions}{" "}
              {listing.positions === 1 ? "position" : "positions"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {listing.applicationsCount}{" "}
              {listing.applicationsCount === 1 ? "application" : "applications"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>
              Created{" "}
              {new Intl.DateTimeFormat("en-NG", {
                dateStyle: "medium",
              }).format(new Date(listing.createdAt))}
            </span>

            {listing.deadline && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Deadline:{" "}
                {new Intl.DateTimeFormat("en-NG", {
                  dateStyle: "medium",
                }).format(new Date(listing.deadline))}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {listing.status === "DRAFT" && (
            <button
              type="button"
              disabled={isPending}
              onClick={onPublish}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Publish
            </button>
          )}

          {listing.status === "PUBLISHED" && (
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Close Listing
            </button>
          )}

          {(listing.status === "DRAFT" || listing.status === "CLOSED") && (
            <button
              type="button"
              disabled={isPending}
              onClick={onArchive}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={onDelete}
            aria-label={`Delete ${listing.title}`}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
