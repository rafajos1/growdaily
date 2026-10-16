import { parseRef, type Passage } from "./bible";

export interface AskPassage extends Passage {
  /** Why this passage is worth reading, in a sentence. */
  why: string;
}

export interface AskAnswer {
  question: string;
  /** Plain paragraphs separated by blank lines. */
  answer: string;
  /** Where Christians honestly differ on this, or "" when it isn't relevant. */
  differ: string;
  passages: AskPassage[];
  nextStep: string;
  followUps: string[];
  source: "ai" | "starter";
}

export const MAX_QUESTION = 500;

export const ASK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "differ", "passages", "nextStep", "followUps"],
  properties: {
    answer: { type: "string" },
    differ: { type: "string" },
    passages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["ref", "why"],
        properties: { ref: { type: "string" }, why: { type: "string" } },
      },
    },
    nextStep: { type: "string" },
    followUps: { type: "array", items: { type: "string" } },
  },
} as const;

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

/**
 * Makes an AI answer safe to show: trims lengths, keeps at most three passages
 * and drops any reference to a book or chapter that doesn't exist.
 */
export function normalizeAnswer(raw: unknown, question: string): AskAnswer | null {
  const r = (raw ?? {}) as Record<string, unknown>;
  const answer = clean(r.answer, 2400);
  if (!answer) return null;
  const passages: AskPassage[] = [];
  for (const p of Array.isArray(r.passages) ? r.passages : []) {
    const parsed = parseRef(clean((p as { ref?: unknown })?.ref, 60));
    if (parsed && !passages.some((x) => x.ref === parsed.ref)) passages.push({ ...parsed, why: clean((p as { why?: unknown })?.why, 200) });
    if (passages.length === 3) break;
  }
  return {
    question,
    answer,
    differ: clean(r.differ, 600),
    passages,
    nextStep: clean(r.nextStep, 300),
    followUps: (Array.isArray(r.followUps) ? r.followUps : []).map((f) => clean(f, 120)).filter(Boolean).slice(0, 3),
    source: "ai",
  };
}

/** Signs someone may be in danger, so the page leads with real help. */
export function needsCrisisHelp(question: string): boolean {
  return /\b(suicid\w*|kill (my ?self|myself)|end (my|it all)|end my life|want(ed)? to die|don'?t want to (live|be here)|self[- ]?harm|hurt(ing)? myself|cutting myself)\b/i.test(question);
}

const starter = (question: string, answer: string, passages: [string, string][], nextStep: string, followUps: string[], differ = ""): AskAnswer => ({
  question,
  answer,
  differ,
  passages: passages.map(([ref, why]) => ({ ...parseRef(ref)!, why })),
  nextStep,
  followUps,
  source: "starter",
});

/** Questions people often start with, answered ahead of time so they work without AI. */
export const STARTERS: AskAnswer[] = [
  starter(
    "Is God real?",
    "Honestly, nobody can prove or disprove God the way you'd solve a math problem. But Christians don't think faith means believing without reasons.\n\nPeople point to a few things: that anything exists at all, the order and beauty of the universe, the sense of right and wrong almost everyone shares, and most of all Jesus, a real person in history whose life, death and reported resurrection changed the world.\n\nFaith is trusting, for good reasons, what you can't fully see yet. And doubt is welcome. Plenty of people in the Bible wrestled with God out loud.",
    [
      ["Romans 1:20", "The idea that creation itself points to God."],
      ["Psalm 19:1", "A poem about the sky telling of God's glory."],
      ["John 20:24–29", "Thomas doubted, and Jesus met him right there."],
    ],
    "Read the Gospel of John, one short chapter a day, and try an honest prayer: \"God, if you're real, show me.\"",
    ["Who was Jesus, really?", "Is the Bible reliable?", "How do I pray?"],
  ),
  starter(
    "Why does God allow suffering?",
    "This is one of the hardest questions there is, and Christians don't have a neat answer. Anyone who says it's simple probably hasn't suffered much.\n\nA few things Christians hold onto. The Bible never pretends suffering is fine; whole books are people crying out to God. God gave people real freedom, and a lot of pain comes from how we use it. The world itself is broken in ways that hurt us.\n\nMost of all, Christians believe God isn't watching from a distance. In Jesus, he stepped into suffering himself, and he promises a day when every tear is wiped away.",
    [
      ["Psalm 13", "A short, honest prayer that asks God, How long?"],
      ["John 11:35", "Jesus wept at his friend's grave."],
      ["Revelation 21:4", "The promise of a world with no more tears or pain."],
    ],
    "It's okay to tell God exactly how you feel, even if you're angry. Psalm 13 is a good place to start.",
    ["Does God care about my anxiety?", "What happens when we die?", "How do I pray?"],
  ),
  starter(
    "Who was Jesus, really?",
    "Jesus was a Jewish teacher from Nazareth in the first century. Most historians, Christian or not, agree he really lived and was crucified under the Roman governor Pontius Pilate.\n\nChristians believe he was more than a great teacher: God become human, showing us what God is really like. He welcomed outsiders, healed people, told stories that turned expectations upside down, and died on a cross. His followers said they saw him alive again three days later, and that changed everything for them.",
    [
      ["John 1:14", "God taking on human life and living among us."],
      ["Mark 10:45", "Jesus on why he came: to serve and give his life."],
      ["1 Corinthians 15:3–8", "One of the earliest written accounts of people who saw him alive."],
    ],
    "Read the Gospel of Mark. It's the shortest of the four, and you can finish it in an evening or two.",
    ["Can I be forgiven for anything?", "Is the Bible reliable?", "What happens when we die?"],
  ),
  starter(
    "Can I be forgiven for anything?",
    "Yes. That's at the very heart of the Christian message: no one is too far gone.\n\nForgiveness isn't something you earn by being good enough. It's a gift. Jesus kept forgiving people everyone else had written off, including a criminal dying next to him on a cross.\n\nForgiveness doesn't always erase consequences, and you may still want to make things right with someone. But guilt and shame don't get the last word.",
    [
      ["1 John 1:9", "A promise that when we're honest with God, he forgives."],
      ["Luke 23:39–43", "Jesus and the man dying beside him."],
      ["Psalm 103:12", "How far God removes our wrongs from us."],
    ],
    "Tell God honestly what's weighing on you. If it's heavy, a pastor can be a safe person to talk it through with.",
    ["How do I pray?", "Who was Jesus, really?", "Does God care about my anxiety?"],
  ),
  starter(
    "What happens when we die?",
    "Christians believe death isn't the end. The whole hope rests on Jesus rising from the dead: if he did, death has lost its final say.\n\nThe Bible describes being with God after we die, and a future where God renews the whole world and raises his people to new, physical life. It's less about floating on clouds and more about everything finally being made right.",
    [
      ["John 11:25–26", "Jesus: I am the resurrection and the life."],
      ["John 14:2–3", "Jesus on preparing a place for us."],
      ["1 Thessalonians 4:13–14", "Grieving, but with hope."],
    ],
    "If you're asking because you've lost someone, be gentle with yourself. Grief and hope can live side by side.",
    ["Why does God allow suffering?", "Can I be forgiven for anything?", "Is God real?"],
    "Christians differ on some details, like exactly what happens right after death and what hell is like. They agree on the core: life with God through Jesus.",
  ),
  starter(
    "How do I pray?",
    "Prayer is simply talking with God. There are no special words, and you don't need to sound religious. Be honest, the way you'd talk to someone who already knows you and loves you.\n\nJesus gave his friends a simple pattern, now called the Lord's Prayer: honor God, ask for what you need today, ask for forgiveness and help to forgive, and ask for help when things get hard. Silence is fine too.",
    [
      ["Matthew 6:9–13", "The prayer Jesus taught his friends."],
      ["Philippians 4:6", "Bringing everything to God, not just the big stuff."],
      ["Romans 8:26", "Help when you don't know what to say."],
    ],
    "Tonight, try two minutes: thank God for one thing, tell him one worry, and ask him for one thing.",
    ["Does God care about my anxiety?", "Is God real?", "Can I be forgiven for anything?"],
  ),
  starter(
    "Does God care about my anxiety?",
    "Yes. The Bible is full of anxious, worried people, and God never shames them for it. He invites you to bring your worries to him, again and again if you need to.\n\nThe peace he offers isn't always the problem disappearing. It's being held steady in the middle of it.\n\nAnd getting help from a doctor or counselor isn't a lack of faith. God often cares for us through other people.",
    [
      ["1 Peter 5:7", "Give your worries to God, because he cares for you."],
      ["Philippians 4:6–7", "Prayer and a peace that's hard to explain."],
      ["Matthew 6:25–34", "Jesus on worry, birds and flowers."],
    ],
    "Name one worry and tell God about it right now. If anxiety feels overwhelming, please reach out to someone you trust or a professional.",
    ["How do I pray?", "Why does God allow suffering?", "Who was Jesus, really?"],
  ),
  starter(
    "Is the Bible reliable?",
    "The Bible is a library of 66 books written by many people over roughly 1,500 years: history, poetry, letters, wisdom and more. Part of reading it well is reading each part as what it is.\n\nIt's also one of the best-preserved ancient texts we have, with thousands of early manuscript copies. Historians and archaeologists keep finding people and places it mentions. And the writers often included details that make their heroes look bad, which isn't what you'd do if you were making things up.",
    [
      ["Luke 1:1–4", "Luke explains how he carefully investigated before writing."],
      ["2 Peter 1:16", "Not clever stories, but eyewitness accounts."],
      ["2 Timothy 3:16", "Why Christians call Scripture God-breathed."],
    ],
    "Read it for yourself. Start with Mark or John, and notice what surprises you.",
    ["Who was Jesus, really?", "Is God real?", "What happens when we die?"],
    "Christians read some parts differently, for example how literally to take the early chapters of Genesis. They share trust in the Bible's central story about God and Jesus.",
  ),
];

export function starterFor(question: string): AskAnswer | undefined {
  const q = question.trim().toLowerCase().replace(/[?!.\s]+$/, "");
  return STARTERS.find((s) => s.question.toLowerCase().replace(/\?$/, "") === q);
}
