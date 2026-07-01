"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  RiAppsLine,
  RiArchiveStackLine,
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiCheckboxMultipleLine,
  RiDeleteBinLine,
  RiEqualizerLine,
  RiForbid2Line,
  RiGroup3Line,
  RiMailSendLine,
  RiMarkPenLine,
  RiMore2Fill,
  RiTimelineView,
} from "@remixicon/react";
import { Search, CalendarIcon } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./sidebar";

const metrics = [
  {
    label: "Total de Eventos",
    icon: RiArchiveStackLine,
    value: 25,
    href: "/dashboard/events",
    typeDash: "up",
    percentage: 0.2,
  },
  {
    label: "Total de Usuários",
    icon: RiGroup3Line,
    value: 25,
    href: "/dashboard/users",
    typeDash: "down",
    percentage: 0.2,
  },
  {
    label: "Total de Categorias",
    icon: RiAppsLine,
    value: 25,
    href: "/dashboard/categories",
    typeDash: "down",
    percentage: 0.2,
  },
  {
    label: "Inscritos em Newsletter",
    icon: RiMailSendLine,
    value: 25,
    href: "/dashboard/newsletter",
    typeDash: "down",
    percentage: 0.2,
  },
];

const mockEvents = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Workshop de React Avançado",
    description:
      "Aprenda conceitos avançados de React incluindo hooks personalizados, context API e padrões de performance.",
    link: "https://exemplo.com/workshop-react",
    category: {
      id: "cat-001",
      name: "Tecnologia",
      groupName: "Tech",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "REMOTE" as const,
    startDate: "2026-07-15T09:00:00Z",
    type: "FREE" as const,
    coverImage: "/img/events/react-workshop.png",
    status: "APPROVED" as const,
    createdById: "user-001",
    createdByUsername: "maria.silva",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-10T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Conferência de Marketing Digital",
    description:
      "Maior conferência de marketing digital do ano com palestrantes internacionais e cases de sucesso.",
    link: "https://exemplo.com/conferencia-marketing",
    category: {
      id: "cat-002",
      name: "Marketing",
      groupName: "Marketing",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "PRESENTIAL" as const,
    startDate: "2026-08-20T08:00:00Z",
    type: "PAID" as const,
    coverImage: "/img/events/marketing-conf.png",
    status: "APPROVED" as const,
    createdById: "user-002",
    createdByUsername: "joao.costa",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-20T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Hackathon de Inovação",
    description:
      "Evento de 48 horas para desenvolver soluções inovadoras com mentoria de especialistas.",
    link: "https://exemplo.com/hackathon",
    category: {
      id: "cat-001",
      name: "Tecnologia",
      groupName: "Tech",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "HYBRID" as const,
    startDate: "2026-09-05T09:00:00Z",
    type: "FREE" as const,
    coverImage: "/img/events/hackathon.png",
    status: "PENDING" as const,
    createdById: "user-003",
    createdByUsername: "ana.santos",
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Curso de Fotografia Profissional",
    description:
      "Aprenda técnicas avançadas de fotografia com equipamento profissional e edição de imagens.",
    link: "https://exemplo.com/curso-fotografia",
    category: {
      id: "cat-003",
      name: "Artes",
      groupName: "Cultura",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "PRESENTIAL" as const,
    startDate: "2026-07-22T14:00:00Z",
    type: "PAID" as const,
    coverImage: "/img/events/fotografia.png",
    status: "APPROVED" as const,
    createdById: "user-004",
    createdByUsername: "carla.lima",
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-06-25T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "Webinar sobre IA Generativa",
    description:
      "Descubra como a inteligência artificial generativa está transformando indústrias e o futuro do trabalho.",
    link: "https://exemplo.com/webinar-ia",
    category: {
      id: "cat-001",
      name: "Tecnologia",
      groupName: "Tech",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "REMOTE" as const,
    startDate: "2026-07-30T19:00:00Z",
    type: "FREE" as const,
    coverImage: "/img/events/webinar-ia.png",
    status: "APPROVED" as const,
    createdById: "user-005",
    createdByUsername: "pedro.alves",
    createdAt: "2026-07-05T10:00:00Z",
    updatedAt: "2026-07-08T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    title: "Encontro de Empreendedores",
    description:
      "Networking e palestras sobre empreendedorismo, captação de investimento e scaling up.",
    link: "https://exemplo.com/encontro-empreendedores",
    category: {
      id: "cat-004",
      name: "Negócios",
      groupName: "Business",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "PRESENTIAL" as const,
    startDate: "2026-08-12T09:00:00Z",
    type: "PAID" as const,
    coverImage: "/img/events/empreendedores.png",
    status: "REJECTED" as const,
    createdById: "user-006",
    createdByUsername: "lucia.martins",
    createdAt: "2026-07-10T10:00:00Z",
    updatedAt: "2026-07-12T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    title: "Palestra de Liderança",
    description:
      "Palestra inspiradora sobre liderança transformadora com CEOs de empresas referência no mercado.",
    link: "https://exemplo.com/palestra-lideranca",
    category: {
      id: "cat-005",
      name: "Desenvolvimento",
      groupName: "Pessoas",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "HYBRID" as const,
    startDate: "2026-08-05T18:00:00Z",
    type: "FREE" as const,
    coverImage: "/img/events/lideranca.png",
    status: "APPROVED" as const,
    createdById: "user-007",
    createdByUsername: "ricardo.gomes",
    createdAt: "2026-07-08T10:00:00Z",
    updatedAt: "2026-07-10T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    title: "Feira de Carreiras",
    description:
      "Feira com recrutadores das maiores empresas para conectar talentos a oportunidades de emprego.",
    link: "https://exemplo.com/feira-carreiras",
    category: {
      id: "cat-006",
      name: "Educação",
      groupName: "Educação",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "PRESENTIAL" as const,
    startDate: "2026-09-10T09:00:00Z",
    type: "FREE" as const,
    coverImage: "/img/events/feira-carreiras.png",
    status: "PENDING" as const,
    createdById: "user-008",
    createdByUsername: "patricia.oliveira",
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-07-15T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    title: "Curso Online de Python",
    description:
      "Curso completo de Python do básico ao avançado com projetos práticos e certificado.",
    link: "https://exemplo.com/curso-python",
    category: {
      id: "cat-001",
      name: "Tecnologia",
      groupName: "Tech",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "REMOTE" as const,
    startDate: "2026-08-01T09:00:00Z",
    type: "PAID" as const,
    coverImage: "/img/events/curso-python.png",
    status: "APPROVED" as const,
    createdById: "user-009",
    createdByUsername: "andre.pereira",
    createdAt: "2026-07-12T10:00:00Z",
    updatedAt: "2026-07-14T14:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    title: "Workshop de Design UX",
    description:
      "Workshop prático de design de experiência do usuário com ferramentas como Figma e prototipação.",
    link: "https://exemplo.com/workshop-ux",
    category: {
      id: "cat-007",
      name: "Design",
      groupName: "Design",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    modality: "HYBRID" as const,
    startDate: "2026-08-25T09:00:00Z",
    type: "PAID" as const,
    coverImage: "/img/events/workshop-ux.png",
    status: "REPORTED" as const,
    createdById: "user-010",
    createdByUsername: "beatriz.rocha",
    createdAt: "2026-07-18T10:00:00Z",
    updatedAt: "2026-07-20T14:00:00Z",
  },
];

const statusColors: Record<string, string> = {
  PENDING: " text-yellow-800",
  APPROVED: " text-green-800",
  REJECTED: " text-red-800",
  REPORTED: " text-orange-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  REPORTED: "Reportado",
};

const typeLabels: Record<string, string> = {
  PAID: "Pago",
  FREE: "Gratuito",
};

const modalityLabels: Record<string, string> = {
  PRESENTIAL: "Presencial",
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
};

interface DashboardClientProps {
  initialTab: string;
}

export default function DashboardClient({ initialTab }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    router.replace(`${pathname}?tab=${tab}`, { scroll: false });
  }

  const sectionTitle: Record<string, string> = {
    dashboard: "Dashboard",
    eventos: "Eventos",
    usuarios: "Usuários",
    categorias: "Categorias",
    newsletter: "Newsletter",
  };

  return (
    <div className="w-full h-dvh bg-[#f5f5f5] grid grid-cols-[4%_96%]">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="h-dvh overflow-y-auto">
        <section id="dashboard" className="p-10">
          <header className="flex items-center justify-between">
            <div className="w-full">
              <InputGroup className="max-w-lg bg-white">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <RiEqualizerLine />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div>
              <button className="px-5 py-1.5 gap-2 border bg-white hover:bg-zinc-100 transition-all border-gray-200 rounded-lg flex items-center">
                <Image
                  src={"/img/avatar.png"}
                  alt={"Avatar"}
                  width={100}
                  className="size-5"
                  height={100}
                />
                <span className="text-zinc-900 inline-flex pe-2 text-sm">
                  msalembe
                </span>
              </button>
            </div>
          </header>

          {activeTab === "dashboard" && (
            <>
              <div className="mt-10 grid grid-cols-4 gap-6">
                {metrics.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white relative border overflow-hidden border-zinc-200 p-6 rounded-2xl"
                  >
                    <header className="flex items-center justify-between">
                      <span className="text-zinc-800 font-medium text-md">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.typeDash === "up" ? (
                          <RiArrowUpSFill className="size-6 text-green-600" />
                        ) : (
                          <RiArrowDownSFill className="size-6 text-red-600" />
                        )}
                        <p
                          className={`text-base ${item.typeDash === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.percentage}%
                        </p>
                      </div>
                      <item.icon className="absolute size-32 text-zinc-300! -bottom-10 -right-6" />
                    </header>
                    <footer className="pt-6">
                      <p className="text-4xl">{item.value}</p>
                      <p className="pt-2 text-sm font-normal! text-zinc-600">
                        {item.typeDash == "up"
                          ? "Aumento neste mês"
                          : "Redução neste mês"}
                      </p>
                    </footer>
                  </div>
                ))}
              </div>

              <section className="mt-10">
                <header className="flex items-center justify-between">
                  <h3 className="text-3xl">Eventos Recentes</h3>
                  <button
                    onClick={() => handleTabChange("eventos")}
                    className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
                  >
                    <RiArchiveStackLine className="size-4" />
                    Todos eventos
                  </button>
                </header>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Input
                    placeholder="Pesquisar eventos..."
                    className="max-w-xs bg-white"
                  />
                  <Select>
                    <SelectTrigger className="w-36 bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="APPROVED">Aprovado</SelectItem>
                      <SelectItem value="REJECTED">Rejeitado</SelectItem>
                      <SelectItem value="REPORTED">Reportado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-28 bg-white">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Pago</SelectItem>
                      <SelectItem value="FREE">Gratuito</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-36 bg-white">
                      <SelectValue placeholder="Modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENTIAL">Presencial</SelectItem>
                      <SelectItem value="REMOTE">Remoto</SelectItem>
                      <SelectItem value="HYBRID">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-36 bg-white">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="artes">Artes</SelectItem>
                      <SelectItem value="negocios">Negócios</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-fit justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {startDate
                          ? format(startDate, "dd/MM/yyyy")
                          : "Data início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-zinc-400">—</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-fit justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Data fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4">
                  {mockEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-zinc-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-md font-medium text-zinc-900 truncate">
                            {event.title}
                          </h4>
                        </div>
                        <span
                          className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[event.status]
                          }`}
                        >
                          {statusLabels[event.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white">
                        <span className="px-2 py-0.5 rounded-md bg-design-3">
                          {typeLabels[event.type]}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-design-3">
                          {modalityLabels[event.modality]}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-design-3">
                          {event.category.name}
                        </span>
                      </div>
                      <div className="pt-4 border-zinc-200 flex items-center justify-between border-t mt-4 text-xs text-zinc-800">
                        <p>por {event.createdByUsername}</p>
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="size-8 rounded border border-zinc-300 flex items-center justify-center cursor-pointer">
                                <RiMore2Fill className="size-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 py-3"
                            >
                              <DropdownMenuItem className="cursor-pointer py-1 px-3 gap-2">
                                <RiTimelineView className="size-4" />
                                Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer py-1 px-3 gap-2">
                                <RiMarkPenLine className="size-4" />
                                Editar Evento
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer py-1 px-3 gap-2">
                                <RiForbid2Line className="size-4" />
                                Rejeitar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer py-1 px-3 gap-2">
                                <RiCheckboxMultipleLine className="size-4" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer py-1 px-3 gap-2"
                                variant="destructive"
                              >
                                <RiDeleteBinLine className="size-4" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab !== "dashboard" && (
            <div className="mt-10">
              <h2 className="text-3xl font-medium text-zinc-800">
                {sectionTitle[activeTab]}
              </h2>
              <p className="mt-2 text-zinc-500">Conteúdo em desenvolvimento.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
