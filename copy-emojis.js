import fs from "node:fs";
import path from "node:path";

const source = path.resolve(
  "node_modules",
  "emoji-datasource-twitter",
  "img",
  "twitter",
  "64"
);

const destination = path.resolve("public", "emoji");

fs.mkdirSync(destination, { recursive: true });

fs.cpSync(source, destination, {
  recursive: true
});

console.log("✅ Twemoji copied successfully.");
