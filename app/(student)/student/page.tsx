import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">
          STUDENT DASHBOARD
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Overview
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your SIWES applications and track your internship journey.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap size={26} />
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl">
            Your SIWES journey starts here.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-primary-foreground/80">
            Discover internship opportunities, connect with employers,
            and take the next step towards your professional career.
          </p>

          <Link
            href="/student/internships"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Explore internships
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full border-[35px] border-white/10" />
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border-[35px] border-white/10" />
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Your activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of your internship progress will appear here.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Applications",
              description: "Your submitted applications",
              icon: FileText,
            },
            {
              title: "Under review",
              description: "Applications being reviewed",
              icon: BriefcaseBusiness,
            },
            {
              title: "Shortlisted",
              description: "Opportunities you've been shortlisted for",
              icon: GraduationCap,
            },
            {
              title: "Placement",
              description: "Your current SIWES placement",
              icon: BriefcaseBusiness,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={21} />
                </div>

                <p className="mt-5 text-sm font-medium text-foreground">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">
            Recent applications
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your recent internship applications will appear here.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">
            Recommended internships
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Internship opportunities suited to your academic profile will
            appear here.
          </p>
        </div>
      </section>
    </div>
  );
}