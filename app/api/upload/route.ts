import { NextResponse } from "next/server";
import {
  CLOUDINARY_EVENTS_FOLDER,
  getCloudinary,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Nenhum ficheiro enviado." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "A capa do evento deve ser uma imagem." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { message: "A imagem deve ter no máximo 5MB." },
        { status: 400 },
      );
    }

    const cloudinary = getCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_EVENTS_FOLDER,
          resource_type: "image",
          overwrite: false,
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Upload falhou."));
            return;
          }
          resolve({
            secure_url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        },
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao fazer upload da imagem.";

    console.error("[cloudinary/upload]", error);

    return NextResponse.json({ message }, { status: 500 });
  }
}
