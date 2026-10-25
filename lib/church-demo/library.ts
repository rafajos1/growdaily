/**
 * The content library of a fictional church, for the "answers only from your
 * church's library" demo. Everything here is made up; the church doesn't exist.
 */

export interface LibraryDoc {
  id: string;
  title: string;
  kind: "About" | "Beliefs" | "FAQ" | "Sermon" | "Events" | "Groups" | "Care";
  /** For sermons: when it was preached. */
  date?: string;
  text: string;
}

export const CHURCH_NAME = "Cedar Hill Fellowship";

export const LIBRARY: LibraryDoc[] = [
  {
    id: "about",
    title: "About Cedar Hill Fellowship",
    kind: "About",
    text: `Cedar Hill Fellowship is a church for people who are exploring faith, returning to faith or growing in it. Sunday services are at 9:00 and 11:00 am at 1200 Example Road. Each service lasts about 75 minutes, with music, a message from the Bible and time to pray. Come as you are: most people wear jeans or whatever is comfortable. Our lead pastor is Pastor Dana Reyes. The church office is open Tuesday to Friday, 9 am to 3 pm, and you can reach it at hello@cedarhill.example.`,
  },
  {
    id: "beliefs",
    title: "What we believe",
    kind: "Beliefs",
    text: `We believe in one God, eternally existing as Father, Son and Holy Spirit. We believe Jesus Christ is fully God and fully human, that he lived without sin, died on the cross for our sins and rose bodily from the dead. We believe people are saved by God's grace through faith in Jesus, not by our own good works. We believe the Bible is inspired by God and is our final authority for faith and life. We believe the church is the family of everyone who follows Jesus, and that baptism and communion are gifts Jesus gave his church. We believe Jesus will return, and that God will one day make all things new.`,
  },
  {
    id: "visit",
    title: "Planning your first visit",
    kind: "FAQ",
    text: `Parking: free parking is in the main lot, and spaces near the front door are saved for first-time guests, families with young children and anyone who needs accessible parking. Coffee: there is free coffee in the lobby before both services. Kids: children from birth to fifth grade have their own classes during both services. Check in at the Kids desk to the left of the main doors; a team member will give you a sticker with a code to pick your child up. All kids volunteers are background-checked. Accessibility: the building is wheelchair accessible, with large-print song lyrics and hearing assistance devices at the welcome desk. Guests are never expected to give money. If you'd like to talk with someone, stop by the welcome desk after the service.`,
  },
  {
    id: "baptism",
    title: "Baptism at Cedar Hill",
    kind: "FAQ",
    text: `At Cedar Hill, we baptize people who have decided to follow Jesus, as a public way of showing that decision. We baptize by immersion, usually during a Sunday service. Before baptism, we ask you to attend a one-hour baptism class, held on the first Sunday of each month after the 11:00 service. If you were baptized as a child and are wondering whether to be baptized again, a pastor would be glad to talk it through with you. To sign up for the class, email hello@cedarhill.example.`,
  },
  {
    id: "groups",
    title: "Small groups",
    kind: "Groups",
    text: `Small groups are 8 to 12 people who meet in homes to talk about the Sunday message, pray and look out for each other. Groups meet on Tuesday and Wednesday evenings from September to May, and new groups start each September and January. There are groups for young adults, couples, women, men and mixed groups. To find a group, fill out a card at the welcome desk or email groups@cedarhill.example, and a leader will contact you within a week.`,
  },
  {
    id: "care",
    title: "Prayer and care",
    kind: "Care",
    text: `If you're going through a hard time, you don't have to go through it alone. You can talk with a pastor by calling the church office during office hours or emailing care@cedarhill.example, and someone will get back to you within two working days. Our pastors offer short-term pastoral care and can recommend licensed Christian counselors for ongoing support. If you or someone you know is in crisis or thinking about suicide, call or text 988 in the US right away, or call 911 if life is in immediate danger.`,
  },
  {
    id: "sermon-silent",
    title: "When God Feels Silent (Psalm 13)",
    kind: "Sermon",
    date: "2026-09-07",
    text: `Pastor Dana Reyes. In Psalm 13, David asks God four times, "How long?" The first point: honest lament is a form of faith, not a lack of it. David brings his complaint to God rather than walking away. The second point: feelings of God's absence are not proof of God's absence. David feels forgotten, but he keeps talking to God. The third point: David ends the psalm by choosing to trust God's steadfast love and remembering how God has been good to him before. The challenge for the week was to write your own honest "How long?" prayer and then write down one way God has been faithful to you in the past.`,
  },
  {
    id: "sermon-waiting",
    title: "Grace in the Waiting (Romans 8:18-28)",
    kind: "Sermon",
    date: "2026-09-14",
    text: `Pastor Dana Reyes. Paul writes that our present sufferings are not worth comparing with the glory that will be revealed. The first point: Christians are not promised a life without suffering, but suffering is not the end of the story. The second point: when we don't know what to pray, the Holy Spirit helps us in our weakness and prays for us. The third point: Romans 8:28 does not say every event is good, but that God works in all things for the good of those who love him. The challenge for the week was to name one thing you are waiting on and pray about it every day for a week.`,
  },
  {
    id: "sermon-neighbor",
    title: "Love Your Neighbor, Even That One (Luke 10:25-37)",
    kind: "Sermon",
    date: "2026-09-21",
    text: `Associate Pastor Sam Okafor. In the parable of the Good Samaritan, an expert in the law asks Jesus, "Who is my neighbor?" The first point: Jesus turns the question around, from "Who deserves my help?" to "Who can I be a neighbor to?" The second point: the hero of the story is a Samaritan, someone the listeners looked down on, which means love crosses the lines we draw between people. The third point: love is practical and costs something: time, money and convenience. The challenge for the week was to notice one person you usually walk past and do one practical thing for them.`,
  },
  {
    id: "events",
    title: "Upcoming events",
    kind: "Events",
    text: `Fall Family Night: Friday, October 30, 6:00 to 8:00 pm, with games, food trucks and a costume-friendly trunk-or-treat in the parking lot. Free, and everyone is welcome. Serve Day: Saturday, November 7, 9:00 am to noon. Teams help at the local food bank, a school cleanup and with yard work for older neighbors. Sign up at the welcome desk. Community Thanksgiving Dinner: Sunday, November 22, 5:00 pm in the fellowship hall. Free for anyone who would like a meal and company; volunteers are welcome too.`,
  },
  {
    id: "membership",
    title: "Becoming a member",
    kind: "FAQ",
    text: `Membership at Cedar Hill means committing to this church family: to worship, grow, serve and care for one another. The first step is Starting Point, a 90-minute class held on the second Sunday of each month after the 11:00 service, with lunch provided. It covers our story, what we believe and how to get involved. After the class, you'll meet with a pastor or elder for a short conversation, and then be welcomed as a member during a Sunday service. You're welcome to attend Cedar Hill for as long as you like before deciding about membership.`,
  },
];

export const docById = (id: string) => LIBRARY.find((d) => d.id === id);
