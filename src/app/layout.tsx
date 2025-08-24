import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabsy",
  description: "Cabsy - Book affordable rides anytime, anywhere. Reliable cabs with quick pickup and secure travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
