import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import StudentProfileForm from "@/components/student/student-profile-form";

function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <StudentProfileContent />
    </Suspense>
  );
}

async function StudentProfileContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
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
      isActive: true,
      createdAt: true,
      student: {
        select: {
          id: true,
          matricNumber: true,
          gender: true,
          dateOfBirth: true,
          level: true,
          graduationYear: true,
          department: {
            select: {
              id: true,
              name: true,
              code: true,
              institution: {
                select: {
                  id: true,
                  name: true,
                  acronym: true,
                },
              },
            },
          },
        },
      },
    },
  });

if (!user) {
  redirect("/unauthorized");
}

const student = user.student;

if (!student) {
  redirect("/unauthorized");
}

return (
  <StudentProfileForm
    user={{
      ...user,
      student,
    }}
  />
);
}