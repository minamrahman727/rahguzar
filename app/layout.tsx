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
  title: "RahGuzar",
  description: "Your Ultimate Karachi Public Transport Guide. Developed solely by Syed Minam Ur Rehman, RahGuzar helps you plan hassle-free trips using BRTS, People Bus, Local Bus, and Chinchi with real-time routes, fares, and stops. Navigate Karachi smarter!",
  
  icons: {
    icon: "/images/route.png",
  },
  openGraph: {
    title: "RahGuzar",
    description: "Your Ultimate Karachi Public Transport Guide. Developed solely by Syed Minam Ur Rehman, RahGuzar helps you plan hassle-free trips using BRTS, People Bus, Local Bus, and Chinchi with real-time routes, fares, and stops. Navigate Karachi smarter!",
    url: "https://rahguzar.vercel.app/",
    siteName: "RahGuzar",
    images: [
      {
        url: "images/route.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RahGuzar",
    description: "Your Ultimate Karachi Public Transport Guide. Developed solely by Syed Minam Ur Rehman, RahGuzar helps you plan hassle-free trips using BRTS, People Bus, Local Bus, and Chinchi with real-time routes, fares, and stops. Navigate Karachi smarter!",
    creator: "@syedminamurrehman",
    site: "@rahguzar",
    images: ["images/route.png"],
  },
  alternates: {
    canonical: "https://roadmapper.vercel.app/",
    languages: {
      en: "https://roadmapper.vercel.app/",
      es: "https://roadmapper.vercel.app/",
      ur: "https://roadmapper.vercel.app/",
    },
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
