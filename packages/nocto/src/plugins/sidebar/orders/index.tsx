import { ErrorBoundary } from "../../../components/utilities/error-boundary"
import { t } from "i18next"
import { RouteEntry } from "@rsc-labs/nocto-plugin-system"
import { ShoppingCart } from "@medusajs/icons"
import { z } from "zod"

export const sidebarOrders = {
  id: "@orders",
  configSchema: z.object({
    excludeColumns: z.array(z.string()).optional()
  }),
  sidebar: {
    path: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    items: [
      {
        path: "/draft-orders",
        label: "Drafts",
      }
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
              Component: () => <mod.Component/>,
            })),
          layout: "main"
        },
        
      ],
    }
  ]
}