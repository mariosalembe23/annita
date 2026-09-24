const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function mapUploadError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("cloudinary não está configurado")) {
    return message;
  }

  if (lower.includes("5mb") || lower.includes("file size")) {
    return "A imagem deve ter no máximo 5MB.";
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("load failed")
  ) {
    return "Não foi possível enviar a imagem. Verifica a ligação e tenta de novo.";
  }

  return message || "Falha ao fazer upload da imagem.";
}

async function uploadToCloudinary(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("A capa do evento deve ser uma imagem.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("A imagem deve ter no máximo 5MB.");
  }

  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body,
  });

  const data = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !data?.url) {
    throw new Error(
      mapUploadError(data?.message ?? "Falha ao fazer upload da imagem."),
    );
  }

  return data.url;
}

/** @deprecated Prefer uploadImage — kept for compatibility */
export const uploadEventImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file);
};

export const uploadImage = async (file: File): Promise<string> => {
  return uploadToCloudinary(file);
};
