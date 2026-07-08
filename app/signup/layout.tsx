import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta",
  description:
    "Regista-te na Annita e junta-te à comunidade tech angolana. Publica e descobre eventos de tecnologia em Angola.",
  robots: { index: false, follow: false },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
