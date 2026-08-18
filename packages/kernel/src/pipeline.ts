import { readFile } from "node:fs/promises";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";
import { parse as parseJsonc, type ParseError } from "jsonc-parser";
import { CURRENT_SCHEMA_VERSION, SUPPORTED_SCHEMA_VERSIONS } from "./constants.js";

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function parseJsoncDocument(text: string, source: string): unknown {
  const errors: ParseError[] = [];
  const value = parseJsonc(text, errors, {
    allowTrailingComma: true,
  });
  if (errors.length > 0) {
    const detail = errors
      .map((e) => `offset ${e.offset}: error ${e.error}`)
      .join("; ");
    throw new ConfigError(`Failed to parse JSONC (${source}): ${detail}`);
  }
  return value;
}

export function migrateSchemaVersion(doc: unknown, source: string): Record<string, unknown> {
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) {
    throw new ConfigError(`Expected a JSON object in ${source}`);
  }
  const record = { ...(doc as Record<string, unknown>) };
  const version = record.schemaVersion;
  if (typeof version !== "string") {
    throw new ConfigError(`Missing required string field schemaVersion in ${source}`);
  }
  if (!(SUPPORTED_SCHEMA_VERSIONS as readonly string[]).includes(version)) {
    throw new ConfigError(
      `Unsupported schemaVersion "${version}" in ${source}; supported: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")}`,
    );
  }
  // Identity migrator for "0" / "1"; normalize to current.
  record.schemaVersion = CURRENT_SCHEMA_VERSION;
  return record;
}

export function validateAgainstSchema(
  schema: object,
  doc: Record<string, unknown>,
  source: string,
): Record<string, unknown> {
  const validate = ajv.compile(schema);
  if (!validate(doc)) {
    const detail =
      validate.errors
        ?.map((e: ErrorObject) => `${e.instancePath || "/"} ${e.message ?? "invalid"}`)
        .join("; ") ?? "unknown validation error";
    throw new ConfigError(`Schema validation failed for ${source}: ${detail}`);
  }
  return doc;
}

export async function readTextFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      throw new ConfigError(`File not found: ${filePath}`);
    }
    throw err;
  }
}

export async function loadJsoncPipeline(
  filePath: string,
  schema: object,
): Promise<Record<string, unknown>> {
  const text = await readTextFile(filePath);
  const parsed = parseJsoncDocument(text, filePath);
  const migrated = migrateSchemaVersion(parsed, filePath);
  return validateAgainstSchema(schema, migrated, filePath);
}
