/** Content for the "Build with GrowDaily" pages: services, the apps as a portfolio, and who we build for. */

import type { Interest } from "../../lib/build/idea";

export interface Service {
  name: string;
  interest: Interest;
  tagline: string;
  includes: string[];
  /** A page with more detail, when there is one. */
  href?: string;
}

/** Each service leads naturally to the next: learn, plan, build, look after it. */
export const SERVICES: Service[] = [
  {
    name: "Guided build",
    interest: "Build it with a guide",
    tagline: "You build your own app with Claude, with us beside you. You leave with a working tool and the know-how to build the next one.",
    includes: ["Working sessions, live or on Zoom", "A simple plan for a small first version", "Plain-English help when you get stuck"],
  },
  {
    name: "AI training",
    interest: "AI training",
    tagline: "A hands-on workshop so your team uses AI well and safely, starting the next morning.",
    includes: ["Live or on Zoom, for staff, boards or volunteers", "Practice on your own real tasks", "A simple AI policy you can adopt"],
    href: "/build/ai-training",
  },
  {
    name: "AI plan",
    interest: "AI plan",
    tagline: "We find the few places AI would save your team the most time, and say plainly where it wouldn't.",
    includes: ["Short interviews with your team", "Tool recommendations, often ones you already have", "A one-page plan with next steps"],
    href: "/build/ai-consulting",
  },
  {
    name: "Custom AI app",
    interest: "Build an app",
    tagline: "Rather not build it yourself? We build a small, focused app around how you work. You own it.",
    includes: ["A fixed quote before work starts", "A small first version to try with real people", "Guardrails written with you"],
  },
  {
    name: "Care plan",
    interest: "Care plan",
    tagline: "We keep your AI app running, up to date and improving, for a simple monthly fee.",
    includes: ["Hosting, monitoring and updates", "Small changes and improvements", "A monthly check-in"],
  },
];

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
    name: "Pilotwise",
    href: "/apps/pilotwise",
    color: "#f2b54b",
    problem: "Most AI pilots never reach production because the problem, data, success measures and path to production were never pinned down.",
    ai: "Turns one AI use case into a pilot-to-production plan: readiness score, go/no-go exit criteria, agile phases, ROAM risks and a sponsor brief.",
    forYou: "Hands-on help framing your AI use cases and running pilots to a clear go or no-go.",
  },
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
    name: "Roomwise",
    href: "/apps/roomwise",
    color: "#4fc7b8",
    problem: "Church calendars live in someone's head or a paper sheet, so rooms get double-booked and requests slip through.",
    ai: "Turns \"a room for 25 with a projector Tuesday evenings\" into a search across every room and every week, on a map of the building.",
    forYou: "Online room requests with approvals, reminders and calendar sync, built around your building and your people.",
  },
  {
    name: "Quotewise",
    href: "/apps/quotewise",
    color: "#8fb3ff",
    problem: "Owners lose evenings typing up quotes, and slow quotes lose jobs.",
    ai: "Turns a plain-English job description into itemized line items at the owner's own rate, ready to send and turn into an invoice.",
    forYou: "Quoting tools with your price list, online acceptance and payments, connected to your accounting software.",
  },
  {
    name: "Cafewise",
    href: "/apps/cafewise",
    color: "#d9965b",
    problem: "Cafés run out of oat milk on busy Saturdays and throw away pastries on slow Tuesdays, and few owners know what each drink really costs.",
    ai: "Turns quick stock counts into an order list and reviews four weeks of use and waste to suggest better par levels.",
    forYou: "Ordering, costing and stock tools for your business, connected to the systems you already use.",
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
  { title: "Bring your idea", text: "Tell us the job you want done on a free 20-minute call. We'll say honestly whether AI is a good fit, and if it isn't, we'll tell you." },
  { title: "Build it together", text: "We shape it into a small first version and guide you through building it with Claude, quoted up front. No hourly surprises." },
  { title: "Own it", text: "You try it with real people, improve it, and keep everything you made, plus the confidence to build the next one." },
];

export const PRINCIPLES = [
  { title: "Private by default", text: "Store only what's needed, and keep personal notes away from AI." },
  { title: "AI for one clear job", text: "Each app uses AI where it genuinely helps, and still works without it." },
  { title: "Guardrails first", text: "Clear limits on what the AI will and won't say, written with you." },
  { title: "A person stays in charge", text: "Anything important gets a human review, and the AI is tested on real examples before launch." },
];

export const BUILD_FAQS = [
  { q: "I'm not technical. Can I really build my own app?", a: "Yes. If you can describe the problem in plain words, you can build a small app with Claude. We guide you step by step: what to ask, how to check the work, and what to do when something breaks." },
  { q: "What's the difference between a guided build and a custom app?", a: "In a guided build, you build it with us beside you and learn as you go. With a custom app, we build it for you. Either way, you own the result." },
  { q: "What kinds of apps can I build?", a: "Small, focused web apps and website assistants: tools that answer questions in your voice, turn messy requests into next steps, recommend the right product or service, or give people a short personal summary. Every app in GrowDaily is an example you can try." },
  { q: "How much does it cost?", a: "Ask for a quote. Guided builds, training, AI plans, apps and care plans are each quoted after a free call, based on what you actually need. First versions of apps are deliberately small so they're affordable and quick to try." },
  { q: "Do you offer AI training for teams?", a: "Yes. Hands-on workshops, live or on Zoom, that teach your team to use AI tools well and safely on their own real work, plus a simple AI policy." },
  { q: "Can you look after an app once it's built?", a: "Yes. A care plan covers hosting, monitoring, updates, small changes and a monthly check-in, for a simple monthly fee." },
  { q: "Who owns the app?", a: "You do. We hand over the code and the accounts it runs on, so you're never locked in." },
  { q: "What does the AI cost to run?", a: "Usually a small monthly amount that depends on how many people use it. We design apps to keep it low, and we'll estimate it before you decide." },
  { q: "Will the AI say things we don't agree with?", a: "We write clear instructions and guardrails with you, test them with tricky questions, and design the app so people are pointed to a real person when it matters." },
  { q: "Do we need technical staff?", a: "No. In a guided build we teach you as you go, and the apps run in a web browser and on phones with nothing to install. If we build it for you, we handle the setup." },
];

export type AudienceSlug = "churches" | "businesses" | "nonprofits";

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
    slug: "businesses",
    label: "Businesses",
    short: "Customer assistants, quote and intake tools and internal helpers you can build yourself, with a guide.",
    title: "Build Your Own AI Apps for Your Business, With a Guide · GrowDaily",
    description: "Build your own AI apps for your business with Claude, with a guide: website assistants, quote and intake tools, product recommenders and internal helpers. Or have us build it. Either way, you own it.",
    h1: "Build the AI tools your business needs",
    intro: "You know where your business loses time: the same customer questions, slow quotes, messy intake. You don't need a developer to fix it. We'll guide you through building a focused AI app with Claude, around how your business actually works, and you own it.",
    ideas: [
      { title: "A website assistant that knows your business", text: "Answers customer questions from your own hours, services, policies and pricing, and hands off to you for anything else." },
      { title: "Quote and estimate builder", text: "Customers describe the job in their own words; the app asks follow-ups and drafts an estimate for you to approve." },
      { title: "Intake that sorts itself", text: "Messy emails and forms become organized requests with the next step, like Planwise does for a to-do list." },
      { title: "\"What's right for me?\" recommender", text: "Matches customers to the right product, menu item or service, like Mealwise matches meals to a fridge." },
    ],
    demos: ["Pilotwise", "Quotewise", "Roomwise"],
    faqs: [
      { q: "Can I really build this myself?", a: "Yes. We keep the first version small and guide you step by step, from the plan to what to ask Claude to how to check the work. If you'd rather not, we can build it for you." },
      { q: "Will it make things up about my business?", a: "You'll set it up to answer from information you give it, say when it doesn't know, and hand off to you. We'll show you how to test it with real customer questions before launch." },
      { q: "Do I need to change my website?", a: "No. The app can live on its own page or as a small box on your current site." },
      { q: "How long does it take?", a: "We agree on a small first version and a timeline on the free call, so you can build it, try it with real customers quickly and improve from there." },
      { q: "What does it cost to run each month?", a: "Usually a small amount based on use. We'll help you estimate it up front and design the app to keep it low." },
    ],
  },
  {
    slug: "nonprofits",
    label: "Nonprofits",
    short: "Volunteer, intake, referral and reporting helpers your team can build to get time back.",
    title: "Build AI Tools for Your Nonprofit, With a Guide · GrowDaily",
    description: "Build careful AI tools for your nonprofit with Claude, with a guide: volunteer and FAQ assistants, intake and referral helpers, donor thank-you drafts and report summaries. Private by default.",
    h1: "Build AI tools that give your nonprofit time back",
    intro: "Your team spends hours answering the same questions and writing the same updates. You can build careful AI tools that give that time back, and we'll guide you so the people you serve stay private and safe.",
    ideas: [
      { title: "Volunteer and FAQ assistant", text: "Answers \"When is the next shift? What do I bring?\" from your own information, any time of day." },
      { title: "Intake and referral helper", text: "Helps people describe what they need and points them to the right program or partner nearby, like Find a church does." },
      { title: "Donor thank-you drafts", text: "Drafts warm, specific thank-you notes from a gift and a few details, for your team to review and send." },
      { title: "Report and update summaries", text: "Turns program notes and numbers into a short, plain-English update for your board or donors." },
    ],
    demos: ["Find a church", "Moodwise", "Habitwise"],
    faqs: [
      { q: "How do we keep the people we serve private?", a: "We'll show you how to store only what's needed, keep sensitive notes away from AI, and set up access so only your team sees what they should." },
      { q: "Can it work for people who aren't comfortable with technology?", a: "Yes. The apps use plain words, work on any phone, and need no account to start." },
      { q: "Is it affordable on a nonprofit budget?", a: "First versions are deliberately small, our help is quoted up front after a free call, and running costs are designed to stay low." },
      { q: "What if the AI gets something wrong?", a: "We'll help you set it up so anything important is reviewed by a person before it goes out, and people can easily reach your team." },
    ],
  },
  {
    slug: "churches",
    label: "Churches & ministries",
    short: "Website assistants, newcomer welcome and care tools in your church's voice, built by your team with a guide.",
    title: "Build AI Tools for Your Church, With a Guide · GrowDaily",
    description: "Build careful AI tools for your church or ministry with Claude, with a guide: a faith questions assistant for your website, newcomer welcome, small-group and care tools, with guardrails in your church's voice.",
    h1: "Build AI tools for your church, with care",
    intro: "People with questions about faith often won't call the church office, but they will type a question at midnight. Your team can build simple, careful AI tools that answer in your church's voice, welcome newcomers and connect people to a real person when it matters, and we'll guide you every step.",
    ideas: [
      { title: "A \"Questions about faith?\" assistant", text: "On your website, answering honestly in your church's beliefs and tone, with passages to read and a gentle next step." },
      { title: "Plan-your-visit helper", text: "Answers \"What should I wear? Is there something for my kids?\" and helps a newcomer plan their first Sunday." },
      { title: "Sermon to small-group guide", text: "Turns this week's sermon notes into discussion questions and a short devotional for groups." },
      { title: "Care and prayer follow-up", text: "Sorts prayer requests and care needs so the right person follows up, with privacy built in." },
    ],
    demos: ["Roomwise", "Ask", "Find a church"],
    faqs: [
      { q: "Will an AI assistant say things that don't match our beliefs?", a: "You write its instructions from your statement of faith, with your pastors. We'll help you test it with hard questions and have it point people to your staff on anything pastoral or sensitive." },
      { q: "What happens if someone in crisis uses it?", a: "We'll help you build it to stop and show real help first, like the 988 Suicide & Crisis Lifeline and your church's contact, the same way GrowDaily's Ask does." },
      { q: "Can it be added to our existing website?", a: "Yes. It can live on its own page or as a small box on the site you already have." },
      { q: "Is it affordable for a small church?", a: "First versions are deliberately small, our help is quoted up front after a free call, and running costs are designed to stay low." },
    ],
  },
];

export const audienceBySlug = (slug: string) => AUDIENCES.find((a) => a.slug === slug);
export const caseByName = (name: string) => CASES.find((c) => c.name === name)!;

export interface ServicePage {
  slug: "ai-training" | "ai-consulting";
  interest: Interest;
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { title: string; text: string }[];
  forWho: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "ai-training",
    interest: "AI training",
    label: "AI training",
    title: "AI Training for Businesses & Nonprofits · GrowDaily",
    description: "Hands-on AI training for business and nonprofit teams of any size: practical workshops on using ChatGPT, Claude and other AI tools safely for everyday work, plus a simple AI policy. Live or on Zoom.",
    h1: "AI training for your team",
    intro: "Most teams have tried AI once or twice and aren't sure what's safe, what's useful, or where to start. Our workshops are practical and jargon-free: your team practices on their own real work and leaves confident, with habits they'll use the next morning and the start of tools they can build themselves.",
    sections: [
      { title: "AI basics, done right", text: "What AI tools are good at, where they make mistakes, and how to check their work." },
      { title: "Your real tasks", text: "Emails, meeting notes, planning, summaries, customer replies: practiced on examples from your own work." },
      { title: "Safe and private", text: "What's okay to paste into an AI tool and what isn't, with a simple policy your team can adopt." },
      { title: "Follow-up", text: "A short guide to keep, and an easy way to ask questions after the workshop." },
    ],
    forWho: ["Staff teams and departments", "Leadership and boards", "Volunteers", "Owners and small offices"],
    faqs: [
      { q: "Do people need any experience with AI?", a: "No. We start from the beginning and keep it practical, and people who already use AI still pick up new habits." },
      { q: "Which AI tools do you teach?", a: "Whichever your team has or would use, such as ChatGPT, Claude, Copilot or Gemini. The habits work across all of them." },
      { q: "Can it be done on Zoom?", a: "Yes. Workshops work live or on Zoom, and we can record it for people who can't attend." },
      { q: "How much does AI training cost?", a: "Ask for a quote. It depends on the length of the workshop and the size of your group." },
    ],
  },
  {
    slug: "ai-consulting",
    interest: "AI plan",
    label: "AI consulting",
    title: "AI Consulting for Businesses & Nonprofits · GrowDaily",
    description: "Practical AI consulting for businesses and nonprofits of any size: we help you find where AI would save your team the most time, choose tools you may already have, and leave with a clear one-page plan.",
    h1: "AI consulting that starts with your work, not the hype",
    intro: "You don't need an AI strategy deck. You need to know the few places AI would actually save your team time, which tools to use, and what to leave alone. We'll help you find them and leave you with a plain-English plan you can act on, with or without us.",
    sections: [
      { title: "Listen first", text: "Short conversations with the people doing the work, to find the repetitive, time-consuming tasks." },
      { title: "Pick the right tool", text: "Often it's a tool you already pay for, used better. Sometimes it's a small custom app. Sometimes it's not AI at all." },
      { title: "Weigh the risks", text: "Privacy, accuracy and what still needs a person, for each recommendation." },
      { title: "A one-page plan", text: "The top opportunities, what to do first, and what it would take, ready to act on with or without us." },
    ],
    forWho: ["Owners and directors", "Operations and admin teams", "Programs and services", "Anyone told to \"figure out AI\""],
    faqs: [
      { q: "Will you just try to sell us a custom app?", a: "No. Many recommendations use tools you already have. If a custom app would help, we'll say so, and you can build it yourself with our guidance, have us build it, or work with anyone else." },
      { q: "What do we get at the end?", a: "A short, plain-English plan: the top opportunities, which tools to use, the risks, and the first steps." },
      { q: "How much of our time does it take?", a: "A few short conversations with the right people. We do the rest." },
      { q: "How much does AI consulting cost?", a: "Ask for a quote. It depends on the size of your team and how many areas we look at." },
    ],
  },
];
