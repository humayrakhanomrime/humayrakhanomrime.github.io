import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_URL,
  SITE_LOCALE,
  AUTHOR_FULL_NAME,
  AUTHOR_JOB_TITLE,
  AUTHOR_AFFILIATION,
  AUTHOR_AFFILIATION_URL,
  AUTHOR_EMAIL,
  AUTHOR_LOCATION_CITY,
  AUTHOR_LOCATION_REGION,
  AUTHOR_LOCATION_COUNTRY,
  AUTHOR_GITHUB_URL,
  AUTHOR_SCHOLAR_URL,
  AUTHOR_ORCID_URL,
  AUTHOR_KNOWS_ABOUT,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  THEME_COLOR_LIGHT,
  THEME_COLOR_DARK,
} from "@/lib/constants";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR_LIGHT },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR_DARK },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${AUTHOR_JOB_TITLE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: AUTHOR_FULL_NAME, url: SITE_URL }],
  creator: AUTHOR_FULL_NAME,
  publisher: AUTHOR_FULL_NAME,
  category: "education",
  classification: "Academic Portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${AUTHOR_JOB_TITLE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${AUTHOR_JOB_TITLE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: OG_IMAGE_ALT,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: AUTHOR_FULL_NAME,
  alternateName: [SITE_SHORT_NAME, "Humayra Rime"],
  givenName: "Humayra Khanom",
  familyName: "Rime",
  jobTitle: AUTHOR_JOB_TITLE,
  email: `mailto:${AUTHOR_EMAIL}`,
  url: SITE_URL,
  image: `${SITE_URL}/prof_pic.jpeg`,
  gender: "https://schema.org/Female",
  nationality: "Bangladeshi",
  worksFor: {
    "@type": "CollegeOrUniversity",
    name: AUTHOR_AFFILIATION,
    url: AUTHOR_AFFILIATION_URL,
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Rajshahi",
      url: "https://ru.ac.bd/",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: AUTHOR_LOCATION_CITY,
    addressRegion: AUTHOR_LOCATION_REGION,
    addressCountry: AUTHOR_LOCATION_COUNTRY,
  },
  knowsAbout: AUTHOR_KNOWS_ABOUT,
  knowsLanguage: ["English", "Bengali"],
  sameAs: [
    AUTHOR_GITHUB_URL,
    AUTHOR_SCHOLAR_URL,
    AUTHOR_ORCID_URL,
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#person` },
  author: { "@id": `${SITE_URL}/#person` },
  copyrightHolder: { "@id": `${SITE_URL}/#person` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");document.documentElement.className=t==="dark"?"dark":""}catch(e){document.documentElement.className=""}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body
        className={`${roboto.variable} ${robotoSlab.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-white focus:px-3 focus:py-1.5 focus:rounded"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Navbar />
          <main
            id="main"
            className="max-w-[930px] mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] sm:pt-[70px] pb-10 sm:pb-12"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
