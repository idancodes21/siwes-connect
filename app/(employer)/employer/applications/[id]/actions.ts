"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";
import { revalidatePath } from "next/cache";

const allowedStatuses = [
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
] as const;

export type ReviewApplicationState = {
  success: boolean;
  message: string;
  errors?: {
    status?: string;
    reviewNote?: string;
  };
};

export async function reviewApplication(
  _prevState: ReviewApplicationState,
  formData: FormData,
): Promise<ReviewApplicationState> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EMPLOYER") {
    return {
      success: false,
      message: "You are not authorized to review applications.",
    };
  }

  const { companyId } = await getEmployerContext();

  const applicationId = String(formData.get("applicationId") ?? "");
  const status = String(formData.get("status") ?? "");
  const reviewNote = String(formData.get("reviewNote") ?? "").trim();

  if (!applicationId) {
    return {
      success: false,
      message: "Application not found.",
    };
  }

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return {
      success: false,
      message: "Please select a valid application status.",
      errors: { status: "Invalid application status." },
    };
  }

  if (reviewNote.length > 3000) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: {
        reviewNote: "Review note cannot exceed 3000 characters.",
      },
    };
  }

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      listing: {
        companyId,
      },
    },
    select: {
      id: true,
      status: true,
      studentId: true,
      listing: {
        select: {
          companyId: true,
        },
      },
    },
  });

  if (!application) {
    return {
      success: false,
      message: "Application not found or access denied.",
    };
  }

  if (
    application.status === "WITHDRAWN" ||
    application.status === "ACCEPTED" ||
    application.status === "REJECTED"
  ) {
    return {
      success: false,
      message: "This application can no longer be updated.",
    };
  }

  await prisma.$transaction(async (tx) => {
    // Update the application review.
    await tx.application.update({
      where: {
        id: application.id,
      },
      data: {
        status: status as (typeof allowedStatuses)[number],
        reviewNote: reviewNote || null,
        reviewedAt: new Date(),
      },
    });

    // Automatically create a placement when the application is accepted.
    if (status === "ACCEPTED") {
      await tx.placement.upsert({
        where: {
          applicationId: application.id,
        },
        update: {},
        create: {
          applicationId: application.id,
          studentId: application.studentId,
          companyId: application.listing.companyId,
          status: "ACTIVE",
        },
      });
    }
  });

  revalidatePath("/employer/applications");
  revalidatePath(`/employer/applications/${applicationId}`);
  revalidatePath("/employer/placements");
  revalidatePath("/student/placement");
  revalidatePath("/student/dashboard");
  revalidatePath("/employer/dashboard");

  return {
    success: true,
    message:
      status === "ACCEPTED"
        ? "Application accepted and student added to placements successfully."
        : "Application review updated successfully.",
  };
}
