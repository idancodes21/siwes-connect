
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getEmployerContext } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import PlacementDetails from "@/components/employer/placement-details";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function PlacementDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-slate-500">
          Loading placement details...
        </div>
      }
    >
      <PlacementDetailsContent params={params} />
    </Suspense>
  );
}

async function PlacementDetailsContent({ params }: PageProps) {
  const { id } = await params;
  const { companyId } = await getEmployerContext();

  const placement = await prisma.placement.findFirst({
    where: {
      id,
      companyId,
    },
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true,
      supervisorName: true,
      supervisorEmail: true,
      supervisorPhone: true,
      createdAt: true,
      updatedAt: true,

      student: {
        select: {
          id: true,
          matricNumber: true,
          gender: true,
          level: true,
          graduationYear: true,
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

      application: {
        select: {
          id: true,
          appliedAt: true,
          listing: {
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              isRemote: true,
              durationMonths: true,
              company: {
                select: {
                  name: true,
                  industry: true,
                  email: true,
                  phone: true,
                  website: true,
                  address: true,
                  city: true,
                  state: true,
                  country: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!placement) {
    notFound();
  }

  return <PlacementDetails placement={placement} />;
}
