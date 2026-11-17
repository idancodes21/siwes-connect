
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { updatePlacement, type PlacementFormState, } from "@/app/(employer)/employer/placements/[id]/action"; 

type PlacementDetailsData = {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED";
  startDate: Date | null;
  endDate: Date | null;
  supervisorName: string | null;
  supervisorEmail: string | null;
  supervisorPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    matricNumber: string;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    level: number | null;
    graduationYear: number | null;
    user: {
      name: string | null;
      email: string;
      phone: string | null;
      image: string | null;
    };
    department: {
      name: string;
      institution: {
        name: string;
        acronym: string | null;
      };
    };
  };
  application: {
    id: string;
    appliedAt: Date;
    listing: {
      id: string;
      title: string;
      description: string;
      location: string | null;
      isRemote: boolean;
      durationMonths: number | null;
      company: {
        name: string;
        industry: string | null;
        email: string | null;
        phone: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        country: string;
      };
    };
  };
};

type Props = {
  placement: PlacementDetailsData;
};

const initialState: PlacementFormState = {
  success: false,
  message: "",
};

const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  TERMINATED: "bg-red-50 text-red-700",
};

function formatDate(date: Date | null) {
  if (!date) return "Not provided";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function dateInputValue(date: Date | null) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function PlacementDetails({ placement }: Props) {
  const [state, formAction, isPending] = useActionState(
    updatePlacement,
    initialState
  );

  const { student, application } = placement;
  const listing = application.listing;
  const company = listing.company;

  const initials =
    student.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  return (
    <div className="space-y-6">
      <Link
        href="/employer/placements"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to placements
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Placement details</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {student.user.name || "Student placement"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{listing.title}</p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[placement.status]}`}
        >
          {placement.status}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Student information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Student information
            </h2>

            <div className="mt-5 flex items-center gap-4">
              {student.user.image ? (
                <img
                  src={student.user.image}
                  alt={student.user.name || "Student"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">
                  {initials}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-900">
                  {student.user.name || "Unnamed student"}
                </h3>
                <p className="text-sm text-slate-500">
                  {student.matricNumber}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={Mail}
                label="Email address"
                value={student.user.email}
              />
              <DetailItem
                icon={Phone}
                label="Phone number"
                value={student.user.phone || "Not provided"}
              />
              <DetailItem
                icon={GraduationCap}
                label="Institution"
                value={
                  student.department.institution.acronym ||
                  student.department.institution.name
                }
              />
              <DetailItem
                icon={Building2}
                label="Department"
                value={student.department.name}
              />
              <DetailItem
                icon={GraduationCap}
                label="Current level"
                value={student.level ? `${student.level} Level` : "Not provided"}
              />
              <DetailItem
                icon={CalendarDays}
                label="Graduation year"
                value={student.graduationYear?.toString() || "Not provided"}
              />
            </div>
          </section>

          {/* Internship information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Internship information
            </h2>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {listing.title}
            </h3>

            {company.industry && (
              <p className="mt-1 text-sm text-slate-500">
                {company.name} · {company.industry}
              </p>
            )}

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={MapPin}
                label="Work location"
                value={
                  listing.isRemote
                    ? "Remote"
                    : listing.location || "Not specified"
                }
              />
              <DetailItem
                icon={CalendarDays}
                label="Expected duration"
                value={
                  listing.durationMonths
                    ? `${listing.durationMonths} months`
                    : "Not specified"
                }
              />
              <DetailItem
                icon={CalendarDays}
                label="Application date"
                value={formatDate(application.appliedAt)}
              />
              <DetailItem
                icon={Building2}
                label="Company"
                value={company.name}
              />
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h4 className="text-sm font-semibold text-slate-800">
                Internship description
              </h4>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {listing.description}
              </p>
            </div>
          </section>

          {/* Company information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Company information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <DetailItem
                icon={Building2}
                label="Company name"
                value={company.name}
              />
              <DetailItem
                icon={MapPin}
                label="Address"
                value={
                  [company.address, company.city, company.state, company.country]
                    .filter(Boolean)
                    .join(", ") || "Not provided"
                }
              />
              <DetailItem
                icon={Mail}
                label="Company email"
                value={company.email || "Not provided"}
              />
              <DetailItem
                icon={Phone}
                label="Company phone"
                value={company.phone || "Not provided"}
              />
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Visit company website
              </a>
            )}
          </section>
        </div>

        {/* Placement management */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:sticky xl:top-6">
          <h2 className="font-semibold text-slate-900">
            Manage placement
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the internship period, supervisor details, and placement
            status.
          </p>

          <form action={formAction} className="mt-6 space-y-5">
            <input
              type="hidden"
              name="placementId"
              value={placement.id}
            />

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Placement status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={placement.status}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="TERMINATED">Terminated</option>
              </select>
              {state.errors?.status && (
                <p className="mt-1 text-xs text-red-600">
                  {state.errors.status}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Internship start date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={dateInputValue(placement.startDate)}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
              {state.errors?.startDate && (
                <p className="mt-1 text-xs text-red-600">
                  {state.errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Internship end date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={dateInputValue(placement.endDate)}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
              {state.errors?.endDate && (
                <p className="mt-1 text-xs text-red-600">
                  {state.errors.endDate}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Workplace supervisor
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="supervisorName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Supervisor name
                  </label>
                  <input
                    id="supervisorName"
                    name="supervisorName"
                    type="text"
                    maxLength={100}
                    defaultValue={placement.supervisorName || ""}
                    placeholder="Enter supervisor's name"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  />
                  {state.errors?.supervisorName && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.supervisorName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="supervisorEmail"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Supervisor email
                  </label>
                  <input
                    id="supervisorEmail"
                    name="supervisorEmail"
                    type="email"
                    maxLength={254}
                    defaultValue={placement.supervisorEmail || ""}
                    placeholder="supervisor@company.com"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  />
                  {state.errors?.supervisorEmail && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.supervisorEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="supervisorPhone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Supervisor phone
                  </label>
                  <input
                    id="supervisorPhone"
                    name="supervisorPhone"
                    type="tel"
                    maxLength={30}
                    defaultValue={placement.supervisorPhone || ""}
                    placeholder="Enter supervisor's phone"
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  />
                  {state.errors?.supervisorPhone && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.supervisorPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {state.message && (
              <p
                className={`rounded-lg p-3 text-sm ${
                  state.success
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving changes..." : "Save placement details"}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
            Placement created {formatDate(placement.createdAt)}
          </div>
        </aside>
      </div>
    </div>
  );
}
