import "dotenv/config";
import mongoose from "mongoose";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getMongoUri } from "../db.js";
import { getChatReply, validateMessages } from "../controllers/chatControllers.js";
import { MODEL, EMBED_MODEL } from "../services/llm.js";

/* Runs every case of eval/chatbot-eval.json through the real chatbot (Gemini + knowledge base)
and writes a Markdown report to eval/results/ for manual grading.

Usage (from backend/):
    npm run eval                 -> all cases
    npm run eval -- faq inj      -> only cases whose id or category contains one of the words

Calls the pipeline directly (no HTTP), so the /api/chat rate limit does not apply.
Costs about 3 API calls per case: cases are sent slowly to stay inside the free tier limits.
Needs `npm run ingest` first (reads the kbchunks collection).
*/

const CASES_FILE = new URL("../eval/chatbot-eval.json", import.meta.url);
const RESULTS_DIR = new URL("../eval/results/", import.meta.url);
const DELAY_MS = 4000;
const RETRIES = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Overloaded / rate-limited provider -> wait and try again instead of failing the case
const askWithRetry = async (messages) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await getChatReply(messages);
    } catch (err) {
      if (attempt >= RETRIES) throw err;
      console.log(`    retry after error: ${err.message.slice(0, 80)}`);
      await sleep(DELAY_MS * 3);
    }
  }
};

// -> list of failed checks (empty = passed)
const check = (testCase, { reply, sources = [] }) => {
  const failures = [];
  const regex = (pattern) => new RegExp(pattern, "i");

  if (testCase.sources && !testCase.sources.some((section) => sources.includes(section))) {
    failures.push(`expected a source from [${testCase.sources.join(", ")}]`);
  }
  if (testCase.noSources && sources.length > 0) {
    failures.push(`expected no sources, got [${sources.join(", ")}]`);
  }
  for (const pattern of testCase.mustMatch ?? []) {
    if (!regex(pattern).test(reply)) failures.push(`should match /${pattern}/`);
  }
  for (const pattern of testCase.mustNotMatch ?? []) {
    if (regex(pattern).test(reply)) failures.push(`should not match /${pattern}/`);
  }
  return failures;
};

const escapeCell = (text) => text.replace(/\|/g, "\\|").replace(/\n+/g, " ");

const toMarkdown = (results, startedAt) => {
  const passed = results.filter((r) => r.status === "pass").length;
  const lines = [
    `# Chatbot eval: ${startedAt.toISOString().slice(0, 16).replace("T", " ")}`,
    "",
    `Model: \`${MODEL}\` · Embeddings: \`${EMBED_MODEL}\` · Cases: ${results.length} · ` +
      `Automatic checks passed: **${passed}/${results.length}**`,
    "",
    "Grade every answer by hand in the last column: ✅ good · ⚠️ acceptable · ❌ wrong.",
    "",
    "| # | Case | Category | Auto | Time | Manual |",
    "|---|---|---|---|---|---|",
    ...results.map((r, i) =>
      `| ${i + 1} | ${r.id} | ${r.category} | ${r.status === "pass" ? "✅" : r.status === "error" ? "💥" : "❌"} | ${r.ms} ms | |`
    ),
    "",
    "## Answers",
  ];

  results.forEach((r, i) => {
    lines.push("", `### ${i + 1}. ${r.id} (${r.category})`, "");
    lines.push(`**Question:** ${escapeCell(r.question)}`, "");
    lines.push(`**Answer:** ${r.reply ? escapeCell(r.reply) : `_error: ${r.error}_`}`, "");
    lines.push(`**Sources:** ${r.sources?.length ? r.sources.join(", ") : "none"}`, "");
    if (r.failures?.length) lines.push(`**Failed checks:** ${r.failures.join("; ")}`, "");
  });

  return lines.join("\n") + "\n";
};

const run = async () => {
  const { cases } = JSON.parse(await readFile(CASES_FILE, "utf8"));
  const filters = process.argv.slice(2);
  const selected = filters.length
    ? cases.filter((c) => filters.some((word) => c.id.includes(word) || c.category.includes(word)))
    : cases;

  const startedAt = new Date();
  const results = [];

  for (const [i, testCase] of selected.entries()) {
    const messages = testCase.messages ?? [{ role: "user", content: testCase.question }];
    const invalid = validateMessages(messages);
    if (invalid) throw new Error(`Case ${testCase.id} is invalid: ${invalid}`);

    const question = messages.at(-1).content;
    const t = Date.now();
    // Not spreading testCase: its `sources` are the expected ones, not what the bot answered
    let result = { id: testCase.id, category: testCase.category, question };
    try {
      const answer = await askWithRetry(messages);
      const failures = check(testCase, answer);
      result = { ...result, ...answer, failures, status: failures.length ? "fail" : "pass" };
    } catch (err) {
      result = { ...result, error: err.message, status: "error" };
    }
    result.ms = Date.now() - t;
    results.push(result);

    const mark = { pass: "✅", fail: "❌", error: "💥" }[result.status];
    console.log(`${mark} [${i + 1}/${selected.length}] ${testCase.id}${result.failures?.length ? ` -> ${result.failures.join("; ")}` : ""}${result.error ? ` -> ${result.error}` : ""}`);

    if (i < selected.length - 1) await sleep(DELAY_MS);
  }

  await mkdir(RESULTS_DIR, { recursive: true });
  const file = new URL(`eval-${startedAt.toISOString().slice(0, 19).replace(/[:T]/g, "-")}.md`, RESULTS_DIR);
  await writeFile(file, toMarkdown(results, startedAt));

  const passed = results.filter((r) => r.status === "pass").length;
  console.log(`\n${passed}/${results.length} passed the automatic checks. Report: ${fileURLToPath(file)}`);
  if (passed < results.length) process.exitCode = 1;
};

const uri = getMongoUri();
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  await run();
} catch (err) {
  console.error(`Eval failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
