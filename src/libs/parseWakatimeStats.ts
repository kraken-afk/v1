interface SimpleLogEntry {
  name: string;
  timeString: string; // e.g., "3 hrs 29 mins"
  bar: string; // The visual bar part
  percentageString: string; // e.g., "44.12 %"
}

export function parseWakatimeStats(logText: string): SimpleLogEntry[] {
  const lines = logText.trim().split('\n');
  // Adjusted Regex: Group 4 now captures the number, optional space, AND the % sign
  const regex =
    /^(.+?)\s{2,}(\d+\s+h(?:rs?|r)(?:\s+\d+\s+m(?:ins?|in))?|\d+\s+m(?:ins?|in))\s+([█░]+)\s+(\d+(?:\.\d+)?)\s*%$/;
  // Indices: 1: Name, 2: Time String, 3: Bar, 4: Percentage String

  return lines
    .map((line) => {
      const match = line.trim().match(regex);
      if (match) {
        // match[0] is the full string
        const name = match[1].trim(); // Group 1: Name
        const timeString = match[2].trim(); // Group 2: Time String
        const bar = match[3]; // Group 3: Bar
        const percentageString = match[4].trim(); // Group 4: Percentage String (raw)

        return { name, timeString, bar, percentageString };
      }
      return null; // Return null for lines that don't match
    })
    .filter((entry): entry is SimpleLogEntry => entry !== null); // Filter out nulls and satisfy TS}
}
