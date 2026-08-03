import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KELAS - RPL 3C",
  description: "Website resmi Kelas RPL 3C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;700&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-brown font-sans">{children}</body>
    </html>
  );
}