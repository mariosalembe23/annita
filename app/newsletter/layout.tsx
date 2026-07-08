import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscreve a newsletter da Annita e recebe os melhores eventos de tecnologia de Angola directamente no teu email.",
  alternates: {
    canonical: "https://annita.himersus.com/newsletter",
  },
  openGraph: {
    title: "Newsletter — Annita",
    description:
      "Subscreve a newsletter da Annita e recebe os melhores eventos de tecnologia de Angola directamente no teu email.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Newsletter da Annita",
      },
    ],
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
