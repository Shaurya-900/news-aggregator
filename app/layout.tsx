import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Cell News — Shiv Nadar University",
  description:
    "Startup news, funding rounds, and ecosystem updates — curated by the Shiv Nadar University Entrepreneurship Cell.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#faf8f4] font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
