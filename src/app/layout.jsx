// src/app/layout.js
// "use client"; // Add this if using client-side features

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import ReduxProvider from "@/redux/providers"; // Default import
// OR if you want named import:
// import { ReduxProvider } from "@/redux/providers";

export const metadata = {
  title: "Data File Converter",
  description:
    "Convert Excel, PDF, and image files into data tables and charts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="">
        <ReduxProvider>
          <div className="fixed w-full z-10">
            <Navbar />
          </div>
          <main className="pt-16 bg-gray-200">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
