import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://annita.himersus.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Annita — Eventos de Tecnologia em Angola",
    template: "%s — Annita",
  },
  description:
    "Descobre e publica os melhores eventos de tecnologia em Angola. Hackathons, workshops, conferências, meetups, bootcamps e mais. Conecta-te com a comunidade tech angolana.",
  keywords: [
    "eventos tecnologia Angola",
    "hackathon Angola",
    "workshop tecnologia Luanda",
    "comunidade tech Angola",
    "eventos tech Angola",
    "programação Angola",
    "conferência tecnologia Angola",
    "meetup Angola",
    "bootcamp Angola",
    "annita",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    siteName: "Annita",
    title: "Annita — Eventos de Tecnologia em Angola",
    description:
      "Descobre e publica os melhores eventos de tecnologia em Angola. Hackathons, workshops, conferências, meetups e mais.",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Annita — Eventos de Tecnologia em Angola",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Annita — Eventos de Tecnologia em Angola",
    description:
      "Descobre e publica os melhores eventos de tecnologia em Angola.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-AO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="application-name" content="Annita" />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#242424"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="author" content="Annita" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
