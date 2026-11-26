const fs = require("node:fs");
const input = JSON.parse(fs.readFileSync(0, "utf8"));

const entry = {
  timestamp: new Date().toISOString(),
  sessionId: input.sessionId,
  tool: input.toolName,
  result: input.toolResult?.resultType
};

fs.appendFileSync(
  ".agent-audit.jsonl",
  JSON.stringify(entry) + "\n"
);
