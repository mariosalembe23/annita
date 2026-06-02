export interface EventBadge {
  label: string;
  variant: "status" | "free" | "paid";
}

export interface EventCardData {
  id: number;
  category: string;
  timeAgo: string;
  subtitle: string;
  title: string;
  badges: EventBadge[];
  date: string;
  interest: number;
  buttonLabel: string;
  headerBg?: string;
}

export const events: EventCardData[] = [
  {
    id: 1,
    category: "Hackathon",
    timeAgo: "Há 3d",
    subtitle: "Evento",
    title: "Hackathon Angola 2026: Inovação e Tecnologia em Foco",
    badges: [
      { label: "Evento Próximo", variant: "status" },
      { label: "Gratuito", variant: "free" },
    ],
    date: "12 de Out. 2026",
    interest: 120,
    buttonLabel: "Participar",
  },
  {
    id: 2,
    category: "Palestra",
    timeAgo: "Há 4d",
    subtitle: "Evento",
    title:
      "Palestra: O Futuro da Inteligência Artificial em Angola - Desafios e Oportunidades",
    badges: [
      { label: "Evento Próximo", variant: "status" },
      { label: "Pago", variant: "paid" },
    ],
    date: "12 de Out. 2026",
    interest: 100,
    buttonLabel: "Participar",
  },
  {
    id: 3,
    category: "Workshop",
    timeAgo: "Há 1d",
    subtitle: "Evento",
    title: "Workshop de Desenvolvimento Web com React e Next.js",
    badges: [
      { label: "A Confirmar", variant: "status" },
      { label: "Gratuito", variant: "free" },
    ],
    date: "20 de Nov. 2026",
    interest: 85,
    buttonLabel: "Participar",
  },
  {
    id: 4,
    category: "Meetup",
    timeAgo: "Há 5d",
    subtitle: "Evento",
    title: "Meetup de Cloud Computing: AWS, Azure e GCP na Prática",
    badges: [
      { label: "Evento Próximo", variant: "status" },
      { label: "Gratuito", variant: "free" },
    ],
    date: "5 de Dez. 2026",
    interest: 200,
    buttonLabel: "Participar",
  },
  {
    id: 5,
    category: "Conferência",
    timeAgo: "Há 2d",
    subtitle: "Evento",
    title: "Angola Tech Summit 2026: O Maior Encontro de Tecnologia do País",
    badges: [
      { label: "Vagas Limitadas", variant: "status" },
      { label: "Pago", variant: "paid" },
    ],
    date: "15 de Jan. 2027",
    interest: 340,
    buttonLabel: "Garantir Vaga",
  },
  {
    id: 6,
    category: "Palestra",
    timeAgo: "Há 6d",
    subtitle: "Evento",
    title:
      "Palestra: Financiamento de Startups em Angola - Oportunidades e Desafios",
    badges: [
      { label: "Evento Passado", variant: "status" },
      { label: "Pago", variant: "paid" },
    ],
    date: "10 de Jan. 2026",
    interest: 340,
    buttonLabel: "Participar",
    headerBg: "bg-red-600",
  },
];
