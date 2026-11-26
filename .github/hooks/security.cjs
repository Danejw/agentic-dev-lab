const fs = require("node:fs");
const input = JSON.parse(fs.readFileSync(0, "utf-8"));

const args = typeof input.toolArgs === "string"
  ? JSON.parse(input.toolArgs)
  : input.toolArgs;

if (["bash", "powershell"].includes(input.toolName)) {
  if ((args?.command || "").includes("BLOCKED_COMMAND")) {
    console.log(JSON.stringify({
      permissionDecision: "deny",
      permissionDecisionReason: "Blocked by repository security policy."
    }));
  }
}
