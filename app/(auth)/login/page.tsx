import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <GraduationCapIcon />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your SIWES Connect account.
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-primary transition hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </main>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 10-10-5L2 10l10 5 10-5Z" />
      <path d="M6 12v5c3.5 3 8.5 3 12 0v-5" />
      <path d="M22 10v6" />
    </svg>
  );
}