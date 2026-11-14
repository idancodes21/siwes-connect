
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import ApplicationList from "@/components/application-list";

export default function EmployerApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationsContent />
    </Suspense>
  );
}

async function ApplicationsContent() {
  const { companyId } = await getEmployerContext();

  const where = {
    listing: {
      companyId,
    },
  };

  const [
    total,
    pending,
    reviewing,
    shortlisted,
    accepted,
    rejected,
    applications,
  ] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.count({
      where: { ...where, status: "PENDING" },
    }),
    prisma.application.count({
      where: { ...where, status: "REVIEWING" },
    }),
    prisma.application.count({
      where: { ...where, status: "SHORTLISTED" },
    }),
    prisma.application.count({
      where: { ...where, status: "ACCEPTED" },
    }),
    prisma.application.count({
      where: { ...where, status: "REJECTED" },
    }),
    prisma.application.findMany({
      where,
      select: {
        id: true,
        status: true,
        appliedAt: true,
        coverLetter: true,
        reviewNote: true,
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
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    }),
  ]);

  const serializedApplications = applications.map((application) => ({
    ...application,
    appliedAt: application.appliedAt.toISOString(),
  }));

  const stats = {
    total,
    pending,
    reviewing,
    shortlisted,
    accepted,
    rejected,
  };

  return (
    <ApplicationList
      applications={serializedApplications}
      stats={stats}
    />
  );
}

function ApplicationsLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
      <div className="h-9 w-64 rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
