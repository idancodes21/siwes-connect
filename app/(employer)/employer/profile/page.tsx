import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import EmployerProfileForm from "@/components/employer-profile-form";

export default function EmployerProfilePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading profile...</div>}>
      <EmployerProfileContent />
    </Suspense>
  );
}

async function EmployerProfileContent() {
  const { userId } = await getEmployerContext();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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
      employer: {
        select: {
          jobTitle: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.employer) {
    throw new Error("Employer profile not found.");
  }

  const profile = {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    phone: user.phone ?? "",
    image: user.image,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    jobTitle: user.employer.jobTitle ?? "",
    companyName: user.employer.company.name,
  };

  return <EmployerProfileForm profile={profile} />;
}