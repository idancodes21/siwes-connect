
"use client";

import { useActionState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  ShieldCheck,
  CalendarDays,
  Save,
  Loader2,
} from "lucide-react";
import { updateHodProfile,type HodProfileState  } from "@/app/(hod)/hod/profile/actions"; 

type HodProfileUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  hod: {
    department: {
      name: string;
      institution: {
        name: string;
      };
    };
  };
};

const initialState: HodProfileState = {
  success: false,
  message: "",
};

export default function HodProfileForm({
  user,
}: {
  user: HodProfileUser;
}) {
  const [state, formAction, isPending] = useActionState(
    updateHodProfile,
    initialState
  );

  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "H";

  return (
    <div className="space-y-6">
      {/* Profile overview */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold">
              {user.name ?? "HOD Account"}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {user.email}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Head of Department
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  user.isActive
                    ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.isActive ? "Active Account" : "Inactive Account"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Editable personal information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="font-semibold">Personal Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your name and contact information.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  defaultValue={user.name ?? ""}
                  placeholder="Enter your full name"
                  className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
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
                className="text-sm font-medium"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="h-11 w-full cursor-not-allowed rounded-xl border bg-muted/50 pr-4 pl-10 text-sm text-muted-foreground outline-none"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your registered email address cannot be changed here.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={30}
                  defaultValue={user.phone ?? ""}
                  placeholder="Enter your phone number"
                  className="h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {state.errors?.phone && (
                <p className="text-xs text-red-500">
                  {state.errors.phone[0]}
                </p>
              )}
            </div>
          </div>

          {state.message && (
            <div
              role="status"
              className={`rounded-xl px-4 py-3 text-sm ${
                state.success
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
              }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex justify-end border-t pt-5">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Department information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold">Department Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your assigned department and institution.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InfoItem
            icon={<Building2 className="h-4 w-4" />}
            label="Institution"
            value={user.hod.department.institution.name}
          />

          <InfoItem
            icon={<GraduationCap className="h-4 w-4" />}
            label="Department"
            value={user.hod.department.name}
          />
        </div>

        <p className="mt-5 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          Your department assignment is managed by the platform and cannot be
          changed from your profile.
        </p>
      </section>

      {/* Account information */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="font-semibold">Account Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Details about your SIWES Connect account.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <InfoItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Account Role"
            value="Head of Department"
          />

          <InfoItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Date Joined"
            value={new Intl.DateTimeFormat("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(user.createdAt)}
          />
        </div>
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
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
