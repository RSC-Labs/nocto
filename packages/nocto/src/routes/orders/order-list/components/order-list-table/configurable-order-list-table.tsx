import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const ConfigurableOrderListTable = () => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("orders.domain")}</Heading>
      </div>
      <div className="px-6 py-4">
        <p className="text-ui-fg-muted">
          View configurations feature is enabled. Full implementation coming soon.
        </p>
      </div>
    </Container>
  )
}