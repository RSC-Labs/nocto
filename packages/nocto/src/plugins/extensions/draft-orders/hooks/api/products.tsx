import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"

export const useProducts = (query: Record<string, any>) => {
  const { data, ...rest } = useQuery({
    queryKey: ["products", query],
    queryFn: () => {
      return sdk.admin.product.list(query)
    },
  })

  return {
    ...data,
    ...rest,
  }
}
