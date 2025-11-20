
import { Tag } from "@medusajs/icons"
import { RouteEntry } from "@rsc-labs/nocto-plugin-system"
import { ErrorBoundary } from "../../../components/utilities/error-boundary"
import { t } from "i18next"
import { Outlet, UIMatch } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"

export const sidebarProducts = {
  id: "@products",
  sidebar: {
    path: "/products",
    label: "Products",
    icon: Tag,
    items: [
      {
        path: "/collections",
        label: "Collections",
      },
      {
        path: "/categories",
        label: "Categories",
      },
    ],
  },
  routes: (): RouteEntry[] => [
    {
      path: "/products",
      layout: "main",
      errorElement: <ErrorBoundary />,
      handle: {
        breadcrumb: () => t("products.domain"),
      },
      children: [
        {
          path: "",
          layout: "main",
          lazy: () => import("../../../routes/products/product-list"),
          children: [
            {
              path: "create",
              layout: "main",
              lazy: () =>
                import("../../../routes/products/product-create"),
            },
            {
              path: "import",
              layout: "main",
              lazy: () =>
                import("../../../routes/products/product-import"),
            },
            {
              path: "export",
              layout: "main",
              lazy: () =>
                import("../../../routes/products/product-export"),
            },
          ],
        },
        {
          path: ":id",
          layout: "main",
          errorElement: <ErrorBoundary />,
          lazy: async () => {
            const { Breadcrumb, loader } = await import(
              "../../../routes/products/product-detail"
            )

            return {
              Component: Outlet,
              loader,
              handle: {
                breadcrumb: (
                  match: UIMatch<HttpTypes.AdminProductResponse>
                ) => <Breadcrumb {...match} />,
              },
            }
          },
          children: [
            {
              path: "",
              layout: "main",
              lazy: () =>
                import("../../../routes/products/product-detail"),
              children: [
                {
                  path: "edit",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-edit"),
                },
                {
                  path: "edit-variant",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/product-variants/product-variant-edit"
                    ),
                },
                {
                  path: "sales-channels",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-sales-channels"
                    ),
                },
                {
                  path: "attributes",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-attributes"),
                },
                {
                  path: "organization",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-organization"
                    ),
                },
                {
                  path: "shipping-profile",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-shipping-profile"
                    ),
                },
                {
                  path: "media",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-media"),
                },
                {
                  path: "images/:image_id/variants",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-image-variants-edit"
                    ),
                },
                {
                  path: "prices",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-prices"),
                },
                {
                  path: "options/create",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-create-option"
                    ),
                },
                {
                  path: "options/:option_id/edit",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-edit-option"),
                },
                {
                  path: "variants/create",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/products/product-create-variant"
                    ),
                },
                {
                  path: "stock",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-stock"),
                },
                {
                  path: "metadata/edit",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-metadata"),
                },
              ],
            },
            {
              path: "variants/:variant_id",
              layout: "main",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../../routes/product-variants/product-variant-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      // eslint-disable-next-line max-len
                      match: UIMatch<HttpTypes.AdminProductVariantResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/product-variants/product-variant-edit"
                    ),
                },
                {
                  path: "prices",
                  layout: "main",
                  lazy: () =>
                    import("../../../routes/products/product-prices"),
                },
                {
                  path: "manage-items",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/product-variants/product-variant-manage-inventory-items"
                    ),
                },
                {
                  path: "media",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/product-variants/product-variant-media"
                    ),
                },
                {
                  path: "metadata/edit",
                  layout: "main",
                  lazy: () =>
                    import(
                      "../../../routes/product-variants/product-variant-metadata"
                    ),
                },
              ],
            },
          ],
        },
      ],
    }
  ]
}