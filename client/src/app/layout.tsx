import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/client/public/editor.svg",
  },
  title: "CodeSync — Real-time Collaborative Editor",
  description:
    "Code together, in real-time. Built with Next.js, Socket.io & Monaco.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#1e1e1e] text-white`}>
        {children}
      </body>
    </html>
  );
}
