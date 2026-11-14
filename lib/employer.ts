import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getEmployerContext() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/unauthorized");
  }

  const employer = await prisma.employerProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      companyId: true,
      jobTitle: true,
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!employer) {
    throw new Error("Employer profile not found.");
  }

  return {
    userId: session.user.id,
    employer,
    companyId: employer.companyId,
  };
}