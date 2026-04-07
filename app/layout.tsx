import type { Metadata } from "next";
import { Roboto, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "MAC+ CRM",
  description: "Mars Athletic Club CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className={`${roboto.className} ${barlowCondensed.variable} min-h-full flex flex-col text-[13px]`}>
        {children}
      </body>
    </html>
  );
}
