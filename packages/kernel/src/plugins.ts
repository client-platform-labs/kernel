import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type { WorkspaceConfig } from "./config.js";

export type PluginRecord = {
  name: string;
  version?: string;
  root?: string;
  clientPlatform?: Record<string, unknown>;
};

type PackageJson = {
  name?: string;
  version?: string;
  clientPlatform?: unknown;
};

async function readPackageJson(pkgJsonPath: string): Promise<PackageJson | null> {
  try {
    const text = await readFile(pkgJsonPath, "utf8");
    return JSON.parse(text) as PackageJson;
  } catch {
    return null;
  }
}

function toPluginRecord(pkg: PackageJson, root: string): PluginRecord | null {
  if (!pkg.clientPlatform || typeof pkg.clientPlatform !== "object" || Array.isArray(pkg.clientPlatform)) {
    return null;
  }
  const name =
    typeof pkg.name === "string" && pkg.name.length > 0
      ? pkg.name
      : path.basename(root);
  const record: PluginRecord = {
    name,
    root,
    clientPlatform: pkg.clientPlatform as Record<string, unknown>,
  };
  if (typeof pkg.version === "string") {
    record.version = pkg.version;
  }
  return record;
}

async function loadLocalPlugin(cwd: string): Promise<PluginRecord | null> {
  const root = path.resolve(cwd);
  const pkg = await readPackageJson(path.join(root, "package.json"));
  if (!pkg) {
    return null;
  }
  return toPluginRecord(pkg, root);
}

async function resolvePluginPackage(
  packageName: string,
  fromDir: string,
): Promise<PluginRecord | null> {
  try {
    const require = createRequire(path.join(fromDir, "package.json"));
    const pkgJsonPath = require.resolve(`${packageName}/package.json`);
    const pkg = await readPackageJson(pkgJsonPath);
    if (!pkg) {
      return null;
    }
    return toPluginRecord(pkg, path.dirname(pkgJsonPath));
  } catch {
    return null;
  }
}

/**
 * Discover plugins from the cwd package.json#clientPlatform and from
 * resolvable package names listed in config.plugins.
 */
export async function loadPlugins(config: WorkspaceConfig): Promise<PluginRecord[]> {
  const root = path.resolve(config.root);
  const byName = new Map<string, PluginRecord>();

  const local = await loadLocalPlugin(root);
  if (local) {
    byName.set(local.name, local);
  }

  for (const packageName of config.plugins ?? []) {
    const resolved = await resolvePluginPackage(packageName, root);
    if (resolved) {
      byName.set(resolved.name, resolved);
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}
