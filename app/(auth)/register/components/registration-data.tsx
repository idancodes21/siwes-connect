import { prisma } from "@/lib/prisma";
import RegistrationForm from "./registration-form";

export default async function RegistrationData() {
  const institutions = await prisma.institution.findMany({
    select: {
      id: true,
      name: true,
      acronym: true,
      departments: {
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return <RegistrationForm institutions={institutions} />;
}