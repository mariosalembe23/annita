import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeToken } from "@/lib/utils";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const payload = decodeToken(token);
  if (!payload || !["ADMIN", "MODERATOR"].includes(payload.role)) redirect("/");

  const { tab } = await searchParams;

  return <DashboardClient initialTab={tab || "dashboard"} />;
}
