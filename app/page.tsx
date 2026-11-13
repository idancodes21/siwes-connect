
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Building2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "For Students",
    description:
      "Apply for internships, track your applications, and manage all your placement documents in one place.",
    icon: Users,
  },
  {
    title: "For Departments",
    description:
      "Manage student fieldwork courses, review applications, and oversee the entire placement process.",
    icon: GraduationCap,
  },
  {
    title: "For Employers",
    description:
      "Post opportunities, review candidates, and find the perfect interns and graduates for your company.",
    icon: Building2,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-white">
        <nav className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link href="/" className="flex items-center gap-4">
            <GraduationCap
              className="h-9 w-9 text-primary"
              strokeWidth={2.2}
            />

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
               Siwes Connect
              </h1>
              <p className="text-sm font-medium text-muted-foreground sm:text-base">
                Internship & Job Placement
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground hover:border-primary hover:text-primary sm:text-base"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-[1500px] flex-col items-center px-6 pb-20 pt-16 text-center sm:px-10 sm:pt-20 lg:px-12 lg:pt-16">
        <div className="max-w-[1250px]">
          <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Find Internships, Get Job-Ready,{" "}
            <span className="text-primary">Connect with Employers</span>
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg lg:text-2xl">
            Streamline your university&apos;s internship and job placement
            process with our comprehensive platform designed for students,
            departments, and employers.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:text-lg"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-8 py-4 text-base font-bold text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary hover:text-primary sm:text-lg"
          >
            Create Account
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid w-full grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#e8eef7] text-primary">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-extrabold tracking-tight text-card-foreground">
                  {feature.title}
                </h3>

                <p className="mt-3 text-base font-medium leading-[1.8] text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
