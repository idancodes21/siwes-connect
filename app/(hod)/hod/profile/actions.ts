
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const hodProfileSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters.").max(100),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
});

export type HodProfileState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    phone?: string[];
  };
};

export async function updateHodProfile(
  _prevState: HodProfileState,
  formData: FormData
): Promise<HodProfileState> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "HOD") {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
    };
  }

  const parsed = hodProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const hod = await prisma.hodProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!hod) {
    return {
      success: false,
      message: "HOD profile not found.",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
      },
    });

    revalidatePath("/hod");
    revalidatePath("/hod/profile");
    revalidatePath("/hod/dashboard");

    return {
      success: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    console.error("HOD profile update error:", error);

    return {
      success: false,
      message: "Something went wrong while updating your profile.",
    };
  }
}
