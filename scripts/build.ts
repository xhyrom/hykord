import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
import { join, resolve } from 'node:path';
import { readFileSync, rmSync, existsSync } from 'node:fs';

if (existsSync(join(__dirname, '..', 'dist'))) rmSync(join(__dirname, '..', 'dist'), { recursive: true });

const watch = process.argv.includes('--watch');
const dev = process.argv.includes('--dev');

const tsconfig = JSON.parse(readFileSync(join(__dirname, '..', 'tsconfig.json')).toString());

// converts tsconfig aliases (paths)
const aliases = Object.fromEntries(
  // @ts-expect-error
  Object.entries(tsconfig.compilerOptions.paths).map(([alias, [target]]) => [
    alias,
    resolve(target),
  ]),
);

const makeAllPackagesExternalPlugin: esbuild.Plugin = {
  name: 'make-all-packages-external',
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with '/' or './' or '../'
    build.onResolve({ filter }, args => ({ path: args.path, external: true }));
  },
};

const common: esbuild.BuildOptions = {
  logLevel: 'info',
  absWorkingDir: join(__dirname, '..'),
  bundle: true,
  minify: !dev,
  sourcemap: dev,
  format: 'cjs' as esbuild.Format,
  watch: watch,
  plugins: [
    alias(aliases),
    makeAllPackagesExternalPlugin
  ]
};

Promise.all([
    esbuild.build({
      ...common,
      entryPoints: ['src/preload/index.ts'],
      outfile: 'dist/preload.js',
      platform: 'node',
      target: ['esnext'],
    }),

    esbuild.build({
      ...common,
      entryPoints: ['src/main/index.ts'],
      outfile: 'dist/main.js',
      platform: 'node',
      target: ['esnext'],
    }),

    esbuild.build({
      ...common,
      entryPoints: ['src/common/index.ts'],
      outfile: 'dist/common.js',
      platform: 'neutral',
      target: ['esnext'],
    }),

    esbuild.build({
      ...common,
      entryPoints: ['src/renderer/index.ts'],
      outfile: 'dist/renderer.js',
      format: 'iife',
      platform: 'browser',
      target: ['esnext'],
      plugins: [
        alias(aliases)
      ],
      globalName: 'Hykord',
    })
]).catch(err => {
    console.error('Hykord failed to build');
    console.error(err.message);
}).then(() =>{
  console.log(watch ? 'Waiting for your changes...' : 'Hykord has been built');
});
