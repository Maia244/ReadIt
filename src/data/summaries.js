// Short "about this book" summaries (the premise of each book itself, distinct
// from the AI review consensus) for the built-in catalogue.
export const SUMMARIES = {
  b1: 'A gifted young musician and arcanist named Kvothe recounts his rise from orphaned street performer to the most notorious wizard his world has known.',
  b2: 'A lone astronaut wakes with amnesia aboard a spacecraft, piecing together a desperate last-chance mission to save humanity from extinction.',
  b3: 'An aging Hollywood icon finally tells the truth about her glamorous, scandalous life — and her seven marriages — to an unknown journalist.',
  b4: 'When Amy Dunne vanishes on her fifth wedding anniversary, her husband becomes the prime suspect in a twisting tale of a marriage gone very wrong.',
  b5: 'Between life and death lies a library where every book lets Nora live a different version of her life, helping her discover what makes one worth living.',
  b6: 'A twelve-year-old learns he is the son of Poseidon and sets out to stop a war among the Greek gods by recovering Zeus’s stolen lightning bolt.',
  b7: 'In a dystopian nation, teenager Katniss volunteers in her sister’s place for a televised fight to the death — and becomes a symbol of rebellion.',
  b8: 'A girl who raised herself in the marshes of North Carolina becomes the prime suspect when a local man is found dead.',
  b9: 'A practical framework for building good habits and breaking bad ones through tiny, compounding one-percent improvements.',
  b10: 'A memoir of a woman raised in a survivalist family with no formal schooling, who goes on to earn a PhD from Cambridge.',
  b11: 'A celebrated painter shoots her husband and then never speaks again; a psychotherapist becomes obsessed with uncovering why.',
  b12: 'The banished witch-goddess of Greek myth comes into her own power across centuries of exile on a solitary island.',
  b13: 'A woman building a bright new life and a passionate romance is forced to confront painful patterns echoing from her past.',
  b14: 'On the desert planet Arrakis, young Paul Atreides navigates politics, prophecy, and a war over the universe’s most precious resource.',
  b15: 'Narrated by Death itself, the story of a young girl who steals books and shares them in Nazi Germany.',
  b16: 'A boy with a facial difference attends mainstream school for the first time and gradually wins over his classmates.',
  b17: 'A small caterpillar eats its way through the week before transforming into a beautiful butterfly.',
  b18: 'A huntress is carried off to a perilous faerie court, where she must navigate a deadly curse and a forbidden romance.',
  b19: 'A sweeping history of humankind, from the emergence of Homo sapiens to the dilemmas of the modern age.',
  b20: 'A family serving as off-season caretakers of an isolated, haunted hotel slowly descends into supernatural terror.',
  b21: 'An artificial friend observes the human world with hope and devotion as she is chosen to care for an ailing child.',
  b22: 'A brilliant little girl with telekinetic powers stands up to her cruel parents and a tyrannical headmistress.',
  b23: 'On a storm-ravaged world, a soldier, a scholar, and a prince are drawn into an ancient war and the return of lost magic.',
  b24: 'A struggling writer hired to finish a bestselling author’s series uncovers a chilling, hidden manuscript.',
}

export function getSummary(id) {
  return SUMMARIES[id] || null
}
