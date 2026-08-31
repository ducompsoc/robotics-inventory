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
    <html lang="en" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient text-foreground font-rubik">
        <header className="flex items-center text-2xl p-5 border-b border-background-warm">
          <h1>
            <b>Durham Robotics</b> Inventory
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
