import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Manrope } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200","300","400","500","600","700","800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "BLTDIF | Built Different",
  description: "Modern streetwear and performance apparel by Build Different (BLTDIF).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-neutral-100">
        <div className="flex min-h-screen flex-col">
          
          <main className="flex-1"><AuthProvider><Navbar />{children}<Footer /></AuthProvider></main>
          
        </div>
      </body>
    </html>
  );
}
