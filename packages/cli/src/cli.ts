import {
  ConfigError,
  createCli,
  doctor,
  loadPlugins,
  loadWorkspaceConfig,
} from "@client-platform/kernel";

export async function run(argv: string[]): Promise<void> {
  const program = createCli({
    name: "client-platform",
    version: "0.0.0",
    description: "Umbrella CLI for Client Platform Labs",
  });

  program
    .command("doctor")
    .description("Run family diagnostics")
    .action(async () => {
      const findings = await doctor(process.cwd());
      for (const finding of findings) {
        console.log(`[${finding.severity}] ${finding.code}: ${finding.message}`);
      }
      if (findings.some((f) => f.severity === "error")) {
        process.exitCode = 1;
      }
    });

  const config = program.command("config").description("Workspace config helpers");
  config
    .command("show")
    .description("Show normalized workspace config")
    .action(async () => {
      try {
        const cfg = await loadWorkspaceConfig(process.cwd());
        console.log(JSON.stringify(cfg, null, 2));
      } catch (err) {
        const message = err instanceof ConfigError || err instanceof Error ? err.message : String(err);
        console.error(message);
        process.exitCode = 1;
      }
    });
  config
    .command("validate")
    .description("Validate workspace config")
    .action(async () => {
      try {
        const cfg = await loadWorkspaceConfig(process.cwd());
        console.log(`config validate: ok (schemaVersion=${cfg.schemaVersion})`);
      } catch (err) {
        const message = err instanceof ConfigError || err instanceof Error ? err.message : String(err);
        console.error(`config validate: failed — ${message}`);
        process.exitCode = 1;
      }
    });

  const plugin = program.command("plugin").description("Installed product/plugin helpers");
  plugin
    .command("list")
    .description("List discovered plugins")
    .action(async () => {
      try {
        const cfg = await loadWorkspaceConfig(process.cwd());
        const plugins = await loadPlugins(cfg);
        if (plugins.length === 0) {
          console.log("(no plugins discovered)");
          return;
        }
        for (const p of plugins) {
          console.log(`${p.name}${p.version ? `@${p.version}` : ""}`);
        }
      } catch (err) {
        const message = err instanceof ConfigError || err instanceof Error ? err.message : String(err);
        console.error(message);
        process.exitCode = 1;
      }
    });
  plugin
    .command("info")
    .argument("<name>", "plugin package name")
    .description("Show plugin metadata")
    .action(async (name: string) => {
      try {
        const cfg = await loadWorkspaceConfig(process.cwd());
        const plugins = await loadPlugins(cfg);
        const match = plugins.find((p) => p.name === name);
        if (!match) {
          console.error(`plugin not found: ${name}`);
          process.exitCode = 1;
          return;
        }
        console.log(JSON.stringify(match, null, 2));
      } catch (err) {
        const message = err instanceof ConfigError || err instanceof Error ? err.message : String(err);
        console.error(message);
        process.exitCode = 1;
      }
    });

  program
    .command("observability")
    .description("Delegate to observability product CLI (lazy stub)")
    .allowUnknownOption(true)
    .argument("[args...]", "product args")
    .action(async (args: string[]) => {
      console.log(
        `delegation stub: run 'observability ${(args ?? []).join(" ")}' after linking @client-platform/observability`,
      );
    });

  program
    .command("build-release")
    .description("Delegate to build-release product CLI (lazy stub)")
    .allowUnknownOption(true)
    .argument("[args...]", "product args")
    .action(async (args: string[]) => {
      console.log(
        `delegation stub: run 'build-release ${(args ?? []).join(" ")}' after linking @client-platform/build-release`,
      );
    });

  await program.parseAsync(argv);
}
