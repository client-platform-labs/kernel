import { SUPPORTED_SCHEMA_VERSIONS } from "./constants.js";

export type WorkspaceConfigRaw = {
  schemaVersion: string;
  products?: Record<string, unknown>;
  plugins?: string[];
  projects?: string[];
};

export type ProjectManifestRaw = {
  schemaVersion: string;
  targets?: string[];
  tooling?: string[];
};

export const workspaceConfigSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://client-platform.local/schemas/workspace-config.json",
  type: "object",
  required: ["schemaVersion"],
  additionalProperties: true,
  properties: {
    schemaVersion: {
      type: "string",
      enum: [...SUPPORTED_SCHEMA_VERSIONS],
    },
    products: {
      type: "object",
      additionalProperties: true,
    },
    plugins: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    projects: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;

export const projectManifestSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://client-platform.local/schemas/project-manifest.json",
  type: "object",
  required: ["schemaVersion"],
  additionalProperties: true,
  properties: {
    schemaVersion: {
      type: "string",
      enum: [...SUPPORTED_SCHEMA_VERSIONS],
    },
    targets: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
    tooling: {
      type: "array",
      items: { type: "string", minLength: 1 },
    },
  },
} as const;
