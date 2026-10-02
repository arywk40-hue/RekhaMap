import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RekhaMap AI — Urban Cadastral Intelligence",
  description:
    "AI-assisted urban parcel mapping, cadastral feature extraction, topology validation and field verification.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
