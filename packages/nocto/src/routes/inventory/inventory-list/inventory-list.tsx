import { NoctoSlot } from "@rsc-labs/nocto-plugin-system"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { InventoryListTable } from "./components/inventory-list-table"

export const InventoryItemListTable = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("inventory_item.list.after"),
        before: getWidgets("inventory_item.list.before"),
      }}
    >
      <NoctoSlot pluginId="@inventory" name="main" fallback={<InventoryListTable />}/>
    </SingleColumnPage>
  )
}
