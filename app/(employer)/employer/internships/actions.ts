
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import { internshipSchema } from "@/lib/validation/internship"; 

export type InternshipFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createInternship(
  _prevState: InternshipFormState,
  formData: FormData
): Promise<InternshipFormState> {
  const { companyId, userId } = await getEmployerContext();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    responsibilities: formData.get("responsibilities"),
    location: formData.get("location"),
    isRemote: formData.get("isRemote") === "on",
    durationMonths: formData.get("durationMonths"),
    positions: formData.get("positions"),
    deadline: formData.get("deadline"),
    status: formData.get("status"),
  };

  const validated = internshipSchema.safeParse(rawData);

  if (!validated.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of validated.error.issues) {
      const field = String(issue.path[0] ?? "form");

      if (!errors[field]) {
        errors[field] = [];
      }

      errors[field].push(issue.message);
    }

    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  try {
    await prisma.internshipListing.create({
      data: {
        ...validated.data,
        companyId,
        createdById: userId,
      },
    });

    revalidatePath("/employer");
    revalidatePath("/employer/dashboard");
    revalidatePath("/employer/internships");

    return {
      success: true,
      message:
        validated.data.status === "PUBLISHED"
          ? "Your internship opportunity has been published successfully."
          : "Your internship has been saved as a draft.",
    };
  } catch (error) {
    console.error("CREATE INTERNSHIP ERROR:", error);

    return {
      success: false,
      message: "Something went wrong while creating the internship.",
    };
  }
}
