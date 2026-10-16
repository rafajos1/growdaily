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

export interface Encouragement {
  /** The passage it's drawn from, e.g. "Isaiah 40:31". */
  ref: string;
  /** Book and chapter for the "read it" link. */
  chapter: string;
  text: string;
}

/**
 * Everyday encouragements drawn from the Bible, written the way a friend would
 * say them rather than quoted. Each names the passage it comes from so people
 * can read the original for themselves.
 */
export const ENCOURAGEMENTS: Encouragement[] = [
  { ref: "Psalm 46:10", chapter: "Psalm 46", text: "You don't have to have it all figured out today. Take a breath and be still for a minute. God's got this, even when you don't." },
  { ref: "Proverbs 3:5–6", chapter: "Proverbs 3", text: "When things don't make sense, you don't have to lean on your own read of it. Trust God with it, bring him into your choices, and he'll help straighten out the path." },
  { ref: "Philippians 4:13", chapter: "Philippians 4", text: "Whatever today throws at you, you're not doing it on your own strength. Christ is in it with you." },
  { ref: "Isaiah 40:31", chapter: "Isaiah 40", text: "Running on empty? People who lean on God get their strength renewed. You can keep going without burning out." },
  { ref: "Matthew 11:28", chapter: "Matthew 11", text: "Tired and carrying a lot? Jesus says come to him, just as you are, and he'll give you rest." },
  { ref: "Lamentations 3:22–23", chapter: "Lamentations 3", text: "Yesterday doesn't get the last word. God's mercy shows up new every morning, and that includes this one." },
  { ref: "Joshua 1:9", chapter: "Joshua 1", text: "Be brave today. Don't let fear or discouragement run the show. God goes with you wherever you go." },
  { ref: "Psalm 23:1", chapter: "Psalm 23", text: "God looks after you like a good shepherd looks after his sheep. With him, you have what you really need." },
  { ref: "John 3:16", chapter: "John 3", text: "Just so you know: God loves you. He loves the whole world so much that he gave his Son, so anyone who trusts him can have life that never ends." },
  { ref: "Psalm 118:24", chapter: "Psalm 118", text: "Today is a gift from God. Find one thing in it to enjoy." },
  { ref: "Galatians 6:9", chapter: "Galatians 6", text: "Don't give up on doing good, even when it feels like nothing's changing. It pays off in time if you keep at it." },
  { ref: "Psalm 119:105", chapter: "Psalm 119", text: "Not sure of your next step? God's word is like a light on a dark path. Usually it's just enough for the next step, and that's okay." },
  { ref: "Romans 8:28", chapter: "Romans 8", text: "Even the messy parts of your story aren't wasted. God can work all of it together for good for the people who love him." },
  { ref: "Matthew 6:34", chapter: "Matthew 6", text: "Tomorrow can worry about itself. Today has enough on its plate. Just take today." },
  { ref: "Hebrews 11:1", chapter: "Hebrews 11", text: "Faith is being sure of what you hope for, even before you can see it. It's okay to keep hoping." },
  { ref: "Psalm 37:5", chapter: "Psalm 37", text: "Hand your plans over to God and trust him with them. He'll help you see them through." },
  { ref: "2 Timothy 1:7", chapter: "2 Timothy 1", text: "That fear you're feeling didn't come from God. What he gives is power, love and a clear mind." },
  { ref: "John 14:27", chapter: "John 14", text: "Jesus offers a kind of peace the world can't give. You don't have to let your heart be troubled or afraid today." },
  { ref: "Micah 6:8", chapter: "Micah 6", text: "God isn't asking for complicated. Do what's right, love mercy, and walk humbly with him." },
  { ref: "Psalm 34:18", chapter: "Psalm 34", text: "If your heart is broken right now, God isn't far away. He's especially close to people who are hurting." },
  { ref: "Matthew 5:16", chapter: "Matthew 5", text: "Let your light shine today. The good you do can point people to God." },
  { ref: "1 Peter 5:7", chapter: "1 Peter 5", text: "Whatever's weighing on you, give it to God. He really does care about you." },
  { ref: "Philippians 4:6", chapter: "Philippians 4", text: "Instead of stewing on it, talk to God about it. Tell him what you need, and thank him for what he's already done." },
  { ref: "James 1:5", chapter: "James 1", text: "Need wisdom for a decision? Ask God. He gives it generously, and he won't make you feel silly for asking." },
  { ref: "Psalm 27:1", chapter: "Psalm 27", text: "With God as your light and your strength, there's no one you need to be afraid of." },
  { ref: "Isaiah 41:10", chapter: "Isaiah 41", text: "You don't have to be afraid. God is with you. He'll give you strength, help you, and hold you up." },
  { ref: "1 Thessalonians 5:16–18", chapter: "1 Thessalonians 5", text: "Find something to be glad about, keep talking with God through the day, and say thanks for something, even in the hard stuff." },
  { ref: "Psalm 90:12", chapter: "Psalm 90", text: "Your days matter. Ask God to help you spend them wisely." },
  { ref: "Proverbs 16:3", chapter: "Proverbs 16", text: "Bring your work to God today. Put it in his hands, and he'll help your plans come together." },
  { ref: "Psalm 139:14", chapter: "Psalm 139", text: "You were made with care, wonderfully made in fact. That includes the version of you showing up today." },
  { ref: "John 8:12", chapter: "John 8", text: "Jesus called himself the light of the world. Follow him, and you won't have to walk around in the dark." },
];

/** The same encouragement all day for everyone, moving to the next one each calendar day. */
export function encouragementFor(iso: string): Encouragement {
  const [y, m, d] = iso.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  return ENCOURAGEMENTS[((dayNumber % ENCOURAGEMENTS.length) + ENCOURAGEMENTS.length) % ENCOURAGEMENTS.length];
}

/** The chapter in the New Living Translation, which reads easily for newcomers. */
export function passageUrl(e: Encouragement): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(e.chapter)}&version=NLT`;
}
