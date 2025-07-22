import { Toaster, TooltipProvider } from "@medusajs/ui"
import type { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { I18n } from "../components/utilities/i18n"
import { DashboardApp } from "../dashboard-app"
import { ExtensionProvider } from "./extension-provider"
import { I18nProvider } from "./i18n-provider"
import { ThemeProvider } from "./theme-provider"

type ProvidersProps = PropsWithChildren<{
  api: DashboardApp["api"]
}>

export const Providers = ({ api, children }: ProvidersProps) => {
  return (
    <TooltipProvider>
      <ExtensionProvider api={api}>
        <HelmetProvider>
          <ThemeProvider>
            <I18n />
            <I18nProvider>{children}</I18nProvider>
            <Toaster />
          </ThemeProvider>
        </HelmetProvider>
      </ExtensionProvider>
    </TooltipProvider>
  )
}
