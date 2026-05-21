import { cpSync, copyFileSync, mkdirSync, existsSync } from "fs";

const src = ".open-next";
const dest = ".open-next/assets";

mkdirSync(dest, { recursive: true });

copyFileSync(`${src}/worker.js`, `${dest}/_worker.js`);

for (const dir of ["cloudflare", "middleware", ".build", "server-functions"]) {
  const from = `${src}/${dir}`;
  if (existsSync(from)) {
    cpSync(from, `${dest}/${dir}`, { recursive: true });
  }
}
