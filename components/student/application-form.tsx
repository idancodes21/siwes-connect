
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

import { submitApplication,type ApplicationFormState, } from "../../app/(student)/student/internships/[id]/apply/action"; 

const initialState: ApplicationFormState = {
  success: false,
  message: "",
};

type ApplicationFormProps = {
  listingId: string;
};

export default function ApplicationForm({
  listingId,
}: ApplicationFormProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState,
  );

  useEffect(() => {
    if (state.success && state.applicationId) {
      router.replace(`/student/applications/${state.applicationId}`);
      router.refresh();
    }
  }, [state.success, state.applicationId, router]);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <input type="hidden" name="listingId" value={listingId} />

      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Your application
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Introduce yourself and explain why you're interested in this
          internship.
        </p>
      </div>

      <div>
        <label
          htmlFor="coverLetter"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Cover letter <span className="text-muted-foreground">(Optional)</span>
        </label>

        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={8}
          maxLength={3000}
          placeholder="Tell the employer about yourself, your relevant skills, and why you're interested in this opportunity..."
          disabled={isPending}
          className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
        />

        {state.errors?.coverLetter && (
          <p className="mt-2 text-sm text-destructive">
            {state.errors.coverLetter[0]}
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground">
          Maximum 3,000 characters.
        </p>
      </div>

      {state.message && !state.success && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <div className="border-t border-border pt-5">
        <p className="mb-4 text-xs leading-5 text-muted-foreground">
          By submitting this application, you confirm that the information
          provided is accurate and that you are interested in this internship.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={17} />
              Submit application
            </>
          )}
        </button>
      </div>
    </form>
  );
}
