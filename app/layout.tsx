import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { ModalProvider } from "@/providers/modal-provider";
import { Loading } from "@/components/auth/loading";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nexora-whiteboard.vercel.app"),
  title: "Nexora | Collaborative Infinite Whiteboard for Teams",
  description: "Nexora is a real-time collaborative whiteboard built with Next.js featuring infinite canvas, live collaboration, authentication, and modern design.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Nexora - Collaborative Infinite Whiteboard",
    description: "Real-time collaborative whiteboard with infinite canvas, rich shape elements, and seamless team collaboration.",
    url: "https://nexora-whiteboard.vercel.app",
    siteName: "Nexora",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Suspense fallback={<Loading />}>
            <ConvexClientProvider>
              <Toaster />
              <ModalProvider />
              {children}
            </ConvexClientProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
