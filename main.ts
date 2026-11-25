// office-joke-head-to-head — writes one single-line office joke to entry.txt.
//
// The joke (102 characters, gate limit is 200):
//   I replied-all to 400 people saying 'please stop replying all' and
//   became the incident I was reporting.
// It is built on the reply-all storm, something anyone who has worked
// in an office knows, with the turn held to the last words: the person
// complaining about the storm becomes the incident themselves.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I replied-all to 400 people saying 'please stop replying all' and became the incident I was reporting.";

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv && fromEnv.trim() !== "" ? fromEnv : "/output";
}

function main(): void {
  // Fail loudly rather than ship an entry the gate would refuse:
  // it must be 1-200 characters and not only whitespace.
  if (JOKE.length < 1 || JOKE.length > 200 || JOKE.trim() === "") {
    throw new Error(`joke fails the gate: ${JOKE.length} characters`);
  }

  // The entry is a single line: refuse a joke that smuggles in a
  // newline, which would break the one-line format the judge expects.
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    throw new Error("joke must be a single line");
  }

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });

  // Clear the directory's contents entry by entry; the directory
  // itself is never removed.
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }

  writeFileSync(join(dir, "entry.txt"), JOKE, "utf8");
}

main();
