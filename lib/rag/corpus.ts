import fs from "fs";
import path from "path";
import type { RagChunk } from "./types";

let cached: RagChunk[] | null = null;

export function loadCorpus(): RagChunk[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "data", "rag", "corpus.jsonl");
  const raw = fs.readFileSync(filePath, "utf8");
  cached = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as RagChunk);
  return cached;
}

/** Test helper / hot-reload after corpus edits in long-lived process */
export function clearCorpusCache() {
  cached = null;
}
