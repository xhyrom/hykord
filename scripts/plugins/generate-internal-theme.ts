import esbuild from 'esbuild';
import sass from 'sass';
import { join, dirname, extname } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

export const generateInternalTheme: esbuild.Plugin = {
    name: 'generate-internal-theme',
    setup(build) {
      build.onLoad({ filter: /\/themes\/index\.ts$/ }, (args) => {
        const files = readdirSync(dirname(args.path));
  
        const code = readFileSync(args.path).toString();
        let generated = '';
  
        for (const file of files) {
          switch (extname(file)) {
            case '.sass': {
              // Dont know if compile has minify option
              generated += sass.renderSync({
                file: join(dirname(args.path), file),
                outputStyle: 'compressed'
              }).css;
            }
          }
        }
  
        return {
          contents: code.replace('    start: () => $generated', `    start: () => '${generated}'`),
          loader: 'ts'
        };
      });
    }
}