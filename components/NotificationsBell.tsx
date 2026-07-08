"use client";

import { useState } from "react";
import { RiMegaphoneLine } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import {
  getNotifications,
  markNotificationRead,
} from "@/lib/api/notifications";
import { timeAgoFromDate } from "@/data/events";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationsTab = "all" | "unread" | "read";

const NOTIFICATION_TABS: { value: NotificationsTab; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "read", label: "Lidas" },
];

export function NotificationsBell() {
  const { token } = useUser();
  const queryClient = useQueryClient();
  const [notificationsTab, setNotificationsTab] =
    useState<NotificationsTab>("all");

  const { data: notificationsResponse } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(token!, 1, 50),
    enabled: !!token,
  });

  const notifications = notificationsResponse?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = notifications.filter((n) =>
    notificationsTab === "all"
      ? true
      : notificationsTab === "unread"
        ? !n.read
        : n.read,
  );

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Notificações"
          className="relative p-2 pot:p-2 border-gray-200 dark:border-zinc-700 border rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center"
        >
          <RiMegaphoneLine className="size-7 pot:size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 pot:-top-1.5 pot:-right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-red-600 text-white text-[11px] font-medium flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={12}
        className="w-80 max-w-80 mt-3 pot:mt-0 p-0 max-pot:w-[90vw]! max-pot:max-w-none!"
      >
        <div className="px-3 pt-2.5 pb-2 border-b border-gray-100 dark:border-zinc-700">
          <p className="pot:text-sm text-xl pot:font-medium font-bold text-zinc-900 dark:text-zinc-100">
            Notificações
          </p>
          <div className="flex items-center gap-1 mt-2">
            {NOTIFICATION_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setNotificationsTab(tab.value)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  notificationsTab === tab.value
                    ? "bg-design-2 text-white font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                {tab.label}
                {tab.value === "unread" && unreadCount > 0 && (
                  <span className="ms-1">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {visibleNotifications.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              {notificationsTab === "unread"
                ? "Sem notificações por ler."
                : notificationsTab === "read"
                  ? "Sem notificações lidas."
                  : "Sem notificações."}
            </p>
          ) : (
            visibleNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onSelect={(e) => {
                  e.preventDefault();
                  if (!notification.read) {
                    markReadMutation.mutate(notification.id);
                  }
                }}
                className="flex flex-col items-start gap-0.5 px-2.5 py-2 cursor-pointer"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      notification.read
                        ? "text-zinc-600 dark:text-zinc-400"
                        : "text-zinc-900 dark:text-zinc-100 font-medium"
                    }`}
                  >
                    {notification.eventTitle}
                  </p>
                  {!notification.read && (
                    <span className="size-2 rounded-full bg-design-2 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {timeAgoFromDate(notification.createdAt)}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
