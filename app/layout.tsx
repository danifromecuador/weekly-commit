import type { Metadata } from "next";
import "./globals.css";

import { ThemeAppearanceRoot } from "@/components/theme-appearance-root";
import { getLocaleBootstrapScript } from "@/lib/i18n";
import { getThemeBootstrapScript } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Weekly Commit",
  description: "Achieve your goals one week at a time",
  /** Single source: `app/icon.png`. Avoid a separate `favicon.ico` or browsers often prefer it and show the wrong asset. */
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapScript(),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: getLocaleBootstrapScript(),
          }}
        />
        <ThemeAppearanceRoot>{children}</ThemeAppearanceRoot>
      </body>
    </html>
  );
}
