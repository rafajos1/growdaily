import { EVERY_DAY, WEEKDAYS } from "./types";

export interface FaithHabit {
  name: string;
  days: number[];
  color: string;
  hint: string;
}

/** One-tap starting points shown in the habit form when Faith is on. */
export const FAITH_HABITS: FaithHabit[] = [
  { name: "Read the Bible", days: EVERY_DAY, color: "#b48cf2", hint: "Even one chapter" },
  { name: "Pray", days: EVERY_DAY, color: "#5cb8e6", hint: "Five quiet minutes" },
  { name: "Write 3 things I'm thankful for", days: EVERY_DAY, color: "#f2b54b", hint: "Gratitude" },
  { name: "Go to church", days: [0], color: "#53cfa0", hint: "Sundays" },
  { name: "Encourage someone", days: WEEKDAYS, color: "#ef7fa8", hint: "A text or a call" },
  { name: "Sabbath rest", days: [0], color: "#f2846b", hint: "Unplug and rest" },
];

export interface Verse {
  ref: string;
  /** Book and chapter for the "read the chapter" link. */
  chapter: string;
  text: string;
}

/**
 * King James Version (public domain), quoted exactly. Kept to whole verses that
 * stand on their own so nothing is quoted out of context mid-sentence.
 */
export const VERSES: Verse[] = [
  { ref: "Psalm 46:10", chapter: "Psalm 46", text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth." },
  { ref: "Proverbs 3:5–6", chapter: "Proverbs 3", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { ref: "Philippians 4:13", chapter: "Philippians 4", text: "I can do all things through Christ which strengtheneth me." },
  { ref: "Isaiah 40:31", chapter: "Isaiah 40", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { ref: "Matthew 11:28", chapter: "Matthew 11", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
  { ref: "Lamentations 3:22–23", chapter: "Lamentations 3", text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness." },
  { ref: "Joshua 1:9", chapter: "Joshua 1", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
  { ref: "Psalm 23:1", chapter: "Psalm 23", text: "The LORD is my shepherd; I shall not want." },
  { ref: "John 3:16", chapter: "John 3", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "Psalm 118:24", chapter: "Psalm 118", text: "This is the day which the LORD hath made; we will rejoice and be glad in it." },
  { ref: "Galatians 6:9", chapter: "Galatians 6", text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not." },
  { ref: "Psalm 119:105", chapter: "Psalm 119", text: "Thy word is a lamp unto my feet, and a light unto my path." },
  { ref: "Romans 8:28", chapter: "Romans 8", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { ref: "Matthew 6:34", chapter: "Matthew 6", text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof." },
  { ref: "Hebrews 11:1", chapter: "Hebrews 11", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
  { ref: "Psalm 37:5", chapter: "Psalm 37", text: "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass." },
  { ref: "2 Timothy 1:7", chapter: "2 Timothy 1", text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." },
  { ref: "John 14:27", chapter: "John 14", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid." },
  { ref: "Micah 6:8", chapter: "Micah 6", text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?" },
  { ref: "Psalm 34:18", chapter: "Psalm 34", text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit." },
  { ref: "Matthew 5:16", chapter: "Matthew 5", text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven." },
  { ref: "1 Peter 5:7", chapter: "1 Peter 5", text: "Casting all your care upon him; for he careth for you." },
  { ref: "Philippians 4:6", chapter: "Philippians 4", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
  { ref: "James 1:5", chapter: "James 1", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him." },
  { ref: "Psalm 27:1", chapter: "Psalm 27", text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?" },
  { ref: "Isaiah 41:10", chapter: "Isaiah 41", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness." },
  { ref: "1 Thessalonians 5:16–18", chapter: "1 Thessalonians 5", text: "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you." },
  { ref: "Psalm 90:12", chapter: "Psalm 90", text: "So teach us to number our days, that we may apply our hearts unto wisdom." },
  { ref: "Proverbs 16:3", chapter: "Proverbs 16", text: "Commit thy works unto the LORD, and thy thoughts shall be established." },
  { ref: "Psalm 139:14", chapter: "Psalm 139", text: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well." },
  { ref: "John 8:12", chapter: "John 8", text: "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life." },
];

/** The same verse all day for everyone, moving to the next one each calendar day. */
export function verseFor(iso: string): Verse {
  const [y, m, d] = iso.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return VERSES[((dayNumber % VERSES.length) + VERSES.length) % VERSES.length];
}

export function chapterUrl(v: Verse): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(v.chapter)}&version=KJV`;
}
