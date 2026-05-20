import { writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const openNextDir = ".open-next";

// Collect top-level public static files (favicon, SVGs, images, etc.)
const topLevelFiles = readdirSync(openNextDir).filter((f) => {
  // Skip directories, hidden files, worker files, and build metadata
  if (f.startsWith(".") || f.startsWith("_")) return false;
  if (f.endsWith(".js") || f.endsWith(".mjs") || f.endsWith(".json")) return false;
  if (f === "BUILD_ID") return false;
  try {
    return statSync(join(openNextDir, f)).isFile();
  } catch {
    return false;
  }
});

const exclude = ["/_next/static/*", "/BUILD_ID", ...topLevelFiles.map((f) => `/${f}`)];

const routes = {
  version: 1,
  include: ["/*"],
  exclude,
};

writeFileSync(
  join(openNextDir, "_routes.json"),
  JSON.stringify(routes, null, 2)
);

console.log("Generated _routes.json with exclude:", exclude);
