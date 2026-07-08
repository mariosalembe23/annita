import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Inicia sessão na Annita e acede à comunidade tech angolana. Descobre e publica eventos de tecnologia em Angola.",
  robots: { index: false, follow: false },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
