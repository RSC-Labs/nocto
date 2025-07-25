import { NoctoSlot } from "@rsc-labs/nocto-plugin-system"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { CampaignListTable } from "./components/campaign-list-table"

export const CampaignList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("campaign.list.after"),
        before: getWidgets("campaign.list.before"),
      }}
      hasOutlet
    >
      <NoctoSlot pluginId="@campaigns" name="main" fallback={<CampaignListTable />}/>
    </SingleColumnPage>
  )
}
