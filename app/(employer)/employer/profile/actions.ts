"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";

export type EmployerProfileFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const employerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name is too long."),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .optional(),
  jobTitle: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters.")
    .max(100, "Job title is too long."),
});

export async function updateEmployerProfile(
  _prevState: EmployerProfileFormState,
  formData: FormData
): Promise<EmployerProfileFormState> {
  try {
    const { userId } = await getEmployerContext();

    const rawData = {
      name: formData.get("name"),
      phone: formData.get("phone") || "",
      jobTitle: formData.get("jobTitle"),
    };

    const validated = employerProfileSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Please correct the errors below.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, phone, jobTitle } = validated.data;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          name,
          phone: phone || null,
        },
      }),
      prisma.employerProfile.update({
        where: { userId },
        data: {
          jobTitle,
        },
      }),
    ]);

    revalidatePath("/employer/profile");
    revalidatePath("/employer");

    return {
      success: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    console.error("Employer profile update error:", error);

    return {
      success: false,
      message: "Something went wrong while updating your profile.",
    };
  }
}
