import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadEventCover(
  file: File,
  userId: string,
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `events/${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("event-covers")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(`Falha ao fazer upload da imagem: ${error.message}`);

  const { data: publicUrl } = supabase.storage
    .from("event-covers")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}
