import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabsy - Smart Cab Booking Platform",
  description: "Book cabs with multiple stops, return journeys, and dynamic fare calculation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
