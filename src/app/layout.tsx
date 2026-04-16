import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const quicksandSans = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HAPI",
  description: "Health & AI Policy Index",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksandSans.variable} antialiased flex flex-col items-center min-h-screen w-screen justify-start`}
      >
        <NuqsAdapter>
          <main className="w-full max-w-7xl px-4 md:px-0">
            <Nav />
            {children}
          </main>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
