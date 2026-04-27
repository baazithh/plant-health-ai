import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Plant Health Monitoring",
  description: "Advanced AI-based plant disease detection and treatment planning",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0F172A]">
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-[1px] border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#0F172A]">
              AI Based Plant Health Monitoring System
            </h1>
            <div className="flex gap-8 items-center">
              <span className="text-[10px] font-medium uppercase tracking-widest text-[#0F172A]/40">v1.0.0</span>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
