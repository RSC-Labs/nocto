import { NoctoPluginDefinition } from "@rsc-labs/nocto-plugin-system"
import { campaignsRoutes } from "./routes/campaigns"
import { categoriesRoutes } from "./routes/categories"
import { collectionsRoutes } from "./routes/collections"
import { customerGroupsRoutes } from "./routes/customer-groups"
import { loginPlugin } from "./routes/login"
import { reservationRoutes } from "./routes/reservations"
import { settingsRoutes } from "./routes/settings"
import { publicRoutes } from "./routes/public"
import { coreRoutes } from "./routes/core"

import { sidebarCustomers } from "./sidebar/customers"
import { sidebarInventory } from "./sidebar/inventory"
import { sidebarOrders } from "./sidebar/orders"
import { sidebarPriceLists } from "./sidebar/pricelists"
import { sidebarProducts } from "./sidebar/products"
import { sidebarPromotions } from "./sidebar/promotions"

import { orderDetail } from "./default/order-detail"
import { draftOrdersRoutes } from "./default/draft-orders"
import { myPlugin } from "./custom/order-detail-slot-1"
import { customInjection } from "./rbac-test/product-main-slot"

export const defaultPlugins: NoctoPluginDefinition[] = [
  {
    ...myPlugin
  },
  {
    ...campaignsRoutes
  },
  {
    ...categoriesRoutes
  },
  {
    ...collectionsRoutes
  },
  {
    ...customerGroupsRoutes
  },
  {
    ...settingsRoutes
  },
  {
    ...publicRoutes
  },
  {
    ...coreRoutes
  },
  {
    ...loginPlugin
  },
  {
    ...reservationRoutes
  },
  {
    ...sidebarCustomers
  },
  {
    ...sidebarInventory
  },
  {
    ...sidebarOrders
  },
  {
    ...sidebarPriceLists
  },
  {
    ...sidebarProducts
  },
  {
    ...sidebarPromotions
  },
  {
    ...orderDetail
  },
  {
    ...draftOrdersRoutes
  },
  {
    ...customInjection
  }
]