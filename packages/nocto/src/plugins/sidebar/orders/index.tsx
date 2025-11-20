import { HttpTypes } from "@medusajs/types"
import { ShoppingCart } from "@medusajs/icons"
import { RouteEntry } from "@rsc-labs/nocto-plugin-system"
import { t } from "i18next"
import { UIMatch } from "react-router-dom"
import { z } from "zod"

import { ErrorBoundary } from "../../../components/utilities/error-boundary"

export const sidebarOrders = {
  id: "@orders",
  configSchema: z.object({
    excludeColumns: z.array(z.string()).optional(),
  }),
  sidebar: {
    path: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    items: [
      {
        path: "/draft-orders",
        label: "Drafts",
      },
    ],
  },
  routes: (): RouteEntry[] => [
    {
      path: "/orders",
      layout: "main",
      errorElement: <ErrorBoundary />,
      handle: {
        breadcrumb: () => t("orders.domain"),
      },
      children: [
        {
          path: "",
          lazy: () =>
            import("../../../routes/orders/order-list").then((mod) => ({
              Component: () => <mod.Component />,
            })),
          layout: "main",
        },
        {
          path: ":id",
          layout: "main",
          lazy: async () => {
            const { Component, Breadcrumb, loader } = await import(
              "../../../routes/orders/order-detail"
            )

            return {
              Component,
              loader,
              handle: {
                breadcrumb: (match: UIMatch<HttpTypes.AdminOrderResponse>) => (
                  <Breadcrumb {...match} />
                ),
              },
            }
          },
          children: [
            {
              path: "fulfillment",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-create-fulfillment"),
            },
            {
              path: "returns/:return_id/receive",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-receive-return"),
            },
            {
              path: "allocate-items",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-allocate-items"),
            },
            {
              path: ":f_id/create-shipment",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-create-shipment"),
            },
            {
              path: "returns",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-create-return"),
            },
            {
              path: "claims",
              layout: "main",
              lazy: () => import("../../../routes/orders/order-create-claim"),
            },
            {
              path: "exchanges",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-create-exchange"),
            },
            {
              path: "edits",
              layout: "main",
              lazy: () => import("../../../routes/orders/order-create-edit"),
            },
            {
              path: "refund",
              layout: "main",
              lazy: () => import("../../../routes/orders/order-create-refund"),
            },
            {
              path: "transfer",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-request-transfer"),
            },
            {
              path: "email",
              layout: "main",
              lazy: () => import("../../../routes/orders/order-edit-email"),
            },
            {
              path: "shipping-address",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-edit-shipping-address"),
            },
            {
              path: "billing-address",
              layout: "main",
              lazy: () =>
                import("../../../routes/orders/order-edit-billing-address"),
            },
            {
              path: "metadata/edit",
              layout: "main",
              lazy: () => import("../../../routes/orders/order-metadata"),
            },
          ],
        },
      ],
    },
  ],
}