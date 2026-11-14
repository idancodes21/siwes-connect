"use client";

import { useActionState } from "react";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  BriefcaseBusiness,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { updateEmployerProfile } from "@/app/(employer)/employer/profile/actions";
import type { EmployerProfileFormState } from "@/app/(employer)/employer/profile/actions";

type EmployerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  jobTitle: string;
  companyName: string;
};

type Props = {
  profile: EmployerProfile;
};

const initialState: EmployerProfileFormState = {
  success: false,
  message: "",
};

export default function EmployerProfileForm({ profile }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateEmployerProfile,
    initialState,
  );

  const joinedDate = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(profile.createdAt));

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your personal and professional account information.
        </p>
      </div>

      {/* Profile overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {profile.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || <UserRound className="size-8" />}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile.jobTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                Employer
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  profile.isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {profile.isActive ? "Active account" : "Inactive account"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Personal information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <UserRound className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your personal details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                defaultValue={profile.name}
                required
                className={inputClass}
                placeholder="Enter your full name"
              />
              {state.errors?.name && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  value={profile.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed pl-11 opacity-70`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Contact support if you need to change your email.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your phone number"
                />
              </div>
              {state.errors?.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.phone[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Professional information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Professional Information
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your role and company affiliation.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="jobTitle" className={labelClass}>
                Job Title
              </label>
              <input
                id="jobTitle"
                name="jobTitle"
                defaultValue={profile.jobTitle}
                required
                className={inputClass}
                placeholder="e.g. HR Manager"
              />
              {state.errors?.jobTitle && (
                <p className="mt-1 text-xs text-red-500">
                  {state.errors.jobTitle[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className={labelClass}>
                Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="companyName"
                  value={profile.companyName}
                  readOnly
                  className={`${inputClass} cursor-not-allowed pl-11 opacity-70`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Account information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Account Information
                </h3>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  An overview of your SIWES Connect account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Account Type */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <UserRound className="size-4" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Account Type
              </p>
              <p className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                Employer
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Employer account
              </p>
            </div>

            {/* Account Status */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div
                className={`mb-4 flex size-9 items-center justify-center rounded-lg ${
                  profile.isActive
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                }`}
              >
                <ShieldCheck className="size-4" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Account Status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    profile.isActive ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <p
                  className={`text-base font-semibold ${
                    profile.isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {profile.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Current account standing
              </p>
            </div>

            {/* Date Joined */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <CalendarDays className="size-4" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date Joined
              </p>
              <p className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                {joinedDate}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Member since registration
              </p>
            </div>
          </div>
        </section>

        {/* Feedback */}
        {state.message && (
          <div
            role="status"
            className={`flex items-start gap-2 rounded-xl p-4 text-sm ${
              state.success
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {state.success && <CheckCircle2 className="size-5 shrink-0" />}
            <p>{state.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
