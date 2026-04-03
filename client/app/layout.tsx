import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⚠️ Comment providers/components first to avoid crashes
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Explorer",
    template: "%s · Explorer",
  },
  description: "A calm place to read and write long-form stories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        
        
        

        <AuthProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </AuthProvider>

      </body>
    </html>
  );
}