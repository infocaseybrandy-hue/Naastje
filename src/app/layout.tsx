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
  title: "ZorgVonk - Jouw perfecte zorgmatch",
  description: "Vind de perfecte zorgverlener of hulp in de buurt. ZorgVonk verbindt PGB-houders en zorgvragers met de juiste zorg — persoonlijk, dichtbij en met een klik.",
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
