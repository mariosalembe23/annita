import {
  RiCheckboxMultipleLine,
  RiDeleteBinLine,
  RiForbid2Line,
  RiMarkPenLine,
  RiMore2Fill,
  RiTimelineView,
} from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MockEvent,
  statusColors,
  statusLabels,
  typeLabels,
  modalityLabels,
} from "./mock-data";

interface EventCardProps {
  event: MockEvent;
  onSelect: (event: MockEvent) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-md font-medium text-zinc-900 truncate">
            {event.title}
          </h4>
        </div>
        <span
          className={`shrink-0 ps-3 py-0.5 rounded-full text-xs font-medium ${
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
      <div className="pt-4 border-zinc-200 flex items-center justify-between border-t mt-4 text-sm text-zinc-800">
        <p>por {event.createdByUsername}</p>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="size-8 rounded border border-zinc-300 flex items-center justify-center cursor-pointer">
                <RiMore2Fill className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 py-3">
              <DropdownMenuItem
                className="cursor-pointer py-1 px-3 gap-2"
                onClick={() => onSelect(event)}
              >
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
  );
}
