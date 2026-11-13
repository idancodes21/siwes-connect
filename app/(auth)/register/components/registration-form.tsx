"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  GraduationCap,
  Loader2,
  School,
  UserRound,
} from "lucide-react";

import { registerUser, type RegisterState } from "@/actions/register";

type Institution = {
  id: string;
  name: string;
  acronym: string | null;
  departments: {
    id: string;
    name: string;
    code: string | null;
  }[];
};

type RegistrationRole = "STUDENT" | "HOD" | "EMPLOYER";

const initialState: RegisterState = {
  success: false,
  message: "",
};

const roles = [
  {
    value: "STUDENT" as const,
    label: "Student",
    description: "Find internships and manage your placements.",
    icon: GraduationCap,
  },
  {
    value: "HOD" as const,
    label: "Head of Department",
    description: "Oversee your department's SIWES activities.",
    icon: School,
  },
  {
    value: "EMPLOYER" as const,
    label: "Employer",
    description: "Post opportunities and find student interns.",
    icon: Building2,
  },
];

type RegistrationFormProps = {
  institutions: Institution[];
};

export default function RegistrationForm({
  institutions,
}: RegistrationFormProps) {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  const router = useRouter();

useEffect(() => {
  if (state.success) {
    router.replace("/login");
  }
}, [state.success, router]);

  const [role, setRole] = useState<RegistrationRole>("STUDENT");
  const [institutionId, setInstitutionId] = useState("");

  const selectedInstitution = institutions.find(
    (institution) => institution.id === institutionId,
  );

  const departments = selectedInstitution?.departments ?? [];

  function fieldError(field: string) {
    return state.errors?.[field]?.[0];
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-border bg-[#f8fafc] px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10";

  const labelClass = "mb-2 block text-sm font-semibold text-foreground";

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="absolute left-5 top-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary sm:left-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="w-full max-w-2xl">
       {state.success ? null :  (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-9">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Join the university internship and job placement portal.
              </p>
            </div>

            {state.message && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {state.message}
              </div>
            )}

            <form action={formAction} className="space-y-7">
              {/* Role selection */}
              <section>
                <label className={labelClass}>I am registering as a</label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {roles.map((item) => {
                    const Icon = item.icon;
                    const active = role === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        className={`rounded-xl border p-4 text-left transition ${
                          active
                            ? "border-primary bg-blue-50 ring-2 ring-primary/10"
                            : "border-border bg-white hover:border-primary/50"
                        }`}
                      >
                        <Icon
                          className={`mb-3 h-6 w-6 ${
                            active ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span className="block text-sm font-bold text-foreground">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input type="hidden" name="role" value={role} />
              </section>

              {/* Shared account information */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Account Information
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter your personal account details.
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className={inputClass}
                  />
                  {fieldError("name") && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldError("name")}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                    {fieldError("email") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("email")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      autoComplete="tel"
                      className={inputClass}
                    />
                    {fieldError("phone") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("phone")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      required
                      className={inputClass}
                    />
                    {fieldError("password") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("password")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                      className={inputClass}
                    />
                    {fieldError("confirmPassword") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("confirmPassword")}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Student and HOD fields */}
              {(role === "STUDENT" || role === "HOD") && (
                <section className="space-y-4 border-t border-border pt-6">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {role === "STUDENT"
                        ? "Academic Information"
                        : "Department Information"}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Select your institution and department.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="institutionId" className={labelClass}>
                      Institution
                    </label>
                    <select
                      id="institutionId"
                      name="institutionId"
                      required
                      value={institutionId}
                      onChange={(event) => setInstitutionId(event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select your institution</option>
                      {institutions.map((institution) => (
                        <option key={institution.id} value={institution.id}>
                          {institution.name}
                          {institution.acronym
                            ? ` (${institution.acronym})`
                            : ""}
                        </option>
                      ))}
                    </select>
                    {fieldError("institutionId") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("institutionId")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="departmentId" className={labelClass}>
                      Department
                    </label>
                    <select
                      id="departmentId"
                      name="departmentId"
                      required
                      disabled={!institutionId || departments.length === 0}
                      defaultValue=""
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="">
                        {!institutionId
                          ? "Select an institution first"
                          : departments.length === 0
                            ? "No departments available"
                            : "Select your department"}
                      </option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                          {department.code ? ` (${department.code})` : ""}
                        </option>
                      ))}
                    </select>
                    {fieldError("departmentId") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("departmentId")}
                      </p>
                    )}
                  </div>

                  {role === "STUDENT" && (
                    <>
                      <div>
                        <label htmlFor="matricNumber" className={labelClass}>
                          Matriculation Number
                        </label>
                        <input
                          id="matricNumber"
                          name="matricNumber"
                          placeholder="Enter your matric number"
                          required
                          className={inputClass}
                        />
                        {fieldError("matricNumber") && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldError("matricNumber")}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="gender" className={labelClass}>
                            Gender{" "}
                            <span className="font-normal text-muted-foreground">
                              (Optional)
                            </span>
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            defaultValue=""
                            className={inputClass}
                          >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="dateOfBirth" className={labelClass}>
                            Date of Birth
                          </label>
                          <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="level" className={labelClass}>
                            Current Level
                          </label>
                          <input
                            id="level"
                            name="level"
                            type="number"
                            min="1"
                            placeholder="e.g. 300"
                            className={inputClass}
                          />
                          {fieldError("level") && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldError("level")}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="graduationYear"
                            className={labelClass}
                          >
                            Graduation Year
                          </label>
                          <input
                            id="graduationYear"
                            name="graduationYear"
                            type="number"
                            min="2000"
                            placeholder="e.g. 2028"
                            className={inputClass}
                          />
                          {fieldError("graduationYear") && (
                            <p className="mt-1 text-xs text-red-600">
                              {fieldError("graduationYear")}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Employer fields */}
              {role === "EMPLOYER" && (
                <section className="space-y-4 border-t border-border pt-6">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Company Information
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Provide information about your organization.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="companyName" className={labelClass}>
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter your company name"
                      required
                      className={inputClass}
                    />
                    {fieldError("companyName") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("companyName")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className={labelClass}>
                      Your Job Title
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      placeholder="e.g. HR Manager, Recruiter"
                      required
                      className={inputClass}
                    />
                    {fieldError("jobTitle") && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldError("jobTitle")}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="companyEmail" className={labelClass}>
                        Company Email
                      </label>
                      <input
                        id="companyEmail"
                        name="companyEmail"
                        type="email"
                        placeholder="company@example.com"
                        className={inputClass}
                      />
                      {fieldError("companyEmail") && (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldError("companyEmail")}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="companyPhone" className={labelClass}>
                        Company Phone
                      </label>
                      <input
                        id="companyPhone"
                        name="companyPhone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="industry" className={labelClass}>
                        Industry
                      </label>
                      <input
                        id="industry"
                        name="industry"
                        placeholder="e.g. Technology"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="registrationNo" className={labelClass}>
                        Registration Number
                      </label>
                      <input
                        id="registrationNo"
                        name="registrationNo"
                        placeholder="e.g. RC123456"
                        className={inputClass}
                      />
                      {fieldError("registrationNo") && (
                        <p className="mt-1 text-xs text-red-600">
                          {fieldError("registrationNo")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className={labelClass}>
                      Company Website
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Company Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      placeholder="Street address"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        placeholder="City"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className={labelClass}>
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        placeholder="State"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className={labelClass}>
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        defaultValue="Nigeria"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Submit */}
              <div className="border-t border-border pt-6">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserRound className="h-4 w-4" />
                      Create Account
                    </>
                  )}
                </button>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
