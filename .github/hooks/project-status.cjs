const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const input = JSON.parse(fs.readFileSync(0, "utf8"));
const match = input.prompt?.match(/^Start work on #(\d+)\s*$/i);

if (match) {
  execFileSync(process.execPath, [
    "scripts/update-project-status.cjs",
    match[1],
    "In progress"
  ], { stdio: "inherit" });
}