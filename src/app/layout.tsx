import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Robotics Inventory",
  description: "Durham Robotics inventory manager.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <html lang="en" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient text-foreground font-rubik">
        <header className="flex justify-between items-center p-5 border-b border-background-warm">
          <h1 className="text-2xl">
            <b>Durham Robotics</b> Inventory
          </h1>
          {isAuthenticated && (
            <p>Signed in as {session.user?.name ?? session.user?.email}</p>
          )}
        </header>
        {children}
      </body>
    </html>
  );
}
