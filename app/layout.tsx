import type { Metadata } from "next";
import "./globals.css";

// Loaded as a stylesheet link rather than next/font/google: next/font
// fetches fonts at build time, which requires network access to
// fonts.googleapis.com. The CSS variables below fall back to system
// font stacks if the stylesheet can't load, so the app still renders.

export const metadata: Metadata = {
  title: {
    default: "LedgerFlow AI — Turn financial documents into usable data",
    template: "%s · LedgerFlow AI",
  },
  description:
    "Extract transactions from bank statement PDFs and export clean CSV, Excel, JSON, QuickBooks, Xero, OFX, Tally, Zoho Books, or FreshBooks files. Free during beta.",
  metadataBase: new URL("https://ledgerflow.example"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional:
            next/font/google fetches at build time and needs network access this
            sandboxed build environment doesn't have. In a normal deployment
            environment with network access, swap this for next/font/google
            for better font-loading performance. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
