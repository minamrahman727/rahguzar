import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RahGuzar",
    template: "%s - RahGuzar",
  },
  description: "Navigate Karachi effortlessly with real-time transit updates.",
  icons: {
    icon: "/images/route.png",
    apple: "/images/route.png",
  },
  openGraph: {
    url: "https://rahguzar.vercel.app/",
    title: "RahGuzar – Your Karachi Journey",
    description: "Discover Karachi with smart, minimalist transit guidance.",
    images: [
      {
        url: "/images/route.png",
        width: 800,
        height: 600,
        alt: "RahGuzar Route",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RahGuzar – Your Karachi Journey",
    description: "Discover Karachi transit with smart updates.",
    site: "@rahguzar",
    images: ["/images/route.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
