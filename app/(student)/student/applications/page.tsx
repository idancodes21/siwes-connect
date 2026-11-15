import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import ApplicationList from "@/components/student/application-list";

function ApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<ApplicationsLoading />}>
      <ApplicationsContent />
    </Suspense>
  );
}

async function ApplicationsContent() {
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

  const applications = await prisma.application.findMany({
    where: {
      studentId: student.id,
    },
    select: {
      id: true,
      status: true,
      appliedAt: true,
      reviewedAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          location: true,
          isRemote: true,
          deadline: true,
          company: {
            select: {
              name: true,
              industry: true,
              city: true,
              state: true,
            },
          },
        },
      },
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  return <ApplicationList applications={applications} />;
}