import { NoctoConfig } from "@rsc-labs/nocto-plugin-system"
import {
  Sparkles,
} from "@medusajs/icons"

export const noctoConfig: NoctoConfig = {
  plugins: {
    "@login": {
      config: {
        title: "Welcome to Nocto",
        hint: "Sign in to access",
        mainIcon: Sparkles
      }
    },
    "@order-detail": {},
    "@campaigns": {},
    "@categories": {},
    "@collections": {},
    "@core-routes": {},
    "@customer-groups": {},
    "@draft-orders": {},
    "@public-routes": {},
    "@reservations": {},
    "@settings": {},
  },
  sidebar: {
    "@orders": { order: 1 },
    "@products": { order: 2 },
    "@inventory": { order: 3 },
    "@customers": { order: 4 },
    "@promotions": { order: 5 },
    "@price-lists": { order: 6 }
  }
}
