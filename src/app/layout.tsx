import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
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
        className={`${publicSans.variable} ${sourceSerif.variable} flex min-h-screen w-full flex-col items-center justify-start antialiased`}
      >
        <NuqsAdapter>
          <main className="w-full max-w-[90rem] px-5 sm:px-8 lg:px-10 xl:px-12">
            <Nav />
            {children}
          </main>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
