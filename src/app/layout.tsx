import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Inter instead of Geist
import "./globals.css";

// 2. Initialize the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OptionsForge",
  description: "A platform for learning stock and options trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Use the Inter font class on the body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}