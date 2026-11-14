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

export type InternshipActionState = {
  success: boolean;
  message: string;
};

function refreshInternshipPaths() {
  revalidatePath("/employer");
  revalidatePath("/employer/dashboard");
  revalidatePath("/employer/internships");
}

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

    refreshInternshipPaths();

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

// Publish a draft listing
export async function publishInternship(
  listingId: string
): Promise<InternshipActionState> {
  const { companyId } = await getEmployerContext();

  try {
    const result = await prisma.internshipListing.updateMany({
      where: {
        id: listingId,
        companyId,
        status: "DRAFT",
      },
      data: {
        status: "PUBLISHED",
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "Listing not found or cannot be published.",
      };
    }

    refreshInternshipPaths();

    return {
      success: true,
      message: "Internship published successfully.",
    };
  } catch (error) {
    console.error("PUBLISH INTERNSHIP ERROR:", error);

    return {
      success: false,
      message: "Unable to publish this internship.",
    };
  }
}

// Close a published listing
export async function closeInternship(
  listingId: string
): Promise<InternshipActionState> {
  const { companyId } = await getEmployerContext();

  try {
    const result = await prisma.internshipListing.updateMany({
      where: {
        id: listingId,
        companyId,
        status: "PUBLISHED",
      },
      data: {
        status: "CLOSED",
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "Listing not found or cannot be closed.",
      };
    }

    refreshInternshipPaths();

    return {
      success: true,
      message: "Internship listing closed successfully.",
    };
  } catch (error) {
    console.error("CLOSE INTERNSHIP ERROR:", error);

    return {
      success: false,
      message: "Unable to close this internship.",
    };
  }
}

// Archive a listing
export async function archiveInternship(
  listingId: string
): Promise<InternshipActionState> {
  const { companyId } = await getEmployerContext();

  try {
    const result = await prisma.internshipListing.updateMany({
      where: {
        id: listingId,
        companyId,
        status: {
          in: ["DRAFT", "CLOSED"],
        },
      },
      data: {
        status: "ARCHIVED",
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "Only draft or closed listings can be archived.",
      };
    }

    refreshInternshipPaths();

    return {
      success: true,
      message: "Internship archived successfully.",
    };
  } catch (error) {
    console.error("ARCHIVE INTERNSHIP ERROR:", error);

    return {
      success: false,
      message: "Unable to archive this internship.",
    };
  }
}

// delete a listing only when it has no applications
export async function deleteInternship(
  listingId: string
): Promise<InternshipActionState> {
  const { companyId } = await getEmployerContext();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const listing = await tx.internshipListing.findFirst({
        where: {
          id: listingId,
          companyId,
        },
        select: {
          id: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
      });

      if (!listing) {
        return {
          success: false,
          message: "Internship listing not found.",
        };
      }

      if (listing._count.applications > 0) {
        return {
          success: false,
          message:
            "This listing has applications and cannot be deleted. Archive it instead.",
        };
      }

      await tx.internshipListing.delete({
        where: {
          id: listing.id,
        },
      });

      return {
        success: true,
        message: "Internship listing deleted successfully.",
      };
    });

    if (result.success) {
      refreshInternshipPaths();
    }

    return result;
  } catch (error) {
    console.error("DELETE INTERNSHIP ERROR:", error);

    return {
      success: false,
      message: "Unable to delete this internship.",
    };
  }
}
