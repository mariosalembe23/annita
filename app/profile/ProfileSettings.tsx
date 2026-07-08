"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiLogoutCircleRLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { updateUser, deleteUser } from "@/lib/api/users";
import { useToast } from "@/hooks/use-toast";

const DELETE_CONFIRMATION_PHRASE = "Eliminar minha conta";

interface UserProfileData {
  id: string;
  username: string;
  email: string;
  receiveNotifications: boolean;
}

interface ProfileSettingsProps {
  user: UserProfileData;
  token: string;
  onSignout: () => void;
  onSave: (settings: {
    receiveNotifications: boolean;
    subscribeNewsletter: boolean;
  }) => void;
  onDeleteAccount: () => void;
}

export function ProfileSettings({
  user,
  token,
  onSignout,
  onSave,
  onDeleteAccount,
}: ProfileSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [receiveNotifications, setReceiveNotifications] = useState(
    user.receiveNotifications,
  );
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(
    user.receiveNotifications,
  );

  const notificationsMutation = useMutation({
    mutationFn: (value: boolean) =>
      updateUser(
        user.id,
        {
          username: user.username,
          email: user.email,
          receiveNotifications: value,
        },
        token,
      ),
    onSuccess: (_data, value) => {
      toast(
        "success",
        value
          ? "Passará a receber notificações por e-mail."
          : "Deixará de receber notificações por e-mail.",
      );
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any, value) => {
      // Reverter para o estado anterior em caso de falha
      setReceiveNotifications(!value);
      toast(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao atualizar as preferências",
      );
    },
  });

  const handleToggleNotifications = (value: boolean) => {
    setReceiveNotifications(value);
    notificationsMutation.mutate(value);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteUser(user.id, token),
    onSuccess: () => {
      setDeleteConfirmOpen(false);
      setDeleteConfirmText("");
      onDeleteAccount();
    },
    onError: (error: any) => {
      toast(
        "error",
        error?.response?.data?.message ||
          error?.message ||
          "Erro ao eliminar a conta",
      );
    },
  });

  const canConfirmDelete =
    deleteConfirmText.trim() === DELETE_CONFIRMATION_PHRASE;

  const handleDeleteDialogChange = (open: boolean) => {
    setDeleteConfirmOpen(open);
    if (!open) setDeleteConfirmText("");
  };

  const handleSave = () => {
    onSave({ receiveNotifications, subscribeNewsletter });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 mb-2 pb-2">
          Informações da Conta
        </h3>
        <div className="grid grid-cols-1 max-w-xl md:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Nome de Utilizador
            </label>
            <input
              type="text"
              disabled
              value={user.username}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 outline-none text-base det:text-sm cursor-not-allowed"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              E-mail
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 outline-none text-base det:text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 mb-2 pb-2">
          Preferências
        </h3>
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="space-y-0.5">
              <p className="text-base font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                Receber notificações por e-mail
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Fique a par de novos eventos publicados na plataforma.
              </p>
            </div>
            <input
              type="checkbox"
              checked={receiveNotifications}
              disabled={notificationsMutation.isPending}
              onChange={(e) => handleToggleNotifications(e.target.checked)}
              className="size-5 rounded border-zinc-300 text-design-2 focus:ring-design-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div className="space-y-0.5">
              <p className="text-base font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                Assinar newsletter semanal
              </p>
              <p className="text-sm max-w-[80%] text-zinc-500 dark:text-zinc-400">
                Receba resumos semanais de eventos, notícias e novidades da
                tecnologia em Angola.
              </p>
            </div>
            <Link href={"/newsletter"}>
              <Button
                type="button"
                className="bg-design-2 hover:bg-design-2/40 text-white"
              >
                Assinar Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 mb-2 pb-2">
          Eliminar Conta
        </h3>
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20">
            <div className="space-y-0.5">
              <p className="text-sm max-w-[85%] text-red-600/80 dark:text-red-400/80">
                Ao eliminar a sua conta, todos os seus dados e eventos
                publicados serão permanentemente apagados. Esta ação é
                irreversível.
              </p>
            </div>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-normal px-4 py-2 shrink-0"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          className="dark:text-red-400 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 hover:border-red-300 gap-2 font-normal"
          onClick={onSignout}
        >
          <RiLogoutCircleRLine className="size-4" />
          Terminar Sessão
        </Button>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="flex p-2 flex-col items-start">
            <DialogTitle>Confirmar Eliminação</DialogTitle>
            <DialogDescription>
              Tem a certeza de que deseja eliminar a sua conta? Esta ação não
              pode ser desfeita e todos os seus eventos serão perdidos.
            </DialogDescription>
          </DialogHeader>

          <div className="px-2 space-y-2">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              Para confirmar, escreva{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {DELETE_CONFIRMATION_PHRASE}
              </span>{" "}
              no campo abaixo.
            </label>
            <input
              type="text"
              autoComplete="off"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={DELETE_CONFIRMATION_PHRASE}
              disabled={deleteAccountMutation.isPending}
              className="w-full px-3 mt-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none text-base det:text-sm transition-all focus:ring-4 focus:ring-red-100 dark:focus:ring-red-500/20 focus:border-red-400 disabled:opacity-50"
            />
          </div>

          <DialogFooter className="bg-white dark:bg-zinc-900 justify-between! border-zinc-200 dark:border-zinc-700 flex sm:justify-center gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={deleteAccountMutation.isPending}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:pointer-events-none"
              disabled={!canConfirmDelete || deleteAccountMutation.isPending}
              onClick={() => deleteAccountMutation.mutate()}
            >
              {deleteAccountMutation.isPending
                ? "A eliminar..."
                : "Sim, eliminar conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
