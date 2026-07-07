import { RiArrowDownSFill, RiArrowUpSFill } from "@remixicon/react";
import { metrics } from "./mock-data";

export default function MetricsGrid() {
  return (
    <div className="mt-10 grid grid-cols-4 gap-6">
      {metrics.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-zinc-900 relative border overflow-hidden border-zinc-200 dark:border-zinc-700 p-6 rounded-2xl"
        >
          <header className="flex items-center justify-between">
            <span className="text-zinc-800 dark:text-zinc-200 font-medium text-md">
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
            <item.icon className="absolute size-32 text-zinc-300 dark:text-zinc-600! -bottom-10 -right-6" />
          </header>
          <footer className="pt-6">
            <p className="text-4xl">{item.value}</p>
            <p className="pt-2 text-sm font-normal! text-zinc-600 dark:text-zinc-400">
              {item.typeDash == "up"
                ? "Aumento neste mês"
                : "Redução neste mês"}
            </p>
          </footer>
        </div>
      ))}
    </div>
  );
}
