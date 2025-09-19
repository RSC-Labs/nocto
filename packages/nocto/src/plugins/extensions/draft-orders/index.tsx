import { RouteEntry } from "@rsc-labs/nocto-plugin-system"
import { ErrorBoundary } from "../../../components/utilities/error-boundary"
import { t } from "i18next"
import { UIMatch } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"

export const draftOrdersRoutes = {
  id: "@draft-orders",
  routes: (): RouteEntry[] => [
    {
    path: "/draft-orders",
    layout: "main",
    errorElement: <ErrorBoundary />,
    handle: {
      breadcrumb: () => t("draftOrders.domain"),
    },
    children: [
      {
        path: "",
        layout: "main",
        lazy: () =>
          import("./plugin"),
        children: [
          {
            path: "create",
            layout: "main",
            lazy: async () => {
              const { CreateComponent } = await import("./plugin")
              return { Component: CreateComponent }
            },
          },
        ],
      },
      {
        path: ":id",
        layout: "main",
        lazy: async () => {
          const { DetailComponent } = await import("./plugin")
          
          return {
            Component: DetailComponent,
            handle: {
              breadcrumb: (
                match: UIMatch<HttpTypes.AdminDraftOrderResponse>
              ) => `Draft Order ${match.params.id}`,
            },
          }
        },
        children: [
          {
            path: "billing-address",
            layout: "main",
            lazy: async () => {
              const { BillingAddressComponent } = await import("./plugin")
              return { Component: BillingAddressComponent }
            },
          },
          {
            path: "custom-items",
            layout: "main",
            lazy: async () => {
              const { CustomItemsComponent } = await import("./plugin")
              return { Component: CustomItemsComponent }
            },
          },
          {
            path: "email",
            layout: "main",
            lazy: async () => {
              const { EmailComponent } = await import("./plugin")
              return { Component: EmailComponent }
            },
          },
          {
            path: "items",
            layout: "main",
            lazy: async () => {
              const { ItemsComponent } = await import("./plugin")
              return { Component: ItemsComponent }
            },
          },
          {
            path: "metadata",
            layout: "main",
            lazy: async () => {
              const { MetadataComponent } = await import("./plugin")
              return { Component: MetadataComponent }
            },
          },
          {
            path: "promotions",
            layout: "main",
            lazy: async () => {
              const { PromotionsComponent } = await import("./plugin")
              return { Component: PromotionsComponent }
            },
          },
          {
            path: "sales-channel",
            layout: "main",
            lazy: async () => {
              const { SalesChannelComponent } = await import("./plugin")
              return { Component: SalesChannelComponent }
            },
          },
          {
            path: "shipping",
            layout: "main",
            lazy: async () => {
              const { ShippingComponent } = await import("./plugin")
              return { Component: ShippingComponent }
            },
          },
          {
            path: "shipping-address",
            layout: "main",
            lazy: async () => {
              const { ShippingAddressComponent } = await import("./plugin")
              return { Component: ShippingAddressComponent }
            },
          },
          {
            path: "transfer-ownership",
            layout: "main",
            lazy: async () => {
              const { TransferOwnershipComponent } = await import("./plugin")
              return { Component: TransferOwnershipComponent }
            },
          },
        ],
      },
    ],
  }
]
}