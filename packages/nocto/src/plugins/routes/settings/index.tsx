import { HttpTypes } from "@medusajs/types"
import { t } from "i18next"
import { Outlet, UIMatch } from "react-router-dom"
import { RouteEntry } from "@rsc-labs/nocto-plugin-system"

import { ErrorBoundary } from "../../../components/utilities/error-boundary"
import { TaxRegionDetailBreadcrumb } from "../../../routes/tax-regions/tax-region-detail/breadcrumb"
import { taxRegionLoader } from "../../../routes/tax-regions/tax-region-detail/loader"

export const settingsRoutes = {
  id: "@settings",
  routes: (): RouteEntry[] => [
    {
      path: "/settings",
      layout: "settings",
      errorElement: <ErrorBoundary />,
      handle: {
        breadcrumb: () => t("app.nav.settings.header"),
      },
      children: [
        {
          index: true,
          path: "",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          lazy: () => import("../../../routes/settings"),
        },
        {
          path: "profile",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          lazy: () => import("../../../routes/profile/profile-detail"),
          handle: {
            breadcrumb: () => t("profile.domain"),
          },
          children: [
            {
              path: "edit",
              layout: "settings",
              lazy: () => import("../../../routes/profile/profile-edit"),
            },
          ],
        },
        {
          path: "regions",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("regions.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () => import("../../../routes/regions/region-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () => import("../../../routes/regions/region-create"),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/regions/region-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminRegionResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () => import("../../../routes/regions/region-edit"),
                },
                {
                  path: "countries/add",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/regions/region-add-countries"),
                },
                {
                  path: "metadata/edit",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/regions/region-metadata"),
                },
              ],
            },
          ],
        },
        {
          path: "store",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          lazy: () => import("../../../routes/store/store-detail"),
          handle: {
            breadcrumb: () => t("store.domain"),
          },
          children: [
            {
              path: "edit",
              layout: "settings",
              lazy: () => import("../../../routes/store/store-edit"),
            },
            {
              path: "currencies",
              layout: "settings",
              lazy: () => import("../../../routes/store/store-add-currencies"),
            },
            {
              path: "metadata/edit",
              layout: "settings",
              lazy: () => import("../../../routes/store/store-metadata"),
            },
          ],
        },
        {
          path: "users",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("users.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () => import("../../../routes/users/user-list"),
              children: [
                {
                  path: "invite",
                  layout: "settings",
                  lazy: () => import("../../../routes/users/user-invite"),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/users/user-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminUserResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () => import("../../../routes/users/user-edit"),
                },
                {
                  path: "metadata/edit",
                  layout: "settings",
                  lazy: () => import("../../../routes/users/user-metadata"),
                },
              ],
            },
          ],
        },
        {
          path: "sales-channels",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("salesChannels.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import("../../../routes/sales-channels/sales-channel-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/sales-channels/sales-channel-create"
                    ),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/sales-channels/sales-channel-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminSalesChannelResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/sales-channels/sales-channel-edit"
                    ),
                },
                {
                  path: "add-products",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/sales-channels/sales-channel-add-products"
                    ),
                },
                {
                  path: "metadata/edit",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/sales-channels/sales-channel-metadata"
                    ),
                },
              ],
            },
          ],
        },
        {
          path: "locations",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("locations.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () => import("../../../routes/locations/location-list"),
            },
            {
              path: "create",
              layout: "settings",
              lazy: () => import("../../../routes/locations/location-create"),
            },
            {
              path: "shipping-profiles",
              layout: "settings",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("shippingProfile.domain"),
              },
              children: [
                {
                  path: "",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/shipping-profiles/shipping-profiles-list"
                    ),
                  children: [
                    {
                      path: "create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/shipping-profiles/shipping-profile-create"
                        ),
                    },
                  ],
                },
                {
                  path: ":shipping_profile_id",
                  layout: "settings",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../../routes/shipping-profiles/shipping-profile-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          // eslint-disable-next-line max-len
                          match: UIMatch<HttpTypes.AdminShippingProfileResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "metadata/edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/shipping-profiles/shipping-profile-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "shipping-option-types",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("shippingOptionTypes.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import(
                      "../../../routes/shipping-option-types/shipping-option-type-list"
                    ),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../../../routes/shipping-option-types/shipping-option-type-create"
                        ),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../../routes/shipping-option-types/shipping-option-type-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          // eslint-disable-next-line max-len
                          match: UIMatch<HttpTypes.AdminShippingOptionTypeResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../../routes/shipping-option-types/shipping-option-type-edit"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: ":location_id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/locations/location-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminStockLocationResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/locations/location-edit"),
                },
                {
                  path: "sales-channels",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/locations/location-sales-channels"
                    ),
                },
                {
                  path: "fulfillment-providers",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/locations/location-fulfillment-providers"
                    ),
                },
                {
                  path: "fulfillment-set/:fset_id",
                  layout: "settings",
                  children: [
                    {
                      path: "service-zones/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/locations/location-service-zone-create"
                        ),
                    },
                    {
                      path: "service-zone/:zone_id",
                      layout: "settings",
                      children: [
                        {
                          path: "edit",
                          layout: "settings",
                          lazy: () =>
                            import(
                              "../../../routes/locations/location-service-zone-edit"
                            ),
                        },
                        {
                          path: "areas",
                          layout: "settings",
                          lazy: () =>
                            import(
                              "../../../routes/locations/location-service-zone-manage-areas"
                            ),
                        },
                        {
                          path: "shipping-option",
                          layout: "settings",
                          children: [
                            {
                              path: "create",
                              layout: "settings",
                              lazy: () =>
                                import(
                                  "../../../routes/locations/location-service-zone-shipping-option-create"
                                ),
                            },
                            {
                              path: ":so_id",
                              layout: "settings",
                              children: [
                                {
                                  path: "edit",
                                  layout: "settings",
                                  lazy: () =>
                                    import(
                                      "../../../routes/locations/location-service-zone-shipping-option-edit"
                                    ),
                                },
                                {
                                  path: "pricing",
                                  layout: "settings",
                                  lazy: () =>
                                    import(
                                      "../../../routes/locations/location-service-zone-shipping-option-pricing"
                                    ),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "product-tags",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("productTags.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import("../../../routes/product-tags/product-tag-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/product-tags/product-tag-create"),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/product-tags/product-tag-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminProductTagResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/product-tags/product-tag-edit"),
                },
              ],
            },
          ],
        },
        {
          path: "workflows",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("workflowExecutions.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import(
                  "../../../routes/workflow-executions/workflow-execution-list"
                ),
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/workflow-executions/workflow-execution-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      // eslint-disable-next-line max-len
                      match: UIMatch<HttpTypes.AdminWorkflowExecutionResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
            },
          ],
        },
        {
          path: "product-types",
          layout: "settings",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("productTypes.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import("../../../routes/product-types/product-type-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/product-types/product-type-create"
                    ),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/product-types/product-type-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminProductTypeResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/product-types/product-type-edit"),
                },
                {
                  path: "metadata/edit",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/product-types/product-type-metadata"
                    ),
                },
              ],
            },
          ],
        },
        {
          path: "publishable-api-keys",
          layout: "settings",
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("apiKeyManagement.domain.publishable"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              element: <Outlet />,
              children: [
                {
                  path: "",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/api-key-management/api-key-management-list"
                    ),
                  children: [
                    {
                      path: "create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/api-key-management/api-key-management-create"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/api-key-management/api-key-management-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminApiKeyResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/api-key-management/api-key-management-edit"
                    ),
                },
                {
                  path: "sales-channels",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/api-key-management/api-key-management-sales-channels"
                    ),
                },
              ],
            },
          ],
        },
        {
          path: "secret-api-keys",
          layout: "settings",
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("apiKeyManagement.domain.secret"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              element: <Outlet />,
              children: [
                {
                  path: "",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/api-key-management/api-key-management-list"
                    ),
                  children: [
                    {
                      path: "create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/api-key-management/api-key-management-create"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/api-key-management/api-key-management-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminApiKeyResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/api-key-management/api-key-management-edit"
                    ),
                },
              ],
            },
          ],
        },
        {
          path: "tax-regions",
          layout: "settings",
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("taxRegions.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import("../../../routes/tax-regions/tax-region-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () =>
                    import("../../../routes/tax-regions/tax-region-create"),
                },
              ],
            },
            {
              path: ":id",
              layout: "settings",
              Component: Outlet,
              element: <Outlet />,
              loader: taxRegionLoader,
              handle: {
                breadcrumb: (
                  match: UIMatch<HttpTypes.AdminTaxRegionResponse>
                ) => <TaxRegionDetailBreadcrumb {...match} />,
              },
              children: [
                {
                  path: "",
                  layout: "settings",
                  lazy: async () => {
                    const { Component } = await import(
                      "../../../routes/tax-regions/tax-region-detail"
                    )

                    return {
                      Component,
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      layout: "settings",
                      lazy: () =>
                        import("../../../routes/tax-regions/tax-region-edit"),
                    },
                    {
                      path: "provinces/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-province-create"
                        ),
                    },
                    {
                      path: "overrides/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-override-create"
                        ),
                    },
                    {
                      path: "overrides/:tax_rate_id/edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-override-edit"
                        ),
                    },
                    {
                      path: "tax-rates/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-rate-create"
                        ),
                    },
                    {
                      path: "tax-rates/:tax_rate_id/edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-rate-edit"
                        ),
                    },
                  ],
                },
                {
                  path: "provinces/:province_id",
                  layout: "settings",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../../routes/tax-regions/tax-region-province-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminTaxRegionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "tax-rates/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-rate-create"
                        ),
                    },
                    {
                      path: "tax-rates/:tax_rate_id/edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-rate-edit"
                        ),
                    },
                    {
                      path: "overrides/create",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-override-create"
                        ),
                    },
                    {
                      path: "overrides/:tax_rate_id/edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/tax-regions/tax-region-tax-override-edit"
                        ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "return-reasons",
          layout: "settings",
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("returnReasons.domain"),
          },
          children: [
            {
              path: "",
              layout: "settings",
              lazy: () =>
                import("../../../routes/return-reasons/return-reason-list"),
              children: [
                {
                  path: "create",
                  layout: "settings",
                  lazy: () =>
                    import(
                      "../../../routes/return-reasons/return-reason-create"
                    ),
                },

                {
                  path: ":id",
                  layout: "settings",
                  children: [
                    {
                      path: "edit",
                      layout: "settings",
                      lazy: () =>
                        import(
                          "../../../routes/return-reasons/return-reason-edit"
                        ),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "refund-reasons",
          element: <Outlet />,
          handle: {
            breadcrumb: () => t("refundReasons.domain"),
          },
          children: [
            {
              path: "",
              lazy: () =>
                import("../../../routes/refund-reasons/refund-reason-list"),
              children: [
                {
                  path: "create",
                  lazy: () =>
                    import(
                      "../../../routes/refund-reasons/refund-reason-create"
                    ),
                },

                {
                  path: ":id",
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../../routes/refund-reasons/refund-reason-edit"
                        ),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}