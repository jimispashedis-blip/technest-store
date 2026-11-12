import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { isMockMode } from "@/lib/shopify";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechNest — Gaming gear για παίκτες που δεν συμβιβάζονται",
    template: "%s · TechNest",
  },
  description:
    "Ελληνικό eshop με επιλεγμένα gaming gear: πληκτρολόγια, ποντίκια, headsets και monitors. Δωρεάν αποστολή άνω των 60€.",
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: "TechNest",
    title: "TechNest — Gaming gear",
    description: "Πληκτρολόγια, ποντίκια, headsets και monitors για το επόμενο level.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {isMockMode ? (
          <div className="demo-banner">
            Demo mode με τοπικά δεδομένα. Σύνδεσε το Shopify store σου στο <code>.env.local</code> για live
            προϊόντα &amp; checkout.
          </div>
        ) : null}
        <a className="skip-link" href="#MainContent">
          Μετάβαση στο περιεχόμενο
        </a>
        <Header />
        <main id="MainContent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
