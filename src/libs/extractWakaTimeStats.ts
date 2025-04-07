export function extractWakaTimeStats(
  markdown: string,
): { prolang: string; editors: string; os: string } | null {
  // Find the start of the relevant section
  const sectionStartMarker = '📊 **This Week I Spent My Time On**';
  const sectionStartIndex = markdown.indexOf(sectionStartMarker);
  if (sectionStartIndex === -1) {
    console.error(
      "Couldn't find the 'This Week I Spent My Time On' section header.",
    );
    return null;
  }

  // Find the text block immediately following the header
  const codeBlockRegex = /```text([\s\S]*?)```/;
  // Search *after* the header we found
  const codeBlockMatch = markdown
    .substring(sectionStartIndex + sectionStartMarker.length)
    .match(codeBlockRegex);

  if (!codeBlockMatch || !codeBlockMatch[1]) {
    console.error(
      "Couldn't find the text code block for 'This Week I Spent My Time On'.",
    );
    return null;
  }

  const blockContent = codeBlockMatch[1];
  const lines = blockContent.split('\n');

  const proLangLines: string[] = [];
  const editorLines: string[] = [];
  const osLines: string[] = [];
  let currentSection: 'prolang' | 'editor' | 'os' | 'none' = 'none';

  // Markers to identify section starts (ignoring emojis)
  const proLangMarker = 'Programming Languages:';
  const editorMarker = 'Editors:';
  const osMarker = 'Operating System:';

  for (const line of lines) {
    const trimmedLine = line.trim(); // Trim whitespace for matching

    // Check if the line marks the start of a new section
    if (trimmedLine.includes(proLangMarker)) {
      currentSection = 'prolang';
      continue; // Don't include the header line itself
    }
    if (trimmedLine.includes(editorMarker)) {
      currentSection = 'editor';
      continue; // Don't include the header line itself
    }
    if (trimmedLine.includes(osMarker)) {
      currentSection = 'os';
      continue; // Don't include the header line itself
    }

    // If it's not a header line, add it to the current section's lines
    // Make sure it's not an empty line either before adding
    if (trimmedLine.length > 0) {
      switch (currentSection) {
        case 'prolang':
          // Use original line to preserve formatting/spacing
          proLangLines.push(line);
          break;
        case 'editor':
          editorLines.push(line);
          break;
        case 'os':
          osLines.push(line);
          break;
        // Ignore lines before the first section header ('none')
      }
    }
  }

  // Join the lines back, trim final whitespace
  const prolang = proLangLines.join('\n').trim();
  const editors = editorLines.join('\n').trim();
  const operatingSystem = osLines.join('\n').trim();

  // Basic validation: Check if we actually extracted something for each category
  if (!prolang && !editors && !operatingSystem) {
    console.error('Failed to extract meaningful data from the block.');
    return null;
  }

  return {
    prolang: prolang,
    editors: editors,
    os: operatingSystem,
  };
}
