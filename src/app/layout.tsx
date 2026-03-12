import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JN Medical Suppliers - Quality Medical Equipment & Supplies",
  description: "Your trusted partner for quality medical supplies. We provide a wide range of medical equipment and supplies with free delivery.",
  keywords: ["Medical Supplies", "Healthcare", "Medical Equipment", "JN Medical"],
  authors: [{ name: "JN Medical Suppliers" }],
  icons: {
    icon: "/logo.jpg",
  },
  openGraph: {
    title: "JN Medical Suppliers",
    description: "Quality medical equipment and supplies with free delivery",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
