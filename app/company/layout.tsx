import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registo de Empresa",
  description:
    "Regista a tua empresa na Annita para publicar e gerir eventos de tecnologia em Angola.",
  robots: { index: false, follow: false },
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
