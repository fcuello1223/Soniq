import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { deleteAudio } from "@/lib/r2";
import { createTRPCRouter, organizationProcedure } from "../init";

export const voicesRouter = createTRPCRouter({
  getAll: organizationProcedure
    .input(z.object({ query: z.string().trim().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const searchFilter = input?.query
        ? {
            OR: [
              {
                name: {
                  contains: input.query,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: input.query,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {};

      const [custom, system] = await Promise.all([
        prisma.voice.findMany({
          where: {
            variant: "CUSTOM",
            organizationId: ctx.orgId,
            ...searchFilter,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            language: true,
            variant: true,
          },
        }),
        prisma.voice.findMany({
          where: {
            variant: "SYSTEM",
            ...searchFilter,
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            language: true,
            variant: true,
          },
        }),
      ]);

      return { custom: custom, system: system };
    }),

  delete: organizationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const voice = await prisma.voice.findUnique({
        where: {
          id: input.id,
          variant: "CUSTOM",
          organizationId: ctx.orgId,
        },
        select: { id: true, r2ObjectKey: true },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      await prisma.voice.delete({ where: { id: voice.id } });

      if (voice.r2ObjectKey) {
        await deleteAudio(voice.r2ObjectKey).catch(() => {});
      }

      return { success: true };
    }),
});
