# kernel

Shared foundation for Client Platform Labs products.

This repository publishes:

- `@client-platform/kernel` — CLI bootstrap, config/manifest loading, plugin registry, project discovery, diagnostics
- `@client-platform/cli` — the Umbrella CLI, command `client-platform`

## Vision

Kernel exists so Products do not reimplement the same engineering surface. It should stay small, boring, and stable. Product-specific runtimes, adapters, and templates do not belong here.

## Scope

In:

- `createCli` and command registration helpers
- JSONC Workspace Config and Project Manifest load / migrate / validate
- plugin discovery from `package.json#clientPlatform`
- lazy `import()` of optional plugins
- project discovery
- doctor-style diagnostics

Out:

- observability event models
- bundler and deploy adapters
- microfrontend runtimes
- hybrid bridges
- cross-platform target adapters

## Documents

- [Roadmap](./ROADMAP.md)
- [Architecture](./docs/architecture.md)
- [ADR 0001: shared kernel boundaries](./docs/adr/0001-shared-kernel-boundaries.md)

## Local development

Requires Node.js 24.x LTS (`engines.node >=24.0.0`).

```bash
npm install
npm run build
node packages/cli/bin/client-platform.js --help
node packages/cli/bin/client-platform.js doctor
```

Workspace packages:

- `packages/kernel` → `@client-platform/kernel`
- `packages/cli` → `@client-platform/cli` (bin `client-platform`)
