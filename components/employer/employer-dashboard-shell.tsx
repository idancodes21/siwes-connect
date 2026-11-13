"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Users,
  Building2,
  UserRound,
  Menu,
  X,
  GraduationCap,
  Bell,
  ChevronRight,
} from "lucide-react";

import EmployerSignOutButton from "./employer-sign-out-button";

type EmployerUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type EmployerDashboardShellProps = {
  children: React.ReactNode;
  user: EmployerUser;
};

const navigation = [
  {
    label: "Overview",
    href: "/employer",
    icon: LayoutDashboard,
  },
  {
    label: "Internship Listings",
    href: "/employer/internships",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/employer/applications",
    icon: FileText,
  },
  {
    label: "Placements",
    href: "/employer/placements",
    icon: Users,
  },
  {
    label: "Company Profile",
    href: "/employer/company",
    icon: Building2,
  },
  {
    label: "My Profile",
    href: "/employer/profile",
    icon: UserRound,
  },
];

export default function EmployerDashboardShell({
  children,
  user,
}: EmployerDashboardShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = user.name || "Employer";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function isActive(href: string) {
    if (href === "/employer/dashboard") {
      return pathname === href || pathname === "/employer";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function SidebarContent() {
    return (
      <>
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-6 w-6" />
          </div>

          <div>
            <p className="font-bold tracking-tight">SIWES Connect</p>
            <p className="text-xs text-muted-foreground">
              Employer Portal
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>

                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={userName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                initials || "E"
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <EmployerSignOutButton />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r bg-card shadow-xl">
            <div className="flex items-center justify-end border-b px-4 py-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-sm font-semibold">Employer Workspace</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage internship opportunities and applications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-full border p-2 text-muted-foreground transition hover:bg-muted"
            >
              <Bell className="h-[18px] w-[18px]" />
            </button>

            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={userName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                initials || "E"
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}