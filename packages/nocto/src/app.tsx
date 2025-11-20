import { DashboardApp } from "./dashboard-app"
import { DashboardPlugin } from "./dashboard-app/types"
import { loadBuiltInPlugins } from "./plugin-system/load-plugins"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/query-client"
import { useMe } from "./hooks/api"
import { NoctoPluginProvider, NoctoRbacProvider, NoctoConfig } from "@rsc-labs/nocto-plugin-system"
import { useEffect, useState } from "react"
import { Spinner } from "@medusajs/icons"

interface AppProps {
  plugins?: DashboardPlugin[]
  noctoConfig?: NoctoConfig,
  rbac?: {
    fetchPermissions: any,
    evaluateAccess: any
  }
}

function Dashboard({ plugins = []}: AppProps) {

  const app = new DashboardApp({
    plugins: [...plugins],
  })

  return (<div>{app.render()}</div>
  )
}

function AppUser({ plugins = [], rbac}: AppProps) {
  const { user, isLoading } = useMe();

  return (
    <NoctoRbacProvider user={user} isLoading={isLoading} rbac={rbac}>
      <NoctoPluginProvider>
        <Dashboard plugins={plugins} />
      </NoctoPluginProvider>
    </NoctoRbacProvider>
  );
}


function App({ plugins = [], noctoConfig, rbac }: AppProps) {

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializePlugins = async () => {
      if (noctoConfig) {
        await loadBuiltInPlugins(noctoConfig);
      }
      setIsInitialized(true);
    };

    initializePlugins();
  }, [noctoConfig]);

  if (!isInitialized) {
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="text-ui-fg-interactive animate-spin" />
    </div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppUser plugins={plugins} rbac={rbac}/>
    </QueryClientProvider>
  )
}

export default App
