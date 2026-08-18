# Roadmap

## Now

- Keep this charter aligned with family decisions.
- Public kernel API: `createCli`, `loadWorkspaceConfig`, `loadProjectManifest`, `discoverProjects`, `loadPlugins`, `doctor`.
- Umbrella CLI v1 commands: `doctor`, `config show|validate`, `plugin list|info`, lazy product delegation.

## Next

- Scaffold the kernel monorepo: `packages/kernel` and `packages/cli`.
- Implement config/manifest load-migrate-validate against JSON Schema 2020-12.
- Implement plugin discovery from `package.json#clientPlatform`.
- Ship the Umbrella v1 command surface above.

## Later

- `plugin install|update` and umbrella `init`.
- Versioned schema migrations and compatibility checks against Product plugins.
- Optional Node SEA distribution; npm `bin` remains default.

## Non-goals for v1

- Hosting Product runtimes inside this repository.
- A plugin marketplace.
- Supporting Node versions below 24.x LTS.
- Interactive family-wide scaffolding in the Umbrella CLI.
