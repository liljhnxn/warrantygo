import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WarrantyGo | On-Chain Warranty Registration & Lookup",
  description:
    "Decentralized, immutable warranty registration and verification on Botchain. Verify gadget and electronics warranties instantly.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-charcoal-950 text-zinc-200 antialiased min-h-screen selection:bg-purple-900/50 selection:text-purple-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

