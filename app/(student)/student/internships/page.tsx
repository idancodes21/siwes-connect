
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import InternshipList from "@/components/student/internship-list";

export default function StudentInternshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading internship opportunities...
        </div>
      }
    >
      <InternshipsContent />
    </Suspense>
  );
}

async function InternshipsContent() {
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
    throw new Error("Student profile not found.");
  }

  const now = new Date();

  const internships = await prisma.internshipListing.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { deadline: null },
        { deadline: { gte: now } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      requirements: true,
      location: true,
      isRemote: true,
      durationMonths: true,
      positions: true,
      deadline: true,
      createdAt: true,
      company: {
        select: {
          name: true,
          industry: true,
          city: true,
          state: true,
        },
      },
      applications: {
        where: {
          studentId: student.id,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedInternships = internships.map((internship) => ({
    ...internship,
    deadline: internship.deadline?.toISOString() ?? null,
    createdAt: internship.createdAt.toISOString(),
    hasApplied: internship.applications.length > 0,
    applications: undefined,
  }));

  return <InternshipList internships={formattedInternships} />;
}
