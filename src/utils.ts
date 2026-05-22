import { getAgentDir } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import * as path from "node:path";
import { existsSync, readFileSync } from "node:fs";

export const loadSettings = (cwd: string) => {
  const agentDir = getAgentDir();
  const globalSettingsPath = path.join(agentDir, "settings.json");
  const projectSettingsPath = path.join(cwd, ".pi", "settings.json");

  let settings: any = {};

  if (existsSync(globalSettingsPath)) {
    try {
      settings = { ...settings, ...JSON.parse(readFileSync(globalSettingsPath, "utf-8")) };
    } catch (e) {}
  }

  if (existsSync(projectSettingsPath)) {
    try {
      settings = { ...settings, ...JSON.parse(readFileSync(projectSettingsPath, "utf-8")) };
    } catch (e) {}
  }

  return settings;
};

export const getBaseDir = (pi: ExtensionAPI, ctx: ExtensionContext) => {
  // 1. Check CLI flag
  const flagValue = pi.getFlag("repo-base-dir") as string | undefined;
  if (flagValue) return path.resolve(ctx.cwd, flagValue);
  
  // 2. Check settings.json (gitResearch.baseDir)
  const settings = loadSettings(ctx.cwd);
  const settingsValue = settings.gitResearch?.baseDir;
  if (settingsValue) {
    // Handle ~ in settings
    const resolved = settingsValue.startsWith("~") 
      ? path.join(process.env.HOME || "", settingsValue.slice(1))
      : path.resolve(ctx.cwd, settingsValue);
    return resolved;
  }
  
  // 3. Default to project root
  return ctx.cwd;
};
