import * as fs from "fs";
import * as path from "path";
import { GlobSync } from "glob";

const cwd = path.resolve(__dirname, "../..");

[{ src: "docs/images", rel: "images" }]
  .concat(new GlobSync("*.md", { cwd }).found.map((src) => ({ src, rel: src })))
  .forEach(({ src, rel }) => {
    fs.cpSync(src, `docs/dist/${rel}`, { recursive: true });
  });
