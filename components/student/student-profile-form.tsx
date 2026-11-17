"use client";

import { useActionState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  Building2,
  BookOpen,
  Hash,
  ShieldCheck,
  CalendarCheck,
  Loader2,
  Save,
  LockKeyhole,
} from "lucide-react";

import { updateStudentProfile } from "@/app/(student)/student/profile/actions";
import type { StudentProfileFormState } from "@/app/(student)/student/profile/actions";
import type { Prisma } from "@/app/generated/prisma/client";

type StudentProfileUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    phone: true;
    image: true;
    isActive: true;
    createdAt: true;
    student: {
      select: {
        id: true;
        matricNumber: true;
        gender: true;
        dateOfBirth: true;
        level: true;
        graduationYear: true;
        department: {
          select: {
            id: true;
            name: true;
            code: true;
            institution: {
              select: {
                id: true;
                name: true;
                acronym: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type StudentProfileFormProps = {
  user: StudentProfileUser & {
    student: NonNullable<StudentProfileUser["student"]>;
  };
};

const initialState: StudentProfileFormState = {
  success: false,
  message: "",
};

function formatDate(date: Date | null) {
  if (!date) return "";

  const parsed = new Date(date);

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatJoinedDate(date: Date) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string | null) {
  if (!name) return "ST";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function StudentProfileForm({
  user,
}: StudentProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateStudentProfile,
    initialState,
  );

  const student = user.student;
  const institution = student.department.institution;

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and academic profile.
        </p>
      </div>

      {/* Profile header */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name ?? "Student"}
                className="size-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-foreground">
              {user.name || "Student"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <GraduationCap className="size-3.5" />
                Student
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {user.isActive ? "Active Account" : "Inactive Account"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <form action={formAction} className="space-y-6">
        {/* Personal information */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Your basic personal details.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  defaultValue={user.name ?? ""}
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {state.errors?.name && (
                <p className="text-xs text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  value={user.email}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted/50 pl-10 pr-10 text-sm text-muted-foreground outline-none"
                />
                <LockKeyhole className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone ?? ""}
                  maxLength={20}
                  placeholder="Enter your phone number"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {state.errors?.phone && (
                <p className="text-xs text-red-500">
                  {state.errors.phone[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-foreground"
              >
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                defaultValue={student.gender ?? ""}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              {state.errors?.gender && (
                <p className="text-xs text-red-500">
                  {state.errors.gender[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="dateOfBirth"
                className="text-sm font-medium text-foreground"
              >
                Date of Birth
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={formatDate(student.dateOfBirth)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:max-w-md"
                />
              </div>

              {state.errors?.dateOfBirth && (
                <p className="text-xs text-red-500">
                  {state.errors.dateOfBirth[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Academic information */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <GraduationCap className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                Academic Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Your institution and academic details.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Institution
              </label>

              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={institution.name}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Department
              </label>

              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={student.department.name}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Matriculation Number
              </label>

              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={student.matricNumber}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted/50 pl-10 pr-4 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="text-sm font-medium text-foreground"
              >
                Current Academic Level
              </label>

              <select
                id="level"
                name="level"
                defaultValue={student.level?.toString() ?? ""}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select level</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
                <option value="600">600 Level</option>
                <option value="700">700 Level</option>
              </select>

              {state.errors?.level && (
                <p className="text-xs text-red-500">
                  {state.errors.level[0]}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="graduationYear"
                className="text-sm font-medium text-foreground"
              >
                Expected Graduation Year
              </label>

              <div className="relative">
                <CalendarCheck className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min={1900}
                  max={2200}
                  defaultValue={student.graduationYear ?? ""}
                  placeholder="e.g. 2027"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 sm:max-w-md"
                />
              </div>

              {state.errors?.graduationYear && (
                <p className="text-xs text-red-500">
                  {state.errors.graduationYear[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Form feedback */}
        {state.message && (
          <div
            role="status"
            className={`rounded-xl border p-4 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}