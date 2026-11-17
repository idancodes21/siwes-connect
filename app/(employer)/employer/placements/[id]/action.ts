"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getEmployerContext } from "@/lib/employer";

export type PlacementFormState = {
  success: boolean;
  message: string;
  errors?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    supervisorName?: string;
    supervisorEmail?: string;
    supervisorPhone?: string;
  };
};

const allowedStatuses = ["ACTIVE", "COMPLETED", "TERMINATED"] as const;

function parseDate(value: string) {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  return date;
}

export async function updatePlacement(
  _prevState: PlacementFormState,
  formData: FormData
): Promise<PlacementFormState> {
  const { companyId } = await getEmployerContext();

  const placementId = String(formData.get("placementId") ?? "");
  const status = String(formData.get("status") ?? "");
  const startDateValue = String(formData.get("startDate") ?? "");
  const endDateValue = String(formData.get("endDate") ?? "");
  const supervisorName = String(formData.get("supervisorName") ?? "").trim();
  const supervisorEmail = String(formData.get("supervisorEmail") ?? "")
    .trim()
    .toLowerCase();
  const supervisorPhone = String(formData.get("supervisorPhone") ?? "").trim();

  const errors: NonNullable<PlacementFormState["errors"]> = {};

  if (!placementId) {
    return { success: false, message: "Placement not found." };
  }

  if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    errors.status = "Select a valid placement status.";
  }

  const startDate = parseDate(startDateValue);
  const endDate = parseDate(endDateValue);

  if (startDateValue && startDate === undefined) {
    errors.startDate = "Enter a valid start date.";
  }

  if (endDateValue && endDate === undefined) {
    errors.endDate = "Enter a valid end date.";
  }

  if (
    startDate instanceof Date &&
    endDate instanceof Date &&
    endDate < startDate
  ) {
    errors.endDate = "End date cannot be before the start date.";
  }

  if (supervisorName.length > 100) {
    errors.supervisorName = "Supervisor name cannot exceed 100 characters.";
  }

  if (supervisorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supervisorEmail)) {
    errors.supervisorEmail = "Enter a valid email address.";
  }

  if (supervisorEmail.length > 254) {
    errors.supervisorEmail = "Email address is too long.";
  }

  if (supervisorPhone.length > 30) {
    errors.supervisorPhone = "Phone number cannot exceed 30 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  const result = await prisma.placement.updateMany({
    where: {
      id: placementId,
      companyId,
    },
    data: {
      status: status as (typeof allowedStatuses)[number],
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      supervisorName: supervisorName || null,
      supervisorEmail: supervisorEmail || null,
      supervisorPhone: supervisorPhone || null,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Placement not found or you do not have permission to update it.",
    };
  }

  revalidatePath("/employer/placements");
  revalidatePath(`/employer/placements/${placementId}`);
  revalidatePath("/student/placement");
  revalidatePath("/student/dashboard");

  return {
    success: true,
    message: "Placement details updated successfully.",
  };
}
