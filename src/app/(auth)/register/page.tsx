import { Suspense } from "react";
import RegisterFlow from "@/features/auth/componentes/register/register-flow";
import { LoadingState } from "@/shared/components/ui/loading-state";

export default function Page() {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-128 mx-auto flex flex-col gap-6">
        <Suspense fallback={<LoadingState />}>
          <RegisterFlow />
        </Suspense>
      </div>
    </main>
  );
}

