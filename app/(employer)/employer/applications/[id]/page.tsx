
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEmployerContext } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import ApplicationReview from "@/components/employer/application-review";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ApplicationDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-6">Loading application...</div>}>
      <ApplicationDetails params={params} />
    </Suspense>
  );
}

async function ApplicationDetails({ params }: PageProps) {
  const { id } = await params;
  const { companyId } = await getEmployerContext();

  const application = await prisma.application.findFirst({
    where: {
      id,
      listing: {
        companyId,
      },
    },
    select: {
      id: true,
      status: true,
      coverLetter: true,
      appliedAt: true,
      reviewedAt: true,
      reviewNote: true,
      student: {
        select: {
          matricNumber: true,
          gender: true,
          level: true,
          graduationYear: true,
          dateOfBirth: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
          department: {
            select: {
              name: true,
              institution: {
                select: {
                  name: true,
                  acronym: true,
                },
              },
            },
          },
        },
      },
      listing: {
        select: {
          id: true,
          title: true,
          location: true,
          isRemote: true,
          durationMonths: true,
          deadline: true,
          description: true,
          requirements: true,
          responsibilities: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return <ApplicationReview application={application} />;
}
