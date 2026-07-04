import type { ApiEvent } from "@/lib/api/events";

export const events: ApiEvent[] = [
  {
    id: "1",
    title: "Hackathon Angola 2026: Inovação e Tecnologia em Foco",
    description:
      "O maior hackathon de Angola está de volta! Reúne-te com mentes brilhantes para criar soluções inovadoras que resolvam desafios reais do país. Durante 48 horas, equipas multidisciplinares vão competir para desenvolver protótipos funcionais nas áreas de saúde, educação, agricultura e finanças. Haverá mentoria com especialistas, workshops técnicos e prémios para as melhores soluções.",
    link: "https://example.com/hackathon",
    category: {
      id: "cat-1",
      name: "Hackathon",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2026-10-12T09:00:00Z",
    type: "FREE",
    upvoteCount: 120,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/2e77f7/ffffff?text=Hackathon+2026",
    status: "APPROVED",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  },
  {
    id: "2",
    title: "Palestra: O Futuro da Inteligência Artificial em Angola - Desafios e Oportunidades",
    description:
      "Uma palestra imperdível sobre como a Inteligência Artificial está a transformar o panorama tecnológico em Angola. Especialistas nacionais e internacionais vão discutir as oportunidades que a IA oferece para o desenvolvimento do país, os desafios éticos e regulatórios, e como preparar a próxima geração para um mercado de trabalho cada vez mais automatizado.",
    link: "https://example.com/palestra-ia",
    category: {
      id: "cat-2",
      name: "Palestra",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2026-10-12T14:00:00Z",
    type: "PAID",
    upvoteCount: 100,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/2e77f7/ffffff?text=IA+em+Angola",
    status: "APPROVED",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  },
  {
    id: "3",
    title: "Workshop de Desenvolvimento Web com React e Next.js",
    description:
      "Workshop prático de desenvolvimento web moderno usando React e Next.js. Vais aprender desde os fundamentos até técnicas avançadas como Server Components, roteamento avançado, optimização de performance e deployment. Traz o teu portátil e sai daqui com uma aplicação funcional!",
    link: "https://example.com/workshop-react",
    category: {
      id: "cat-3",
      name: "Workshop",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2026-11-20T09:00:00Z",
    type: "FREE",
    upvoteCount: 85,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/2e77f7/ffffff?text=React+Next.js",
    status: "PENDING",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  },
  {
    id: "4",
    title: "Meetup de Cloud Computing: AWS, Azure e GCP na Prática",
    description:
      "Meetup imperdível para quem trabalha ou quer aprender sobre cloud computing. Vamos comparar as três maiores plataformas cloud — AWS, Azure e Google Cloud — com demonstrações práticas de cada uma. Desde deploy de aplicações serverless até machine learning na cloud, este evento cobre tudo o que precisas saber para escolher a plataforma certa.",
    link: "https://example.com/meetup-cloud",
    category: {
      id: "cat-4",
      name: "Meetup",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2026-12-05T18:00:00Z",
    type: "FREE",
    upvoteCount: 200,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/2e77f7/ffffff?text=Cloud+Computing",
    status: "APPROVED",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  },
  {
    id: "5",
    title: "Angola Tech Summit 2026: O Maior Encontro de Tecnologia do País",
    description:
      "O maior evento de tecnologia de Angola está de volta! O Angola Tech Summit 2026 reúne líderes da indústria, startups inovadoras, investidores e entusiastas da tecnologia para três dias de palestras, workshops, hackathons e networking. Com mais de 50 oradores nacionais e internacionais, é o ponto de encontro obrigatório para quem quer estar na vanguarda da inovação em Angola.",
    link: "https://example.com/tech-summit",
    category: {
      id: "cat-5",
      name: "Conferência",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2027-01-15T09:00:00Z",
    type: "PAID",
    upvoteCount: 340,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/2e77f7/ffffff?text=Angola+Tech+Summit",
    status: "APPROVED",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  },
  {
    id: "6",
    title: "Palestra: Financiamento de Startups em Angola - Oportunidades e Desafios",
    description:
      "Sessão dedicada a empreendedores e founders que buscam entender o ecossistema de financiamento para startups em Angola. Vão ser abordados temas como venture capital, business angels, programas de aceleração e subsídios governamentais. Oradoras convidadas partilharão as suas experiências e dicas práticas para conseguir financiamento.",
    link: "https://example.com/financiamento-startups",
    category: {
      id: "cat-2",
      name: "Palestra",
      groupName: "Tecnologia",
      createdAt: "2026-07-04T20:14:22Z"
    },
    modality: ["PRESENTIAL"],
    startDate: "2026-01-10T14:00:00Z",
    type: "PAID",
    upvoteCount: 340,
    downvoteCount: 0,
    coverImage: "https://placehold.co/600x400/ef4444/ffffff?text=Startups+Angola",
    status: "APPROVED",
    createdById: "user-1",
    createdByUsername: "admin",
    createdAt: "2026-07-01T20:14:22Z",
    updatedAt: "2026-07-01T20:14:22Z"
  }
];

export const badgeVariantFromStatus = (status: string) => {
  if (status === "PENDING") return "status" as const;
  if (status === "APPROVED") return "status" as const;
  return "status" as const;
};

export const badgeVariantFromType = (type: string) => {
  if (type === "FREE") return "free" as const;
  return "paid" as const;
};

export const badgeLabelFromStatus = (status: string) => {
  if (status === "PENDING") return "A Confirmar";
  if (status === "APPROVED") return "Confirmado";
  if (status === "REJECTED") return "Rejeitado";
  if (status === "REPORTED") return "Denunciado";
  return status;
};

export const modalityLabel = (modality: string | string[]) => {
  const list = Array.isArray(modality) ? modality : [modality];
  if (list.includes("PRESENTIAL") && list.length === 1) return "Presencial";
  if (list.includes("REMOTE") && list.length === 1) return "Remoto";
  if (list.includes("HYBRID")) return "Híbrido";
  return list.join(", ");
};

export function timeAgoFromDate(dateStr: string): string {
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

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}. ${year}`;
}
