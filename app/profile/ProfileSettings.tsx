"use client";

import { useState } from "react";
import { RiLogoutCircleRLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

interface UserProfileData {
  username: string;
  email: string;
  receiveNotifications: boolean;
}

interface ProfileSettingsProps {
  user: UserProfileData;
  onSignout: () => void;
  onSave: (settings: {
    receiveNotifications: boolean;
    subscribeNewsletter: boolean;
  }) => void;
}

export function ProfileSettings({
  user,
  onSignout,
  onSave,
}: ProfileSettingsProps) {
  const [receiveNotifications, setReceiveNotifications] = useState(
    user.receiveNotifications,
  );
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(
    user.receiveNotifications,
  );

  const handleSave = () => {
    onSave({ receiveNotifications, subscribeNewsletter });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 border-zinc-200 mb-2 pb-2">
          Informações da Conta
        </h3>
        <div className="grid grid-cols-1 max-w-xl md:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-500">
              Nome de Utilizador
            </label>
            <input
              type="text"
              disabled
              value={user.username}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-600 outline-none text-sm cursor-not-allowed"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-zinc-500">E-mail</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-600 outline-none text-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-zinc-900 border-zinc-200 mb-2 pb-2">
          Preferências
        </h3>
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200">
            <div className="space-y-0.5">
              <p className="text-base font-medium text-zinc-800 flex items-center gap-1.5">
                Receber Notificações por E-mail
              </p>
              <p className="text-sm text-zinc-500">
                Fique a par de novos eventos publicados na plataforma.
              </p>
            </div>
            <input
              type="checkbox"
              checked={receiveNotifications}
              onChange={(e) => setReceiveNotifications(e.target.checked)}
              className="size-5 rounded border-zinc-300 text-design-2 focus:ring-design-2 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200">
            <div className="space-y-0.5">
              <p className="text-base font-medium text-zinc-800 flex items-center gap-1.5">
                Assinar Newsletter Semanal
              </p>
              <p className="text-sm max-w-[80%] text-zinc-500">
                Receba resumos semanais de eventos, notícias e novidades da
                tecnologia em Angola.
              </p>
            </div>
            <input
              type="checkbox"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className="size-5 rounded border-zinc-300 text-design-2 focus:ring-design-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 gap-2 font-normal"
          onClick={onSignout}
        >
          <RiLogoutCircleRLine className="size-4" />
          Terminar Sessão
        </Button>
        <Button
          onClick={handleSave}
          className="bg-design-2 hover:bg-design-2/90 text-white font-normal px-6"
        >
          Salvar Definições
        </Button>
      </div>
    </div>
  );
}
