
import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().trim().optional(),
);

const optionalEmail = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.string().trim().email("Enter a valid email address").optional(),
);

const optionalNumber = z.preprocess(
  (value) => (value === "" || value == null ? undefined : Number(value)),
  z.number().int().positive().optional(),
);

const optionalDate = z.preprocess(
  (value) =>
    value === "" || value == null ? undefined : new Date(String(value)),
  z.date().optional(),
);

const optionalGender = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
);

const accountFields = {
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),

  phone: optionalText,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: z.string().min(1, "Please confirm your password"),
};

function validatePasswords<T extends { password: string; confirmPassword: string }>(
  schema: z.ZodType<T>,
) {
  return schema.refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );
}


const studentRegistrationSchema = z.object({
  ...accountFields,
  role: z.literal("STUDENT"),
  institutionId: z.string().min(1, "Select your institution"),
  departmentId: z.string().min(1, "Select your department"),
  matricNumber: z.string().trim().min(1, "Matriculation number is required"),
  gender: optionalGender,
  dateOfBirth: optionalDate,
  level: optionalNumber,
  graduationYear: optionalNumber,
});

const hodRegistrationSchema = z.object({
  ...accountFields,
  role: z.literal("HOD"),
  institutionId: z.string().min(1, "Select your institution"),
  departmentId: z.string().min(1, "Select your department"),
});

const employerRegistrationSchema = z.object({
  ...accountFields,
  role: z.literal("EMPLOYER"),
  companyName: z.string().trim().min(2, "Company name is required"),
  jobTitle: z.string().trim().min(2, "Job title is required"),
  companyEmail: optionalEmail,
  companyPhone: optionalText,
  industry: optionalText,
  registrationNo: optionalText,
  website: optionalText,
  address: optionalText,
  city: optionalText,
  state: optionalText,
  country: optionalText,
});

export const registrationSchema = z
  .discriminatedUnion("role", [
    studentRegistrationSchema,
    hodRegistrationSchema,
    employerRegistrationSchema,
  ])
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;
