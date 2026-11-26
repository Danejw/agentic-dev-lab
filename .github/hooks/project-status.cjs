const fs = require("node:fs");
const input = JSON.parse(fs.readFileSync(0, "utf8"));

const match = input.prompt?.match(/^Start work on #(\d+)\s*$/i);

if (match) {
  const task = {
    number: Number(match[1]),
    status: "In progress"
  };

  fs.appendFileSync(
    ".project-status-requests.jsonl",
    JSON.stringify(task) + "\n"
  );
}
