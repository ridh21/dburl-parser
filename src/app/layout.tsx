import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DB URL Parser | Database Connection URL Converter",
  description: "Parse database connection URLs and convert them to ready-to-use parameters for DBeaver, pgAdmin, and other database management tools.",
  keywords: ["database", "connection", "URL", "parser", "PostgreSQL", "MySQL", "DBeaver", "pgAdmin"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="e74504b6-4f88-4ba1-8c5c-16265cc3df32"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${dmSans.variable} font-sans antialiased min-h-screen bg-background`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
