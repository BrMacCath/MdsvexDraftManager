export function extractCompleteSection(content: string): string | undefined {
  // Frontmatter must be at the very start of the file
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!fm) { return content; }

  // Pull out completeSection: "## Heading" (quotes optional)
  const heading = fm[1].match(/^completeSection:\s*["']?(.+?)["']?\s*$/m)?.[1].trim();
  if (!heading) { return content; } // no completeSection key: use the whole file

  const level = heading.match(/^#+/)?.[0].length;
  if (!level) { return undefined; } // value isn't a markdown heading

  const lines = content.slice(fm[0].length).split(/\r?\n/);

  let start = -1;
  let end = lines.length;
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignore "#" lines inside code blocks
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) { continue; }

    if (start === -1) {
      if (line.trim() === heading) { start = i + 1; }
    } else {
      // Next heading of same or higher level (fewer or equal #s) ends the section
      const m = line.match(/^(#{1,6})\s/);
      if (m && m[1].length <= level) {
        end = i;
        break;
      }
    }
  }

  if (start === -1) { return undefined; } // heading not found
  return lines.slice(start, end).join('\n').trim();
}
