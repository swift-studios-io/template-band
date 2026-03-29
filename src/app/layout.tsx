import type { Metadata } from "next";
import { Syne, Heebo, Teko } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3333"),
  title: "The Voltage | Official Site",
  description:
    "The Voltage — electrifying live performances, original music, tour dates, videos and more.",
  openGraph: {
    title: "The Voltage | Official Site",
    description:
      "The Voltage — electrifying live performances, original music, tour dates, videos and more.",
    type: "website",
    siteName: "The Voltage",
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
        className={`${syne.variable} ${heebo.variable} ${teko.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
