import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real-Time Stock Ticker Dashboard",
  description: "Comprehensive stock market dashboard with real-time data, interactive charts, and portfolio tracking. Monitor your favorite stocks with live updates and detailed analytics.",
  keywords: ["stock market", "real-time stocks", "portfolio tracker", "stock dashboard", "market data", "trading", "investing"],
  authors: [{ name: "Stock Dashboard Team" }],
  creator: "Stock Dashboard",
  publisher: "Stock Dashboard",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stock-dashboard.vercel.app",
    siteName: "Real-Time Stock Ticker Dashboard",
    title: "Real-Time Stock Ticker Dashboard",
    description: "Monitor your favorite stocks with real-time data and interactive charts",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stock Dashboard Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Real-Time Stock Ticker Dashboard",
    description: "Monitor your favorite stocks with real-time data and interactive charts",
    images: ["/og-image.jpg"]
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="stock-dashboard-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}