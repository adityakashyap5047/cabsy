import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
});

export const metadata: Metadata = {
  title: "Cabsy",
  description: "Cabsy - Book affordable rides anytime, anywhere. Reliable cabs with quick pickup and secure travel",
  icons: {
    icon: "cabsy/cabsy.png",
    shortcut: "cabsy/cabsy.png",
    apple: "cabsy/cabsy.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${libreBaskerville.variable} antialiased flex flex-col min-h-screen`} > 
        <Providers>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
