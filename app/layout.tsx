import type { Metadata } from "next";
import { Geist, Geist_Mono, Varela_Round } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const varelaRound = Varela_Round({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-varela-round",
});

export const metadata: Metadata = {
  title: "VibeFlow - Sync, Share, and Vibe",
  description: "A social music platform for listening to music with friends in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${varelaRound.variable} dark`}
      >
      <ClerkProvider>
      <body className="min-h-full flex flex-col">{children}</body>
      </ClerkProvider>
    </html>
  );
}
