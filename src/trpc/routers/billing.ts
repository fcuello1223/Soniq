import { TRPCError } from "@trpc/server";

import { env } from "@/lib/env";
import { polar } from "@/lib/polar";

import { createTRPCRouter, organizationProcedure } from "../init";

export const billingRouter = createTRPCRouter({
  createCheckout: organizationProcedure.mutation(async ({ ctx }) => {
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      externalCustomerId: ctx.orgId,
      successUrl: process.env.APP_URL,
    });

    if (!result.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { checkoutUrl: result.url };
  }),

  createPortalSession: organizationProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer service portal",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),

  getStatus: organizationProcedure.query(async ({ ctx }) => {
    try {
      const customerState = await polar.customers.getStateExternal({
        externalId: ctx.orgId,
      });

      const hasActiveSubscription =
        (customerState.activeSubscriptions ?? []).length > 0;

      //Sum up estimated costs from all meters across active organizations
      let estimatedCostCents = 0;

      for (const subscription of customerState.activeSubscriptions ?? []) {
        for (const meter of subscription.meters ?? []) {
          estimatedCostCents += meter.amount ?? 0;
        }
      }

      return {
        hasActiveSubscription: hasActiveSubscription,
        customerId: customerState.id,
        estimatedCostCents: estimatedCostCents,
      };
    } catch {
      //Customer doesn't exist in Polar
      return {
        hasActiveSubscription: false,
        customerId: null,
        estimatedCostCents: 0
      }
    }
  }),
});
