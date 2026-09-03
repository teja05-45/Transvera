import type { Metadata } from "next";
import { PageShell } from "@/components/marketing/PageShell";
import { AuthForm } from "@/components/marketing/AuthForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <PageShell title="Log in">
      <AuthForm mode="login" />
    </PageShell>
  );
}
