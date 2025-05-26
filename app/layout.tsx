import type { Metadata } from "next";
import "./globals.css";
import HomeNavbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Giggo",
  description: "Connecting Talent with Opportunity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
