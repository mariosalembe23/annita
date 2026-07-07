import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://annita.ao";

export const metadata: Metadata = {
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
    "anita eventos",
    "annita",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "pt_AO",
    siteName: "Annita",
    title: "Annita — Eventos de Tecnologia em Angola",
    description:
      "Descobre e publica os melhores eventos de tecnologia em Angola. Hackathons, workshops, conferências, meetups e mais.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Annita — Eventos de Tecnologia em Angola",
    description:
      "Descobre e publica os melhores eventos de tecnologia em Angola.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="application-name" content="Annita" />
        <meta name="theme-color" content="#ffffff" />
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
