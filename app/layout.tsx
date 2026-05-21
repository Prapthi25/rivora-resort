
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Rivora Coorg — Resort Management",
//   description: "Booking & operations console for Rivora Coorg",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} min-h-full flex flex-col`}>
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import "./globals.css";

/* ─── Fonts ────────────────────────────────────────────────────────────────
   Cormorant Garamond  → elegant display / headings (resort, timeless feel)
   Nunito              → body text (rounded, readable for children + seniors)
──────────────────────────────────────────────────────────────────────────── */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

/* ─── Metadata ─────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Rivora Coorg — Resort Management",
  description: "Booking & operations console for Rivora Coorg",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,   /* allow pinch-zoom for accessibility */
  themeColor: "#0B1A0D",
};

/* ─── Root Layout ──────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${nunito.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}