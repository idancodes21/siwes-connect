
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import HodProfileForm from "@/components/hod/hod-profile-form";

export default function HodProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <HodProfileContent />
    </Suspense>
  );
}

async function HodProfileContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "HOD") {
    redirect("/unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
      hod: {
        select: {
          department: {
            select: {
              name: true,
              institution: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.hod) {
    redirect("/unauthorized");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <p className="mb-2 text-sm font-medium text-primary">
          Account Settings
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and view your department details.
        </p>
      </section>

      <HodProfileForm
        user={{
          ...user,
          hod: user.hod,
        }}
      />
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      <div className="h-[520px] rounded-2xl border bg-card" />
    </div>
  );
}
