
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { reviewApplication,type ReviewApplicationState, } from "@/app/(employer)/employer/applications/[id]/actions"; 

type ApplicationReviewData = {
  id: string;
  status:
    | "PENDING"
    | "REVIEWING"
    | "SHORTLISTED"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
  coverLetter: string | null;
  appliedAt: Date;
  reviewedAt: Date | null;
  reviewNote: string | null;
  student: {
    matricNumber: string;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    level: number | null;
    graduationYear: number | null;
    dateOfBirth: Date | null;
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
  listing: {
    id: string;
    title: string;
    location: string | null;
    isRemote: boolean;
    durationMonths: number | null;
    deadline: Date | null;
    description: string;
    requirements: string | null;
    responsibilities: string | null;
  };
};

type Props = {
  application: ApplicationReviewData;
};

const initialState: ReviewApplicationState = {
  success: false,
  message: "",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  REVIEWING: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  WITHDRAWN: "bg-slate-100 text-slate-600",
};

const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(date))
    : "Not provided";

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
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

export default function ApplicationReview({ application }: Props) {
  const [state, formAction, isPending] = useActionState(
    reviewApplication,
    initialState
  );

  const { student, listing } = application;
  const isFinal =
    application.status === "ACCEPTED" ||
    application.status === "REJECTED" ||
    application.status === "WITHDRAWN";

  const initials = student.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <Link
        href="/employer/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Application review</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {student.user.name || "Unnamed applicant"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Applied for {listing.title}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[application.status]}`}
        >
          {application.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Applicant information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Applicant information
            </h2>

            <div className="mt-5 flex items-center gap-4">
              {student.user.image ? (
                <img
                  src={student.user.image}
                  alt={student.user.name || "Applicant"}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-700">
                  {initials || <UserRound />}
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-900">
                  {student.user.name || "Unnamed applicant"}
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
                label="Expected graduation"
                value={student.graduationYear?.toString() || "Not provided"}
              />
            </div>
          </section>

          {/* Cover letter */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">Cover letter</h2>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {application.coverLetter || "No cover letter was submitted."}
            </div>
          </section>

          {/* Internship information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Internship details
            </h2>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {listing.title}
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailItem
                icon={MapPin}
                label="Location"
                value={
                  listing.isRemote
                    ? "Remote"
                    : listing.location || "Not specified"
                }
              />
              <DetailItem
                icon={Clock3}
                label="Duration"
                value={
                  listing.durationMonths
                    ? `${listing.durationMonths} months`
                    : "Not specified"
                }
              />
              <DetailItem
                icon={CalendarDays}
                label="Application deadline"
                value={formatDate(listing.deadline)}
              />
              <DetailItem
                icon={CalendarDays}
                label="Date applied"
                value={formatDate(application.appliedAt)}
              />
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Description
                </h4>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {listing.description}
                </p>
              </div>

              {listing.responsibilities && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Responsibilities
                  </h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {listing.responsibilities}
                  </p>
                </div>
              )}

              {listing.requirements && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Requirements
                  </h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {listing.requirements}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Review panel */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:sticky xl:top-6">
          <h2 className="font-semibold text-slate-900">Review application</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the applicant&apos;s review status and leave feedback.
          </p>

          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <p>
              Submitted:{" "}
              <span className="font-medium text-slate-800">
                {formatDate(application.appliedAt)}
              </span>
            </p>
            <p>
              Last reviewed:{" "}
              <span className="font-medium text-slate-800">
                {formatDate(application.reviewedAt)}
              </span>
            </p>
          </div>

          {application.reviewNote && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">
                Previous review note
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {application.reviewNote}
              </p>
            </div>
          )}

          {isFinal ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <CheckCircle2 className="mb-2 text-slate-500" size={20} />
              This application has received a final decision and can no longer
              be updated.
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-4">
              <input
                type="hidden"
                name="applicationId"
                value={application.id}
              />

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Application status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={
                    application.status === "PENDING"
                      ? "REVIEWING"
                      : application.status
                  }
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                >
                  <option value="REVIEWING">Reviewing</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                {state.errors?.status && (
                  <p className="mt-1 text-xs text-red-600">
                    {state.errors.status}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reviewNote"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Review note
                </label>
                <textarea
                  id="reviewNote"
                  name="reviewNote"
                  rows={5}
                  maxLength={3000}
                  defaultValue={application.reviewNote || ""}
                  placeholder="Add feedback or notes about this application..."
                  disabled={isPending}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
                {state.errors?.reviewNote && (
                  <p className="mt-1 text-xs text-red-600">
                    {state.errors.reviewNote}
                  </p>
                )}
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
                {isPending ? "Saving review..." : "Save review"}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
