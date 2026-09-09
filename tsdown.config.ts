import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  // Derive extensions from package.json "type" (.js / .cjs) instead of
  // tsdown's node-platform default of always .mjs / .cjs, so the published
  // file layout keeps matching the "exports" map.
  fixedExtension: false,
  // Guard the package surface: publint checks the manifest, attw checks that
  // each entry resolves to a declaration file of the matching module format.
  publint: true,
  attw: true,
});
