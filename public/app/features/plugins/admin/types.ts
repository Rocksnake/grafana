import { EntityState } from '@reduxjs/toolkit';
import { PluginType, PluginSignatureStatus, PluginSignatureType, PluginDependencies } from '@grafana/data';
import { StoreState, PluginsState } from 'app/types';

export type PluginTypeCode = 'app' | 'panel' | 'datasource';

export enum PluginAdminRoutes {
  Home = 'plugins-home',
  Browse = 'plugins-browse',
  Details = 'plugins-details',
  HomeAdmin = 'plugins-home-admin',
  BrowseAdmin = 'plugins-browse-admin',
  DetailsAdmin = 'plugins-details-admin',
}

export enum IconName {
  app = 'apps',
  datasource = 'database',
  panel = 'credit-card',
  renderer = 'pen',
}

export interface CatalogPlugin {
  description: string;
  downloads: number;
  hasUpdate: boolean;
  id: string;
  info: CatalogPluginInfo;
  isDev: boolean;
  isCore: boolean;
  isEnterprise: boolean;
  isInstalled: boolean;
  name: string;
  orgName: string;
  signature: PluginSignatureStatus;
  signatureType?: PluginSignatureType;
  signatureOrg?: string;
  popularity: number;
  publishedAt: string;
  type?: PluginType;
  updatedAt: string;
  version: string;
  details?: CatalogPluginDetails;
}

export interface CatalogPluginDetails {
  readme?: string;
  versions?: Version[];
  links: Array<{
    name: string;
    url: string;
  }>;
  grafanaDependency?: string;
  pluginDependencies?: PluginDependencies['plugins'];
}

export interface CatalogPluginInfo {
  logos: {
    large: string;
    small: string;
  };
}

export type RemotePlugin = {
  createdAt: string;
  description: string;
  downloads: number;
  downloadSlug: string;
  featured: number;
  id: number;
  internal: boolean;
  json?: {
    dependencies: PluginDependencies;
    info: {
      links: Array<{
        name: string;
        url: string;
      }>;
    };
  };
  links: Array<{ rel: string; href: string }>;
  name: string;
  orgId: number;
  orgName: string;
  orgSlug: string;
  orgUrl: string;
  packages: {
    [arch: string]: {
      packageName: string;
      downloadUrl: string;
    };
  };
  popularity: number;
  readme?: string;
  signatureType: PluginSignatureType | '';
  slug: string;
  status: string;
  typeCode: PluginType;
  typeId: number;
  typeName: string;
  updatedAt: string;
  url: string;
  userId: number;
  verified: boolean;
  version: string;
  versionSignatureType: PluginSignatureType | '';
  versionSignedByOrg: string;
  versionSignedByOrgName: string;
  versionStatus: string;
};

export type LocalPlugin = {
  category: string;
  defaultNavUrl: string;
  dev?: boolean;
  enabled: boolean;
  hasUpdate: boolean;
  id: string;
  info: {
    author: Rel;
    description: string;
    links?: Rel[];
    logos: {
      small: string;
      large: string;
    };
    build: Build;
    screenshots?: Array<{
      path: string;
      name: string;
    }> | null;
    version: string;
    updated: string;
  };
  latestVersion: string;
  name: string;
  pinned: boolean;
  signature: PluginSignatureStatus;
  signatureOrg: string;
  signatureType: PluginSignatureType;
  state: string;
  type: PluginType;
};

interface Rel {
  name: string;
  url: string;
}

export interface Build {
  time?: number;
  repo?: string;
  branch?: string;
  hash?: string;
}

export interface Version {
  version: string;
  createdAt: string;
}

export interface PluginDetails {
  remote?: RemotePlugin;
  remoteVersions?: Version[];
  local?: LocalPlugin;
}

export interface Org {
  slug: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  avatarUrl: string;
}

export type CatalogPluginsState = {
  loading: boolean;
  error?: Error;
  plugins: CatalogPlugin[];
};

export enum PluginStatus {
  INSTALL = 'INSTALL',
  UNINSTALL = 'UNINSTALL',
  UPDATE = 'UPDATE',
}

export enum PluginTabLabels {
  OVERVIEW = 'Overview',
  VERSIONS = 'Version history',
  CONFIG = 'Config',
  DASHBOARDS = 'Dashboards',
}

export enum RequestStatus {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

export type RequestInfo = {
  status: RequestStatus;
  // The whole error object
  error?: any;
  // An optional error message
  errorMessage?: string;
};

export type PluginDetailsTab = {
  label: PluginTabLabels | string;
};

// TODO<remove `PluginsState &` when the "plugin_admin_enabled" feature flag is removed>
export type ReducerState = PluginsState & {
  items: EntityState<CatalogPlugin>;
  requests: Record<string, RequestInfo>;
};

// TODO<remove when the "plugin_admin_enabled" feature flag is removed>
export type PluginCatalogStoreState = StoreState & { plugins: ReducerState };
