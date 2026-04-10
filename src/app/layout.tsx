import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ZorgMatch - Matchingplatform voor zorg",
  description: "Vind de perfecte zorgverlener of PGB-houder. Een warm en vriendelijk platform voor Nederlandse zorgmatching.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={nunito.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
