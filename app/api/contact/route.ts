import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";

// Basic in-memory rate limit — resets on server restart, and doesn't share
// state across multiple server instances. Fine for a beta; swap for a
// Redis-backed limiter before scaling past a single instance.
const submissionsByIp = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const history = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  history.push(now);
  submissionsByIp.set(ip, history);
  return history.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  if (parsed.data.companyWebsite) {
    // Honeypot tripped — silently accept without processing further,
    // rather than telling the bot it was caught.
    return NextResponse.json({ ok: true });
  }

  // NOTE: no email/notification provider is configured in this build.
  // The submission is validated, spam-checked, and logged server-side;
  // wiring an actual delivery provider (e.g. Postmark, SES) here is a
  // config change, not a restructure.
  console.log("[contact] new submission", {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
  });

  return NextResponse.json({ ok: true });
}
