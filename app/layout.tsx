import type { Metadata } from "next";
import {
  Caveat,
  Dancing_Script,
  Geist,
  Geist_Mono,
  Kalam,
  Patrick_Hand,
  Playfair_Display,
  Sniglet,
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

const sniglet = Sniglet({
  variable: "--font-flow-sniglet",
  subsets: ["latin"],
  weight: ["400", "800"],
});

const caveat = Caveat({
  variable: "--font-flow-caveat",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const kalam = Kalam({
  variable: "--font-flow-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-flow-patrick",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Weekly Commit",
  description: "Achieve your goals one week at a time",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancingScript.variable} ${sniglet.variable} ${caveat.variable} ${kalam.variable} ${patrickHand.variable} h-full antialiased`}
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
