import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import "./globals.css";
export const metadata: Metadata = {
  title: "Africa Community Village — Goma, RDC",
  description:
    "Jeunesse, communautés et initiatives locales au cœur du Nord-Kivu.",
};
export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = (await cookies()).get("acv-language")?.value === "en" ? "en" : "fr";
  return (
    <html lang={language} data-scroll-behavior="smooth">
      <body className="bg-surface font-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
