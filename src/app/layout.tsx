import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robotics Inventory",
  description: "Durham Robotics inventory manager.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${rubik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-rubik">{children}</body>
    </html>
  );
}
