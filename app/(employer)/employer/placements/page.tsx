
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import PlacementList from "@/components/placement-list";

export default function EmployerPlacementsPage() {
  return (
    <Suspense fallback={<PlacementsLoading />}>
      <PlacementsContent />
    </Suspense>
  );
}

async function PlacementsContent() {
  const { companyId } = await getEmployerContext();

  const where = { companyId };

  const [
    total,
    active,
    completed,
    terminated,
    placements,
  ] = await Promise.all([
    prisma.placement.count({ where }),

    prisma.placement.count({
      where: { ...where, status: "ACTIVE" },
    }),

    prisma.placement.count({
      where: { ...where, status: "COMPLETED" },
    }),

    prisma.placement.count({
      where: { ...where, status: "TERMINATED" },
    }),

    prisma.placement.findMany({
      where,
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        supervisorName: true,
        supervisorEmail: true,
        supervisorPhone: true,
        createdAt: true,

        student: {
          select: {
            matricNumber: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },

        application: {
          select: {
            id: true,
            listing: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const serializedPlacements = placements.map((placement) => ({
    ...placement,
    startDate: placement.startDate?.toISOString() ?? null,
    endDate: placement.endDate?.toISOString() ?? null,
    createdAt: placement.createdAt.toISOString(),
  }));

  return (
    <PlacementList
      placements={serializedPlacements}
      stats={{
        total,
        active,
        completed,
        terminated,
      }}
    />
  );
}

function PlacementsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-9 w-64 rounded-lg bg-muted" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl bg-muted"
          />
        ))}
      </div>

      <div className="h-96 rounded-2xl bg-muted" />
    </div>
  );
}
