"use client";
import type { Metadata } from "next";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Providers from "@/lib/Providers";
import { Toaster } from "react-hot-toast";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";

const metadata: Metadata = {
  title: "TripNest Admin",
  description: "Generated by TripNest Limited",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Providers>
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {/* <DefaultLayout> */}
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <Toaster position="top-right"/>
          {loading ? <Loader /> : children}
        </div>
        {/* </DefaultLayout> */}
      </body>
    </html>
    </Providers>
  );
}
