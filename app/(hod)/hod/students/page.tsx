
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StudentList from "@/components/hod/student-list";

export default function HodStudentsPage() {
  return (
    <Suspense fallback={<StudentsLoading />}>
      <HodStudentsContent />
    </Suspense>
  );
}

async function HodStudentsContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "HOD") {
    redirect("/unauthorized");
  }

  const hod = await prisma.hodProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      departmentId: true,
      department: {
        select: {
          name: true,
          institution: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!hod) {
    redirect("/unauthorized");
  }

  const students = await prisma.studentProfile.findMany({
    where: {
      departmentId: hod.departmentId,
    },
    select: {
      id: true,
      matricNumber: true,
      gender: true,
      level: true,
      graduationYear: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true,
          isActive: true,
        },
      },
      _count: {
        select: {
          applications: true,
          placements: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Department Management
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Students
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View and monitor students registered under your department.
        </p>

        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {hod.department.name} · {hod.department.institution.name}
        </p>
      </div>

      <StudentList students={students} />
    </div>
  );
}

function StudentsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-72 max-w-full rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border bg-card"
          />
        ))}
      </div>

      <div className="h-96 rounded-2xl border bg-card" />
    </div>
  );
}
