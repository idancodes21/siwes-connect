
import { z } from "zod";

const optionalText = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === ""
      ? undefined
      : value,
  z.string().trim().optional()
);

const optionalPositiveInteger = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value),
  z.number().int().positive().optional()
);

const optionalDate = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === ""
      ? undefined
      : value,
  z.coerce.date().optional()
);

export const internshipSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Title must contain at least 5 characters.")
      .max(120, "Title cannot exceed 120 characters."),

    description: z
      .string()
      .trim()
      .min(30, "Please provide at least 30 characters.")
      .max(5000, "Description is too long."),

    requirements: optionalText,
    responsibilities: optionalText,
    location: optionalText,

    isRemote: z.boolean(),

    durationMonths: optionalPositiveInteger,

    positions: z.preprocess(
      (value) =>
        value === "" || value === null || value === undefined
          ? 1
          : Number(value),
      z.number().int().positive("Positions must be at least 1.")
    ),

    deadline: optionalDate,

    status: z.enum(["DRAFT", "PUBLISHED"]),
  })
  .superRefine((data, ctx) => {
    if (!data.isRemote && !data.location) {
      ctx.addIssue({
        code: "custom",
        message: "Location is required for on-site opportunities.",
        path: ["location"],
      });
    }
  });

export type InternshipFormValues = z.infer<typeof internshipSchema>;
