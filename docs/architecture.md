# Architecture

Kernel is a small monorepo. It is the only shared runtime for Client Platform Labs CLIs.

## Packages

```text
packages/kernel  ->  @client-platform/kernel
packages/cli     ->  @client-platform/cli   bin: client-platform
```

Product CLIs depend on `@client-platform/kernel` and call `createCli`.
The Umbrella CLI is a thin command layer over the same library.

## Family constraints

- Node.js 24.x LTS + TypeScript
- `commander`
- ESM-first npm packages
- JSONC + JSON Schema 2020-12 + Ajv
- Workspace Config: `client-platform.config.jsonc`
- Project Manifest: `client-platform.manifest.jsonc`
- Plugin Manifest: `package.json#clientPlatform`

## Command loading

- Kernel and Umbrella family commands are statically registered.
- Product commands in the Umbrella CLI are discovered from installed packages, then loaded with `import()` only when invoked.
- Product CLIs statically register their own high-frequency commands and lazy-load heavy ones.

## Interfaces

| Interface | Input | Output |
| --- | --- | --- |
| `createCli` | name, version, commands | `commander` program |
| `loadWorkspaceConfig` | cwd | normalized Workspace Config |
| `loadProjectManifest` | project root | normalized Project Manifest |
| `discoverProjects` | Workspace Config | project list |
| `loadPlugins` | config + plugin manifests | plugin records, modules still lazy |
| `doctor` | cwd | diagnostics |

Config pipeline: parse JSONC → migrate `schemaVersion` → validate → normalize.

## What stays out

Adapters, domain schemas, domain codegen, and templates belong in Product repositories.
