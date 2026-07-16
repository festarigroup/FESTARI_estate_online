import { Suspense } from "react";
import VerifyIdentity from "@/components/auth/VerifyIdentity";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyIdentity />
    </Suspense>
  );
}
