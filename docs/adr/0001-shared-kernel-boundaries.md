# 0001. Shared kernel boundaries

## Status

Accepted

## Context

Client Platform Labs has five Products plus a future RN track. Without a kernel boundary, each CLI would grow its own config loader, plugin discovery, and diagnostics.

## Decision

Publish a dedicated `kernel` repository containing:

- `@client-platform/kernel` for shared library APIs
- `@client-platform/cli` for the Umbrella CLI `client-platform`

Kernel owns bootstrap, config/manifest governance, plugin discovery, project discovery, and diagnostics. Products own domain commands, runtimes, adapters, presets, and templates.

Users get both Product binaries and the Umbrella CLI.

## Consequences

- Product repos stay independently releasable.
- Kernel API compatibility becomes a family contract and should version conservatively.
- Template/codegen/adapter work must not land in this repository.
- A later RN Product can depend on the same kernel without renaming the family.
