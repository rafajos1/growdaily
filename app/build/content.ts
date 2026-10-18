/** Content for the "Build with GrowDaily" pages: the apps as a portfolio, and who we build for. */

export interface CaseStudy {
  name: string;
  href: string;
  color: string;
  problem: string;
  ai: string;
  /** What an organization could build on the same idea. */
  forYou: string;
}

export const CASES: CaseStudy[] = [
  {
    name: "Spendwise",
    href: "/apps/spendwise",
    color: "#f2b54b",
    problem: "Budgets fail because people only look back at what they spent, when it's too late.",
    ai: "Projects where the month will end at today's pace and spots repeating subscriptions on its own.",
    forYou: "Dashboards that turn your numbers into a plain-English forecast.",
  },
  {
    name: "Habitwise",
    href: "/apps/habitwise",
    color: "#53cfa0",
    problem: "Habit trackers count streaks but never say why a habit keeps slipping.",
    ai: "A weekly review that reads the pattern (\"Thursdays are hard\") and suggests one small change.",
    forYou: "Programs and coaching tools that give each person a short, personal check-in.",
  },
  {
    name: "Planwise",
    href: "/apps/planwise",
    color: "#5cb8e6",
    problem: "A long to-do list doesn't tell you what to do first or what won't fit today.",
    ai: "Turns a messy brain dump into a realistic, time-blocked plan, most important work first.",
    forYou: "Intake tools that turn messy requests, notes or emails into organized next steps.",
  },
  {
    name: "Mealwise",
    href: "/apps/mealwise",
    color: "#ef7fa8",
    problem: "\"What's for dinner?\" with half a fridge of ingredients and no plan.",
    ai: "Suggests three meals from what you already have and writes the grocery list for the rest.",
    forYou: "Recommenders that match your products, menu or services to what a customer has and needs.",
  },
  {
    name: "Moodwise",
    href: "/apps/moodwise",
    color: "#b48cf2",
    problem: "People rarely notice what actually lifts or drains their week.",
    ai: "Finds patterns in daily check-ins, using only numbers and tags, never private notes.",
    forYou: "Private, careful check-in tools for care teams, groups and programs.",
  },
  {
    name: "Ask",
    href: "/faith/ask",
    color: "#f2b54b",
    problem: "Big questions about God feel awkward to ask a person, and search results are preachy or cluttered.",
    ai: "Answers in a warm, honest voice with real passages to read, and points people in crisis to real help.",
    forYou: "An assistant that answers questions in your organization's own voice and beliefs, with clear guardrails.",
  },
  {
    name: "Find a church",
    href: "/faith/church",
    color: "#5cb8e6",
    problem: "Finding a church nearby, and knowing what to expect on a first visit, takes too much digging.",
    ai: "Searches open map data around any town and pairs results with a plain first-visit guide.",
    forYou: "Locators and directories for your locations, partners or services.",
  },
];

export const PROCESS = [
  { title: "A free 20-minute call", text: "Tell us what you wish an app did. We'll say honestly whether AI is a good fit, and if it isn't, we'll tell you." },
  { title: "A fixed quote and a small first version", text: "We agree on one job the app does well and a fixed price before any work starts. No hourly surprises." },
  { title: "Launch, learn, improve", text: "You try it with real people, we improve it together, and you own what we build." },
];

export const PRINCIPLES = [
  { title: "Private by default", text: "Store only what's needed, and keep personal notes away from AI." },
  { title: "AI for one clear job", text: "Each app uses AI where it genuinely helps, and still works without it." },
  { title: "Guardrails first", text: "Clear limits on what the AI will and won't say, written with you." },
  { title: "Plain words", text: "Built for real people on their phones, not for a demo." },
];

export const BUILD_FAQS = [
  { q: "What kinds of AI apps do you build?", a: "Small, focused web apps and website assistants: tools that answer questions in your voice, turn messy requests into next steps, recommend the right product or service, or give people a short personal summary. Every app in GrowDaily is an example you can try." },
  { q: "How much does a custom AI app cost?", a: "Every project gets a fixed price after a free call, based on what the first version needs to do. We keep first versions deliberately small so they're affordable and quick to try." },
  { q: "Who owns the app?", a: "You do. We hand over the code and the accounts it runs on, so you're never locked in." },
  { q: "What does the AI cost to run?", a: "Usually a small monthly amount that depends on how many people use it. We design apps to keep it low, and we'll estimate it before you decide." },
  { q: "Will the AI say things we don't agree with?", a: "We write clear instructions and guardrails with you, test them with tricky questions, and design the app so people are pointed to a real person when it matters." },
  { q: "Do we need technical staff?", a: "No. The apps run in a web browser and on phones with nothing to install, and we handle the setup." },
];

export type AudienceSlug = "churches" | "small-business" | "nonprofits";

export interface Audience {
  slug: AudienceSlug;
  label: string;
  short: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  ideas: { title: string; text: string }[];
  demos: string[];
  faqs: { q: string; a: string }[];
}

export const AUDIENCES: Audience[] = [
  {
    slug: "churches",
    label: "Churches & ministries",
    short: "Website assistants, newcomer welcome and care tools that sound like your church.",
    title: "AI Chatbot & App Development for Churches · GrowDaily",
    description: "Custom AI tools for churches and ministries: a faith questions assistant for your website, newcomer welcome, small-group and care tools. Built with guardrails, in your church's voice.",
    h1: "AI tools for your church, built with care",
    intro: "People with questions about faith often won't call the church office, but they will type a question at midnight. We build simple, careful AI tools that answer in your church's voice, welcome newcomers, and connect people to a real person when it matters.",
    ideas: [
      { title: "A \"Questions about faith?\" assistant", text: "On your website, answering honestly in your church's beliefs and tone, with passages to read and a gentle next step." },
      { title: "Plan-your-visit helper", text: "Answers \"What should I wear? Is there something for my kids?\" and helps a newcomer plan their first Sunday." },
      { title: "Sermon to small-group guide", text: "Turns this week's sermon notes into discussion questions and a short devotional for groups." },
      { title: "Care and prayer follow-up", text: "Sorts prayer requests and care needs so the right person follows up, with privacy built in." },
    ],
    demos: ["Ask", "Find a church", "Habitwise"],
    faqs: [
      { q: "Will an AI assistant say things that don't match our beliefs?", a: "We write its instructions from your statement of faith and with your pastors, test it with hard questions, and have it point people to your staff on anything pastoral or sensitive." },
      { q: "What happens if someone in crisis uses it?", a: "It stops and shows real help first, like the 988 Suicide & Crisis Lifeline and your church's contact, the same way GrowDaily's Ask does." },
      { q: "Can it be added to our existing website?", a: "Yes. It can live on its own page or as a small box on the site you already have." },
      { q: "Is it affordable for a small church?", a: "First versions are deliberately small, with a fixed price agreed after a free call, and running costs designed to stay low." },
    ],
  },
  {
    slug: "small-business",
    label: "Small businesses",
    short: "Customer assistants, quote and intake tools, and recommenders built around your business.",
    title: "Custom AI App Development for Small Businesses · GrowDaily",
    description: "Custom AI apps for small businesses: a website assistant that answers customer questions, quote and intake tools, product recommenders and internal helpers. Fixed price, you own it.",
    h1: "Custom AI apps for small businesses",
    intro: "You don't need a big AI project. You need one tool that saves time every week or helps customers decide faster. We build small, focused AI apps around how your business actually works, and you own them.",
    ideas: [
      { title: "A website assistant that knows your business", text: "Answers customer questions from your own hours, services, policies and pricing, and hands off to you for anything else." },
      { title: "Quote and estimate builder", text: "Customers describe the job in their own words; the app asks follow-ups and drafts an estimate for you to approve." },
      { title: "Intake that sorts itself", text: "Messy emails and forms become organized requests with the next step, like Planwise does for a to-do list." },
      { title: "\"What's right for me?\" recommender", text: "Matches customers to the right product, menu item or service, like Mealwise matches meals to a fridge." },
    ],
    demos: ["Planwise", "Mealwise", "Spendwise"],
    faqs: [
      { q: "Will it make things up about my business?", a: "It answers from information you give it, says when it doesn't know, and hands off to you. We test it with real customer questions before launch." },
      { q: "Do I need to change my website?", a: "No. The app can live on its own page or as a small box on your current site." },
      { q: "How long does it take?", a: "We agree on a small first version and a timeline on the free call, so you can try it with real customers quickly and improve from there." },
      { q: "What does it cost to run each month?", a: "Usually a small amount based on use. We estimate it up front and design the app to keep it low." },
    ],
  },
  {
    slug: "nonprofits",
    label: "Nonprofits",
    short: "Volunteer, intake, referral and reporting helpers for small teams.",
    title: "AI Tools & App Development for Nonprofits · GrowDaily",
    description: "Custom AI tools for nonprofits: volunteer and FAQ assistants, intake and referral helpers, donor thank-you drafts and report summaries. Private by default, fixed price.",
    h1: "AI tools for nonprofits with small teams",
    intro: "Small teams spend hours answering the same questions and writing the same updates. We build careful AI tools that give that time back, while keeping the people you serve private and safe.",
    ideas: [
      { title: "Volunteer and FAQ assistant", text: "Answers \"When is the next shift? What do I bring?\" from your own information, any time of day." },
      { title: "Intake and referral helper", text: "Helps people describe what they need and points them to the right program or partner nearby, like Find a church does." },
      { title: "Donor thank-you drafts", text: "Drafts warm, specific thank-you notes from a gift and a few details, for your team to review and send." },
      { title: "Report and update summaries", text: "Turns program notes and numbers into a short, plain-English update for your board or donors." },
    ],
    demos: ["Find a church", "Moodwise", "Habitwise"],
    faqs: [
      { q: "How do you keep the people we serve private?", a: "We store only what's needed, keep sensitive notes away from AI, and design access so only your team sees what they should." },
      { q: "Can it work for people who aren't comfortable with technology?", a: "Yes. The apps use plain words, work on any phone, and need no account to start." },
      { q: "Is it affordable on a nonprofit budget?", a: "First versions are deliberately small, with a fixed price after a free call, and running costs designed to stay low." },
      { q: "What if the AI gets something wrong?", a: "Anything important is reviewed by a person before it goes out, and the app makes it easy to reach your team." },
    ],
  },
];

export const audienceBySlug = (slug: string) => AUDIENCES.find((a) => a.slug === slug);
export const caseByName = (name: string) => CASES.find((c) => c.name === name)!;
