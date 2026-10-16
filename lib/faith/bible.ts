/** The 66 books of the Protestant Bible with their chapter counts, for checking references. */
const BOOKS: [string, number][] = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34], ["Joshua", 24], ["Judges", 21], ["Ruth", 4],
  ["1 Samuel", 31], ["2 Samuel", 24], ["1 Kings", 22], ["2 Kings", 25], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10], ["Nehemiah", 13],
  ["Esther", 10], ["Job", 42], ["Psalms", 150], ["Proverbs", 31], ["Ecclesiastes", 12], ["Song of Songs", 8], ["Isaiah", 66], ["Jeremiah", 52],
  ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12], ["Hosea", 14], ["Joel", 3], ["Amos", 9], ["Obadiah", 1], ["Jonah", 4], ["Micah", 7],
  ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3], ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4],
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21], ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13],
  ["Galatians", 6], ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6],
  ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1], ["Hebrews", 13], ["James", 5], ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5], ["2 John", 1],
  ["3 John", 1], ["Jude", 1], ["Revelation", 22],
];
const ALIASES: Record<string, string> = { psalm: "Psalms", "song of solomon": "Song of Songs", "revelations": "Revelation" };
const BY_NAME = new Map(BOOKS.map(([name, chapters]) => [name.toLowerCase(), { name, chapters }]));

export interface Passage {
  /** Normalized reference, e.g. "John 11:25–26" or "Psalm 13". */
  ref: string;
  /** Book and chapter, for linking to the whole chapter. */
  chapter: string;
}

/**
 * Parses a reference like "John 3:16", "1 Peter 5:7", "Psalm 13" or
 * "Luke 23:39-43". Returns null when the book doesn't exist or the chapter is
 * out of range, so made-up references can be dropped.
 */
export function parseRef(input: string): Passage | null {
  const m = /^\s*((?:[1-3]\s*)?[A-Za-z][A-Za-z ]*?)\s+(\d{1,3})(?::(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?)?\s*$/.exec(input.replace(/[–—]/g, "-"));
  if (!m) return null;
  const key = m[1].replace(/^([1-3])\s*/, "$1 ").replace(/\s+/g, " ").trim().toLowerCase();
  const book = BY_NAME.get(ALIASES[key]?.toLowerCase() ?? key);
  if (!book) return null;
  let chapter = Number(m[2]);
  let verse = m[3] ? Number(m[3]) : null;
  const to = m[4] ? Number(m[4]) : null;
  // One-chapter books are often cited by verse alone ("Jude 24").
  if (book.chapters === 1 && verse === null && chapter > 1) {
    verse = chapter;
    chapter = 1;
  }
  if (chapter < 1 || chapter > book.chapters) return null;
  if (verse !== null && (verse < 1 || verse > 176)) return null;
  if (to !== null && (verse === null || to <= verse || to > 176)) return null;
  const display = book.name === "Psalms" ? "Psalm" : book.name;
  const ref = `${display} ${chapter}${verse !== null ? `:${verse}${to !== null ? `–${to}` : ""}` : ""}`;
  return { ref, chapter: `${display} ${chapter}` };
}

/** The chapter in the New Living Translation, which reads easily for newcomers. */
export function chapterLink(p: Passage): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(p.chapter)}&version=NLT`;
}
