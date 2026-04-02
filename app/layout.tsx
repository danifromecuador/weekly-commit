import type { Metadata } from "next";
import {
  Dancing_Script,
  Geist,
  Geist_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

import { DEFAULT_THEME_ID, getThemeBootstrapScript } from "@/lib/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-theme-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const dancingScript = Dancing_Script({
  variable: "--font-theme-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Weekly Commit",
  description: "Achieve your goals one week at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={DEFAULT_THEME_ID}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapScript(),
          }}
        />
        {children}
      </body>
    </html>
  );
}
