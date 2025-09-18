import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksandSans = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "HAPI",
  description: "By Will Moss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksandSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
