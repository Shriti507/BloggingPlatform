/** Dummy posts for UI-only development */

export const MOCK_POSTS = [
  {
    id: "1",
    title: "The Quiet Craft of Long-Form Writing",
    summary:
      "Why slowing down your publishing rhythm can deepen trust with readers and sharpen your thinking.",
    author: "Alex Rivera",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    publishedAt: "Mar 12, 2026",
    readMinutes: 6,
    content: `There is a difference between writing to finish and writing to understand. Long-form essays reward patience: you research, draft, cut, and let ideas breathe.

Readers feel that care. They scroll less aggressively. They save your work. In a feed full of hot takes, a considered piece stands out not because it is louder, but because it earns attention.

Start with one question you cannot answer in a paragraph. Outline loosely. Write the messy middle without judging it. Then edit ruthlessly—clarity is kindness.

Publishing slower is not publishing less meaningfully. It is choosing depth over noise, and trust over churn.`,
  },
  {
    id: "2",
    title: "Design Systems for Small Teams",
    summary:
      "You do not need a monolith library on day one. Here is a pragmatic path that scales with your product.",
    author: "Jamie Chen",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    publishedAt: "Mar 10, 2026",
    readMinutes: 8,
    content: `Small teams often postpone design systems until they feel “big enough.” That is backwards. Systems emerge from repetition—buttons, forms, spacing—and you can document those patterns early without heavyweight tooling.

Begin with tokens: color, type scale, radii, and spacing. Then capture core components in code with clear props and examples. Review weekly, and promote patterns only after they have survived three real screens.

The goal is not perfection. The goal is consistent decisions that compound. Your future self—and your collaborators—will thank you.`,
  },
  {
    id: "3",
    title: "Reading as a Creative Practice",
    summary:
      "Consuming great work is not procrastination when you take notes with intention.",
    author: "Sam Okonkwo",
    imageUrl: "https://images.unsplash.com/photo-1519682337052-a94d519337bc?w=800&q=80",
    publishedAt: "Mar 8, 2026",
    readMinutes: 5,
    content: `Reading widely trains taste. But passive scrolling trains anxiety. The middle path is active reading: highlight sparingly, write one-sentence reactions, and connect ideas across genres.

Keep a running list of techniques you admire—an opening hook, a narrative pivot, a metaphor that lands. Remix them in your own voice, in your own contexts.

Creativity is recombination plus courage. Reading gives you the pieces; publishing is how you learn to assemble them.`,
  },
  {
    id: "4",
    title: "Shipping Weekly Without Burning Out",
    summary:
      "A sustainable publishing cadence beats heroic sprints. Block time, limit scope, finish small.",
    author: "Morgan Lee",
    imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80",
    publishedAt: "Mar 5, 2026",
    readMinutes: 7,
    content: `Ambitious creators often confuse intensity with consistency. Intensity spikes then collapses; consistency compounds.

Pick a realistic cadence—weekly is plenty for most—and protect it on your calendar. Each piece should have a defined “good enough” bar before you start. Iterate in public; polish in private if you must.

Rest is part of the work. Sleep and walks solve problems outlining cannot. Treat energy as a budget, not an infinite resource.`,
  },
  {
    id: "5",
    title: "Typography That Feels Invisible",
    summary:
      "When type works, nobody comments on it. That is the compliment you want.",
    author: "Riley Park",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    publishedAt: "Mar 2, 2026",
    readMinutes: 4,
    content: `Good typography whispers. It sets comfortable measure, generous line height, and hierarchy that guides the eye without shouting.

Choose one serif or sans for long reading and pair it sparingly. Limit font sizes to a small scale. Favor contrast through weight and spacing before you reach for another family.

Test on phones. If it reads effortlessly on a small screen, you are close.`,
  },
  {
    id: "6",
    title: "Community Notes, Not Comments",
    summary:
      "Structured prompts invite better discussions than empty text boxes.",
    author: "Alex Rivera",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    publishedAt: "Feb 28, 2026",
    readMinutes: 5,
    content: `Open comment sections often devolve into performance. Readers benefit from guidance: What challenged you? What would you try differently?

Moderation matters, but design matters first. Lightweight identity, readable threading, and clear norms set the tone before the first reply.

Treat comments as an extension of the essay, not a separate arena.`,
  },
  {
    id: "7",
    title: "Editing for the Skimmer and the Reader",
    summary:
      "Subheads, pull quotes, and short paragraphs respect every kind of attention.",
    author: "Jamie Chen",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    publishedAt: "Feb 24, 2026",
    readMinutes: 6,
    content: `Some people read linearly; others jump. Structure your work for both.

Use descriptive subheads so skimmers grasp the arc. Pull one or two memorable lines when you can. Break walls of text; white space is a readability feature.

The best pieces reward deep reading without punishing casual browsing.`,
  },
  {
    id: "8",
    title: "Building in Public, Thoughtfully",
    summary:
      "Transparency builds trust when paired with boundaries and context.",
    author: "Sam Okonkwo",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    publishedAt: "Feb 20, 2026",
    readMinutes: 9,
    content: `Sharing progress can attract allies and feedback. It can also invite noise.

Share milestones, not every doubt. Explain constraints so advice is useful. Thank contributors publicly and incorporate credit.

Building in public is a communication skill. Practice it with the same care as your product.`,
  },
  {
    id: "9",
    title: "The First Draft Is For You",
    summary:
      "Separate generating from judging. The second draft is for the reader.",
    author: "Morgan Lee",
    imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3c3fe0?w=800&q=80",
    publishedAt: "Feb 16, 2026",
    readMinutes: 5,
    content: `First drafts exist to discover what you think. If you edit while drafting, you throttle discovery.

Write to the end. Print or change the font for editing passes. Read aloud for rhythm.

The reader meets the revision, not the hesitation.`,
  },
];

export const MOCK_COMMENTS_BY_POST_ID = {
  1: [
    { id: "c1", author: "Taylor M.", body: "This landed right when I needed it—thank you.", at: "2d ago" },
    { id: "c2", author: "Chris P.", body: "Curious: how do you balance slow publishing with growth goals?", at: "1d ago" },
  ],
  2: [
    { id: "c3", author: "Devon K.", body: "Tokens-first clicked for our team. Small doc, big clarity.", at: "3d ago" },
  ],
  3: [
    { id: "c4", author: "Priya S.", body: "Active reading as a habit—noted.", at: "5h ago" },
    { id: "c5", author: "Jordan L.", body: "Love the remix framing.", at: "4h ago" },
  ],
};

/** Posts attributed to mock "current user" on dashboard */
export const MOCK_MY_POSTS = [
  { id: "1", title: "The Quiet Craft of Long-Form Writing", status: "Published", updatedAt: "Mar 12, 2026" },
  { id: "6", title: "Community Notes, Not Comments", status: "Published", updatedAt: "Feb 28, 2026" },
  { id: "draft-a", title: "Untitled: On Morning Pages", status: "Draft", updatedAt: "Mar 14, 2026" },
];

export function getPostById(id) {
  return MOCK_POSTS.find((p) => p.id === id) ?? null;
}

export function getInitialComments(postId) {
  return MOCK_COMMENTS_BY_POST_ID[String(postId)] ?? [];
}
