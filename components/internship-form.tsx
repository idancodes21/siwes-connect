
"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  MapPin,
  Save,
  Send,
} from "lucide-react";

import { createInternship, type InternshipFormState, } from "@/app/(employer)/employer/internships/actions";

const initialState: InternshipFormState = {
  success: false,
  message: "",
};

export default function InternshipForm() {
  const [state, formAction, pending] = useActionState(
    createInternship,
    initialState
  );

  const getError = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            state.success
              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          <p className="font-medium">{state.message}</p>

          {state.success && (
            <Link
              href="/employer/internships"
              className="mt-2 inline-block font-semibold underline underline-offset-4"
            >
              View your internship listings
            </Link>
          )}
        </div>
      )}

      {/* Basic information */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">Basic Information</h2>
            <p className="text-sm text-muted-foreground">
              Introduce the internship opportunity.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Internship Title <span className="text-destructive">*</span>
            </label>

            <input
              id="title"
              name="title"
              required
              maxLength={120}
              placeholder="e.g. Frontend Developer Intern"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {getError("title") && (
              <p className="text-xs text-destructive">
                {getError("title")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Internship Description{" "}
              <span className="text-destructive">*</span>
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Describe the internship, what the student will learn, and the nature of the work..."
              className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {getError("description") && (
              <p className="text-xs text-destructive">
                {getError("description")}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="durationMonths" className="text-sm font-medium">
                Duration (months)
              </label>

              <input
                id="durationMonths"
                name="durationMonths"
                type="number"
                min="1"
                placeholder="e.g. 6"
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              {getError("durationMonths") && (
                <p className="text-xs text-destructive">
                  {getError("durationMonths")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="positions" className="text-sm font-medium">
                Available Positions
              </label>

              <input
                id="positions"
                name="positions"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              {getError("positions") && (
                <p className="text-xs text-destructive">
                  {getError("positions")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Responsibilities and requirements */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Role Expectations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explain what students should know and what they will do.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="responsibilities" className="text-sm font-medium">
              Responsibilities
            </label>

            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={5}
              placeholder="List the tasks and responsibilities of the intern..."
              className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="requirements" className="text-sm font-medium">
              Requirements
            </label>

            <textarea
              id="requirements"
              name="requirements"
              rows={5}
              placeholder="List the skills, qualifications, or knowledge expected..."
              className="w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">Work Location</h2>
            <p className="text-sm text-muted-foreground">
              Specify where the internship will take place.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>

            <input
              id="location"
              name="location"
              placeholder="e.g. Port Harcourt, Rivers State"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {getError("location") && (
              <p className="text-xs text-destructive">
                {getError("location")}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
            <input
              type="checkbox"
              name="isRemote"
              className="mt-0.5 h-4 w-4 accent-primary"
            />

            <span>
              <span className="block text-sm font-medium">
                Remote internship
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Students can complete this internship remotely.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Application deadline and publishing */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold">Application Settings</h2>
            <p className="text-sm text-muted-foreground">
              Set the application deadline and listing visibility.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Application Deadline
            </label>

            <input
              id="deadline"
              name="deadline"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {getError("deadline") && (
              <p className="text-xs text-destructive">
                {getError("deadline")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Listing Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue="DRAFT"
              required
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="PUBLISHED">Publish Immediately</option>
            </select>

            {getError("status") && (
              <p className="text-xs text-destructive">
                {getError("status")}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              Draft listings are not visible to students. Published listings
              can be discovered by eligible students.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
        <Link
          href="/employer/internships"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Create Internship
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
