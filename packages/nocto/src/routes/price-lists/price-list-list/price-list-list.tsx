import { NoctoSlot } from "@rsc-labs/nocto-plugin-system"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { PriceListListTable } from "./components/price-list-list-table"

export const PriceListList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("price_list.list.after"),
        before: getWidgets("price_list.list.before"),
      }}
    >
      <NoctoSlot pluginId="@price-lists" name="main" fallback={<PriceListListTable />}/>
    </SingleColumnPage>
  )
}
