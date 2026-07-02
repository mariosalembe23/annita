"use client";

import { useRef, useState } from "react";
import { RiMore2Fill, RiMouseFill } from "@remixicon/react";
import { cn } from "@/lib/utils";
import type { EventCardData } from "@/data/events";
import { EventDetailModal } from "./EventDetailModal";
import { EventActionsDropdown } from "./EventActionsDropdown";

const badgeStyles: Record<string, string> = {
  status: "bg-indigo-400/30 text-indigo-800",
  free: "bg-orange-600 text-white",
  paid: "bg-blue-600 text-white",
};

const pastBadgeStyle = "bg-red-500/10 text-red-700";

interface EventCardProps {
  event: EventCardData;
  className?: string;
  type?: "usual" | "presentation";
}

export function EventCard({
  event,
  className,
  type = "usual",
}: EventCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dotsRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div
        className={cn(
          "h-86 bg-transparent shrink-0 overflow-hidden flex flex-col justify-between border border-gray-200 shadow-2xl shadow-gray-200 z-20 rounded-3xl w-80 cursor-pointer transition-all hover:shadow-gray-300 hover:-translate-y-0.5",
          className,
        )}
        onClick={() => (type === "usual" ? setDetailOpen(true) : null)}
      >
        <header
          className={cn(
            "font-sans rounded-t-2xl p-4 h-20",
            event.headerBg ?? "bg-design-2",
          )}
        >
          <div className="flex w-full items-center gap-4 justify-between">
            <p className="text-white text-sm">{event.category}</p>
            <div className="flex items-center gap-4">
              <p className="text-white text-sm">{event.timeAgo}</p>
              {type === "usual" && (
                <button
                  ref={dotsRef}
                  className="text-white rotate-90 opacity-50 hover:opacity-100 transition-opacity relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((prev) => !prev);
                  }}
                >
                  <RiMore2Fill />
                </button>
              )}
            </div>
          </div>
        </header>
        <div className="h-full w-full flex-col flex justify-between p-5 rounded-t-2xl shadow-2xl bg-white -mt-5">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 mb-2">{event.subtitle}</p>
              <div className="flex items-center ">
                <div className="size-9 rounded-full bg-gray-100 border-2 border-white" />
                <div className="size-9 rounded-full -ms-4 bg-gray-100 border-2 border-white" />
              </div>
            </div>
            <h3 className="text-xl mt-3 line-clamp-3">{event.title}</h3>
            {event.badges.length > 0 && (
              <div className="flex items-center gap-1">
                {event.badges.map((badge, i) => (
                  <p
                    key={i}
                    className={cn(
                      "px-2 py-0.5 mt-3 rounded inline-flex text-sm",
                      badge.label === "Evento Passado"
                        ? pastBadgeStyle
                        : badgeStyles[badge.variant],
                    )}
                  >
                    {badge.label}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Data do Evento</p>
              <p className="text-base">{event.date}</p>
            </div>
          </div>
          <footer className="flex items-center justify-between w-full">
            <div>
              <p className="flex items-center text-blue-600 gap-0.5">
                <RiMouseFill className="size-5" />
                {event.interest}
              </p>
            </div>
            <div>
              {type === "usual" && (
                <button
                  className="text-base transition-all hover:opacity-75 text-white bg-design-2 border-design-2 border rounded-lg px-3 py-1.5 font-normal flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.buttonLabel}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>

      <EventActionsDropdown
        open={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onViewDetails={() => setDetailOpen(true)}
        onReport={() => {}}
        triggerRef={dotsRef}
      />

      <EventDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        event={event}
      />
    </>
  );
}
