export const INDONESIAN_BAD_WORDS = [
  // Animals (when used as slurs)
  "anjing", "anjink", "anjig", "anjng", "anjay", "anjret", "anjrit", "anjrot",
  "babi", "babiat",
  "monyet", "kunyuk",
  "asu", "asoe",

  // Genitalia & Sexual terms
  "kontol", "kntl", "kntt", "kntlm", "kontl",
  "memek", "mmk", "m3m3k", "puki", "pukimak", "cibai", "cibay", "cheebye",
  "ngentot", "ngentod", "ngentt", "ngewe", "ewe", "ngewet", "entot", "entod",
  "jembut", "jmbut",
  "peler", "pler", "titit",
  "tetek", "toket", "nenen", "n3n3n",
  "pantek", "panteq",
  "pecun", "lonte", "lont3", "jablay", "j4bl4y", "perek", "pr3k", "sundal", "pelacur",
  "coli", "coly", "colmek", "ngocok", "sange", "s4ng3",

  // Insults / Dumb
  "goblok", "goblog", "goblokz", "goblokk",
  "tolol", "t0l0l",
  "bego", "begok",
  "bloon",
  "idiot",
  "sinting", "sarap", "edan",

  // General vulgarities
  "bangsat", "bangsatt", "bgsat",
  "bajingan", "bajing", "bajang",
  "keparat",
  "tai", "taik", "ty", "tahi",
  "kampret",
  "jancok", "jancuk", "dancok", "dancuk", "cok",
  "kimak", "k1m4k",
  "lanchiao", "lanjiao",

  // English Bad Words
  "fuck", "fucking", "fucker", "fuckface", "fucks",
  "shit", "shitting", "shitty", "shits",
  "bitch", "bitches", "bitchy",
  "asshole", "assholes",
  "bastard", "bastards",
  "cunt", "cunts",
  "pussy", "pussies",
  "dick", "dicks", "dickhead",
  "cock", "cocks",
  "motherfucker", "motherfucking",
  "faggot", "fag",
  "whore", "slut"
];

// Highly specific words that can be checked as substrings anywhere without risking false positives
const HIGHLY_SPECIFIC_BAD_WORDS = [
  "kontol", "ngentot", "ngentod", "memek", "jembut", "peler", "bajingan", "pantek", "jancok", "jancuk", "dancok", "dancuk",
  "pukimak", "cibai", "motherfucker", "lanchiao", "cheebye", "cibay"
];

export function checkBadWords(text: string | null | undefined): { hasBadWords: boolean; foundWords: string[] } {
  if (!text) return { hasBadWords: false, foundWords: [] };

  let normalized = text.toLowerCase();

  // Character mapping for common l33tspeak bypasses
  const replacements: { [key: string]: string } = {
    '4': 'a', '@': 'a',
    '1': 'i', '!': 'i',
    '3': 'e',
    '0': 'o',
    '5': 's', '$': 's',
    '7': 't',
    '8': 'b',
    '9': 'g',
  };

  // Convert l33t speak
  let l33tNormalized = "";
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    l33tNormalized += replacements[char] || char;
  }

  // Remove consecutive duplicate characters (e.g., "anjiiiiiing" -> "anjing")
  let deduplicated = "";
  for (let i = 0; i < l33tNormalized.length; i++) {
    if (i === 0 || l33tNormalized[i] !== l33tNormalized[i - 1]) {
      deduplicated += l33tNormalized[i];
    }
  }

  // Remove non-alphanumeric characters but keep spaces for word boundary checking
  const cleanWithSpaces = l33tNormalized.replace(/[^a-z0-9\s]/g, '');
  const cleanDeduplicatedWithSpaces = deduplicated.replace(/[^a-z0-9\s]/g, '');

  // Also create a version without any spaces or punctuation to catch spaced out words like "a n j i n g"
  const cleanNoSpaces = l33tNormalized.replace(/[^a-z0-9]/g, '');
  const cleanDeduplicatedNoSpaces = deduplicated.replace(/[^a-z0-9]/g, '');

  const foundWords = new Set<string>();

  // Helper to check with word boundaries on clean text
  const checkTextWithBoundaries = (srcText: string) => {
    for (const badWord of INDONESIAN_BAD_WORDS) {
      const escapedWord = badWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
      if (regex.test(srcText)) {
        foundWords.add(badWord);
      }
    }
  };

  // Helper to check direct substring matches for highly specific words (e.g. "kontol" or "memek")
  const checkHighlySpecificSubstrings = (srcText: string) => {
    for (const badWord of HIGHLY_SPECIFIC_BAD_WORDS) {
      if (srcText.includes(badWord)) {
        foundWords.add(badWord);
      }
    }
  };

  // Run checks on normalized versions
  checkTextWithBoundaries(cleanWithSpaces);
  checkTextWithBoundaries(cleanDeduplicatedWithSpaces);

  // Check highly specific substrings in no-spaces versions to catch spaced out words like "k.o.n.t.o.l"
  checkHighlySpecificSubstrings(cleanNoSpaces);
  checkHighlySpecificSubstrings(cleanDeduplicatedNoSpaces);

  // Also check if the whole no-space string is an exact match for any bad word
  for (const badWord of INDONESIAN_BAD_WORDS) {
    if (cleanNoSpaces === badWord || cleanDeduplicatedNoSpaces === badWord) {
      foundWords.add(badWord);
    }
  }

  return {
    hasBadWords: foundWords.size > 0,
    foundWords: Array.from(foundWords)
  };
}
