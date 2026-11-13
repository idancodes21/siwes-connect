"use server";

import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validation/registration"; 
import bcrypt from "bcryptjs";

export type RegisterState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  // Convert the submitted form into an object Zod can validate.
  const rawData = Object.fromEntries(formData.entries());

  const result = registrationSchema.safeParse(rawData);

  if (!result.success) {
    const errors = Object.fromEntries(
      Object.entries(result.error.flatten().fieldErrors).filter(
        ([, messages]) => messages && messages.length > 0,
      ),
    ) as Record<string, string[]>;

    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  const data = result.data;

  try {
    // Check whether the email is already registered.
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
        errors: {
          email: ["This email is already registered."],
        },
      };
    }

    // Verify the selected department and institution.
    if (data.role === "STUDENT" || data.role === "HOD") {
      const department = await prisma.department.findFirst({
        where: {
          id: data.departmentId,
          institutionId: data.institutionId,
        },
        select: { id: true },
      });

      if (!department) {
        return {
          success: false,
          message: "The selected department does not belong to that institution.",
          errors: {
            departmentId: ["Please select a valid department."],
          },
        };
      }
    }

    // Check student matriculation number.
    if (data.role === "STUDENT") {
      const existingStudent = await prisma.studentProfile.findUnique({
        where: { matricNumber: data.matricNumber },
        select: { id: true },
      });

      if (existingStudent) {
        return {
          success: false,
          message: "This matriculation number is already registered.",
          errors: {
            matricNumber: ["This matriculation number is already in use."],
          },
        };
      }
    }

    // A department can only have one HOD profile in the current schema.
    if (data.role === "HOD") {
      const existingHod = await prisma.hodProfile.findUnique({
        where: { departmentId: data.departmentId },
        select: { id: true },
      });

      if (existingHod) {
        return {
          success: false,
          message: "An HOD account is already registered for this department.",
          errors: {
            departmentId: ["This department already has a registered HOD."],
          },
        };
      }
    }

    // Check optional company registration number.
    if (data.role === "EMPLOYER" && data.registrationNo) {
      const existingCompany = await prisma.company.findUnique({
        where: { registrationNo: data.registrationNo },
        select: { id: true },
      });

      if (existingCompany) {
        return {
          success: false,
          message: "This company registration number is already in use.",
          errors: {
            registrationNo: ["This registration number is already registered."],
          },
        };
      }
    }

    // Hash the password before storing it.
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the user and corresponding profile atomically.
    await prisma.$transaction(async (tx) => {
      if (data.role === "STUDENT") {
        await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "STUDENT",

            student: {
              create: {
                matricNumber: data.matricNumber,
                departmentId: data.departmentId,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                level: data.level,
                graduationYear: data.graduationYear,
              },
            },
          },
        });
      }

      if (data.role === "HOD") {
        await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "HOD",

            hod: {
              create: {
                departmentId: data.departmentId,
              },
            },
          },
        });
      }

      if (data.role === "EMPLOYER") {
        await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            role: "EMPLOYER",

            employer: {
              create: {
                jobTitle: data.jobTitle,

                company: {
                  create: {
                    name: data.companyName,
                    registrationNo: data.registrationNo,
                    email: data.companyEmail,
                    phone: data.companyPhone,
                    industry: data.industry,
                    website: data.website,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                  },
                },
              },
            },
          },
        });
      }
    });

    return {
      success: true,
      message: "Your account has been created successfully.",
    };
  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);

    if (isPrismaUniqueError(error)) {
      return {
        success: false,
        message:
          "Some information is already registered. Please check your email, matriculation number, or company details.",
      };
    }

    return {
      success: false,
      message: "Something went wrong while creating your account. Please try again.",
    };
  }
}
