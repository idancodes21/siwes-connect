
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";

import InternshipForm from "@/components/internship-form";

export default function CreateInternshipPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Page heading */}
      <div>
        <Link
          href="/employer/internships"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Internship Listings
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-primary">
              Internship Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Post an Internship
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create an internship opportunity and connect with students
              looking for valuable SIWES experience.
            </p>
          </div>
        </div>
      </div>

      <InternshipForm />
    </div>
  );
}
