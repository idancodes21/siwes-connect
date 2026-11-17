import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  BookOpen,
  FileText,
  BriefcaseBusiness,
  Building2,
  UserRound,
  MapPin,
} from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function HodStudentDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<StudentDetailsLoading />}>
      <StudentDetailsContent params={params} />
    </Suspense>
  );
}

async function StudentDetailsContent({ params }: PageProps) {
  const { id } = await params;

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
    },
  });

  if (!hod) {
    redirect("/unauthorized");
  }

  // Fetch only students belonging to this HOD's department.
  const student = await prisma.studentProfile.findFirst({
    where: {
      id,
      departmentId: hod.departmentId,
    },
    select: {
      id: true,
      matricNumber: true,
      gender: true,
      dateOfBirth: true,
      level: true,
      graduationYear: true,
      createdAt: true,

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

      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true,
          isActive: true,
          createdAt: true,
        },
      },

      applications: {
        orderBy: {
          appliedAt: "desc",
        },
        select: {
          id: true,
          status: true,
          appliedAt: true,
          reviewedAt: true,
          reviewNote: true,
          listing: {
            select: {
              title: true,
              location: true,
              isRemote: true,
              durationMonths: true,
              company: {
                select: {
                  name: true,
                  industry: true,
                },
              },
            },
          },
        },
      },

      placements: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          supervisorName: true,
          supervisorEmail: true,
          supervisorPhone: true,
          company: {
            select: {
              name: true,
              industry: true,
              city: true,
              state: true,
            },
          },
          application: {
            select: {
              listing: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Back navigation */}
      <Link
        href="/hod/students"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </Link>

      {/* Student profile header */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-xl font-bold text-primary sm:h-20 sm:w-20">
              {student.user.image ? (
                <Image
                  src={student.user.image}
                  alt={student.user.name ?? "Student"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                getInitials(student.user.name)
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {student.user.name ?? "Unnamed Student"}
                </h1>

                <StatusBadge
                  status={student.user.isActive ? "ACTIVE" : "INACTIVE"}
                />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {student.matricNumber}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {student.department.name} ·{" "}
                {student.department.institution.name}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">Academic Level</p>
            <p className="mt-1 text-lg font-bold">
              {student.level ? `${student.level} Level` : "Not specified"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={<Mail />}
            label="Email Address"
            value={student.user.email}
          />

          <InfoItem
            icon={<Phone />}
            label="Phone Number"
            value={student.user.phone}
          />

          <InfoItem
            icon={<UserRound />}
            label="Gender"
            value={student.gender ? formatEnum(student.gender) : null}
          />

          <InfoItem
            icon={<CalendarDays />}
            label="Date of Birth"
            value={formatDate(student.dateOfBirth)}
          />

          <InfoItem
            icon={<GraduationCap />}
            label="Graduation Year"
            value={student.graduationYear?.toString() ?? null}
          />

          <InfoItem
            icon={<CalendarDays />}
            label="Registered On"
            value={formatDate(student.user.createdAt)}
          />
        </div>
      </section>

      {/* Summary statistics */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<FileText />}
          label="Applications"
          value={student.applications.length}
          description="Internship applications submitted"
        />

        <SummaryCard
          icon={<BriefcaseBusiness />}
          label="Placements"
          value={student.placements.length}
          description="Total SIWES placement records"
        />

        <SummaryCard
          icon={<GraduationCap />}
          label="Active Placements"
          value={
            student.placements.filter(
              (placement) => placement.status === "ACTIVE",
            ).length
          }
          description="Currently undergoing SIWES"
        />
      </section>

      {/* Application history */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Application History</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Internship applications submitted by this student.
              </p>
            </div>

            <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {student.applications.length} Applications
            </span>
          </div>
        </div>

        {student.applications.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No applications yet"
            description="This student has not submitted any internship applications."
          />
        ) : (
          <div className="divide-y">
            {student.applications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">
                      {application.listing.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {application.listing.company.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied {formatDate(application.appliedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <StatusBadge status={application.status} />

                  <Link
                    href={`/hod/applications/${application.id}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View application
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Placement history */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">SIWES Placement History</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Companies and placements associated with this student.
              </p>
            </div>

            <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {student.placements.length} Placements
            </span>
          </div>
        </div>

        {student.placements.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness />}
            title="No placements yet"
            description="Placement records for this student will appear here."
          />
        ) : (
          <div className="divide-y">
            {student.placements.map((placement) => (
              <div key={placement.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">
                        {placement.application.listing.title}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {placement.company.name}
                      </p>

                      {placement.company.city || placement.company.state ? (
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {[placement.company.city, placement.company.state]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <StatusBadge status={placement.status} />
                </div>

                <div className="mt-5 grid gap-4 rounded-xl bg-muted/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <PlacementInfo
                    label="Start Date"
                    value={formatDate(placement.startDate)}
                  />

                  <PlacementInfo
                    label="End Date"
                    value={formatDate(placement.endDate)}
                  />

                  <PlacementInfo
                    label="Supervisor"
                    value={placement.supervisorName}
                  />

                  <PlacementInfo
                    label="Industry"
                    value={placement.company.industry}
                  />
                </div>

                {(placement.supervisorEmail || placement.supervisorPhone) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    {placement.supervisorEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {placement.supervisorEmail}
                      </span>
                    )}

                    {placement.supervisorPhone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {placement.supervisorPhone}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function PlacementInfo({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-600",
    INACTIVE: "bg-red-500/10 text-red-600",
    PENDING: "bg-amber-500/10 text-amber-600",
    REVIEWING: "bg-blue-500/10 text-blue-600",
    SHORTLISTED: "bg-purple-500/10 text-purple-600",
    ACCEPTED: "bg-green-500/10 text-green-600",
    REJECTED: "bg-red-500/10 text-red-600",
    WITHDRAWN: "bg-muted text-muted-foreground",
    COMPLETED: "bg-blue-500/10 text-blue-600",
    TERMINATED: "bg-red-500/10 text-red-600",
  };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {formatEnum(status)}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function formatDate(date: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatEnum(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function getInitials(name: string | null) {
  if (!name) return "S";

  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}

function StudentDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      <div className="h-5 w-36 rounded bg-muted" />
      <div className="h-64 rounded-2xl border bg-card" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl border bg-card" />
        ))}
      </div>
      <div className="h-72 rounded-2xl border bg-card" />
      <div className="h-72 rounded-2xl border bg-card" />
    </div>
  );
}
