import * as fs from "node:fs";
import * as path from "node:path";

const LINE =
  "An hour, nine people, one outcome: an email summarizing the meeting that should have been the email.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validateLine(line: string): void {
  if (line.length === 0) {
    fail("line is empty");
  }
  if (line.trim().length === 0) {
    fail("line is only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("line must be a single line");
  }
  if (line.length < 1 || line.length > 200) {
    fail(`line length ${line.length} is outside the 1-200 character gate`);
  }
}

function writeAndVerify(line: string, outputPath: string): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, line, "utf8");

  const written = fs.readFileSync(outputPath, "utf8");
  if (written !== line) {
    fail("written file does not match the line byte-for-byte");
  }
  if (written.endsWith("\n") || written.endsWith("\r")) {
    fail("written file has a trailing newline");
  }
}

validateLine(LINE);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = path.join(outputDir, "entry.txt");

writeAndVerify(LINE, outputPath);

const written = fs.readFileSync(outputPath, "utf8");

const charCount = [...written].length;
const byteCount = Buffer.byteLength(written, "utf8");
console.log(`wrote ${outputPath}`);
console.log(`characters: ${charCount}`);
console.log(`bytes: ${byteCount}`);
