import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TanStackProviders from "@/providers/TanStackProvicers";
import { Toaster } from "@/components/ui/toaster";
import AuthShield from "@/components/auth/AuthShield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot RAG",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TanStackProviders>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthShield>{children}</AuthShield>
          <Toaster />
        </body>
      </TanStackProviders>
    </html>
  );
}
