import { Suspense } from "react";
import ChangeContactMethod from "@/components/auth/ChangeContactMethod";

export default function ChangeContactPage() {
  return (
    <Suspense fallback={null}>
      <ChangeContactMethod />
    </Suspense>
  );
}
