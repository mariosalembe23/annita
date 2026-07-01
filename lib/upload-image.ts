import { createClient } from "@supabase/supabase-js";

const BUCKET = "annita-events";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const sanitizeFilename = (filename: string): string => {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
};

export const uploadEventImage = async (file: File): Promise<string> => {
  const supabase = getSupabase();
  const sanitizedName = sanitizeFilename(file.name);
  const filename = `events/${Date.now()}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: "application/pdf" });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return data.publicUrl;
};

export const uploadImage = async (file: File): Promise<string> => {
  const supabase = getSupabase();
  const sanitizedName = sanitizeFilename(file.name);
  const filename = `events/${Date.now()}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return data.publicUrl;
};
