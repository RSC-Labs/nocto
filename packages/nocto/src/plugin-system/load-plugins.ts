/// <reference types="vite/client" />

import { SidebarRegistry, NoctoConfig, PluginConfigRegistry, RouteRegistry, SlotRegistry } from "@rsc-labs/nocto-plugin-system"
import { defaultPlugins } from "../plugins/plugins"

/// <reference types="vite/client" />

export interface MedusaPlugin {
  widgetModule: {
    widgets: any[];
  };
  routeModule: {
    routes: {
      path: string;
      Component: any
    }[];
  };
  menuItemModule: {
    menuItems: {
      label: string;
      icon: Record<string, any>;
      path: string;
    }[];
  };
  formModule: {
    customFields: Record<string, any>;
  };
  displayModule: {
    displays: Record<string, any>;
  };
  i18nModule: {
    resources: Record<string, any>;
  };
}


async function loadNpmPlugins(noctoConfig: NoctoConfig) {
  const allNpmMedusaPlugins = {
    ...import.meta.glob(
      '/node_modules/@*/*/.medusa/server/src/admin/index.{js,mjs,ts,tsx}',
      { eager: false }
    ),
    ...import.meta.glob(
      '/node_modules/*/.medusa/server/src/admin/index.{js,mjs,ts,tsx}',
      { eager: false }
    ),
  };

  // Collect npm plugin IDs from config
  const npmPluginsIds: string[] = [];

  for (const pluginId in noctoConfig.plugins) {
    if (!pluginId) continue;
    const isNpmPlugin = pluginId.startsWith('@') && pluginId.includes('/');
    if (isNpmPlugin) npmPluginsIds.push(pluginId);
  }

  for (const pluginId in noctoConfig.sidebar) {
    if (!pluginId) continue;
    const isNpmPlugin = pluginId.startsWith('@') && pluginId.includes('/');
    if (isNpmPlugin && !npmPluginsIds.includes(pluginId)) {
      npmPluginsIds.push(pluginId);
    }
  }

  for (const pluginId of npmPluginsIds) {
    const pluginPath = `/node_modules/${pluginId}/.medusa/server/src/admin/index.mjs`
    if (allNpmMedusaPlugins[pluginPath]) {
      const mod = await allNpmMedusaPlugins[pluginPath]() as unknown as any;

      const plugin: MedusaPlugin = mod.default || mod[pluginId] || Object.values(mod)[0];
      if (plugin) {
        registerMedusaPlugin(plugin, pluginId, noctoConfig);
      }
    }
  }
}

function registerMedusaPlugin(plugin: MedusaPlugin, pluginId: string, noctoConfig: NoctoConfig) {
  if (!noctoConfig.plugins[pluginId] && !noctoConfig.sidebar[pluginId]) {
    return
  }

  if (plugin.routeModule.routes.length > 0) {
    const normalizedRoutes = plugin.routeModule.routes.map(r => ({
      path: r.path,
      layout: "main",
      Component: r.Component,
    }));

    RouteRegistry.register(pluginId, {
      layout: "main",
      path: normalizedRoutes[0].path,   // parent path
      children: normalizedRoutes.map(r => ({
        path: r.path === normalizedRoutes[0].path ? "" : r.path.replace(/^\//, ""),
        layout: "main",
        Component: r.Component,
      })),
    });
  }

  if (plugin.menuItemModule.menuItems.length > 0) {
    SidebarRegistry.register({
      id: pluginId,
      sidebar: {
        path: plugin.menuItemModule.menuItems[0].path,
        label: plugin.menuItemModule.menuItems[0].label,
        icon: plugin.menuItemModule.menuItems[0].icon,
      }
    })
  }
}


export async function loadBuiltInPlugins(noctoConfig: NoctoConfig) {

  SidebarRegistry.setConfig(noctoConfig.sidebar)

  for (const plugin of defaultPlugins) {
    if (!plugin?.id) continue

    if (noctoConfig.plugins[plugin.id] || noctoConfig.sidebar[plugin.id]) {
      if (plugin.configSchema) {
        const userConfig = noctoConfig.plugins?.[plugin.id]?.config ?? {}
        PluginConfigRegistry.register(plugin.id, plugin.configSchema, userConfig)
      }

      if (typeof plugin.routes === "function") {
        const routes = plugin.routes()
        RouteRegistry.register(plugin.id, routes)
      }

      if (plugin.sidebar) {
        SidebarRegistry.register(plugin as unknown as any)
      }
      if (plugin.injections) {
        plugin.injections().forEach((c: any) => {
          if (SlotRegistry.get(c.pluginId, c.slot).length) {
            return;
          }
          SlotRegistry.register(
            {
              pluginId: c.pluginId,
              slot: c.slot,
              component: c.component,
              injectedPluginId: plugin.id,
            }
          )
        })
      }
    }
  }

  await loadNpmPlugins(noctoConfig)
}