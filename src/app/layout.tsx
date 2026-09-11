import type { Metadata } from "next";
import { Inter, Geist_Mono, Poppins, Herr_Von_Muellerhoff } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
// Wordmark font for "KAD CONTROLS LIMITED" — geometric sans matching the real logo/site.
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-wordmark" });
// Script font for the "For All Your Electrical Needs" tagline, matching the real site.
const tagline = Herr_Von_Muellerhoff({ subsets: ["latin"], weight: "400", variable: "--font-tagline" });


const SITE_URL = "https://www.kadcontrols.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kad Controls Ltd | Turn-key Electrical, Automation & Solar Solutions in Kenya",
    template: "%s | Kad Controls Ltd",
  },
  description:
    "Kad Controls Ltd is a turn-key solution provider in Kenya with 16+ years in the industry — we " +
    "design, supply, install and commission solar PV, automation & control panels, PLC/HMI/SCADA, " +
    "UPS & generators, BMS (including fire alarm systems) and HVAC. One team, from concept to a working system.",
  keywords: [
    "turn-key electrical solutions Kenya",
    "automation panels Nairobi",
    "solar PV installation Kenya",
    "PLC HMI SCADA Kenya",
    "building management systems Kenya",
    "fire alarm systems Nairobi",
    "UPS and generator installation Kenya",
    "power factor correction Kenya",
    "industrial lighting Kenya",
    "Kad Controls",
  ],
  authors: [{ name: "Kad Controls Ltd" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Kad Controls Ltd",
    title: "Kad Controls Ltd | Turn-key Electrical, Automation & Solar Solutions in Kenya",
    description:
      "Design, supply, installation and commissioning — one team handles everything. Solar PV, " +
      "automation, BMS, fire alarm systems, UPS/generators and industrial lighting.",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kad Controls Ltd | Turn-key Electrical, Automation & Solar Solutions in Kenya",
    description: "Design, supply, install and commission — one turn-key team for solar, automation, BMS and more.",
  },
  robots: { index: true, follow: true },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: "Kad Controls Ltd",
  description:
    "Turn-key solution provider handling design, supply, installation and commissioning of " +
    "solar PV, automation and control panels, PLC/HMI/SCADA, UPS and generators, building " +
    "management systems (including fire alarm systems), and industrial/commercial lighting.",
  url: SITE_URL,
  telephone: "+254772600242",
  email: "info@kadcontrols.co.ke",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Prabhaki Industrial Park, Godown C3, Babadogo",
    addressLocality: "Nairobi",
    postalCode: "00200",
    addressCountry: "KE",
  },
  areaServed: "KE",
  sameAs: [
    "https://www.facebook.com/KAD-Controls-Limited-348235419330444",
    "https://www.linkedin.com/in/kad-controls-limited-33bb00112/",
    "https://www.instagram.com/KADcontrols",
    "https://www.twitter.com/ControlsKad",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable, geistMono.variable, poppins.variable, tagline.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}