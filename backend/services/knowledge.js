import { createHash } from "node:crypto";

/* Splits the FAQ markdown into chunks: one chunk per "### question" under a "## section".
Chunking on headings keeps every question + answer together (better than cutting every N characters). */

const parseFaq = (markdown) => {
  const chunks = [];
  let section = null;
  let current = null;

  const finish = () => {
    if (!current) return;
    const answer = current.lines.join("\n").trim();
    if (answer) {
      chunks.push({
        section: current.section,
        question: current.question,
        text: `${current.section} > ${current.question}\n${answer}`,
      });
    }
    current = null;
  };

  // HTML comments are notes for the team, not knowledge
  const lines = markdown.replace(/<!--[\s\S]*?-->/g, "").split("\n");

  for (const line of lines) {
    if (line.startsWith("## ")) {
      finish();
      section = line.slice(3).trim();
    } else if (line.startsWith("### ")) {
      finish();
      current = { section: section ?? "General", question: line.slice(4).trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  finish();

  return chunks;
};

const chunkHash = (text, embedModel) =>
  createHash("sha256").update(`${embedModel}\n${text}`).digest("hex");

export { parseFaq, chunkHash };
