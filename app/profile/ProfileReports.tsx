import React from "react";

export function ProfileReports() {
  return (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="p-5 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900">
          Histórico de Denúncias
        </h3>
        <p className="text-sm text-zinc-500">
          Denúncias efetuadas por si para ajudar a moderar a plataforma.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 border-b border-zinc-200">
              <th className="py-3.5 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Evento
              </th>
              <th className="py-3.5 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Razão
              </th>
              <th className="py-3.5 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Data
              </th>
              <th className="py-3.5 px-5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-sm">
            <tr className="hover:bg-zinc-50/30 transition-colors">
              <td className="py-4 px-5 font-medium text-zinc-900">
                Conferência Web3 Falsa
              </td>
              <td className="py-4 px-5 text-zinc-600">
                Informação Falsa / Enganosa
              </td>
              <td className="py-4 px-5 text-zinc-500">10 Jun. 2026</td>
              <td className="py-4 px-5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  Removido
                </span>
              </td>
            </tr>
            <tr className="hover:bg-zinc-50/30 transition-colors">
              <td className="py-4 px-5 font-medium text-zinc-900">
                Workshop React Pago
              </td>
              <td className="py-4 px-5 text-zinc-600">
                Spam ou Repetido
              </td>
              <td className="py-4 px-5 text-zinc-500">02 Jul. 2026</td>
              <td className="py-4 px-5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  Em Análise
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
