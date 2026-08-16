import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {
    return { status: "ok", code: 342 };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
