const fs = require("node:fs");
const input = JSON.parse(fs.readFileSync(0, "utf8"));

if (!["bash", "powershell"].includes(input.toolName)) {
  process.exit(0);
}

const args = typeof input.toolArgs === "string"
  ? JSON.parse(input.toolArgs)
  : input.toolArgs;

if ((args?.command || "").includes("BLOCKED_COMMAND")) {
  console.log(JSON.stringify({
    permissionDecision: "deny",
    permissionDecisionReason: "Blocked by repository security policy."
  }));
}