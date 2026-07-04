export interface EventImage {
  src: string;
  alt: string;
}

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
  description: string;
  location: string;
  images: EventImage[];
  link?: string;
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
    description:
      "O maior hackathon de Angola está de volta! Reúne-te com mentes brilhantes para criar soluções inovadoras que resolvam desafios reais do país. Durante 48 horas, equipas multidisciplinares vão competir para desenvolver protótipos funcionais nas áreas de saúde, educação, agricultura e finanças. Haverá mentoria com especialistas, workshops técnicos e prémios para as melhores soluções.",
    location: "Centro de Conferências de Luanda, Talatona",
    images: [
      { src: "https://placehold.co/600x400/2e77f7/ffffff?text=Hackathon+2026", alt: "Hackathon banner" },
      { src: "https://placehold.co/600x400/59c7fa/ffffff?text=Equipas+a+Trabalhar", alt: "Equipas a trabalhar" },
      { src: "https://placehold.co/600x400/172fab/ffffff?text=Prémios", alt: "Prémios" },
    ],
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
    description:
      "Uma palestra imperdível sobre como a Inteligência Artificial está a transformar o panorama tecnológico em Angola. Especialistas nacionais e internacionais vão discutir as oportunidades que a IA oferece para o desenvolvimento do país, os desafios éticos e regulatórios, e como preparar a próxima geração para um mercado de trabalho cada vez mais automatizado.",
    location: "Auditório do ISPTEC, Luanda",
    images: [
      { src: "https://placehold.co/600x400/2e77f7/ffffff?text=IA+em+Angola", alt: "IA em Angola" },
      { src: "https://placehold.co/600x400/59c7fa/ffffff?text=Palestrantes", alt: "Palestrantes" },
    ],
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
    description:
      "Workshop prático de desenvolvimento web moderno usando React e Next.js. Vais aprender desde os fundamentos até técnicas avançadas como Server Components, roteamento avançado, optimização de performance e deployment. Traz o teu portátil e sai daqui com uma aplicação funcional!",
    location: "Coworking AngoInov, Luanda",
    images: [
      { src: "https://placehold.co/600x400/2e77f7/ffffff?text=React+Next.js", alt: "React e Next.js" },
      { src: "https://placehold.co/600x400/59c7fa/ffffff?text=Código+ao+Vivo", alt: "Código ao vivo" },
    ],
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
    description:
      "Meetup imperdível para quem trabalha ou quer aprender sobre cloud computing. Vamos comparar as três maiores plataformas cloud — AWS, Azure e Google Cloud — com demonstrações práticas de cada uma. Desde deploy de aplicações serverless até machine learning na cloud, este evento cobre tudo o que precisas saber para escolher a plataforma certa.",
    location: "Espaço Kilamba, Luanda",
    images: [
      { src: "https://placehold.co/600x400/2e77f7/ffffff?text=Cloud+Computing", alt: "Cloud Computing" },
      { src: "https://placehold.co/600x400/59c7fa/ffffff?text=AWS+Azure+GCP", alt: "AWS, Azure, GCP" },
    ],
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
    description:
      "O maior evento de tecnologia de Angola está de volta! O Angola Tech Summit 2026 reúne líderes da indústria, startups inovadoras, investidores e entusiastas da tecnologia para três dias de palestras, workshops, hackathons e networking. Com mais de 50 oradores nacionais e internacionais, é o ponto de encontro obrigatório para quem quer estar na vanguarda da inovação em Angola.",
    location: "Centro de Convenções de Luanda",
    images: [
      { src: "https://placehold.co/600x400/2e77f7/ffffff?text=Angola+Tech+Summit", alt: "Angola Tech Summit" },
      { src: "https://placehold.co/600x400/59c7fa/ffffff?text=Palco+Principal", alt: "Palco principal" },
      { src: "https://placehold.co/600x400/172fab/ffffff?text=Networking", alt: "Networking" },
    ],
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
    description:
      "Sessão dedicada a empreendedores e founders que buscam entender o ecossistema de financiamento para startups em Angola. Vão ser abordados temas como venture capital, business angels, programas de aceleração e subsídios governamentais. Oradoras convidadas partilharão as suas experiências e dicas práticas para conseguir financiamento.",
    location: "Hub de Inovação do Banco Nacional de Angola",
    images: [
      { src: "https://placehold.co/600x400/ef4444/ffffff?text=Startups+Angola", alt: "Startups Angola" },
      { src: "https://placehold.co/600x400/f97316/ffffff?text=Financiamento", alt: "Financiamento" },
    ],
  },
];

import type { ApiEvent } from "@/lib/api/events";

const badgeVariantFromStatus = (status: string) => {
  if (status === "PENDING") return "status" as const;
  if (status === "APPROVED") return "status" as const;
  return "status" as const;
};

const badgeVariantFromType = (type: string) => {
  if (type === "FREE") return "free" as const;
  return "paid" as const;
};

const badgeLabelFromStatus = (status: string) => {
  if (status === "PENDING") return "A Confirmar";
  if (status === "APPROVED") return "Confirmado";
  if (status === "REJECTED") return "Rejeitado";
  if (status === "REPORTED") return "Denunciado";
  return status;
};

const modalityLabel = (modality: string | string[]) => {
  const list = Array.isArray(modality) ? modality : [modality];
  if (list.includes("PRESENTIAL") && list.length === 1) return "Presencial";
  if (list.includes("REMOTE") && list.length === 1) return "Remoto";
  if (list.includes("HYBRID")) return "Híbrido";
  return list.join(", ");
};

export function adaptApiEvent(apiEvent: ApiEvent): EventCardData {
  const badges = [
    { label: badgeLabelFromStatus(apiEvent.status), variant: badgeVariantFromStatus(apiEvent.status) },
    { label: apiEvent.type === "FREE" ? "Gratuito" : "Pago", variant: badgeVariantFromType(apiEvent.type) },
  ];

  const timeAgo = timeAgoFromDate(apiEvent.createdAt);

  return {
    id: parseInt(apiEvent.id.replace(/-/g, "").slice(0, 8), 16) || Math.random(),
    category: apiEvent.category.name,
    timeAgo,
    subtitle: modalityLabel(apiEvent.modality),
    title: apiEvent.title,
    badges,
    date: formatDate(apiEvent.startDate),
    interest: 0,
    buttonLabel: "Participar",
    description: apiEvent.description,
    location: "",
    images: apiEvent.coverImage
      ? [{ src: apiEvent.coverImage, alt: apiEvent.title }]
      : [],
    link: apiEvent.link,
  };
}

function timeAgoFromDate(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Há 1d";
  if (days < 7) return `Há ${days}d`;
  if (days < 30) return `Há ${Math.floor(days / 7)}sem`;
  return `Há ${Math.floor(days / 30)}m`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}. ${year}`;
}
