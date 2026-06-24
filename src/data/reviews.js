// Community reviews ("all the voices") + an AI-style consensus synopsis that
// balances them for each built-in book. The synopsis is written to weigh every
// review fairly: what most readers love, the common criticisms, and who it's
// best for — a democracy of voices rather than a single take.

// tone: 'pos' | 'mixed' | 'neg'
export const REVIEWS = {
  b1: [
    { user: 'Sam', tone: 'pos', text: 'The prose is pure music — Kvothe’s voice hooked me instantly.' },
    { user: 'Priya', tone: 'mixed', text: 'Beautiful writing but very little actually happens. Slow.' },
    { user: 'Theo', tone: 'pos', text: 'A modern fantasy classic. Re-read it twice.' },
  ],
  b2: [
    { user: 'Maya', tone: 'pos', text: 'Smart, funny, and the friendship wrecked me. Perfect.' },
    { user: 'Leo', tone: 'mixed', text: 'Loved it, though the science gets dense in places.' },
    { user: 'Alex', tone: 'pos', text: 'Could not put it down. Best sci-fi in years.' },
  ],
  b3: [
    { user: 'Priya', tone: 'pos', text: 'Evelyn’s voice is unforgettable. That twist!' },
    { user: 'Nina', tone: 'pos', text: 'Glamorous, emotional, and quietly groundbreaking.' },
    { user: 'Jordan', tone: 'mixed', text: 'Gripping, but I saw the ending coming a mile away.' },
  ],
  b4: [
    { user: 'Alex', tone: 'pos', text: 'That mid-book twist is a masterclass. Addictive.' },
    { user: 'Iris', tone: 'neg', text: 'Everyone is awful and the ending frustrated me.' },
    { user: 'Theo', tone: 'mixed', text: 'Brilliantly plotted even if no one is likeable.' },
  ],
  b5: [
    { user: 'Maya', tone: 'pos', text: 'Comforting and moving — exactly what I needed.' },
    { user: 'Leo', tone: 'neg', text: 'A bit heavy-handed and repetitive for me.' },
    { user: 'Zoe', tone: 'mixed', text: 'Lovely message, slightly predictable execution.' },
  ],
  b6: [
    { user: 'Zoe', tone: 'pos', text: 'Hilarious and fast — my kids devoured it.' },
    { user: 'Sam', tone: 'pos', text: 'The gateway to loving mythology. So fun.' },
    { user: 'Leo', tone: 'mixed', text: 'Great for kids, a little simple for adults.' },
  ],
  b7: [
    { user: 'Jordan', tone: 'pos', text: 'Breathless tension and Katniss is iconic.' },
    { user: 'Nina', tone: 'mixed', text: 'Loved the stakes, the romance felt forced.' },
    { user: 'Maya', tone: 'pos', text: 'Sharp social commentary under the action.' },
  ],
  b8: [
    { user: 'Priya', tone: 'pos', text: 'The nature writing is stunning and Kya stayed with me.' },
    { user: 'Alex', tone: 'mixed', text: 'Gorgeous, but the courtroom plot stretches belief.' },
    { user: 'Iris', tone: 'pos', text: 'Atmospheric and deeply emotional.' },
  ],
  b9: [
    { user: 'Leo', tone: 'pos', text: 'Actually changed my routines. Clear and practical.' },
    { user: 'Maya', tone: 'pos', text: 'The 1% systems idea is genuinely useful.' },
    { user: 'Theo', tone: 'mixed', text: 'Solid, but covers ground other habit books do.' },
  ],
  b10: [
    { user: 'Priya', tone: 'pos', text: 'Raw and gripping — I read it in one sitting.' },
    { user: 'Iris', tone: 'pos', text: 'Unforgettable testament to education.' },
    { user: 'Alex', tone: 'mixed', text: 'Powerful, though I wondered about some details.' },
  ],
  b11: [
    { user: 'Alex', tone: 'pos', text: 'The twist floored me. Flew through it.' },
    { user: 'Nina', tone: 'neg', text: 'Characters felt thin and the ending was far-fetched.' },
    { user: 'Theo', tone: 'mixed', text: 'Clever hook, shaky logic if you think too hard.' },
  ],
  b12: [
    { user: 'Iris', tone: 'pos', text: 'A gorgeous, feminist retelling. Circe is everything.' },
    { user: 'Priya', tone: 'pos', text: 'The prose is luminous. Slow-burn empowerment done right.' },
    { user: 'Sam', tone: 'mixed', text: 'Beautiful, occasionally meandering.' },
  ],
  b13: [
    { user: 'Nina', tone: 'pos', text: 'Emotional and important. I sobbed.' },
    { user: 'Jordan', tone: 'mixed', text: 'Heavy themes handled honestly, writing was just okay.' },
    { user: 'Iris', tone: 'neg', text: 'Not for me — found it melodramatic.' },
  ],
  b14: [
    { user: 'Maya', tone: 'pos', text: 'A visionary masterpiece. The world-building is unmatched.' },
    { user: 'Sam', tone: 'pos', text: 'Dense but endlessly rewarding politics and lore.' },
    { user: 'Zoe', tone: 'neg', text: 'I bounced off it — too slow to start.' },
  ],
  b15: [
    { user: 'Iris', tone: 'pos', text: 'Death as narrator broke my heart. Stunning.' },
    { user: 'Leo', tone: 'mixed', text: 'Moving, though the style kept me at a distance.' },
    { user: 'Priya', tone: 'pos', text: 'A literary WWII novel I’ll never forget.' },
  ],
  b16: [
    { user: 'Zoe', tone: 'pos', text: 'Heartwarming — every kid should read it.' },
    { user: 'Jordan', tone: 'pos', text: 'A real lesson in kindness without preaching.' },
    { user: 'Theo', tone: 'mixed', text: 'Sweet, a touch sentimental.' },
  ],
  b17: [
    { user: 'Zoe', tone: 'pos', text: 'Timeless. The art and counting delight my toddler.' },
    { user: 'Maya', tone: 'pos', text: 'A perfect read-aloud, never gets old.' },
    { user: 'Leo', tone: 'pos', text: 'Simple joy in every page.' },
  ],
  b18: [
    { user: 'Nina', tone: 'pos', text: 'The romance and world are addictive. Later books soar.' },
    { user: 'Jordan', tone: 'mixed', text: 'Slow start, but it pays off big.' },
    { user: 'Sam', tone: 'neg', text: 'Uneven writing wasn’t for me.' },
  ],
  b19: [
    { user: 'Leo', tone: 'pos', text: 'Sweeping and thought-provoking. Reframed how I see history.' },
    { user: 'Priya', tone: 'mixed', text: 'Accessible, but it generalizes a lot.' },
    { user: 'Alex', tone: 'pos', text: 'Big ideas explained clearly. Loved it.' },
  ],
  b20: [
    { user: 'Theo', tone: 'pos', text: 'The dread builds perfectly. The Overlook is alive.' },
    { user: 'Alex', tone: 'mixed', text: 'Masterful, if slow to get going.' },
    { user: 'Iris', tone: 'pos', text: 'Psychological terror at its best.' },
  ],
  b21: [
    { user: 'Priya', tone: 'pos', text: 'Klara’s tender perspective quietly destroyed me.' },
    { user: 'Leo', tone: 'mixed', text: 'Beautiful but very understated and slow.' },
    { user: 'Maya', tone: 'pos', text: 'Reflective sci-fi that lingers.' },
  ],
  b22: [
    { user: 'Zoe', tone: 'pos', text: 'Pure wish-fulfillment joy. A childhood favorite.' },
    { user: 'Jordan', tone: 'pos', text: 'Funny and big-hearted. Dahl at his best.' },
    { user: 'Sam', tone: 'pos', text: 'Still magical as an adult.' },
  ],
  b23: [
    { user: 'Sam', tone: 'pos', text: 'Epic scope and a payoff that earns the page count.' },
    { user: 'Theo', tone: 'mixed', text: 'Incredible world, but the length is daunting.' },
    { user: 'Maya', tone: 'pos', text: 'Sanderson’s best. The ending is jaw-dropping.' },
  ],
  b24: [
    { user: 'Nina', tone: 'pos', text: 'Dark, twisted, unputdownable. That ending!' },
    { user: 'Alex', tone: 'neg', text: 'Lurid and implausible — not my thing.' },
    { user: 'Theo', tone: 'mixed', text: 'Shocking and fast, if you don’t question it.' },
  ],
}

export const SYNOPSES = {
  b1: 'Readers are mesmerized by Rothfuss’s lyrical prose and Kvothe’s storytelling, calling it a modern fantasy classic. The common gripe is that it’s slow and light on plot. Best for patient readers who savor beautiful writing.',
  b2: 'An overwhelming favorite — readers love the clever problem-solving, humor, and the emotional friendship at its heart. A few find the science dense. Best for fans of smart, optimistic sci-fi.',
  b3: 'Readers are swept up by Evelyn’s voice, the old-Hollywood glamour, and an emotional twist, with many praising its LGBTQ+ representation. Some call the ending predictable. Best for lovers of character-driven drama.',
  b4: 'Praised for its razor-sharp twist and unreliable narrators, with many finding it addictive. Critics dislike the unlikeable characters and divisive ending. Best for thriller fans who don’t need someone to root for.',
  b5: 'Readers find the premise moving and comforting — a gentle meditation on regret and second chances. Others felt it heavy-handed and repetitive. Best for those wanting an uplifting, philosophical read.',
  b6: 'Beloved for its humor, fast pace, and accessible mythology, and often credited as a gateway for reluctant readers. Some adults find it simple. Best for middle-grade readers and myth lovers.',
  b7: 'Readers praise the breakneck tension, Katniss, and sharp social commentary. A recurring critique is the love triangle. Best for YA readers who like high-stakes dystopia.',
  b8: 'Readers love the lush nature writing and Kya’s resilience, and the mystery keeps pages turning. Critics question the plot’s plausibility. Best for readers who enjoy atmospheric, emotional fiction.',
  b9: 'Widely credited as practical and genuinely habit-changing, with clear, actionable systems. Some find it repetitive of other self-help books. Best for anyone wanting concrete self-improvement.',
  b10: 'Readers call it raw, gripping, and unforgettable — a testament to the power of education. A few question memoir accuracy. Best for fans of resilient true stories.',
  b11: 'The twist earns near-universal praise and the pacing hooks readers fast. Common criticisms are thin characters and a far-fetched ending. Best for readers chasing a clever psychological thriller.',
  b12: 'Readers adore the feminist retelling, the luminous prose, and Circe’s slow-burn empowerment. A few find it meandering. Best for myth lovers and literary-fantasy fans.',
  b13: 'Readers find it emotional and important for its honest portrayal of abuse, and many were moved to tears. Critics dislike the prose and feel it romanticizes its subject. Best for contemporary-romance readers ready for heavy themes.',
  b14: 'Revered as a visionary, complex masterpiece of world-building and politics. Newcomers consistently find it dense and slow to start. Best for patient sci-fi readers who love deep lore.',
  b15: 'Readers are moved by Death’s narration and the heartbreaking WWII story. Some find the literary style distancing. Best for readers who want an emotional historical novel.',
  b16: 'Readers call it heartwarming and a powerful lesson in kindness, and a favorite in classrooms. A few find it sentimental. Best for middle-grade readers and families.',
  b17: 'A timeless favorite — parents praise the art, the counting, and its simple joy, with almost no criticism beyond its brevity. Best for toddlers and read-alouds.',
  b18: 'Readers are hooked by the romance, the world, and the addictive later books. Critics note a slow start and uneven writing. Best for romantasy fans who like some spice.',
  b19: 'Readers find it sweeping, thought-provoking, and surprisingly accessible. Some push back on its broad generalizations. Best for curious readers who like big-picture history.',
  b20: 'Readers praise the mounting dread, the Overlook itself, and King’s character work. Some find it slow-building. Best for horror fans who like psychological terror.',
  b21: 'Readers find Klara’s perspective tender and quietly devastating. Others find it slow and understated. Best for literary readers who like subtle, reflective sci-fi.',
  b22: 'Beloved for its humor, heart, and wish-fulfillment — a childhood favorite with almost no detractors. Best for young readers and the young at heart.',
  b23: 'Readers are awed by the epic scope, the world-building, and a payoff that earns the page count. The length and slow start intimidate some. Best for epic-fantasy devotees.',
  b24: 'Readers call it dark, twisted, and impossible to put down, though the ending divides everyone. Critics find it implausible and lurid. Best for thriller readers who want pure shock.',
}
