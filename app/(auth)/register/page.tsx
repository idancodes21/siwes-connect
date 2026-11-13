import { Suspense } from "react";
import RegistrationData from "./components/registration-data";

function RegisterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading registration form...
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegistrationData />
    </Suspense>
  );
}