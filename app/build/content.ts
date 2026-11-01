/** Content for the "Build with GrowDaily" pages: services, the apps as a portfolio, and who we build for. */

import type { Interest } from "../../lib/build/idea";

export interface Service {
  name: string;
  interest: Interest;
  tagline: string;
  includes: string[];
  /** A page with more detail, when there is one. */
  href?: string;
  /** Shown full width, first: the main offer. */
  featured?: boolean;
}

/** Each service leads naturally to the next: learn, plan, build, look after it. */
export const SERVICES: Service[] = [
  {
    name: "AI governance",
    interest: "AI governance",
    tagline: "Know which AI tools your people use, set clear rules, and show your leadership you're in control, without slowing your team down.",
    includes: ["An AI register of every tool in use, each rated with reasons", "A tailored AI policy and a short team training", "A one-page leadership or board briefing"],
    href: "/build/ai-governance",
    featured: true,
  },
  {
    name: "Guided build",
    interest: "Guided build",
    tagline: "Build your own AI tool with Claude, with Rafael guiding you from idea to something that works. No coding experience needed.",
    includes: ["A free 20-minute first call to shape the idea", "Paid working sessions, priced up front", "You own the tool and understand how it works"],
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
    tagline: "A small, focused app or website assistant built around how you work. You own it.",
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
    name: "Church library assistant",
    href: "/demo/church-assistant",
    color: "#4fc7b8",
    problem: "Pastors want to offer AI to their church, but only if it teaches what their church teaches.",
    ai: "Answers only from one church's sermons, beliefs and information, quotes its source every time, and declines what its library doesn't cover.",
    forYou: "A website or member assistant built on your own content, with your pastors deciding what goes in.",
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
  { title: "A free 20-minute call", text: "Tell us what you need. We'll say honestly whether AI is a good fit, and if it isn't, we'll tell you." },
  { title: "A clear quote", text: "Every service is quoted up front for what you actually need. No hourly surprises." },
  { title: "Launch, learn, improve", text: "You try it with real people, we improve it together, and you own what we build." },
];

export const PRINCIPLES = [
  { title: "Your data first", text: "AI is only as good as your data. We look at what you have first, and tell you honestly if it isn't ready yet." },
  { title: "Private by default", text: "Store only what's needed, and keep personal notes away from AI." },
  { title: "AI for one clear job", text: "Each app uses AI where it genuinely helps, and still works without it." },
  { title: "Guardrails first", text: "Clear limits on what the AI will and won't say, written with you." },
  { title: "Plain words", text: "Built for real people on their phones, not for a demo." },
];

export const BUILD_FAQS = [
  { q: "What kinds of AI apps do you build?", a: "Small, focused web apps and website assistants: tools that answer questions in your voice, turn messy requests into next steps, recommend the right product or service, or give people a short personal summary. Every app in GrowDaily is an example you can try." },
  { q: "How much does it cost?", a: "The first 20-minute call is free. After that, guided build sessions, training, AI plans, apps and care plans are billed, with the price agreed up front based on what you actually need. First versions of apps are deliberately small so they're affordable and quick to try." },
  { q: "Do you offer AI training for teams?", a: "Yes. Hands-on workshops, live or on Zoom, that teach your team to use AI tools well and safely on their own real work, plus a simple AI policy." },
  { q: "Can you look after an app once it's built?", a: "Yes. A care plan covers hosting, monitoring, updates, small changes and a monthly check-in, for a simple monthly fee." },
  { q: "Who owns the app?", a: "You do. We hand over the code and the accounts it runs on, so you're never locked in." },
  { q: "What does the AI cost to run?", a: "Usually a small monthly amount that depends on how many people use it. We design apps to keep it low, and we'll estimate it before you decide." },
  { q: "Will the AI say things we don't agree with?", a: "We write clear instructions and guardrails with you, test them with tricky questions, and design the app so people are pointed to a real person when it matters." },
  { q: "Do we need technical staff?", a: "No. The apps run in a web browser and on phones with nothing to install, and we handle the setup." },
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
  /** A ready-made offering shown right under the hero. */
  feature?: { eyebrow: string; title: string; text: string; href: string; label: string };
  demos: string[];
  faqs: { q: string; a: string }[];
}

export const AUDIENCES: Audience[] = [
  {
    slug: "businesses",
    label: "Businesses",
    short: "Know which AI tools your team uses, set clear rules and train your people, then build the tools that help.",
    title: "AI Governance for Businesses: AI Policy & Training · GrowDaily",
    description: "AI governance for businesses of any size: find the AI tools your team uses, rate each one, adopt a tailored AI policy and train your people. Plus custom AI tools when you're ready.",
    h1: "AI governance for your business",
    intro: "Your team is already using AI, often on free personal accounts, with customer and company information. We help you see which tools are in use, set clear rules and train your people, so AI saves time without putting your customers or your business at risk. When you're ready to build, we do that too.",
    ideas: [
      { title: "A website assistant that knows your business", text: "Answers customer questions from your own hours, services, policies and pricing, and hands off to you for anything else." },
      { title: "Quote and estimate builder", text: "Customers describe the job in their own words; the app asks follow-ups and drafts an estimate for you to approve." },
      { title: "Intake that sorts itself", text: "Messy emails and forms become organized requests with the next step, like Planwise does for a to-do list." },
      { title: "\"What's right for me?\" recommender", text: "Matches customers to the right product, menu item or service, like Mealwise matches meals to a fridge." },
    ],
    demos: ["Pilotwise", "Quotewise", "Roomwise"],
    faqs: [
      { q: "Where should a business start with AI?", a: "With what your team already uses. A quick AI register, a short policy and an hour of training remove most of the risk and help people use AI confidently. Our free AI governance kit gets you started in about 15 minutes." },
      { q: "Will it make things up about my business?", a: "It answers from information you give it, says when it doesn't know, and hands off to you. We test it with real customer questions before launch." },
      { q: "Do I need to change my website?", a: "No. The app can live on its own page or as a small box on your current site." },
      { q: "How long does it take?", a: "We agree on a small first version and a timeline on the free call, so you can try it with real customers quickly and improve from there." },
      { q: "What does it cost to run each month?", a: "Usually a small amount based on use. We estimate it up front and design the app to keep it low." },
    ],
  },
  {
    slug: "nonprofits",
    label: "Nonprofits",
    short: "Protect donor, client and volunteer information with clear AI rules, team training and a board briefing.",
    title: "AI Governance for Nonprofits: AI Policy & Training · GrowDaily",
    description: "AI governance for nonprofits: find the AI tools staff and volunteers use, adopt a clear AI policy, train your team and brief your board. Plus careful AI tools that give time back.",
    h1: "AI governance for nonprofits",
    intro: "Your team holds information people trust you with: donor, client and volunteer records. We help you see which AI tools staff and volunteers use, set clear rules, train your team and brief your board, so AI gives time back without putting the people you serve at risk.",
    ideas: [
      { title: "Volunteer and FAQ assistant", text: "Answers \"When is the next shift? What do I bring?\" from your own information, any time of day." },
      { title: "Intake and referral helper", text: "Helps people describe what they need and points them to the right program or partner nearby, like Find a church does." },
      { title: "Donor thank-you drafts", text: "Drafts warm, specific thank-you notes from a gift and a few details, for your team to review and send." },
      { title: "Report and update summaries", text: "Turns program notes and numbers into a short, plain-English update for your board or donors." },
    ],
    demos: ["Find a church", "Moodwise", "Habitwise"],
    faqs: [
      { q: "Where should a nonprofit start with AI?", a: "With a list of the AI tools staff and volunteers already use, a short AI policy that protects donor and client information, and a one-page briefing for your board. Our free AI governance kit gets you started in about 15 minutes." },
      { q: "How do you keep the people we serve private?", a: "We store only what's needed, keep sensitive notes away from AI, and design access so only your team sees what they should." },
      { q: "Can it work for people who aren't comfortable with technology?", a: "Yes. The apps use plain words, work on any phone, and need no account to start." },
      { q: "Is it affordable on a nonprofit budget?", a: "First versions are deliberately small, with a fixed price after a free call, and running costs designed to stay low." },
      { q: "What if the AI gets something wrong?", a: "Anything important is reviewed by a person before it goes out, and the app makes it easy to reach your team." },
    ],
  },
  {
    slug: "churches",
    label: "Churches & ministries",
    short: "A clear church AI policy, trained staff and volunteers, and AI tools that speak only from your teaching.",
    title: "AI Governance & AI Policy for Churches · GrowDaily",
    description: "AI governance for churches and ministries: find the AI tools staff and volunteers use, adopt a clear church AI policy and train your team. Plus an AI assistant that answers only from your teaching.",
    h1: "AI governance for your church",
    intro: "Churches hold some of the most sensitive information there is: pastoral care notes, prayer requests and giving records. We help you see which AI tools staff and volunteers use, adopt a clear church AI policy and train your team, so AI serves your people without putting their trust at risk.",
    ideas: [
      { title: "A church AI assistant", text: "Answers questions only from your sermons, statement of faith and church information, with a source for every answer. Your pastors decide what goes in." },
      { title: "Plan-your-visit helper", text: "Answers \"What should I wear? Is there something for my kids?\" and helps a newcomer plan their first Sunday." },
      { title: "Sermon to small-group guide", text: "Turns this week's sermon notes into discussion questions and a short devotional for groups." },
      { title: "Care and prayer follow-up", text: "Sorts prayer requests and care needs so the right person follows up, with privacy built in." },
    ],
    feature: {
      eyebrow: "New for churches",
      title: "A church AI assistant that speaks only from your teaching",
      text: "It answers from your own sermons, statement of faith and church information, quotes its source every time, and hands everything else to a real person. Built by a former pastor of 14 years.",
      href: "/build/church-ai-assistant",
      label: "See how it works",
    },
    demos: ["Church library assistant", "Roomwise", "Ask"],
    faqs: [
      { q: "Where should a church start with AI?", a: "With a clear church AI policy: which tools are approved, and a firm line that pastoral care notes, prayer requests and giving records stay out of AI tools unless approved. Our free AI governance kit and church AI policy template help you start." },
      { q: "Will an AI assistant say things that don't match our beliefs?", a: "We write its instructions from your statement of faith and with your pastors, test it with hard questions, and have it point people to your staff on anything pastoral or sensitive." },
      { q: "What happens if someone in crisis uses it?", a: "It stops and shows real help first, like the 988 Suicide & Crisis Lifeline and your church's contact, the same way GrowDaily's Ask does." },
      { q: "Can it be added to our existing website?", a: "Yes. It can live on its own page or as a small box on the site you already have." },
      { q: "Is it affordable for a small church?", a: "First versions are deliberately small, with a fixed price agreed after a free call, and running costs designed to stay low." },
    ],
  },
];

export const audienceBySlug = (slug: string) => AUDIENCES.find((a) => a.slug === slug);
export const caseByName = (name: string) => CASES.find((c) => c.name === name)!;

export interface ServicePage {
  slug: "ai-governance" | "ai-training" | "ai-consulting";
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
    slug: "ai-governance",
    interest: "AI governance",
    label: "AI governance",
    title: "AI Governance Consulting for Businesses & Nonprofits · GrowDaily",
    description: "Practical AI governance for businesses and nonprofits of any size: an AI register of the tools your people use, a tailored AI policy, team training and a leadership briefing. Plain English, sized for you.",
    h1: "AI governance that fits how your team really works",
    intro: "Your people are already using AI, often on free personal accounts, with information you'd rather keep in house. AI governance means knowing which tools are in use, setting clear rules for them, and keeping a person responsible for the results. We put that in place with you, in plain English, without slowing your team down.",
    sections: [
      { title: "Find every AI tool in use", text: "Short conversations and a quick survey to build your AI register, including the free tools on personal phones that nobody mentions." },
      { title: "Rate each one, with reasons", text: "Approved, approved with limits, or not allowed, based on the account type, the information that goes in and who sees the results." },
      { title: "A policy people will follow", text: "A short, tailored AI policy: approved tools, what may and may not go in, human review and who to ask. Then a 45-minute session so your team actually knows it." },
      { title: "Brief your leadership", text: "A one-page summary of where you stand, the biggest risks and the next steps, for your leaders or board, plus a review date so it stays current." },
    ],
    forWho: ["Owners and executive directors", "Operations and HR leads", "Boards asking \"what's our AI policy?\"", "Churches and ministries with staff and volunteers"],
    faqs: [
      { q: "Who will we work with?", a: "Rafael, who has extensive experience leading complex data platform projects, including enterprise AI, and is trained in Microsoft Enterprise AI Governance. His background is in governance, and he started GrowDaily because organizations often rush AI out the door with serious consequences. His goal: help you launch AI without regret." },
      { q: "We're small. Do we really need AI governance?", a: "If anyone on your team uses AI with work information, yes, but the small version: a list of tools, a short policy and a named person who owns it. Our free Governwise kit gets you started in about 15 minutes." },
      { q: "Will this stop our team from using AI?", a: "No. The goal is the opposite: clear rules let people use AI confidently. Most tools end up approved, some with simple limits." },
      { q: "Is this legal compliance?", a: "It's practical governance, not legal advice. We'll flag areas like health, financial or children's information where you should check with a qualified advisor, and keep your policy easy to update as laws change." },
      { q: "What do we get at the end?", a: "Your AI register, a tailored AI policy, a team training session and a one-page leadership briefing, all yours to keep and update." },
      { q: "How much does AI governance cost?", a: "The first 20-minute call is free. After that it's priced up front, based on the size of your team and how many tools are in use." },
    ],
  },
  {
    slug: "ai-training",
    interest: "AI training",
    label: "AI training",
    title: "AI Training for Businesses & Nonprofits · GrowDaily",
    description: "Hands-on AI training for business and nonprofit teams of any size: practical workshops on using ChatGPT, Claude and other AI tools safely for everyday work, plus a simple AI policy. Live or on Zoom.",
    h1: "AI training for your team",
    intro: "Most teams have tried AI once or twice and aren't sure what's safe, what's useful, or where to start. Our workshops are practical and jargon-free: your team practices on their own real work, and leaves with habits they'll use the next morning.",
    sections: [
      { title: "AI basics, done right", text: "What AI tools are good at, where they make mistakes, and how to check their work." },
      { title: "Your real tasks", text: "Emails, meeting notes, planning, summaries, customer replies: practiced on examples from your own work." },
      { title: "Safe and private", text: "What's okay to paste into an AI tool and what isn't, with a simple policy your team can adopt." },
      { title: "Follow-up", text: "A short guide to keep, and an easy way to ask questions after the workshop." },
    ],
    forWho: ["Staff teams and departments", "Leadership and boards", "Volunteers", "Owners and office teams"],
    faqs: [
      { q: "Do people need any experience with AI?", a: "No. We start from the beginning and keep it practical, and people who already use AI still pick up new habits." },
      { q: "Which AI tools do you teach?", a: "Whichever your team has or would use, such as ChatGPT, Claude, Copilot or Gemini. The habits work across all of them." },
      { q: "How does training fit with AI governance?", a: "Training is how a policy becomes a habit. We can pair the workshop with our AI governance service, so your team learns the tools and the rules together." },
      { q: "Can it be done on Zoom?", a: "Yes. Workshops work live or on Zoom, and we can record it for people who can't attend." },
      { q: "How much does AI training cost?", a: "Ask for a quote. It depends on the length of the workshop and the size of your group." },
    ],
  },
  {
    slug: "ai-consulting",
    interest: "AI plan",
    label: "AI consulting",
    title: "AI Consulting for Businesses & Nonprofits · GrowDaily",
    description: "Practical AI consulting for businesses and nonprofits of any size: we find where AI would save your team the most time, recommend tools you may already have, and write a clear one-page AI plan.",
    h1: "AI consulting that starts with your work, not the hype",
    intro: "You don't need an AI strategy deck. You need to know the few places AI would actually save your team time, which tools to use, and what to leave alone. Our AI plan answers exactly that, in plain words.",
    sections: [
      { title: "Listen first", text: "Short conversations with the people doing the work, to find the repetitive, time-consuming tasks." },
      { title: "Pick the right tool", text: "Often it's a tool you already pay for, used better. Sometimes it's a small custom app. Sometimes it's not AI at all." },
      { title: "Weigh the risks", text: "Privacy, accuracy and what still needs a person, for each recommendation." },
      { title: "A one-page plan", text: "The top opportunities, what to do first, and what it would take, ready to act on with or without us." },
    ],
    forWho: ["Owners and directors", "Operations and admin teams", "Programs and services", "Anyone told to \"figure out AI\""],
    faqs: [
      { q: "Will you just try to sell us a custom app?", a: "No. Many recommendations use tools you already have. If a custom app would help, we'll say so, and you can build it with us or anyone else." },
      { q: "What do we get at the end?", a: "A short, plain-English plan: the top opportunities, which tools to use, the risks, and the first steps." },
      { q: "How much of our time does it take?", a: "A few short conversations with the right people. We do the rest." },
      { q: "How much does AI consulting cost?", a: "Ask for a quote. It depends on the size of your team and how many areas we look at." },
    ],
  },
];
