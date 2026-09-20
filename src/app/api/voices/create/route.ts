import { auth } from "@clerk/nextjs/server";
import { parseBuffer } from "music-metadata";
import z from "zod";

import { VOICE_CATEGORIES } from "@/features/voices/data/voice-categories";
import type { VoiceCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { uploadAudio } from "@/lib/r2";

const createVoiceSchema = z.object({
  name: z.string().min(1, "Voice name is required"),
  category: z.enum(VOICE_CATEGORIES as [VoiceCategory, ...VoiceCategory[]]),
  language: z.string().min(1, "Language is required"),
  description: z.string().nullish(),
});

const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;
const MIN_AUDIO_DURATION_SECONDS = 10;

export async function POST(req: Request) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);

  const validation = createVoiceSchema.safeParse({
    name: url.searchParams.get("name"),
    category: url.searchParams.get("category"),
    language: url.searchParams.get("language"),
    description: url.searchParams.get("description"),
  });

  if (!validation.success) {
    return Response.json(
      {
        error: "Invalid Input",
        issues: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const { name, category, language, description } = validation.data;

  const fileBuffer = await req.arrayBuffer();

  if (!fileBuffer.byteLength) {
    return Response.json(
      { error: "Please upload an audio file" },
      { status: 400 },
    );
  }

  if (fileBuffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
    return Response.json(
      { error: "Audio file is greater than the 20 MB size limit" },
      { status: 413 },
    );
  }

  const contentType = req.headers.get("content-type");

  if (!contentType) {
    return Response.json(
      { error: "Missing Content-Type Header" },
      { status: 400 },
    );
  }

  const normalizedContentType = contentType.split(";")[0].trim() || "audio/wav";

  //Validate audio format and duration
  let duration: number;

  try {
    const metadata = await parseBuffer(
      new Uint8Array(fileBuffer),
      { mimeType: normalizedContentType },
      { duration: true },
    );

    duration = metadata.format.duration ?? 0;
  } catch (error) {
    return Response.json(
      { error: "File is not a valid audio file" },
      { status: 422 },
    );
  }

  if (duration < MIN_AUDIO_DURATION_SECONDS) {
    return Response.json(
      {
        error: `Your audio is ${duration.toFixed(1)} seconds. The minimum duration must be ${MIN_AUDIO_DURATION_SECONDS} seconds`,
      },
      { status: 422 },
    );
  }

  let createdVoiceId: string | null = null;

  try {
    const voice = await prisma.voice.create({
      data: {
        name: name,
        variant: "CUSTOM",
        organizationId: orgId,
        description: description,
        category: category,
        language: language,
      },
      select: {
        id: true,
      },
    });

    createdVoiceId = voice.id;

    const r2ObjectKey = `voices/orgs/${orgId}/${voice.id}.wav`;

    await uploadAudio({
      buffer: Buffer.from(fileBuffer),
      key: r2ObjectKey,
      contentType: normalizedContentType,
    });

    await prisma.voice.update({
      where: {
        id: voice.id,
      },
      data: {
        r2ObjectKey: r2ObjectKey,
      },
    });
  } catch (error) {
    if (createdVoiceId) {
      await prisma.voice
        .delete({
          where: { id: createdVoiceId },
        })
        .catch(() => {});
    }

    return Response.json(
      { error: "Failed to create voice. Please retry" },
      { status: 500 },
    );
  }

  return Response.json(
    { name: name, message: "Voice created successfully" },
    { status: 201 },
  );
}
