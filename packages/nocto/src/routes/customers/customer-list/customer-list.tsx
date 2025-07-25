import { NoctoSlot } from "@rsc-labs/nocto-plugin-system"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { CustomerListTable } from "./components/customer-list-table"

export const CustomersList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("customer.list.after"),
        before: getWidgets("customer.list.before"),
      }}
    >
      <NoctoSlot pluginId="@customers" name="main" fallback={<CustomerListTable />}/>
    </SingleColumnPage>
  )
}
