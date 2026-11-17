
"use client";

import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  FileText,
  BriefcaseBusiness,
  Download,
  Search,
  GraduationCap,
  Building2,
  ChartNoAxesCombined,
} from "lucide-react";

type Student = {
  id: string;
  matricNumber: string;
  name: string | null;
  email: string;
  isActive: boolean;
  level: number | null;
  graduationYear: number | null;
  gender: string | null;
  applicationCount: number;
  placementCount: number;
};

type CountStat = {
  status: string;
  count: number;
};

type Props = {
  departmentName: string;
  students: Student[];
  levelStats: {
    level: number | null;
    count: number;
  }[];
  applicationStats: CountStat[];
  placementStats: CountStat[];
  companyStats: {
    name: string;
    industry: string | null;
    count: number;
  }[];
  summary: {
    totalStudents: number;
    activeStudents: number;
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    totalPlacements: number;
    activePlacements: number;
    completedPlacements: number;
  };
};

const applicationColors: Record<string, string> = {
  PENDING: "bg-amber-500",
  REVIEWING: "bg-blue-500",
  SHORTLISTED: "bg-purple-500",
  ACCEPTED: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-slate-400",
};

const placementColors: Record<string, string> = {
  ACTIVE: "bg-green-500",
  COMPLETED: "bg-blue-500",
  TERMINATED: "bg-red-500",
};

export default function DepartmentReports({
  departmentName,
  students,
  levelStats,
  applicationStats,
  placementStats,
  companyStats,
  summary,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name?.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query);

      const matchesLevel =
        selectedLevel === "ALL" ||
        student.level?.toString() === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [students, search, selectedLevel]);

  const stats = [
    {
      label: "Total Students",
      value: summary.totalStudents,
      description: "Registered in your department",
      icon: Users,
    },
    {
      label: "Active Accounts",
      value: summary.activeStudents,
      description: "Students with active accounts",
      icon: UserCheck,
    },
    {
      label: "Applications",
      value: summary.totalApplications,
      description: "Total internship applications",
      icon: FileText,
    },
    {
      label: "Placements",
      value: summary.totalPlacements,
      description: "Total SIWES placement records",
      icon: BriefcaseBusiness,
    },
  ];

  function exportCSV() {
    const headers = [
      "Student Name",
      "Matric Number",
      "Email",
      "Gender",
      "Level",
      "Graduation Year",
      "Account Status",
      "Applications",
      "Placements",
    ];

    const rows = students.map((student) => [
      student.name ?? "",
      student.matricNumber,
      student.email,
      student.gender ?? "",
      student.level?.toString() ?? "",
      student.graduationYear?.toString() ?? "",
      student.isActive ? "Active" : "Inactive",
      student.applicationCount.toString(),
      student.placementCount.toString(),
    ]);

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${departmentName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-student-report.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Report actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Department Summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your department's SIWES activities.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={students.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export Student Report
        </button>
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-card p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-4 text-2xl font-bold tracking-tight">
                {stat.value.toLocaleString()}
              </p>

              <p className="mt-1 text-sm font-semibold">{stat.label}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Application and placement overview */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Application Overview</h3>
              <p className="text-xs text-muted-foreground">
                Distribution by application status
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {applicationStats.length === 0 ? (
              <EmptyReport text="No application records available yet." />
            ) : (
              applicationStats.map((item) => (
                <StatusBar
                  key={item.status}
                  label={formatStatus(item.status)}
                  count={item.count}
                  total={summary.totalApplications}
                  color={applicationColors[item.status] ?? "bg-primary"}
                />
              ))
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Pending Applications
              </p>
              <p className="mt-1 text-xl font-bold">
                {summary.pendingApplications}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Accepted Applications
              </p>
              <p className="mt-1 text-xl font-bold">
                {summary.acceptedApplications}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Placement Overview</h3>
              <p className="text-xs text-muted-foreground">
                Distribution by placement status
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {placementStats.length === 0 ? (
              <EmptyReport text="No placement records available yet." />
            ) : (
              placementStats.map((item) => (
                <StatusBar
                  key={item.status}
                  label={formatStatus(item.status)}
                  count={item.count}
                  total={summary.totalPlacements}
                  color={placementColors[item.status] ?? "bg-primary"}
                />
              ))
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-5">
            <div>
              <p className="text-xs text-muted-foreground">
                Active Placements
              </p>
              <p className="mt-1 text-xl font-bold">
                {summary.activePlacements}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Completed Placements
              </p>
              <p className="mt-1 text-xl font-bold">
                {summary.completedPlacements}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic level distribution */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold">Student Distribution</h3>
            <p className="text-xs text-muted-foreground">
              Students grouped by academic level
            </p>
          </div>
        </div>

        {levelStats.length === 0 ? (
          <EmptyReport text="No student records available yet." />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {levelStats.map((item) => {
              const percentage =
                summary.totalStudents > 0
                  ? (item.count / summary.totalStudents) * 100
                  : 0;

              return (
                <div
                  key={item.level ?? "unknown"}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {item.level ? `${item.level} Level` : "Unspecified"}
                    </p>

                    <span className="text-sm font-bold">
                      {item.count}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of department students
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Company distribution */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold">Placement Companies</h3>
            <p className="text-xs text-muted-foreground">
              Companies currently or previously hosting your students
            </p>
          </div>
        </div>

        {companyStats.length === 0 ? (
          <EmptyReport text="Company placement records will appear here." />
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Industry</th>
                  <th className="pb-3 text-right font-medium">
                    Placements
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {companyStats.map((company) => (
                  <tr key={company.name}>
                    <td className="py-4 font-medium">{company.name}</td>
                    <td className="py-4 text-muted-foreground">
                      {company.industry || "Not specified"}
                    </td>
                    <td className="py-4 text-right font-semibold">
                      {company.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Student report */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Student Report</h3>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Academic and SIWES activity summary for each student.
            </p>
          </div>

          <span className="w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            {filteredStudents.length} of {students.length} Students
          </span>
        </div>

        <div className="flex flex-col gap-3 border-b p-5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or matric number..."
              className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            className="h-11 rounded-xl border bg-background px-4 text-sm outline-none focus:border-primary sm:w-44"
          >
            <option value="ALL">All Levels</option>
            {levelStats
              .filter(
                (item): item is { level: number; count: number } =>
                  item.level !== null,
              )
              .map((item) => (
                <option key={item.level} value={item.level.toString()}>
                  {item.level} Level
                </option>
              ))}
          </select>
        </div>

        {filteredStudents.length === 0 ? (
          <EmptyReport text="No students match your search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Student</th>
                  <th className="px-5 py-4 font-medium">Matric Number</th>
                  <th className="px-5 py-4 font-medium">Level</th>
                  <th className="px-5 py-4 font-medium">Applications</th>
                  <th className="px-5 py-4 font-medium">Placements</th>
                  <th className="px-5 py-4 font-medium">Account</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <p className="font-semibold">
                        {student.name || "Unnamed Student"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {student.matricNumber}
                    </td>

                    <td className="px-5 py-4">
                      {student.level
                        ? `${student.level} Level`
                        : "Not specified"}
                    </td>

                    <td className="px-5 py-4">
                      {student.applicationCount}
                    </td>

                    <td className="px-5 py-4">
                      {student.placementCount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          student.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold tabular-nums">
          {count}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            ({percentage.toFixed(1)}%)
          </span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EmptyReport({ text }: { text: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
