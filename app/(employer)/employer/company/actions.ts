"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import { z } from "zod";

export type CompanyFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? null
        : value,
    z.string().trim().max(maxLength).nullable()
  );

const companySchema = z.object({
  name: z.string().trim().min(2, "Company name is required.").max(120),
  registrationNo: optionalText(100),
  email: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? null
        : value,
    z.string().trim().email("Enter a valid company email.").nullable()
  ),
  phone: optionalText(30),
  website: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === ""
        ? null
        : value,
    z.string().trim().url("Enter a valid website URL, including https://").nullable()
  ),
  industry: optionalText(100),
  description: optionalText(2000),
  address: optionalText(250),
  city: optionalText(100),
  state: optionalText(100),
  country: z.string().trim().min(1, "Country is required.").max(100),

  logo: z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === ""
      ? null
      : value,
  z.string().trim().url("Enter a valid image URL.").nullable()
),
});

export async function updateCompanyProfile(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const { companyId } = await getEmployerContext();

  const rawData = {
    name: formData.get("name"),
    registrationNo: formData.get("registrationNo"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    description: formData.get("description"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    country: formData.get("country"),
  };

  const validated = companySchema.safeParse(rawData);

  if (!validated.success) {
    const errors: Record<string, string[]> = {};

    for (const issue of validated.error.issues) {
      const field = issue.path[0]?.toString();

      if (field) {
        errors[field] ??= [];
        errors[field].push(issue.message);
      }
    }

    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: validated.data,
    });

    revalidatePath("/employer/company");
    revalidatePath("/employer");

    return {
      success: true,
      message: "Company profile updated successfully.",
    };
  } catch (error) {
    console.error("Company profile update error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "This company registration number is already in use.",
      };
    }

    return {
      success: false,
      message: "Unable to update company profile. Please try again.",
    };
  }
}
