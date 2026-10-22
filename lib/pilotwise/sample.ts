import { newId } from "../habitwise/storage";
import { cleanPlan } from "./template";
import type { Inputs, Pilot, PilotData } from "./types";

/** A realistic example: an AI pilot for drafting customer support replies, mid-way through. */
export function sampleData(now: string): PilotData {
  const inputs: Inputs = {
    useCase: "Draft first replies to customer support emails so agents answer faster",
    orgSize: "51–250 people",
    industry: "Online retail",
    builder: "A vendor or partner",
    data: "About 2,000 support emails a week in our help desk, plus a 40-page help center",
    weeks: 12,
  };
  const draft = {
    title: "AI-drafted replies for customer support",
    problem: "Five support agents spend most of their day writing similar replies to about 2,000 emails a week. First replies take 9 hours on average, and customers notice.",
    value: { metric: "Median time to first reply", baseline: "9 hours (last 4 weeks)", target: "Under 2 hours, with satisfaction scores no lower", owner: "Head of Customer Support" },
    users: "Five support agents, reviewing every draft before it's sent",
    readiness: [
      { area: "problem", score: 4, note: "Clear job, owner and metric.", gap: "" },
      { area: "data", score: 3, note: "Help desk history and help center exist.", gap: "Old replies include customer details; need a clean sample for testing." },
      { area: "people", score: 4, note: "Agents asked for help and will join testing.", gap: "" },
      { area: "governance", score: 2, note: "No AI policy yet.", gap: "Agree what customer data the vendor may see, and get privacy sign-off." },
      { area: "tech", score: 3, note: "Help desk has an API; vendor has a connector.", gap: "Confirm drafts appear inside the help desk, not a separate tool." },
      { area: "measurement", score: 2, note: "Reply times are tracked.", gap: "No test set yet: pick 150 past emails with agreed good replies." },
    ],
    exitCriteria: [
      { name: "Draft quality", target: "≥ 85% of drafts sent with light or no edits", measure: "Agents rate each draft on 150 test emails, then in live use", status: "on-track" },
      { name: "Time to first reply", target: "Median under 2 hours", measure: "Help desk reporting, pilot group vs. baseline", status: "not-measured" },
      { name: "Agent adoption", target: "4 of 5 agents use drafts daily", measure: "Usage data and a short survey", status: "met" },
      { name: "Accuracy on policy", target: "0 drafts that promise refunds or terms we don't offer", measure: "Policy test cases in the test set", status: "on-track" },
      { name: "Cost per draft", target: "Under $0.10", measure: "Vendor usage bill ÷ drafts created", status: "met" },
      { name: "Privacy", target: "Approved data use; no payment details sent", measure: "Privacy review signed off", status: "not-measured" },
    ],
    phases: [
      { name: "Discover & frame", weeks: 2, goal: "Baseline, test set and privacy rules agreed.", features: [
        { title: "Build the test set", outcome: "150 past emails with agreed good replies, personal details removed" },
        { title: "Privacy and data rules", outcome: "What the vendor may see, signed off" } ] },
      { name: "Pilot with two agents", weeks: 4, goal: "Drafts inside the help desk for two agents, every draft reviewed.", features: [
        { title: "Drafts in the help desk", outcome: "A draft appears on each new email" },
        { title: "Policy guardrails", outcome: "Refund and returns questions follow written policy or hand off" },
        { title: "Weekly test-set run", outcome: "Quality tracked every sprint" } ] },
      { name: "Expand to all five agents", weeks: 4, goal: "Same setup for the whole team; measure reply times.", features: [
        { title: "Team rollout", outcome: "All agents trained and using drafts" } ] },
      { name: "Gate review", weeks: 2, goal: "Go, adjust or stop against the exit criteria.", features: [
        { title: "Results to the owner", outcome: "Decision recorded with the numbers" } ] },
    ],
    risks: [
      { risk: "A draft promises a refund we don't offer", category: "quality", likelihood: "medium", impact: "high", response: "Policy test cases; agents review every draft", roam: "mitigated" },
      { risk: "Customer details shared beyond what's allowed", category: "privacy", likelihood: "low", impact: "high", response: "Privacy review before pilot; strip payment details", roam: "owned" },
      { risk: "Agents stop reviewing drafts carefully", category: "adoption", likelihood: "medium", impact: "medium", response: "Spot checks and quality scores shared weekly", roam: "open" },
      { risk: "Vendor price rises at renewal", category: "vendor", likelihood: "low", impact: "medium", response: "Keep test set and prompts portable", roam: "accepted" },
    ],
    evalPlan: { testSet: "150 past emails across the top 10 topics, including angry and unusual ones", size: 150, labeling: "Two senior agents agree the good reply for each", cadence: "Every sprint and before any prompt or model change" },
    firstSteps: ["Confirm the Head of Support as owner", "Pull the last 4 weeks of reply times", "Pick and clean 150 test emails", "Book the privacy review"],
    brief: "We propose a 12-week pilot of AI-drafted replies for customer support. Agents review every draft. Success means median first reply under 2 hours with satisfaction no lower, at under $0.10 per draft, decided against a 150-email test set at the gate. Two gaps to close first: privacy sign-off and the test set.",
  };
  let ids = 0;
  const plan = cleanPlan(draft, inputs, () => `ex${ids++}`);
  plan.firstSteps[0].done = true;
  plan.firstSteps[1].done = true;
  plan.phases[0].features[0].done = true;
  const pilot: Pilot = { id: newId(), createdAt: now, updatedAt: now, source: "ai", inputs, plan };
  return { pilots: [pilot] };
}
