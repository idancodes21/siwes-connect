
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import InternshipListings from "@/components/internship-listings";

export default function EmployerInternshipsPage() {
  return (
    <Suspense fallback={<InternshipListingsLoading />}>
      <InternshipListingsContent />
    </Suspense>
  );
}

async function InternshipListingsContent() {
  const { companyId } = await getEmployerContext();

  const listings = await prisma.internshipListing.findMany({
    where: {
      companyId,
    },
    select: {
      id: true,
      title: true,
      location: true,
      isRemote: true,
      durationMonths: true,
      positions: true,
      deadline: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    location: listing.location,
    isRemote: listing.isRemote,
    durationMonths: listing.durationMonths,
    positions: listing.positions,
    deadline: listing.deadline?.toISOString() ?? null,
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
    applicationsCount: listing._count.applications,
  }));

  return <InternshipListings listings={serializedListings} />;
}

function InternshipListingsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border bg-card" />
        ))}
      </div>

      <div className="h-20 rounded-2xl border bg-card" />
      <div className="h-72 rounded-2xl border bg-card" />
    </div>
  );
}
