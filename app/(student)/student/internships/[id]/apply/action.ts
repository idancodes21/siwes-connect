
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ApplicationFormState = {
  success: boolean;
  message: string;
  errors?: {
    coverLetter?: string[];
  };
  applicationId?: string;
};

export async function submitApplication(
  _prevState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
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
      message: "You are not authorized to submit an application.",
    };
  }

  const listingId = String(formData.get("listingId") ?? "").trim();
  const coverLetter = String(formData.get("coverLetter") ?? "").trim();

  if (!listingId) {
    return {
      success: false,
      message: "Invalid internship listing.",
    };
  }

  if (coverLetter.length > 3000) {
    return {
      success: false,
      message: "Please correct the highlighted field.",
      errors: {
        coverLetter: ["Cover letter cannot exceed 3,000 characters."],
      },
    };
  }

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!student) {
      return {
        success: false,
        message: "Student profile not found.",
      };
    }

    const listing = await prisma.internshipListing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        status: true,
        deadline: true,
      },
    });

    if (!listing || listing.status !== "PUBLISHED") {
      return {
        success: false,
        message: "This internship is no longer accepting applications.",
      };
    }

    if (listing.deadline && listing.deadline < new Date()) {
      return {
        success: false,
        message: "The application deadline for this internship has passed.",
      };
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_listingId: {
          studentId: student.id,
          listingId: listing.id,
        },
      },
      select: { id: true },
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this internship.",
      };
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        listingId: listing.id,
        coverLetter: coverLetter || null,
      },
      select: { id: true },
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/internships");
    revalidatePath(`/student/internships/${listing.id}`);
    revalidatePath("/student/applications");

    return {
      success: true,
      message: "Your application has been submitted successfully.",
      applicationId: application.id,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "You have already applied for this internship.",
      };
    }

    console.error("APPLICATION SUBMISSION ERROR:", error);

    return {
      success: false,
      message: "Something went wrong while submitting your application.",
    };
  }
}
