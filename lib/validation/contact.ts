import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(160),
  message: z.string().min(10, "Message should be at least 10 characters").max(4000),
  // Honeypot field — real users never fill this in; bots often do.
  companyWebsite: z.string().max(0, "Spam check failed").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
