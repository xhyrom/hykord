import { file, write } from "bun";
import { mkdirSync } from "fs";
import { join, resolve } from "path";
import { getDotTsFiles } from "@hykord/utils/getDotFiles";

const folder = join(import.meta.dir, "..", "dist");

try {
  mkdirSync(folder, { recursive: true });
} catch {}

const filesToCat = (await getDotTsFiles("./")).filter(
    (f) => !["./index.d.ts"].some((tf) => f === tf)
);

const fileContents: string[] = [];

for (let i = 0; i < filesToCat.length; i++) {
  const name = filesToCat[i];
  fileContents.push(
    "// " +
      name +
      "\n\n" +
      (await file(resolve(import.meta.dir, "..", "src", name)).text()) +
      "\n"
  );
}

const text = fileContents.join("\n");

await write(join(folder, "index.d.ts"), text);