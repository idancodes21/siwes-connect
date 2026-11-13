"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Building2,
  UserRound,
  Menu,
  X,
  Bell,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import StudentSignOutButton from "./student-sign-out-button";

type StudentUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type StudentDashboardShellProps = {
  user: StudentUser;
  children: React.ReactNode;
};

const navigation = [
  {
    label: "Overview",
    href: "/student",
    icon: LayoutDashboard,
  },
  {
    label: "Find Internships",
    href: "/student/internships",
    icon: BriefcaseBusiness,
  },
  {
    label: "My Applications",
    href: "/student/applications",
    icon: FileText,
  },
  {
    label: "My Placement",
    href: "/student/placement",
    icon: Building2,
  },
  {
    label: "My Profile",
    href: "/student/profile",
    icon: UserRound,
  },
];

export default function StudentDashboardShell({
  user,
  children,
}: StudentDashboardShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  function isActive(href: string) {
    if (href === "/student/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col">
        <Link
          href="/student/dashboard"
          onClick={() => setMobileNavOpen(false)}
          className="flex h-[76px] items-center gap-3 border-b border-border px-6"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={23} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              SIWES Connect
            </p>
            <p className="text-xs text-muted-foreground">
              Student Portal
            </p>
          </div>
        </Link>

        <div className="flex-1 px-4 py-7">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={19} />
                  <span className="flex-1">{item.label}</span>

                  {active && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.name || "Student"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

         <StudentSignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Student Portal
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your SIWES journey
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
            </button>

            <div className="hidden h-8 w-px bg-border sm:block" />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {user.name || "Student"}
                </p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile navigation */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-slate-950/50"
          />

          <aside className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw] bg-card shadow-2xl">
            <div className="absolute right-3 top-5 z-10">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}