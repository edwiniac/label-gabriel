import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageTransition } from "@/components/PageTransition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://labelgabriel.com"),
  title: "Label Gabriel",
  description:
    "Bespoke bridal, baptism, and custom fashion. Editorially crafted garments by Label Gabriel — where heritage textiles meet modern silhouette.",
  openGraph: {
    title: "Label Gabriel — Bespoke Bridal & Custom Fashion",
    description:
      "Bespoke bridal, baptism, and custom fashion. Editorially crafted garments where heritage textiles meet modern silhouette.",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Label Gabriel — Bespoke Fashion Label",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Gabriel — Bespoke Bridal & Custom Fashion",
    description:
      "Bespoke bridal, baptism, and custom fashion. Editorially crafted garments where heritage textiles meet modern silhouette.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {/* Accessibility: skip-to-content link */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>
          <PageTransition>
            <main id="main-content">{children}</main>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
