import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer, BottomNav, DynamicEnvironment } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SendHeartHaven",
  description: "Sebuah ruang sunyi untuk berbagi pesan-pesan dari hati.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col paper-texture font-serif">
        <DynamicEnvironment />
        <Header />
        <main className="grow flex flex-col">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
