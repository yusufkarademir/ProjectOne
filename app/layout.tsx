import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EtkinlikQR",
  description: "Etkinlik fotoğraflarınızı QR kod ile kolayca paylaşın",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
