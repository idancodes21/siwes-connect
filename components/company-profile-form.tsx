
"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  ImagePlus,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { updateCompanyProfile,   type CompanyFormState, } from "@/app/(employer)/employer/company/actions";

type Company = {
  id: string;
  name: string;
  registrationNo: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  logo: string | null;
};

type Props = {
  company: Company;
};

const initialState: CompanyFormState = {
  success: false,
  message: "",
};

export default function CompanyProfileForm({ company }: Props) {
  const [state, formAction, isPending] = useActionState(
    updateCompanyProfile,
    initialState
  );

  const [logoUrl, setLogoUrl] = useState(company.logo ?? "");

  useEffect(() => {
    if (state.success) {
      // Keep the logo preview synchronized after a successful save.
      setLogoUrl((current) => current.trim());
    }
  }, [state.success]);

  const errors = state.errors ?? {};

  const getError = (field: string) => errors[field]?.[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Heading */}
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Company Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your company's information and keep your business profile up to date.
        </p>
      </section>

      <form action={formAction} className="space-y-6">
        {/* Feedback */}
        {state.message && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}
            <p>{state.message}</p>
          </div>
        )}

        {/* Company identity */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Company Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Basic information about your organization.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">
            {/* Logo */}
            {/* <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Company Logo
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                  {logoUrl.trim() ? (
                    <img
                      src={logoUrl}
                      alt="Company logo preview"
                      className="size-full object-contain"
                    />
                  ) : (
                    <ImagePlus className="size-8 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    name="logo"
                    type="url"
                    value={logoUrl}
                    onChange={(event) => setLogoUrl(event.target.value)}
                    placeholder="https://example.com/company-logo.png"
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a publicly accessible image URL for your company logo.
                  </p>
                  {getError("logo") && (
                    <p className="text-xs text-red-500">
                      {getError("logo")}
                    </p>
                  )}
                </div>
              </div>
            </div> */}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Company Name"
                name="name"
                defaultValue={company.name}
                required
                error={getError("name")}
                placeholder="Enter company name"
              />

              <Field
                label="Industry"
                name="industry"
                defaultValue={company.industry}
                error={getError("industry")}
                placeholder="e.g. Information Technology"
              />

              <Field
                label="Registration Number"
                name="registrationNo"
                defaultValue={company.registrationNo}
                error={getError("registrationNo")}
                placeholder="Enter registration number"
              />
            </div>

            <TextAreaField
              label="Company Description"
              name="description"
              defaultValue={company.description}
              error={getError("description")}
              placeholder="Tell students about your company, its work and the opportunities you offer..."
            />
          </div>
        </section>

        {/* Contact information */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Contact Information
              </h2>
              <p className="text-sm text-muted-foreground">
                How students and applicants can reach your company.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <Field
              label="Company Email"
              name="email"
              type="email"
              defaultValue={company.email}
              error={getError("email")}
              placeholder="contact@company.com"
            />

            <Field
              label="Company Phone"
              name="phone"
              type="tel"
              defaultValue={company.phone}
              error={getError("phone")}
              placeholder="+234 800 000 0000"
            />

            <div className="sm:col-span-2">
              <Field
                label="Website"
                name="website"
                type="url"
                defaultValue={company.website}
                error={getError("website")}
                placeholder="https://www.company.com"
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Business Location
              </h2>
              <p className="text-sm text-muted-foreground">
                Your company's registered or operating address.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <Field
              label="Street Address"
              name="address"
              defaultValue={company.address}
              error={getError("address")}
              placeholder="Enter street address"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="City"
                name="city"
                defaultValue={company.city}
                error={getError("city")}
                placeholder="Enter city"
              />

              <Field
                label="State"
                name="state"
                defaultValue={company.state}
                error={getError("state")}
                placeholder="Enter state"
              />

              <div className="sm:col-span-2">
                <Field
                  label="Country"
                  name="country"
                  defaultValue={company.country}
                  required
                  error={getError("country")}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
};

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  error,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className={`h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  error?: string;
};

function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  error,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={5}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`w-full resize-y rounded-xl border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
