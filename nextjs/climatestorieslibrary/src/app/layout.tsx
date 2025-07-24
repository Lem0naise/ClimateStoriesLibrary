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
  description: "The Climate Stories Library provides a platform for individuals and grassroots groups to share their experiences of, and responses to, the climate and nature crisis.",
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-16x16-0.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32-0.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48-0.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon-64x64-0.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicons/favicon-96x96-0.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon-128x128-0.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicons/favicon-192x192-0.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/favicon-256x256-0.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicons/favicon-384x384-0.png', sizes: '384x384', type: 'image/png' },
      { url: '/favicons/favicon-512x512-0.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      { url: '/favicons/apple-touch-icon-0.png', sizes: '180x180', type: 'image/png' }
    ],
  },
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
