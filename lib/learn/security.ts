import type { Guide } from "./types";

const D = "2026-10-20";

const TEAM_NOTE = `Subject: Using AI at work — what's approved and how to use it safely

Hi team,

Many of us already use AI tools to write, summarize and plan. That's great, and we want to make it easier and safer.

What to use
• For work, please use [approved tool and plan, e.g. "our company Claude/ChatGPT/Copilot business account"]. Ask [name] for access.
• Personal or free AI accounts are fine for personal things, but not for work information.

What never goes into any AI tool
• Passwords, keys or account numbers
• [Customer / donor / member] personal details, unless the task truly needs them and the tool is approved for it
• Health, HR, counseling or other confidential information

Good habits
• Remove names and identifying details when you can.
• Check facts and numbers before anything goes out.
• You're responsible for what you send or publish, even if AI drafted it.

Not sure? Ask [name]. No one is in trouble for asking, or for telling us which tools you've been using. We'd rather know, so we can get you a safe version of what helps.

Our full AI policy: [link]

Thanks,
[Name]`;

const VERIFY_POLICY = `Payment and request verification policy

Why: Scammers can now imitate a real person's voice, writing style and even video. A familiar voice or name is no longer proof of who is asking.

1. Call back before you act
Any request to send money, buy gift cards, change bank details or share passwords or personal data must be confirmed by calling the person on a number we already have on file — never a number given in the message.

2. Two people for payments
Payments over [$ amount], and every change to a vendor's or employee's bank details, need approval from two people.

3. Gift cards are never a payment method
We will never ask staff, volunteers or [members / customers] to buy gift cards or send card numbers.

4. A pause is always OK
Urgency and secrecy are red flags. No one will be in trouble for taking time to verify a request, even from [the CEO / the pastor].

5. Report it
Forward suspicious messages to [name / email]. Report fraud to ReportFraud.ftc.gov and the FBI at ic3.gov.

Approved by [name], [date]. Reviewed every [6 / 12] months.`;

export const SECURITY_GUIDES: Guide[] = [
  {
    slug: "what-is-shadow-ai",
    topic: "security",
    title: "What is shadow AI, and how do you manage it?",
    seoTitle: "What Is Shadow AI? Risks and How to Manage It at Work",
    description: "Shadow AI is staff using AI tools their organization hasn't approved. What it is, why banning AI backfires, and a practical plan to bring it into the open safely.",
    shortAnswer:
      "Shadow AI is people using AI tools at work that the organization hasn't approved, usually free personal accounts. It's common and rarely malicious, but company and customer information can leave your control. Bans tend to push it underground; the fix is approved tools, simple rules and training.",
    sections: [
      {
        heading: "What shadow AI means",
        blocks: [
          "Shadow AI is the AI version of \"shadow IT\": staff using tools the organization doesn't know about or hasn't approved. Most often it's someone pasting an email, a spreadsheet or meeting notes into a free chatbot on their personal account to get work done faster.",
          "It's widespread. In a 2026 PagerDuty survey of 1,250 office professionals at large companies, two-thirds (66%) said they had used AI tools at work they believed weren't permitted.",
        ],
      },
      {
        heading: "Why it's a risk",
        blocks: [
          {
            list: [
              "Data leaves your control: customer, donor, member or employee information ends up in accounts and systems you don't manage.",
              "Training and retention: depending on the plan and settings, what's typed into personal AI accounts may be stored or used to improve the service.",
              "No visibility: you can't support, secure or learn from tools you don't know are being used.",
              "Quality: AI output that goes out unchecked can contain mistakes in your organization's name.",
            ],
          },
        ],
      },
      {
        heading: "Why banning AI backfires",
        blocks: [
          "People use shadow AI because it helps them. A ban removes the safe options but not the need, so use continues quietly on personal phones and accounts, where you have the least protection. The goal is to bring AI into the open, not to stamp it out.",
        ],
      },
      {
        heading: "How to manage shadow AI: a practical plan",
        blocks: [
          {
            steps: [
              { title: "Ask, without blame", text: "Run a quick, anonymous survey: which AI tools do people use, and for what? Make it clear no one is in trouble. You'll learn what's genuinely helpful." },
              { title: "Approve good tools", text: "Give people a business or team plan of a major AI assistant. Business plans generally come with stronger data commitments and admin controls than personal accounts." },
              { title: "Set simple rules", text: "Write a one-page AI policy: what's approved, what data never goes in, and what needs a human check. Our [AI policy template](/learn/ai-policy-template) is a starting point." },
              { title: "Train on real work", text: "An hour of hands-on practice with the approved tool beats any memo. See [how to train your team on AI](/learn/how-to-train-your-team-on-ai)." },
              { title: "Make asking easy", text: "Name a go-to person for AI questions and new tool requests, and review the approved list every few months." },
            ],
          },
        ],
      },
      {
        heading: "Copy-ready note to your team",
        blocks: [
          "Send this when you announce your approved AI tool. Adjust the brackets for your organization.",
          { template: { title: "Team announcement: using AI safely", text: TEAM_NOTE } },
        ],
      },
    ],
    faqs: [
      { q: "Is using ChatGPT at work shadow AI?", a: "Only if your organization hasn't approved it. Using an approved business account within your organization's rules isn't shadow AI; using a personal account for work information usually is." },
      { q: "How do I find out what AI tools my team uses?", a: "Ask. An anonymous, no-blame survey is the fastest and most honest way. Technical monitoring can help larger organizations, but it works best alongside open conversation and approved alternatives." },
      { q: "Should small businesses and churches worry about shadow AI?", a: "Yes, in proportion. Small teams handle sensitive information too, like customer details, donor records and prayer requests. A short policy and one approved tool cover most of the risk." },
    ],
    related: ["is-it-safe-to-put-business-data-in-ai", "how-to-stop-ai-training-on-your-data", "ai-policy-template", "how-to-train-your-team-on-ai"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "PagerDuty: two-thirds of office professionals have used unauthorized AI tools at work (2026 survey)", url: "https://s206.q4cdn.com/635206389/files/doc_news/PagerDuty-Report-Finds-Two-Thirds-66-of-Office-Professionals-Have-Used-Unauthorized-AI-Tools-at-Work-2026.pdf" },
    ],
  },
  {
    slug: "how-to-stop-ai-training-on-your-data",
    topic: "security",
    title: "How to stop ChatGPT, Claude, Gemini and Copilot from training on your data",
    seoTitle: "How to Stop ChatGPT, Claude & Gemini Training on Your Data",
    description: "Step-by-step privacy settings to stop ChatGPT, Claude, Gemini and Microsoft Copilot from using your chats for AI training, plus why business plans are different.",
    shortAnswer:
      "Each major AI assistant has a privacy setting for this. On personal accounts, turn off ChatGPT's \"Improve the model for everyone\", Claude's \"Help improve Claude\", Gemini's \"Keep Activity\" or Copilot's model training toggle. Business and work plans generally don't train on your data by default.",
    sections: [
      {
        heading: "First: personal account or business plan?",
        blocks: [
          "The settings below are for personal accounts (free and individual paid plans). Business, team and enterprise plans from these providers generally don't use your data for training by default and are governed by business terms. For work information, an approved business plan is the better fix than a personal setting.",
          { callout: "Menus change often. These steps are current as of October 2026; if something has moved, search the app's help center for the setting name." },
        ],
      },
      {
        heading: "ChatGPT",
        blocks: [
          {
            steps: [
              { title: "Open Data Controls", text: "On the web, open Settings, then Data Controls. In the mobile app, it's in the side menu under your profile." },
              { title: "Turn off \"Improve the model for everyone\"", text: "Your conversations stay in your history but won't be used to train ChatGPT. The setting applies to your whole account." },
              { title: "Use Temporary Chat for one-offs", text: "Temporary Chats don't appear in your history and aren't used to train models." },
            ],
          },
          "ChatGPT Business, Enterprise and Edu don't use your data for training by default.",
        ],
      },
      {
        heading: "Claude",
        blocks: [
          {
            steps: [
              { title: "Open Privacy settings", text: "In Claude (Free, Pro or Max), open Settings, then Privacy." },
              { title: "Turn off \"Help improve Claude\"", text: "Future chats and coding sessions won't be used to train models. It doesn't remove data from training that has already happened." },
            ],
          },
          "Claude for Work (Team and Enterprise) and the Claude API fall under Anthropic's commercial terms, which don't use your inputs or outputs to train models by default. Conversations flagged for safety review may still be used for trust and safety work on any plan.",
        ],
      },
      {
        heading: "Google Gemini",
        blocks: [
          {
            steps: [
              { title: "Open Gemini Apps Activity", text: "In Gemini, open Settings, then Activity, or go to myactivity.google.com/product/gemini." },
              { title: "Turn off \"Keep Activity\"", text: "Future chats won't be used to train Google's models unless you send feedback. Google still keeps chats for up to 72 hours to respond and keep the service safe." },
              { title: "Know about human review", text: "Chats already reviewed by people are kept separately for up to three years, even if you delete your activity. Don't share anything you wouldn't want a reviewer to see." },
            ],
          },
          "Gemini in Google Workspace business and education editions is different: Google says your content isn't human reviewed or used for AI model training outside your organization without permission.",
        ],
      },
      {
        heading: "Microsoft Copilot",
        blocks: [
          "In the consumer Copilot app, open Settings, go to Privacy, and turn off model training. Copilot can still remember your conversations for personalization; Microsoft just won't use them to train its models.",
          "Microsoft 365 Copilot used with a work or school account is covered by enterprise data protection: prompts and responses aren't used to train the underlying models.",
        ],
      },
      {
        heading: "What these settings don't do",
        blocks: [
          {
            list: [
              "They don't stop the provider from storing your chats to run the service, keep it safe, or meet legal obligations.",
              "They don't make it OK to paste passwords, account numbers or other people's sensitive information.",
              "They apply to your account, so each person on your team has to set them. That's one reason a managed business plan is easier for organizations.",
            ],
          },
          "For more on choosing safe accounts and rules, see [is it safe to put business data in AI?](/learn/is-it-safe-to-put-business-data-in-ai) and [what shadow AI is](/learn/what-is-shadow-ai).",
        ],
      },
    ],
    faqs: [
      { q: "Does turning off training delete my past chats?", a: "No. It affects future chats. Delete conversations separately if you want them gone, and note that data already used in training can't be removed from trained models." },
      { q: "Do paid personal plans like ChatGPT Plus or Claude Pro train on my data?", a: "They can, depending on your settings. Paid individual plans use the same settings as free ones; business and team plans are the ones with no-training defaults." },
      { q: "Is the API safer than the chat app?", a: "Generally yes for training: the major providers' APIs fall under business terms that don't use your data for training by default. You still need to handle security and retention in your own app." },
    ],
    related: ["is-it-safe-to-put-business-data-in-ai", "private-ai-for-business", "what-is-shadow-ai", "ai-policy-template"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [
      { label: "OpenAI: Data Controls FAQ", url: "https://help.openai.com/en/articles/7730893-data-controls-faq" },
      { label: "Anthropic: how to change your model improvement privacy settings", url: "https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings" },
      { label: "Google: Gemini Apps Privacy Hub", url: "https://support.google.com/gemini/answer/13594961" },
      { label: "Google Workspace: Generative AI in Google Workspace Privacy Hub", url: "https://support.google.com/a/answer/15706919" },
      { label: "Microsoft: Copilot privacy controls", url: "https://support.microsoft.com/en-us/microsoft-copilot/microsoft-copilot-privacy-controls" },
      { label: "Microsoft: enterprise data protection in Microsoft 365 Copilot", url: "https://learn.microsoft.com/en-us/copilot/microsoft-365/enterprise-data-protection" },
    ],
  },
  {
    slug: "private-ai-for-business",
    topic: "security",
    title: "Private AI for business: how to use AI and keep your data in-house",
    seoTitle: "Private AI for Business: How to Keep Your Data In-House",
    description: "Four ways to use AI while keeping sensitive data under your control, from business plans to your own cloud to models on your own computers, with honest trade-offs.",
    shortAnswer:
      "Most organizations don't need to run AI on their own servers. A business plan with no-training terms covers most needs. For more control, use AI through your own cloud account or the API under business terms. Running open models on your own hardware keeps data fully in-house, but costs more effort and capability.",
    sections: [
      {
        heading: "Four levels of control",
        blocks: [
          {
            steps: [
              { title: "Business plan of a major AI assistant", text: "ChatGPT Business, Claude for Work, Gemini in Google Workspace or Microsoft 365 Copilot. Contract terms, admin controls and no training on your data by default. The right starting point for most teams." },
              { title: "The API under business terms", text: "Build your own assistant or workflow on a provider's API. You decide what data is sent, and business terms don't use it for training by default. Ask providers about data retention options if you handle sensitive information." },
              { title: "AI inside your own cloud account", text: "Major clouds offer leading models through your existing account, such as Claude on Amazon Bedrock or Google Cloud Vertex AI, with your cloud's security, regions and agreements. Amazon Bedrock, for example, says it doesn't store your prompts or use them to train models." },
              { title: "Open models on your own hardware", text: "Tools like Ollama or LM Studio run open-weight models (such as Llama, Mistral, Gemma or Qwen) on your own computers or servers. Data never leaves your machines." },
            ],
          },
        ],
      },
      {
        heading: "The trade-offs of running AI yourself",
        blocks: [
          {
            list: [
              "Capability: models small enough to run on a laptop or office server are usually less capable than the leading hosted models, especially for complex reasoning and writing.",
              "Hardware: larger models need a powerful graphics card or a computer with lots of memory.",
              "Responsibility: you own security, updates, backups and access control. \"On our own server\" is only private if that server is well secured.",
              "Cost: little or no usage cost, but real setup and maintenance time.",
            ],
          },
          { callout: "A common, practical mix: a business AI plan for everyday work, plus a local or own-cloud setup only for the few tasks involving your most sensitive data." },
        ],
      },
      {
        heading: "\"Chat with our documents\" safely",
        blocks: [
          "Many organizations want AI that answers questions from their own files: handbooks, policies, past proposals. Whichever level you choose, apply the same rules you use for the files themselves: people should only get answers from documents they're allowed to see. Start with non-sensitive documents and expand once access rules are proven.",
        ],
      },
      {
        heading: "How to choose",
        blocks: [
          {
            list: [
              "General work (writing, summaries, planning): a business plan.",
              "A custom assistant or automated workflow: the API or your cloud account, under business terms.",
              "Regulated data such as health information: talk to the provider about plans that support your obligations (for example, HIPAA-eligible setups with a business associate agreement) before sending any.",
              "Data that must never leave your building: open models on your own hardware.",
            ],
          },
          "Whatever you choose, pair it with a short [AI policy](/learn/ai-policy-template) and the right [privacy settings](/learn/how-to-stop-ai-training-on-your-data).",
        ],
      },
    ],
    faqs: [
      { q: "What is private AI?", a: "AI used in a way that keeps your data under your control: business terms that rule out training on your data, AI running inside your own cloud account, or open models running on your own hardware." },
      { q: "Can I run ChatGPT or Claude on my own computer?", a: "No. Those models only run on their providers' services. You can run open-weight models such as Llama, Mistral, Gemma or Qwen locally with tools like Ollama or LM Studio." },
      { q: "Is a local AI model always safer?", a: "Not automatically. It keeps data off third-party services, but you become responsible for securing the computer, controlling access and keeping software updated." },
    ],
    related: ["how-to-stop-ai-training-on-your-data", "is-it-safe-to-put-business-data-in-ai", "what-is-shadow-ai", "ai-implementation-plan"],
    service: "ai-consulting",
    published: D,
    updated: D,
    sources: [
      { label: "AWS: data protection in Amazon Bedrock", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html" },
      { label: "Google Workspace: Generative AI in Google Workspace Privacy Hub", url: "https://support.google.com/a/answer/15706919" },
      { label: "Microsoft: enterprise data protection in Microsoft 365 Copilot", url: "https://learn.microsoft.com/en-us/copilot/microsoft-365/enterprise-data-protection" },
      { label: "Ollama: run open models locally", url: "https://ollama.com" },
    ],
  },
  {
    slug: "ai-voice-cloning-scams",
    topic: "security",
    title: "AI voice cloning and impersonation scams: how to protect your business or church",
    seoTitle: "AI Voice Cloning Scams: How to Protect Your Business & Church",
    description: "Scammers use AI to clone voices and impersonate bosses and pastors. How these scams work, the warning signs, and a simple verification policy you can copy.",
    shortAnswer:
      "Scammers can now clone a voice from a short audio clip and write convincing messages in anyone's name. The defense is a habit, not a gadget: never act on an urgent request for money, gift cards or data until you've verified it through a number you already have, and require two people for payments.",
    sections: [
      {
        heading: "How the scams work",
        blocks: [
          "The FTC warns that a scammer needs only a short clip of someone's voice, often taken from content posted online, plus a voice-cloning program to imitate them on a call. The FBI says criminals use generative AI to make fraud more believable at scale: cloned voices of relatives asking for emergency money, and fake audio or video of company executives.",
          {
            list: [
              "The urgent boss: a call or message from \"the owner\" asking someone to pay an invoice, wire money or change a vendor's bank details, quickly and quietly.",
              "The family emergency: a cloned voice of a relative in trouble, asking for money now.",
              "The pastor's favor: an email or text that appears to come from a pastor, asking members to buy gift cards for someone in need.",
            ],
          },
        ],
      },
      {
        heading: "Why churches are targeted",
        blocks: [
          "Pastor impersonation scams have been reported by churches across the U.S. Scammers often use names and details from church websites and online bulletins, send messages from look-alike email addresses, and ask members for gift cards. One Virginia church suspected scammers imitated the pastor's voice using audio from an online service.",
          "You don't need to stop posting sermons. Do tell your congregation clearly, and often, that church leaders will never ask them to buy gift cards or send money by text or email.",
        ],
      },
      {
        heading: "Warning signs",
        blocks: [
          {
            list: [
              "Urgency and secrecy: \"I need this in the next hour\" or \"don't tell anyone yet.\"",
              "Unusual payment: gift cards, wire transfers, cryptocurrency or new bank details.",
              "A new channel: a personal email address, a new phone number, or a text instead of the usual way you talk.",
              "Pressure not to verify: \"I'm in a meeting, I can't talk, just do it.\"",
            ],
          },
        ],
      },
      {
        heading: "Protect your team and congregation",
        blocks: [
          {
            steps: [
              { title: "Call back on a known number", text: "Verify any request for money or data by calling the person on a number you already have, never one from the message. This is the FTC's core advice." },
              { title: "Agree a code word", text: "The FBI recommends families agree on a secret word or phrase to confirm identity. Small teams and church leadership can do the same." },
              { title: "Two people for payments", text: "Require two approvals for payments and for any change to bank details." },
              { title: "Say it publicly", text: "Put \"we will never ask you for gift cards or money by text or email\" in your newsletter, website and staff onboarding." },
              { title: "Report it", text: "Report scams to the FTC at ReportFraud.ftc.gov and to the FBI at ic3.gov, and warn your people quickly." },
            ],
          },
        ],
      },
      {
        heading: "Copy-ready verification policy",
        blocks: [
          "Adapt this for your business, nonprofit or church and share it with everyone who handles money or personal information.",
          { template: { title: "Verification policy template", text: VERIFY_POLICY } },
          "Add it to your [AI policy](/learn/ai-policy-template), or for churches, your [church AI policy](/learn/church-ai-policy-template).",
        ],
      },
    ],
    faqs: [
      { q: "How much audio does someone need to clone a voice?", a: "The FTC says a short clip can be enough, often taken from videos or recordings posted online. That's why verification habits matter more than keeping audio offline." },
      { q: "What should I do if I get a call from a family member asking for money?", a: "Hang up and call them back on a number you know is theirs, or contact another family member. Ask for your family's code word if you have one." },
      { q: "Will a pastor or church ever ask for gift cards?", a: "Churches should make it clear they never will. Treat any gift card request from a church leader by email or text as a scam until you've confirmed it by phone." },
    ],
    related: ["church-ai-policy-template", "what-is-shadow-ai", "ai-policy-template", "ai-for-churches"],
    service: "ai-training",
    published: D,
    updated: D,
    sources: [
      { label: "FTC: scammers use AI to enhance their family emergency schemes", url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes" },
      { label: "FBI IC3: criminals use generative AI to facilitate financial fraud (PSA I-120324)", url: "https://www.ic3.gov/PSA/2024/PSA241203" },
      { label: "Church Law & Tax: new scam emails target worshipers", url: "https://www.churchlawandtax.com/keep-safe/cyberliability/new-scam-emails-target-worshipers/" },
      { label: "Annandale Today: scammers impersonating church pastors", url: "https://annandaletoday.com/scammers-impersonating-church-pastors/" },
    ],
  },
];
