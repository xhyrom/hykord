import esbuild from "esbuild";

try {
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    minify: true,
    bundle: true,
    format: "iife",
    external: ["@hykord/webpack", "@hykord/components", "@hykord/structures", "@hykord/utilities", "@hykord/patcher", "path"],
    target: ["esnext"],
  });

  console.log("Build successful!");
} catch (err) {
  console.error(err);
}
