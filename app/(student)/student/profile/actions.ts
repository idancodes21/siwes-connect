"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type StudentProfileFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    phone?: string[];
    gender?: string[];
    dateOfBirth?: string[];
    level?: string[];
    graduationYear?: string[];
  };
};

export async function updateStudentProfile(
  _prevState: StudentProfileFormState,
  formData: FormData,
): Promise<StudentProfileFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Your session has expired. Please log in again.",
    };
  }

  if (session.user.role !== "STUDENT") {
    return {
      success: false,
      message: "You are not authorized to update this profile.",
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
  const levelValue = String(formData.get("level") ?? "").trim();
  const graduationYearValue = String(
    formData.get("graduationYear") ?? "",
  ).trim();

  const errors: NonNullable<StudentProfileFormState["errors"]> = {};

  if (!name || name.length < 2) {
    errors.name = ["Name must contain at least 2 characters."];
  }

  if (name.length > 100) {
    errors.name = ["Name cannot exceed 100 characters."];
  }

  if (phone.length > 20) {
    errors.phone = ["Phone number cannot exceed 20 characters."];
  }

  if (
    gender &&
    !["MALE", "FEMALE", "OTHER"].includes(gender)
  ) {
    errors.gender = ["Please select a valid gender."];
  }

  let parsedDate: Date | null = null;

  if (dateOfBirth) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(dateOfBirth)) {
      errors.dateOfBirth = ["Please enter a valid date of birth."];
    } else {
      const [year, month, day] = dateOfBirth.split("-").map(Number);
      parsedDate = new Date(year, month - 1, day);

      if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day ||
        parsedDate > new Date()
      ) {
        errors.dateOfBirth = ["Please enter a valid date of birth."];
        parsedDate = null;
      }
    }
  }

  let level: number | null = null;

  if (levelValue) {
    level = Number(levelValue);

    if (!Number.isInteger(level) || level <= 0) {
      errors.level = ["Please enter a valid academic level."];
    }
  }

  let graduationYear: number | null = null;

  if (graduationYearValue) {
    graduationYear = Number(graduationYearValue);

    if (
      !Number.isInteger(graduationYear) ||
      graduationYear < 1900 ||
      graduationYear > 2200
    ) {
      errors.graduationYear = ["Please enter a valid graduation year."];
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      return {
        success: false,
        message: "Student profile not found.",
      };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          phone: phone || null,
        },
      }),

      prisma.studentProfile.update({
        where: {
          id: student.id,
        },
        data: {
          gender: gender
            ? (gender as "MALE" | "FEMALE" | "OTHER")
            : null,
          dateOfBirth: parsedDate,
          level,
          graduationYear,
        },
      }),
    ]);

    revalidatePath("/student/profile");
    revalidatePath("/student/dashboard");

    return {
      success: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    console.error("STUDENT PROFILE UPDATE ERROR:", error);

    return {
      success: false,
      message: "Something went wrong while updating your profile.",
    };
  }
}