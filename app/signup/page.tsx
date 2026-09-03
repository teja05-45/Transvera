import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { AuthForm } from "@/components/marketing/AuthForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <PageShell title="Create your account">
      <AuthForm mode="signup" />
    </PageShell>
  );
}
