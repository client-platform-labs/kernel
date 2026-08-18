import { access } from "node:fs/promises";
import path from "node:path";
import { glob } from "node:fs/promises";
import { PROJECT_MANIFEST_FILENAME } from "./constants.js";
import type { WorkspaceConfig } from "./config.js";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Discover project roots for a workspace.
 * - If config.projects globs are set, expand them relative to config.root.
 * - Else if client-platform.manifest.jsonc exists at the workspace root, return [root].
 * - Else return [].
 */
export async function discoverProjects(config: WorkspaceConfig): Promise<string[]> {
  const root = path.resolve(config.root);

  if (config.projects && config.projects.length > 0) {
    const found = new Set<string>();
    for (const pattern of config.projects) {
      for await (const match of glob(pattern, { cwd: root })) {
        const absolute = path.resolve(root, match);
        found.add(absolute);
      }
    }
    return [...found].sort();
  }

  if (await pathExists(path.join(root, PROJECT_MANIFEST_FILENAME))) {
    return [root];
  }

  return [];
}
