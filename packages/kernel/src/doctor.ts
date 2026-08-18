import { access } from "node:fs/promises";
import path from "node:path";
import { WORKSPACE_CONFIG_FILENAME } from "./constants.js";
import { loadWorkspaceConfig } from "./config.js";
import { ConfigError } from "./pipeline.js";
import { loadPlugins } from "./plugins.js";

export type DoctorFinding = {
  code: string;
  message: string;
  severity: "info" | "warn" | "error";
};

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function nodeMajor(version: string): number {
  const match = /^v?(\d+)/.exec(version);
  return match ? Number(match[1]) : 0;
}

export async function doctor(cwd: string): Promise<DoctorFinding[]> {
  const findings: DoctorFinding[] = [];
  const root = path.resolve(cwd);

  const major = nodeMajor(process.version);
  if (major >= 24) {
    findings.push({
      code: "node.engines",
      message: `Node.js ${process.version} satisfies engines.node >=24`,
      severity: "info",
    });
  } else {
    findings.push({
      code: "node.engines",
      message: `Node.js ${process.version} is below the family baseline (>=24). Upgrade recommended.`,
      severity: "warn",
    });
  }

  const configPath = path.join(root, WORKSPACE_CONFIG_FILENAME);
  if (!(await pathExists(configPath))) {
    findings.push({
      code: "config.missing",
      message: `Missing ${WORKSPACE_CONFIG_FILENAME} in ${root}`,
      severity: "error",
    });
    return findings;
  }

  findings.push({
    code: "config.present",
    message: `Found ${WORKSPACE_CONFIG_FILENAME}`,
    severity: "info",
  });

  try {
    const config = await loadWorkspaceConfig(root);
    findings.push({
      code: "config.valid",
      message: `Workspace config validated (schemaVersion=${config.schemaVersion})`,
      severity: "info",
    });

    const plugins = await loadPlugins(config);
    if (plugins.length === 0) {
      findings.push({
        code: "plugins.none",
        message: "No plugins discovered from package.json#clientPlatform or config.plugins",
        severity: "info",
      });
    } else {
      findings.push({
        code: "plugins.found",
        message: `Plugins: ${plugins.map((p) => (p.version ? `${p.name}@${p.version}` : p.name)).join(", ")}`,
        severity: "info",
      });
    }
  } catch (err) {
    const message = err instanceof ConfigError || err instanceof Error ? err.message : String(err);
    findings.push({
      code: "config.invalid",
      message,
      severity: "error",
    });
  }

  return findings;
}
