"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiFlagLine, RiFunctionAddFill, RiLink, RiDeleteBinLine } from "@remixicon/react";
import Image from "next/image";

interface ActionOption {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface EventActionsDropdownProps {
  open: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onReport: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
  isOwner: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function EventActionsDropdown({
  open,
  onClose,
  onViewDetails,
  onReport,
  onCopyLink,
  onDelete,
  isOwner,
  triggerRef,
}: EventActionsDropdownProps) {
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const actions: ActionOption[] = [
    {
      key: "view",
      label: "Ver detalhes",
      icon: <RiFunctionAddFill className="size-4" />,
      onClick: onViewDetails,
    },
    {
      key: "copy",
      label: "Copiar link",
      icon: <RiLink className="size-4" />,
      onClick: onCopyLink,
    },
  ];

  if (isOwner) {
    actions.push({
      key: "delete",
      label: "Eliminar",
      icon: <RiDeleteBinLine className="size-4" />,
      onClick: onDelete,
      danger: true,
    });
  } else {
    actions.push({
      key: "report",
      label: "Denunciar",
      icon: <RiFlagLine className="size-4" />,
      onClick: onReport,
      danger: true,
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="dropdown-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            key="dropdown-menu"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ top: position.top, right: position.right }}
            className="fixed z-50 min-w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
