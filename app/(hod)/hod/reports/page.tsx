
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DepartmentReports from "@/components/hod/department-reports";

export default function HodReportsPage() {
  return (
    <Suspense fallback={<ReportsLoading />}>
      <ReportsContent />
    </Suspense>
  );
}

async function ReportsContent() {
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

  const departmentId = hod.departmentId;

  const [
    students,
    levelGroups,
    applicationGroups,
    placementGroups,
    placements,
  ] = await Promise.all([
    prisma.studentProfile.findMany({
      where: { departmentId },
      select: {
        id: true,
        matricNumber: true,
        level: true,
        graduationYear: true,
        gender: true,
        user: {
          select: {
            name: true,
            email: true,
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
        matricNumber: "asc",
      },
    }),

    prisma.studentProfile.groupBy({
      by: ["level"],
      where: { departmentId },
      _count: {
        _all: true,
      },
      orderBy: {
        level: "asc",
      },
    }),

    prisma.application.groupBy({
      by: ["status"],
      where: {
        student: { departmentId },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.placement.groupBy({
      by: ["status"],
      where: {
        student: { departmentId },
      },
      _count: {
        _all: true,
      },
    }),

    prisma.placement.findMany({
      where: {
        student: { departmentId },
      },
      select: {
        company: {
          select: {
            name: true,
            industry: true,
          },
        },
      },
    }),
  ]);

  const applicationStats = applicationGroups.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));

  const placementStats = placementGroups.map((item) => ({
    status: item.status,
    count: item._count._all,
  }));

  const levelStats = levelGroups.map((item) => ({
    level: item.level,
    count: item._count._all,
  }));

  // Aggregate placements by company.
  const companyMap = new Map<
    string,
    { name: string; industry: string | null; count: number }
  >();

  for (const placement of placements) {
    const key = placement.company.name;
    const existing = companyMap.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      companyMap.set(key, {
        name: placement.company.name,
        industry: placement.company.industry,
        count: 1,
      });
    }
  }

  const companyStats = Array.from(companyMap.values()).sort(
    (a, b) => b.count - a.count,
  );

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.user.isActive,
  ).length;

  const totalApplications = applicationStats.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const totalPlacements = placementStats.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const completedPlacements =
    placementStats.find((item) => item.status === "COMPLETED")?.count ?? 0;

  const activePlacements =
    placementStats.find((item) => item.status === "ACTIVE")?.count ?? 0;

  const acceptedApplications =
    applicationStats.find((item) => item.status === "ACCEPTED")?.count ?? 0;

  const pendingApplications =
    applicationStats.find((item) => item.status === "PENDING")?.count ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          Department Analytics
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Reports
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Monitor student registration, internship applications, and SIWES
          placement outcomes across your department.
        </p>

        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {hod.department.name} · {hod.department.institution.name}
        </p>
      </div>

      <DepartmentReports
        departmentName={hod.department.name}
        students={students.map((student) => ({
          id: student.id,
          matricNumber: student.matricNumber,
          name: student.user.name,
          email: student.user.email,
          isActive: student.user.isActive,
          level: student.level,
          graduationYear: student.graduationYear,
          gender: student.gender,
          applicationCount: student._count.applications,
          placementCount: student._count.placements,
        }))}
        levelStats={levelStats}
        applicationStats={applicationStats}
        placementStats={placementStats}
        companyStats={companyStats}
        summary={{
          totalStudents,
          activeStudents,
          totalApplications,
          pendingApplications,
          acceptedApplications,
          totalPlacements,
          activePlacements,
          completedPlacements,
        }}
      />
    </div>
  );
}

function ReportsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border bg-card" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl border bg-card" />
        <div className="h-72 rounded-2xl border bg-card" />
      </div>

      <div className="h-96 rounded-2xl border bg-card" />
    </div>
  );
}
