// Main Draft Orders Routes
export { default as Component } from "./routes/draft-orders/page"

// Create Draft Order Route
export { default as CreateComponent } from "./routes/draft-orders/@create/page"

// Draft Order Detail Routes
export { default as DetailComponent } from "./routes/draft-orders/[id]/page"

// Draft Order Sub-Routes
export { default as BillingAddressComponent } from "./routes/draft-orders/[id]/@billing-address/page"
export { default as CustomItemsComponent } from "./routes/draft-orders/[id]/@custom-items/page"
export { default as EmailComponent } from "./routes/draft-orders/[id]/@email/page"
export { default as ItemsComponent } from "./routes/draft-orders/[id]/@items/page"
export { default as MetadataComponent } from "./routes/draft-orders/[id]/@metadata/page"
export { default as PromotionsComponent } from "./routes/draft-orders/[id]/@promotions/page"
export { default as SalesChannelComponent } from "./routes/draft-orders/[id]/@sales-channel/page"
export { default as ShippingComponent } from "./routes/draft-orders/[id]/@shipping/page"
export { default as ShippingAddressComponent } from "./routes/draft-orders/[id]/@shipping-address/page"
export { default as TransferOwnershipComponent } from "./routes/draft-orders/[id]/@transfer-ownership/page"
