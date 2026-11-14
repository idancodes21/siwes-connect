
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import CompanyProfileForm from "@/components/company-profile-form";

export default function EmployerCompanyPage() {
  return (
    <Suspense fallback={<CompanyProfileLoading />}>
      <CompanyProfileContent />
    </Suspense>
  );
}

async function CompanyProfileContent() {
  const { companyId } = await getEmployerContext();

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    select: {
      id: true,
      name: true,
      registrationNo: true,
      email: true,
      phone: true,
      website: true,
      industry: true,
      description: true,
      address: true,
      city: true,
      state: true,
      country: true,
      logo: true,
    },
  });

  if (!company) {
    throw new Error("Company profile not found.");
  }

  return <CompanyProfileForm company={company} />;
}

function CompanyProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
      <div className="h-9 w-64 rounded-lg bg-muted" />

      <div className="h-40 rounded-2xl bg-muted" />

      <div className="h-96 rounded-2xl bg-muted" />
    </div>
  );
}
