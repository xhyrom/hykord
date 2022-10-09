import esbuild from 'esbuild';
import sass from 'sass';
import CleanCSS from 'clean-css';
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

              break;
            }
            case '.css': {
              // @ts-expect-error no types
              generated += new CleanCSS().minify(readFileSync(join(dirname(args.path), file)).toString()).styles;
            }
          }
        }
  
        return {
          contents: code.replace('start: () => $generated', `start: () => '${generated}'`),
          loader: 'ts'
        };
      });
    }
}