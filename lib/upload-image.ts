import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const BUCKET = "annita-events"; // ✅ um só lugar para mudar

const sanitizeFilename = (filename: string): string => {
  return filename
    .normalize("NFD") // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-zA-Z0-9._-]/g, "_") // substitui caracteres inválidos por _
    .toLowerCase();
};

export const uploadEventImage = async (file: File): Promise<string> => {
  const sanitizedName = sanitizeFilename(file.name);
  const filename = `events/${Date.now()}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: "application/pdf" });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(BUCKET) // ✅ mesmo bucket
    .getPublicUrl(filename);

  return data.publicUrl;
};

export const uploadImage = async (file: File): Promise<string> => {
  const sanitizedName = sanitizeFilename(file.name);
  const filename = `events/${Date.now()}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return data.publicUrl;
};
