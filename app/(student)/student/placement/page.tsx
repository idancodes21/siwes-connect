import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import PlacementList from "@/components/student/placement-list";

function PlacementLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export default function PlacementPage() {
  return (
    <Suspense fallback={<PlacementLoading />}>
      <PlacementContent />
    </Suspense>
  );
}

async function PlacementContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/unauthorized");
  }

  const student = await prisma.studentProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!student) {
    redirect("/unauthorized");
  }

  const placements = await prisma.placement.findMany({
    where: {
      studentId: student.id,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
      supervisorName: true,
      supervisorEmail: true,
      supervisorPhone: true,
      company: {
        select: {
          name: true,
          industry: true,
          address: true,
          city: true,
          state: true,
          country: true,
          website: true,
        },
      },
      application: {
        select: {
          id: true,
          listing: {
            select: {
              id: true,
              title: true,
              location: true,
              isRemote: true,
              durationMonths: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <PlacementList placements={placements} />;
}