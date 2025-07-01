import type { Metadata } from "next";
import { SUSE } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const suseFont = SUSE({
  variable: "--font-SUSE",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Climate Stories Library",
  description: "A platform for individuals and grassroots groups to share their experiences of, and responses to, the climate and nature crisis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${suseFont.variable} ${suseFont.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
