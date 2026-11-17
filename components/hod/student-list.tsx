"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  GraduationCap,
  FileText,
  BriefcaseBusiness,
  ArrowUpRight,
  Mail,
  Phone,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";

type Student = {
  id: string;
  matricNumber: string;
  gender: string | null;
  level: number | null;
  graduationYear: number | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    isActive: boolean;
  };
  _count: {
    applications: number;
    placements: number;
  };
};

export default function StudentList({
  students,
}: {
  students: Student[];
}) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const levels = useMemo(
    () =>
      Array.from(
        new Set(
          students
            .map((student) => student.level)
            .filter((level): level is number => level !== null),
        ),
      ).sort((a, b) => a - b),
    [students],
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.user.name?.toLowerCase().includes(query) ||
        student.user.email.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query);

      const matchesLevel =
        selectedLevel === "ALL" ||
        student.level?.toString() === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [students, search, selectedLevel]);

  const activeStudents = students.filter(
    (student) => student.user.isActive,
  ).length;

  const totalApplications = students.reduce(
    (total, student) => total + student._count.applications,
    0,
  );

  const totalPlacements = students.reduce(
    (total, student) => total + student._count.placements,
    0,
  );

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: Users,
      description: "Registered in your department",
    },
    {
      label: "Active Accounts",
      value: activeStudents,
      icon: GraduationCap,
      description: "Students with active accounts",
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
      description: "Total applications submitted",
    },
    {
      label: "Placements",
      value: totalPlacements,
      icon: BriefcaseBusiness,
      description: "Total placement records",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
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

              <p className="mt-1 text-sm font-semibold">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Student directory */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Student Directory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary sm:w-64"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <select
                value={selectedLevel}
                onChange={(event) =>
                  setSelectedLevel(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border bg-background pl-10 pr-9 text-sm outline-none transition focus:border-primary sm:w-40"
              >
                <option value="ALL">All Levels</option>

                {levels.map((level) => (
                  <option key={level} value={level.toString()}>
                    {level} Level
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Users className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              {students.length === 0
                ? "No students registered yet"
                : "No students found"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {students.length === 0
                ? "Students who register under your department will appear here."
                : "Try adjusting your search or changing the selected level."}
            </p>

            {(search || selectedLevel !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedLevel("ALL");
                }}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StudentCard({ student }: { student: Student }) {
  const initials = student.user.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "S";

  return (
    <div className="rounded-xl border p-4 transition hover:border-primary/40 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {student.user.image ? (
            <img
              src={student.user.image}
              alt={student.user.name ?? "Student"}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">
              {student.user.name ?? "Unnamed Student"}
            </h3>

            <p className="truncate text-xs text-muted-foreground">
              {student.matricNumber}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            student.user.isActive
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }`}
        >
          {student.user.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{student.user.email}</span>
        </div>

        {student.user.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{student.user.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
        <div>
          <p className="text-xs text-muted-foreground">Level</p>
          <p className="mt-1 text-sm font-semibold">
            {student.level ? `${student.level} Level` : "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Graduation Year</p>
          <p className="mt-1 text-sm font-semibold">
            {student.graduationYear ?? "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Applications</p>
          <p className="mt-1 text-sm font-semibold">
            {student._count.applications}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Placements</p>
          <p className="mt-1 text-sm font-semibold">
            {student._count.placements}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {student.gender
            ? student.gender.charAt(0) +
              student.gender.slice(1).toLowerCase()
            : "Gender not specified"}
        </span>

        <Link
          href={`/hod/students/${student.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
