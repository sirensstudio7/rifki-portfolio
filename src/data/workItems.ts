export type StorySection = {
  heading: string;
  body: string;
};

export type WorkGallery = {
  hero?: string;
  imageCards?: string[];
  screens?: string[];
  wide?: string;
  details?: string[];
};

export type WorkItem = {
  slug: string;
  date: string;
  title: string;
  /** When true, shows a “Coming soon” chip next to the title on the work index. */
  comingSoon?: boolean;
  /** Replaces the main case-study body on the work detail page. */
  detailEmbed?: "maze";
  shortDescription: string;
  story?: {
    tagline?: string;
    context?: string;
    challenge?: string;
    approach?: string;
    result?: string;
    /** Long-form narrative; when present, shown instead of context/challenge/approach/result */
    sections?: StorySection[];
  };
  gallery?: WorkGallery;
};

/** Work index: show the Coming soon chip and open the fullscreen dialog (never deep-link to /work/:slug). */
export function workItemOpensComingSoonFromIndex(item: WorkItem): boolean {
  return item.comingSoon === true || item.detailEmbed === "maze";
}

export const WORK_ITEMS: WorkItem[] = [
  {
    slug: "core-club-connect",
    date: "2025 - Present",
    title: "Core Club Connect // Mobile App",
    comingSoon: true,
    detailEmbed: "maze",
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "Connecting members through design that feels like home.",
      context:
        "Core Club needed a mobile experience that reflected their brand—premium, warm, and effortless. Members would use it daily to book classes, connect with the community, and stay in the loop.",
      challenge:
        "How do we make routine actions (booking, checking in) feel intentional and on-brand, without adding friction? We had to balance clarity for first-time users with speed for regulars.",
      approach:
        "We led with hierarchy and whitespace. Every screen had one primary action. We introduced subtle motion and a consistent visual language so the app felt like an extension of the physical club.",
      result:
        "Launch saw strong adoption and positive feedback on ease of use. The app became a core touchpoint for member engagement and retention.",
    },
  },
  {
    slug: "nanofi",
    date: "2025 - Present",
    title: "NanoFi // Web3",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "Making Web3 feel approachable, one flow at a time.",
      context:
        "NanoFi wanted to bring DeFi to a broader audience. Their product was powerful but the interface felt technical and intimidating to non-crypto users.",
      challenge:
        "We had to simplify complex concepts—wallets, gas, chains—without dumbing them down. Trust and clarity were non-negotiable.",
      approach:
        "We focused on progressive disclosure: show only what’s needed at each step. We used plain language, clear feedback, and a calm visual system that didn’t scream \"crypto.\"",
      result:
        "Onboarding completion improved and support tickets around basic flows dropped. Users reported feeling more confident using the product.",
    },
  },
  {
    slug: "creelab",
    date: "2025 - 2025",
    title: "Creelab // Web",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "A creative studio’s digital front door.",
      context:
        "Creelab is a small studio that does big work. They needed a site that showcased projects without overwhelming visitors—and that reflected their craft and attention to detail.",
      challenge:
        "Portfolio sites often either look the same or sacrifice usability for flair. We had to stand out while keeping the experience fast and accessible.",
      approach:
        "We treated the site as a product: clear structure, strong typography, and deliberate motion. Each project got space to breathe. Performance and semantics were part of the design.",
      result:
        "A site the team is proud to send clients to. It loads quickly, works well on any device, and sets the tone for the work that follows.",
    },
  },
  {
    slug: "tanahub",
    date: "2024 - 2024",
    title: "Tanahub // Web3",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "Staking and governance, clearly explained.",
      context:
        "Tanahub offers staking and governance for their community. The product needed to serve both power users and newcomers who were exploring Web3 for the first time.",
      challenge:
        "Explaining staking, APY, and governance in a way that builds trust and encourages participation—without jargon or walls of text.",
      approach:
        "We broke the experience into clear steps and used visuals to support the copy. Numbers and rewards were always visible; actions were labeled plainly. We added short tooltips for terms that couldn’t be avoided.",
      result:
        "Higher engagement with staking and governance features. Users reported understanding the product better and feeling more in control.",
    },
  },
  {
    slug: "jazztify",
    date: "2024 - 2024",
    title: "Jazztify // Web",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "Music discovery that feels personal.",
      context:
        "Jazztify is a web app for discovering and curating jazz and related genres. The goal was to make discovery feel exploratory, not algorithmic.",
      challenge:
        "How do we surface new music without feeling pushy or generic? The experience had to reward curiosity and support different listening habits.",
      approach:
        "We designed around moods, instruments, and eras—language that jazz fans already use. Layouts were spacious; listening was the primary action. We avoided dark patterns and kept recommendations transparent.",
      result:
        "Users spent more time exploring and added more tracks to their libraries. The product felt distinct in a crowded space.",
    },
  },
  {
    slug: "islamic-reminder",
    date: "2024 - 2024",
    title: "Islamic Reminder // Mobile App",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "Gentle reminders, thoughtful design.",
      context:
        "Islamic Reminder helps users stay consistent with prayer and reflection. The app had to feel respectful, calm, and easy to use in daily life.",
      challenge:
        "Reminder apps can feel naggy or generic. We needed a tone and experience that felt supportive and aligned with the product’s purpose.",
      approach:
        "We used a soft visual language and clear typography. Notifications and in-app copy were written to encourage, not pressure. Settings were simple so users could tailor the experience without friction.",
      result:
        "Positive feedback on tone and usability. The app became a daily habit for many users without feeling intrusive.",
    },
  },
  {
    slug: "dundun",
    date: "2023 - 2023",
    title: "Dundun // Web3",
    comingSoon: true,
    shortDescription:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    story: {
      tagline: "From idea to interface in the token space.",
      context:
        "Dundun was building tools for token creators and communities. Their early product was functional but the UX didn’t match the ambition of the team.",
      challenge:
        "We had to align a technical product with a vision that was about creativity and community—and do it without a large design system in place.",
      approach:
        "We established a clear information architecture and a minimal but consistent UI. We prioritized the flows that mattered most to early users and iterated based on feedback.",
      result:
        "A more coherent product that the team could build on. Users found key actions faster and the product felt more intentional.",
    },
  },
  {
    slug: "offer",
    date: "2021 - 2022",
    title: "Offer // Mobile App",
    shortDescription:
      "A barbershop booking experience built around trust: real-time slots, queue visibility, and clarity so users know what to expect before they walk in.",
    story: {
      tagline:
        "Designing for trust — from guessing to knowing. A story-led case study on reducing uncertainty in local booking.",
      sections: [
        {
          heading: "Expectation — “This should be easy…”",
          body: `It’s 6:12 PM. Rizky steps out of his office, adjusting his sleeves as he checks his reflection on his phone screen. Tomorrow morning, he has an important client meeting. His hair? Not ready.

He opens his phone and thinks: “I just need a quick haircut. This shouldn’t take long.”

In his mind, the flow is simple.`,
        },
        {
          heading: "Reality — “Wait… why is this so complicated?”",
          body: `He searches “barbershop near me.” He taps one result. Instagram. Nice photos. Clean fades. Good vibes. But no booking button. Only this: “DM / WhatsApp for booking.”

He clicks. “Hi, are you available tonight?” …typing …waiting …still waiting.

Ten minutes later: “Available. Come.” No time. No queue. No certainty. Still, Rizky goes.

He arrives at 7:05 PM. The shop is full. He approaches the barber: “I booked earlier…” The barber glances briefly: “Oh, just wait ya. Still 3 people.” Rizky sits down. Fifteen minutes pass. Then thirty. Now it’s 7:48 PM. He checks his watch again. “I thought I already booked…”

The frustration isn’t just the waiting. It’s the uncertainty. He didn’t know how long it would take. He didn’t know if the booking was real. He didn’t feel in control. What should’ve been simple feels unpredictable and outdated.`,
        },
        {
          heading: "Solution — “What if Rizky never had to guess?”",
          body: `We reframed the problem: this isn’t a booking issue. This is a trust issue.

So instead of only adding a booking feature, we designed for one goal: make the experience feel certain before the user arrives.

Now imagine Rizky opens the app again. This time, the experience is different.

He instantly sees nearby barbershops with ratings, distance, and pricing — labels like “Available Now” or “Next slot: 6:45 PM.” No guessing. Just clarity.

He taps one barbershop. Inside, everything is visible: services with prices, available barbers, and real-time time slots (like booking a movie seat). He selects haircut, preferred barber, 6:45 PM.

Before confirming, he sees: “2 people ahead of you — Est. wait: 10 mins.” For the first time, he knows exactly what to expect. He taps Confirm. Done in under a minute.

At 6:30 PM, his phone buzzes: “Reminder: Your haircut is in 15 minutes.” He arrives at 6:44 PM, checks in, sits down. At 6:52 PM, his name is called.

No confusion. No frustration. No wasted time. Just flow.`,
        },
        {
          heading: "Action — “Turning insight into impact”",
          body: `We didn’t start with screens. We started with stories like Rizky’s.

1. Listening to reality — From interviews, we kept hearing: “Booking doesn’t feel real,” “I still have to wait anyway,” “I don’t know when I’ll be served.” The pattern was clear: the pain wasn’t booking — it was uncertainty.

2. Defining the core problem — Users struggle to trust the booking process because it lacks visibility and predictability.

3. Designing for trust — Every decision answered: “Does this reduce uncertainty?” We introduced real-time slots, queue visibility (“people ahead of you”), upfront pricing, clear confirmation, and a sub-three-step booking flow.

4. Testing the experience — In usability tests, users didn’t ask “How do I book?” They said: “Oh… this is clear.” That clarity became the success metric.

5. Iterating the details — We refined shortcuts like “Next Available Slot,” stronger booking CTAs, and clearer queue explanations. Small details → a big confidence shift.`,
        },
        {
          heading: "Impact — “From better UX to better business”",
          body: `User experience
• Booking time: ~10 min → under 2 min
• Waiting time: down ~40%
• No-show rate: 28% → 12%
• User confidence: significantly increased

Product
• Conversion (view → book): 35% → 62%
• Booking completion time: 5–10 min → ~1.5 min
• Repeat booking rate: 22% → 41%

Business
• More daily bookings: +35–50%
• Higher seat utilization: +25% efficiency
• Reduced operational load: less WhatsApp back-and-forth; staff focus on service
• Stronger brand perception: “modern,” “reliable,” “professional” — better reviews and referrals`,
        },
        {
          heading: "Final reflection — “Designing for trust”",
          body: `This project wasn’t about adding a feature. It was about shifting a feeling: from guessing → to knowing, from waiting → to flowing, from uncertain → to confident.

Good UX removes friction. Great UX builds trust. And trust drives business.`,
        },
      ],
    },
    gallery: {
      hero: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&auto=format&fit=crop",
      imageCards: [
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503951914875-452162b0e3b1?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop",
      ],
      screens: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
      ],
      wide: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop",
      details: [
        "https://images.unsplash.com/photo-1503951914875-452162b0e3b1?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80",
      ],
    },
  },
];

export function getWorkItemBySlug(slug: string): WorkItem | undefined {
  return WORK_ITEMS.find((item) => item.slug === slug);
}
